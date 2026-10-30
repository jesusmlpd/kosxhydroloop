/**
 * Informe de ventas (estilo Shopify) calculado desde los pedidos de Stripe.
 * Solo cuenta pedidos pagados; uno reembolsado por completo no es venta.
 */
import type { AdminOrder } from "@/lib/admin-data";
import { addDay, dayFromMs, spanDays } from "@/lib/date-range";

export type Breakdown = {
  grossCents: number;
  discountCents: number;
  refundCents: number;
  netCents: number;
  shippingCents: number;
  totalCents: number;
};

export type SalesReport = Breakdown & {
  since: string;
  until: string;
  orderCount: number;
  avgCents: number;
  /** Pedidos de clientes que ya habian comprado antes (por correo). */
  returningOrders: number;
  returningRate: number;
  /** Un punto por dia. */
  byDay: Array<{ day: string; totalCents: number; orders: number }>;
  byProduct: Array<{ name: string; units: number; cents: number }>;
  byState: Array<{ label: string; orders: number; cents: number }>;
  byCity: Array<{ label: string; orders: number; cents: number }>;
  byCoupon: Array<{ code: string; orders: number; discountCents: number; cents: number }>;
};

const isSale = (order: AdminOrder) => order.paid && order.refundState !== "full" && order.refundState !== "pending";
const top = <T,>(rows: T[], n = 8) => rows.slice(0, n);

export function buildSalesReport(orders: AdminOrder[], since: string, until: string): SalesReport {
  const day = (order: AdminOrder) => dayFromMs(order.created * 1000);
  const sales = orders.filter(isSale).sort((a, b) => a.created - b.created);

  // Cliente habitual: ya tenia un pedido pagado anterior, aunque sea de antes del rango.
  const seen = new Set<string>();
  const returning = new Set<string>();
  for (const order of sales) {
    const email = order.email.trim().toLowerCase();
    if (email && seen.has(email)) returning.add(order.id);
    if (email) seen.add(email);
  }

  const inRange = sales.filter((order) => day(order) >= since && day(order) <= until);
  const sum = (pick: (order: AdminOrder) => number) => inRange.reduce((total, order) => total + pick(order), 0);

  const grossCents = sum((o) => o.subtotalCents);
  const discountCents = sum((o) => o.discountCents);
  const refundCents = sum((o) => o.refundedCents);
  const shippingCents = sum((o) => o.shippingCents);
  const netCents = grossCents - discountCents - refundCents;

  const perDay = new Map<string, { totalCents: number; orders: number }>();
  for (const order of inRange) {
    const entry = perDay.get(day(order)) ?? { totalCents: 0, orders: 0 };
    entry.totalCents += order.totalCents - order.refundedCents;
    entry.orders += 1;
    perDay.set(day(order), entry);
  }
  const byDay: SalesReport["byDay"] = [];
  for (let d = since; spanDays(since, d) <= spanDays(since, until); d = addDay(d)) {
    byDay.push({ day: d, ...(perDay.get(d) ?? { totalCents: 0, orders: 0 }) });
  }

  const group = <K extends string>(key: (o: AdminOrder) => string, init: () => Record<string, number>) => {
    const map = new Map<string, Record<string, number>>();
    for (const order of inRange) {
      const k = key(order);
      const entry = map.get(k) ?? init();
      entry.orders += 1;
      entry.cents += order.totalCents - order.refundedCents;
      entry.discount = (entry.discount ?? 0) + order.discountCents;
      map.set(k, entry);
    }
    return [...map.entries()] as Array<[K, Record<string, number>]>;
  };

  const products = new Map<string, { units: number; cents: number }>();
  for (const order of inRange) {
    for (const item of order.items) {
      const entry = products.get(item.name) ?? { units: 0, cents: 0 };
      entry.units += item.qty;
      entry.cents += item.cents;
      products.set(item.name, entry);
    }
  }

  const places = (key: (o: AdminOrder) => string) =>
    group(key, () => ({ orders: 0, cents: 0 }))
      .map(([label, v]) => ({ label, orders: v.orders, cents: v.cents }))
      .sort((a, b) => b.orders - a.orders || b.cents - a.cents);

  const returningCount = inRange.filter((order) => returning.has(order.id)).length;
  return {
    since,
    until,
    grossCents,
    discountCents,
    refundCents,
    netCents,
    shippingCents,
    totalCents: netCents + shippingCents,
    orderCount: inRange.length,
    avgCents: inRange.length ? Math.round((netCents + shippingCents) / inRange.length) : 0,
    returningOrders: returningCount,
    returningRate: inRange.length ? (returningCount / inRange.length) * 100 : 0,
    byDay,
    byProduct: [...products.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.cents - a.cents),
    byState: top(places((o) => o.state || "Sin estado")),
    byCity: top(places((o) => (o.city ? `${o.city}${o.state ? `, ${o.state}` : ""}` : "Sin ciudad"))),
    byCoupon: group(
      (o) => o.coupon || "",
      () => ({ orders: 0, cents: 0, discount: 0 }),
    )
      .filter(([code]) => code !== "")
      .map(([code, v]) => ({ code, orders: v.orders, discountCents: v.discount, cents: v.cents }))
      .sort((a, b) => b.orders - a.orders),
  };
}
