import { formatMoney } from "@/lib/commerce";
import { getDict } from "@/lib/dict";
import { emailConfigured, sendEmail } from "@/lib/email";
import { internalRecipients } from "@/lib/formsubmit";
import { isLocale, type Locale } from "@/lib/i18n";
import { findProductById, site, whatsappUrl } from "@/lib/site";

/**
 * Los dos correos de un pedido: el aviso interno con todo lo necesario para
 * surtirlo y el recibo del cliente. Se arman desde un mismo objeto, venga de la
 * sesion de Stripe (webhook) o del checkout (pedido por confirmar).
 */
export type OrderEmail = {
  ref: string;
  /** "pagado" | "por confirmar" | "iniciado" */
  status: "paid" | "pending" | "started";
  method: string;
  locale: Locale;
  customer: { name: string; email: string; phone: string; address: string; notes: string };
  lines: Array<{ name: string; qty: number; unitCents: number }>;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  coupon: string;
};

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const LABELS = {
  es: {
    qty: "Cant.",
    item: "Artículo",
    subtotal: "Subtotal",
    discount: "Descuento",
    shipping: "Envío",
    free: "Gratis",
    total: "Total",
    order: "Pedido",
    ship: "Envío a",
    notes: "Notas",
    phone: "Teléfono",
    email: "Correo",
    payment: "Pago",
    coupon: "Cupón",
    adminCta: "Abrir pedidos en el panel",
    customerTitle: "Recibimos tu pedido",
    customerPaidLead: "Gracias por tu compra. Tu pago se confirmó y ya estamos preparando tu pedido.",
    customerPendingLead:
      "Gracias por tu pedido. Está por confirmar: nuestro equipo te contactará para coordinar el pago y el envío.",
    next: "Te avisaremos con la guía de rastreo en cuanto tu pedido salga. Si tienes dudas, responde a este correo o escríbenos por WhatsApp.",
    whatsapp: "Escribir por WhatsApp",
    legal: "Hydroloop®. Este correo es el recibo de tu pedido.",
  },
  en: {
    qty: "Qty",
    item: "Item",
    subtotal: "Subtotal",
    discount: "Discount",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    order: "Order",
    ship: "Ship to",
    notes: "Notes",
    phone: "Phone",
    email: "Email",
    payment: "Payment",
    coupon: "Coupon",
    adminCta: "Open orders in the panel",
    customerTitle: "We received your order",
    customerPaidLead: "Thank you for your purchase. Your payment is confirmed and we are preparing your order.",
    customerPendingLead:
      "Thank you for your order. It is pending confirmation: our team will contact you to arrange payment and shipping.",
    next: "We will send you the tracking number as soon as your order ships. Questions? Reply to this email or message us on WhatsApp.",
    whatsapp: "Message us on WhatsApp",
    legal: "Hydroloop®. This email is your order receipt.",
  },
} as const;

