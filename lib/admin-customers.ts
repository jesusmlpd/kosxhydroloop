/** Clientes del panel: compradores agrupados por correo (Stripe) y su exportacion. */
import type { AdminOrder } from "@/lib/admin-data";
import type { Lead } from "@/lib/leads";
import { findProductById } from "@/lib/site";
import { getDict } from "@/lib/dict";

export type Customer = {
  email: string;
  name: string;
  phone: string;
  city: string;
  orders: number;
  spentCents: number;
  lastOrder: number;
};

export function buildCustomers(orders: AdminOrder[]): Customer[] {
  const map = new Map<string, Customer>();
  for (const order of orders) {
    if (!order.paid || order.refundState === "full" || order.refundState === "pending") continue;
    const email = order.email.trim().toLowerCase();
    if (!email) continue;
    const entry = map.get(email) ?? { email, name: order.name, phone: order.phone, city: "", orders: 0, spentCents: 0, lastOrder: 0 };
    entry.orders += 1;
    entry.spentCents += order.totalCents - order.refundedCents;
    if (order.created > entry.lastOrder) {
      entry.lastOrder = order.created;
      entry.name = order.name || entry.name;
      entry.phone = order.phone || entry.phone;
      entry.city = order.city ? `${order.city}${order.state ? `, ${order.state}` : ""}` : entry.city;
    }
    map.set(email, entry);
  }
  return [...map.values()].sort((a, b) => b.spentCents - a.spentCents);
}

export function itemsText(items: Lead["items"]) {
  const names = getDict("es").products.items as Record<string, { name: string }>;
  return items
    .map((item) => {
      const product = findProductById(item.id);
      return `${item.qty} x ${(product && names[product.slug]?.name) || item.id}`;
    })
    .join(", ");
}

/** Estado legible de un lead. */
export function leadStatus(lead: Lead) {
  if (lead.optedOut) return "Se dio de baja";
  if (lead.purchased) return "Ya compró";
  return lead.consent ? "Con consentimiento" : "Sin consentimiento";
}

/** Se puede usar para marketing: marco la casilla, no se dio de baja y aun no compro. */
export const marketable = (lead: Lead) => lead.consent && !lead.optedOut && !lead.purchased;

const cell = (value: string | number) => {
  let text = String(value);
  // Evita que Excel interprete el texto como formula.
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

export function toCsv(header: string[], rows: Array<Array<string | number>>) {
  // BOM para que Excel abra bien los acentos.
  return "﻿" + [header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
}
