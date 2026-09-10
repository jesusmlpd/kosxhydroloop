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
  paid: boolean;
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
    expand: ["data.payment_intent"],
  });

  const orders: AdminOrder[] = [];
  for (const session of sessions.data) {
    if (session.status !== "complete") continue;
    const intent =
      typeof session.payment_intent === "object" ? session.payment_intent : null;
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
      paid: session.payment_status === "paid",
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
  /** Solo pedidos pagados de los ultimos 30 dias. */
  revenueCents: number;
  orderCount: number;
  avgCents: number;
  unshipped: number;
  /** 30 entradas, de hace 29 dias a hoy. */
  byDay: Array<{ label: string; cents: number; count: number }>;
  byProduct: Array<{ name: string; units: number; cents: number }>;
  byState: Array<{ state: string; count: number; cents: number }>;
};

export function computeStats(orders: AdminOrder[], now = Date.now()): SalesStats {
  const paid = orders.filter((order) => order.paid);
  const dayMs = 24 * 60 * 60 * 1000;
  const start = now - 29 * dayMs;
  const recent = paid.filter((order) => order.created * 1000 >= start - dayMs);

  const dayFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });
  const byDay: SalesStats["byDay"] = [];
  for (let i = 29; i >= 0; i--) {
    const dayStart = new Date(now - i * dayMs);
    dayStart.setHours(0, 0, 0, 0);
    const from = dayStart.getTime();
    const to = from + dayMs;
    const inDay = paid.filter((order) => {
      const ms = order.created * 1000;
      return ms >= from && ms < to;
    });
    byDay.push({
      label: dayFormat.format(dayStart),
      cents: inDay.reduce((sum, order) => sum + order.totalCents, 0),
      count: inDay.length,
    });
  }

  const products = new Map<string, { units: number; cents: number }>();
  for (const order of recent) {
    for (const item of order.items) {
      const entry = products.get(item.name) ?? { units: 0, cents: 0 };
      entry.units += item.qty;
      entry.cents += item.cents;
      products.set(item.name, entry);
    }
  }

  const states = new Map<string, { count: number; cents: number }>();
  for (const order of recent) {
    const state = order.state || "Sin estado";
    const entry = states.get(state) ?? { count: 0, cents: 0 };
    entry.count += 1;
    entry.cents += order.totalCents;
    states.set(state, entry);
  }

  const revenueCents = recent.reduce((sum, order) => sum + order.totalCents, 0);
  return {
    revenueCents,
    orderCount: recent.length,
    avgCents: recent.length ? Math.round(revenueCents / recent.length) : 0,
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
