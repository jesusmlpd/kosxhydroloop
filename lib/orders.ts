import { formatMoney, type Totals } from "@/lib/commerce";
import { emailConfigured } from "@/lib/email";
import { ccField, resolveInbox } from "@/lib/formsubmit";
import { sendOrderEmails, type OrderEmail } from "@/lib/order-email";
import { isLocale, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

export type Customer = {
  name: string;
  email: string;
  phone: string;
  street: string;
  interior?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
  /** "on" si dejo marcada la casilla de recordatorios del checkout. */
  marketing?: string;
};

export type PaymentMethod = "stripe" | "mercadopago" | "manual";

/**
 * Referencia legible del pedido. No es un id de base de datos: mientras no
 * haya una, esto es lo que el cliente y el cobro comparten para reconciliar.
 */
export function orderRef(now = Date.now()) {
  const date = new Date(now);
  const stamp = [
    String(date.getFullYear()).slice(2),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const tail = Math.floor(now % 100000)
    .toString()
    .padStart(5, "0");
  return `HL-${stamp}-${tail}`;
}

export function orderLines(totals: Totals, names: Record<string, string>, locale: string) {
  return totals.lines
    .map(
      (line) =>
        `${line.qty} x ${names[line.slug] ?? line.slug} = ${formatMoney(line.lineCents, locale)}`,
    )
    .join("\n");
}

/**
 * Aviso del pedido por correo. Es el sustituto honesto de una base de datos:
 * mientras no exista, el pedido llega al inbox con todo lo necesario para
 * surtirlo. Usa FormSubmit igual que el formulario de contacto, con las mismas
 * dos trampas ya cubiertas (cabecera Origin obligatoria y el veredicto real en
 * el JSON aunque conteste 200).
 */
export async function notifyOrder(input: {
  ref: string;
  method: PaymentMethod;
  status: string;
  customer: Customer;
  totals: Totals;
  names: Record<string, string>;
  locale: string;
  origin: string;
}) {
  // Con Resend configurado el aviso sale por ahi (equipo y, en pedidos por
  // confirmar, tambien el recibo del cliente). FormSubmit queda de respaldo.
  if (emailConfigured()) {
    const { customer, totals } = input;
    const locale: Locale = isLocale(input.locale) ? input.locale : "es";
    const order: OrderEmail = {
      ref: input.ref,
      status: input.method === "manual" ? "pending" : "started",
      method: input.method,
      locale,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: [
          customer.street,
          customer.interior,
          customer.neighborhood,
          `${customer.city}, ${customer.state}`,
          `CP ${customer.zip}`,
        ]
          .filter(Boolean)
          .join(", "),
        notes: customer.notes ?? "",
      },
      lines: totals.lines.map((line) => ({
        name: input.names[line.slug] ?? line.slug,
        qty: line.qty,
        unitCents: line.unitCents,
      })),
      subtotalCents: totals.subtotalCents,
      discountCents: totals.discountCents,
      shippingCents: totals.shippingCents,
      totalCents: totals.totalCents,
      coupon: totals.couponCode ?? "",
    };
    const sent = await sendOrderEmails(order, { customerReceipt: input.method === "manual" });
    return sent.internal;
  }

  const to = resolveInbox();
  if (!to) {
    // Sin buzon configurado no se finge un envio. El pedido igual queda en el
    // log del servidor para no perderlo.
    console.warn("[pedido] sin buzon configurado, no se envio correo", input.ref);
    return false;
  }
  const { customer, totals } = input;

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: input.origin,
    },
    body: JSON.stringify({
      ...ccField(),
      _subject: `${site.name}: pedido ${input.ref} (${input.method}, ${input.status})`,
      _template: "table",
      Pedido: input.ref,
      Estado: input.status,
      Pago: input.method,
      Cliente: customer.name,
      Correo: customer.email,
      Telefono: customer.phone,
      Direccion: [
        customer.street,
        customer.interior,
        customer.neighborhood,
        `${customer.city}, ${customer.state}`,
        `CP ${customer.zip}`,
      ]
        .filter(Boolean)
        .join(" / "),
      Notas: customer.notes || "",
      Articulos: orderLines(totals, input.names, input.locale),
      Cupon: totals.couponCode ?? "",
      Subtotal: formatMoney(totals.subtotalCents, input.locale),
      Descuento: formatMoney(totals.discountCents, input.locale),
      Envio: formatMoney(totals.shippingCents, input.locale),
      Total: formatMoney(totals.totalCents, input.locale),
    }),
  });

  const data = (await response.json().catch(() => null)) as { success?: string | boolean } | null;
  return response.ok && (data?.success === true || String(data?.success).toLowerCase() === "true");
}
