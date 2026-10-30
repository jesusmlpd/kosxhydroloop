import { addDay, dayFromMs, formatDayShort, spanDays, todayInPanel } from "@/lib/date-range";

/**
 * Lectura de pedidos para el panel interno. Stripe es la base de datos: cada
 * checkout session completa es un pedido, y el estado de envio vive en la
 * metadata del PaymentIntent. Sin tablas, sin migraciones.
 */

export type AdminOrder = {
  id: string;
  paymentIntent: string | null;
  ref: string;
  created: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes: string;
  totalCents: number;
  /** Antes de descuentos y envio (Stripe: amount_subtotal). */
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  coupon: string;
  paid: boolean;
  /** Centavos devueltos al cliente (Stripe: charge.amount_refunded). */
  refundedCents: number;
  /** none | pending (Stripe aun lo procesa) | partial | full */
  refundState: "none" | "pending" | "partial" | "full";
  shipped: boolean;
  tracking: string;
  items: Array<{ qty: number; name: string; cents: number }>;
};

/**
 * La direccion se guarda en la metadata como
 * "calle interior, colonia, ciudad, estado, CP 00000".
 * Ciudad y estado salen de las posiciones fijas contando desde el final,
 * porque la calle puede traer comas.
 */
function parsePlace(address: string) {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 4) return { city: "", state: "" };
  return {
    state: parts[parts.length - 2] ?? "",
    city: parts[parts.length - 3] ?? "",
  };
}

/** null = Stripe sin configurar. Lista los pedidos mas recientes primero. */
export async function loadOrders(limit = 100): Promise<AdminOrder[] | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(key);

  const sessions = await stripe.checkout.sessions.list({
    limit: Math.min(limit, 100),
    expand: ["data.payment_intent", "data.payment_intent.latest_charge"],
  });

  const orders: AdminOrder[] = [];
  for (const session of sessions.data) {
    if (session.status !== "complete") continue;
    const intent =
      typeof session.payment_intent === "object" ? session.payment_intent : null;
    const charge =
      intent && typeof intent.latest_charge === "object" ? intent.latest_charge : null;
    const total = session.amount_total ?? 0;
    const refundedCents = charge?.amount_refunded ?? 0;
    // Solo se pregunta por los reembolsos cuando existe alguno: asi se distingue
    // "en proceso" (pending) de "ya devuelto" sin una llamada extra por pedido.
    let refundPending = false;
    if (intent && refundedCents > 0) {
      const refunds = await stripe.refunds
        .list({ payment_intent: intent.id, limit: 10 })
        .catch(() => null);
      refundPending = Boolean(
        refunds?.data.some((r) => r.status === "pending" || r.status === "requires_action"),
      );
    }
    const refundState: AdminOrder["refundState"] =
      refundedCents <= 0
        ? "none"
        : refundPending
          ? "pending"
          : refundedCents >= total
            ? "full"
            : "partial";

    const lineItems = await stripe.checkout.sessions
      .listLineItems(session.id, { limit: 10 })
      .catch(() => null);

    const address = session.metadata?.address ?? "";
    orders.push({
      id: session.id,
      paymentIntent: intent?.id ?? null,
      ref: session.client_reference_id ?? session.metadata?.ref ?? session.id.slice(-8),
      created: session.created,
      name: session.customer_details?.name ?? "",
      email: session.customer_details?.email ?? session.customer_email ?? "",
      phone: session.metadata?.phone ?? session.customer_details?.phone ?? "",
      address,
      ...parsePlace(address),
      notes: session.metadata?.notes ?? "",
      totalCents: session.amount_total ?? 0,
      subtotalCents: session.amount_subtotal ?? session.amount_total ?? 0,
      discountCents: session.total_details?.amount_discount ?? 0,
      shippingCents: session.total_details?.amount_shipping ?? 0,
      coupon: session.metadata?.coupon ?? "",
      paid: session.payment_status === "paid",
      refundedCents,
      refundState,
      shipped: intent?.metadata?.shipped === "1",
      tracking: intent?.metadata?.tracking ?? "",
      items:
        lineItems?.data.map((item) => ({
          qty: item.quantity ?? 1,
          name: item.description ?? "",
          cents: item.amount_total ?? 0,
        })) ?? [],
    });
  }
  return orders;
}

export type SalesStats = {
  since: string;
  until: string;
  /** Solo pedidos pagados dentro del rango, netos de reembolsos. */
  revenueCents: number;
  orderCount: number;
  avgCents: number;
  /** Pedidos pagados pendientes de envio: no depende del rango, es trabajo atrasado. */
  unshipped: number;
  /** Un dia por entrada, de `since` a `until`. */
  byDay: Array<{ label: string; cents: number; count: number }>;
  byProduct: Array<{ name: string; units: number; cents: number }>;
  byState: Array<{ state: string; count: number; cents: number }>;
};

/** Tope de dias que se dibujan en la grafica (un año). */
const MAX_CHART_DAYS = 366;

export function computeStats(
  orders: AdminOrder[],
  range?: { since: string; until: string },
): SalesStats {
  const until = range?.until ?? todayInPanel();
  let since = range?.since ?? addDay(until, -29);
  if (spanDays(since, until) > MAX_CHART_DAYS) since = addDay(until, -(MAX_CHART_DAYS - 1));

  // Un pedido totalmente reembolsado (o con el reembolso en proceso) ya no es
  // venta ni esta por surtir; uno parcial cuenta por lo que quedo cobrado.
  const paid = orders.filter(
    (order) => order.paid && order.refundState !== "full" && order.refundState !== "pending",
  );
  const net = (order: AdminOrder) => order.totalCents - order.refundedCents;
  const dayOf = (order: AdminOrder) => dayFromMs(order.created * 1000);
  const inRange = paid.filter((order) => {
    const day = dayOf(order);
    return day >= since && day <= until;
  });

  const perDay = new Map<string, { cents: number; count: number }>();
  for (const order of inRange) {
    const day = dayOf(order);
    const entry = perDay.get(day) ?? { cents: 0, count: 0 };
    entry.cents += net(order);
    entry.count += 1;
    perDay.set(day, entry);
  }
  const byDay: SalesStats["byDay"] = [];
  for (let day = since; day <= until; day = addDay(day)) {
    const entry = perDay.get(day);
    byDay.push({ label: formatDayShort(day), cents: entry?.cents ?? 0, count: entry?.count ?? 0 });
  }

  const products = new Map<string, { units: number; cents: number }>();
  for (const order of inRange) {
    for (const item of order.items) {
      const entry = products.get(item.name) ?? { units: 0, cents: 0 };
      entry.units += item.qty;
      entry.cents += item.cents;
      products.set(item.name, entry);
    }
  }

  const states = new Map<string, { count: number; cents: number }>();
  for (const order of inRange) {
    const state = order.state || "Sin estado";
    const entry = states.get(state) ?? { count: 0, cents: 0 };
    entry.count += 1;
    entry.cents += net(order);
    states.set(state, entry);
  }

  const revenueCents = inRange.reduce((sum, order) => sum + net(order), 0);
  return {
    since,
    until,
    revenueCents,
    orderCount: inRange.length,
    avgCents: inRange.length ? Math.round(revenueCents / inRange.length) : 0,
    unshipped: paid.filter((order) => !order.shipped).length,
    byDay,
    byProduct: [...products.entries()]
      .map(([name, entry]) => ({ name, ...entry }))
      .sort((a, b) => b.units - a.units),
    byState: [...states.entries()]
      .map(([state, entry]) => ({ state, ...entry }))
      .sort((a, b) => b.count - a.count),
  };
}