function rows(order: OrderEmail) {
  const t = LABELS[order.locale];
  const money = (cents: number) => formatMoney(cents, order.locale);
  const items = order.lines
    .map(
      (line) => `<tr>
  <td style="padding:8px 0;border-bottom:1px solid #e5eef2">${esc(line.name)}</td>
  <td style="padding:8px 0;border-bottom:1px solid #e5eef2;text-align:center">${line.qty}</td>
  <td style="padding:8px 0;border-bottom:1px solid #e5eef2;text-align:right">${money(line.unitCents * line.qty)}</td>
</tr>`,
    )
    .join("");
  const totals = [
    [t.subtotal, money(order.subtotalCents)],
    ...(order.discountCents ? [[`${t.discount}${order.coupon ? ` (${esc(order.coupon)})` : ""}`, `-${money(order.discountCents)}`]] : []),
    [t.shipping, order.shippingCents ? money(order.shippingCents) : t.free],
  ]
    .map(
      ([label, value]) =>
        `<tr><td colspan="2" style="padding:4px 0;color:#4b6270">${label}</td><td style="padding:4px 0;text-align:right">${value}</td></tr>`,
    )
    .join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
<tr><th align="left" style="padding-bottom:6px;color:#4b6270">${t.item}</th><th style="padding-bottom:6px;color:#4b6270">${t.qty}</th><th align="right" style="padding-bottom:6px;color:#4b6270"> </th></tr>
${items}
${totals}
<tr><td colspan="2" style="padding:10px 0 0;font-weight:700;font-size:16px">${t.total}</td><td style="padding:10px 0 0;text-align:right;font-weight:700;font-size:16px">${money(order.totalCents)}</td></tr>
</table>`;
}

function shell(title: string, body: string, legal: string) {
  return `<!doctype html><html><body style="margin:0;background:#f2f7f9;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0b1f2a">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
<div style="background:#ffffff;border-radius:16px;padding:28px">
<div style="font-weight:700;letter-spacing:.08em;color:#0a7f94;font-size:12px">HYDROLOOP®</div>
<h1 style="margin:8px 0 16px;font-size:22px">${title}</h1>
${body}
</div>
<p style="text-align:center;color:#6b8290;font-size:12px;margin-top:16px">${legal}</p>
</div></body></html>`;
}

function plainRows(order: OrderEmail) {
  const t = LABELS[order.locale];
  const money = (cents: number) => formatMoney(cents, order.locale);
  return [
    ...order.lines.map((l) => `${l.qty} x ${l.name} = ${money(l.unitCents * l.qty)}`),
    `${t.subtotal}: ${money(order.subtotalCents)}`,
    ...(order.discountCents ? [`${t.discount}${order.coupon ? ` (${order.coupon})` : ""}: -${money(order.discountCents)}`] : []),
    `${t.shipping}: ${order.shippingCents ? money(order.shippingCents) : t.free}`,
    `${t.total}: ${money(order.totalCents)}`,
  ].join("\n");
}

export function internalEmail(order: OrderEmail) {
  const t = LABELS.es;
  const state = order.status === "paid" ? "PAGADO, hay que surtir" : order.status === "pending" ? "POR CONFIRMAR" : "INICIADO (sin pagar)";
  const subject = `${site.name}: pedido ${order.ref} ${order.status === "paid" ? "pagado" : order.status === "pending" ? "por confirmar" : "iniciado"} · ${formatMoney(order.totalCents, "es")}`;
  const detail = [
    [t.order, order.ref],
    [t.payment, `${order.method} · ${state}`],
    ["Cliente", order.customer.name],
    [t.phone, order.customer.phone],
    [t.email, order.customer.email],
    [t.ship, order.customer.address],
    ...(order.customer.notes ? [[t.notes, order.customer.notes]] : []),
    ...(order.coupon ? [[t.coupon, order.coupon]] : []),
  ] as Array<[string, string]>;
  const html = shell(
    order.status === "paid" ? "Compra recibida: hay que atenderla" : `Pedido ${state.toLowerCase()}`,
    `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:18px">${detail
      .map(
        ([k, v]) =>
          `<tr><td style="padding:3px 12px 3px 0;color:#4b6270;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:3px 0">${esc(v)}</td></tr>`,
      )
      .join("")}</table>
${rows({ ...order, locale: "es" })}
<p style="margin:22px 0 0"><a href="${site.url}/admin/pedidos" style="background:#0a7f94;color:#fff;text-decoration:none;padding:11px 18px;border-radius:999px;font-weight:600;font-size:14px">${t.adminCta}</a></p>`,
    "Aviso interno de Hydroloop.",
  );
  const text = `${subject}\n\n${detail.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${plainRows({ ...order, locale: "es" })}\n\n${site.url}/admin/pedidos`;
  return { subject, html, text };
}

export function customerEmail(order: OrderEmail) {
  const t = LABELS[order.locale];
  const subject =
    order.locale === "en" ? `Your Hydroloop order ${order.ref}` : `Tu pedido Hydroloop ${order.ref}`;
  const lead = order.status === "paid" ? t.customerPaidLead : t.customerPendingLead;
  const html = shell(
    t.customerTitle,
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.5">${esc(order.customer.name.split(" ")[0] || "")}, ${esc(lead)}</p>
<p style="margin:0 0 16px;font-size:14px"><strong>${t.order}:</strong> ${esc(order.ref)}</p>
${rows(order)}
<p style="margin:20px 0 4px;font-size:14px"><strong>${t.ship}</strong><br>${esc(order.customer.address)}</p>
<p style="margin:18px 0;font-size:14px;line-height:1.5;color:#4b6270">${esc(t.next)}</p>
<p style="margin:0"><a href="${whatsappUrl(`${t.order} ${order.ref}`)}" style="background:#0a7f94;color:#fff;text-decoration:none;padding:11px 18px;border-radius:999px;font-weight:600;font-size:14px">${t.whatsapp}</a></p>`,
    t.legal,
  );
  const text = `${t.customerTitle}\n\n${lead}\n\n${t.order}: ${order.ref}\n\n${plainRows(order)}\n\n${t.ship}: ${order.customer.address}\n\n${t.next}`;
  return { subject, html, text };
}

/** Un envio interno (equipo) y, si hay correo del cliente, su recibo. */
export async function sendOrderEmails(order: OrderEmail, options: { customerReceipt: boolean }) {
  if (!emailConfigured()) {
    console.warn("[pedido] sin RESEND_API_KEY, no salen correos", order.ref);
    return { internal: false, customer: false };
  }
  const internal = internalEmail(order);
  const to = internalRecipients();
  const sentInternal = to.length
    ? await sendEmail({
        to,
        subject: internal.subject,
        html: internal.html,
        text: internal.text,
        replyTo: order.customer.email || undefined,
        idempotencyKey: `internal-${order.status}-${order.ref}`,
      })
    : false;

  let sentCustomer = false;
  if (options.customerReceipt && order.customer.email.includes("@")) {
    const receipt = customerEmail(order);
    sentCustomer = await sendEmail({
      to: [order.customer.email],
      subject: receipt.subject,
      html: receipt.html,
      text: receipt.text,
      replyTo: site.email,
      idempotencyKey: `customer-${order.status}-${order.ref}`,
    });
  }
  return { internal: sentInternal, customer: sentCustomer };
}

/** Arma el pedido desde la sesion de Checkout de Stripe y los datos del checkout. */
export function orderFromStripeSession(session: {
  client_reference_id?: string | null;
  amount_total?: number | null;
  amount_subtotal?: number | null;
  total_details?: { amount_discount?: number | null; amount_shipping?: number | null } | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null; phone?: string | null; name?: string | null } | null;
  payment_status?: string;
  payment_method_types?: string[] | null;
  metadata?: Record<string, string> | null;
}): OrderEmail | null {
  const meta = session.metadata ?? {};
  const ref = session.client_reference_id ?? meta.ref;
  if (!ref || !session.amount_total) return null;
  const locale: Locale = isLocale(meta.locale ?? "") ? (meta.locale as Locale) : "es";
  const dict = getDict(locale);
  const names = dict.products.items as Record<string, { name: string }>;

  const lines = (meta.items ?? "")
    .split(",")
    .filter(Boolean)
    .map((part) => {
      const [id, qty, price] = part.split(":");
      const product = findProductById(id);
      return {
        name: (product && names[product.slug]?.name) || id,
        qty: Number(qty) || 1,
        unitCents: Number(price) || 0,
      };
    });

  return {
    ref,
    status: "paid",
    method: `Stripe${session.payment_method_types?.[0] ? ` (${session.payment_method_types[0]})` : ""}`,
    locale,
    customer: {
      name: meta.name || session.customer_details?.name || "",
      email: session.customer_details?.email ?? session.customer_email ?? "",
      phone: session.customer_details?.phone || meta.phone || "",
      address: meta.address || "",
      notes: meta.notes || "",
    },
    lines,
    subtotalCents: session.amount_subtotal ?? session.amount_total,
    discountCents: session.total_details?.amount_discount ?? 0,
    shippingCents: session.total_details?.amount_shipping ?? 0,
    totalCents: session.amount_total,
    coupon: meta.coupon || "",
  };
}
