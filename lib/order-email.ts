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

/* ------------------------------------------------------------------ */
/* Reembolsos                                                          */
/* ------------------------------------------------------------------ */

export type RefundEmail = {
  ref: string;
  locale: Locale;
  refundId: string;
  refundCents: number;
  orderTotalCents: number;
  /** El reembolso cubre todo el pedido (suma de reembolsos == total cobrado). */
  full: boolean;
  /** card | oxxo | customer_balance (SPEI) | ... */
  paymentMethod: string;
  customer: { name: string; email: string };
};

const REFUND_TEXT = {
  es: {
    title: "Tu reembolso está en camino",
    lead: (amount: string, ref: string, full: boolean) =>
      `Ya solicitamos el reembolso ${full ? "total" : "parcial"} de ${amount} de tu pedido ${ref}.`,
    cardTime:
      "El dinero vuelve a la misma tarjeta con la que pagaste. Tu banco lo refleja normalmente entre 5 y 10 días hábiles, y puede verse como un abono o como una cancelación del cargo; algunos bancos tardan hasta 15 días hábiles.",
    otherTime:
      "Como el pago no fue con tarjeta, nuestro equipo te contactará en las próximas 24 a 48 horas hábiles para coordinar la devolución a tu cuenta.",
    help: "Si pasado ese plazo no lo ves, responde a este correo con tu número de pedido y lo revisamos contigo.",
    amount: "Monto del reembolso",
    order: "Pedido",
    subject: (ref: string) => `Tu reembolso del pedido ${ref} está en camino`,
  },
  en: {
    title: "Your refund is on its way",
    lead: (amount: string, ref: string, full: boolean) =>
      `We have issued a ${full ? "full" : "partial"} refund of ${amount} for your order ${ref}.`,
    cardTime:
      "The money goes back to the same card you paid with. Your bank usually shows it within 5 to 10 business days, as a credit or as a reversed charge; some banks take up to 15 business days.",
    otherTime:
      "Since the payment was not made by card, our team will contact you within 24 to 48 business hours to arrange the refund to your account.",
    help: "If you do not see it after that time, reply to this email with your order number and we will look into it with you.",
    amount: "Refund amount",
    order: "Order",
    subject: (ref: string) => `Your refund for order ${ref} is on its way`,
  },
} as const;

export function refundCustomerEmail(refund: RefundEmail) {
  const t = REFUND_TEXT[refund.locale];
  const amount = formatMoney(refund.refundCents, refund.locale);
  const lead = t.lead(amount, refund.ref, refund.full);
  const time = refund.paymentMethod === "card" ? t.cardTime : t.otherTime;
  const first = esc(refund.customer.name.split(" ")[0] || "");
  const html = shell(
    t.title,
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.5">${first ? `${first}, ` : ""}${esc(lead)}</p>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:0 0 16px">
<tr><td style="padding:3px 0;color:#4b6270">${t.order}</td><td style="padding:3px 0;text-align:right">${esc(refund.ref)}</td></tr>
<tr><td style="padding:3px 0;color:#4b6270">${t.amount}</td><td style="padding:3px 0;text-align:right;font-weight:700">${amount}</td></tr>
</table>
<p style="margin:0 0 12px;font-size:14px;line-height:1.55">${esc(time)}</p>
<p style="margin:0 0 18px;font-size:14px;line-height:1.55;color:#4b6270">${esc(t.help)}</p>
<p style="margin:0"><a href="${whatsappUrl(`${t.order} ${refund.ref}`)}" style="background:#0a7f94;color:#fff;text-decoration:none;padding:11px 18px;border-radius:999px;font-weight:600;font-size:14px">${LABELS[refund.locale].whatsapp}</a></p>`,
    LABELS[refund.locale].legal,
  );
  const text = `${t.title}\n\n${lead}\n\n${t.order}: ${refund.ref}\n${t.amount}: ${amount}\n\n${time}\n\n${t.help}`;
  return { subject: t.subject(refund.ref), html, text };
}

export function refundInternalEmail(refund: RefundEmail) {
  const amount = formatMoney(refund.refundCents, "es");
  const total = formatMoney(refund.orderTotalCents, "es");
  const subject = `${site.name}: reembolso ${refund.full ? "total" : "parcial"} del pedido ${refund.ref} · ${amount}`;
  const lines: Array<[string, string]> = [
    ["Pedido", refund.ref],
    ["Cliente", `${refund.customer.name} <${refund.customer.email}>`],
    ["Reembolso", `${amount} (${refund.full ? "total" : "parcial"}) de ${total}`],
    ["Método de pago", refund.paymentMethod],
    ["Stripe", refund.refundId],
  ];
  const warn =
    refund.paymentMethod === "card"
      ? ""
      : `<p style="margin:16px 0 0;font-size:14px;color:#9b2c20"><strong>Atención:</strong> el pago no fue con tarjeta; Stripe no devuelve este dinero solo. Hay que coordinar la devolución con el cliente.</p>`;
  const html = shell(
    `Reembolso ${refund.full ? "total" : "parcial"} emitido`,
    `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">${lines
      .map(
        ([k, v]) =>
          `<tr><td style="padding:3px 12px 3px 0;color:#4b6270;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:3px 0">${esc(v)}</td></tr>`,
      )
      .join("")}</table>${warn}
<p style="margin:20px 0 0"><a href="${site.url}/admin/pedidos" style="background:#0a7f94;color:#fff;text-decoration:none;padding:11px 18px;border-radius:999px;font-weight:600;font-size:14px">Abrir pedidos en el panel</a></p>`,
    "Aviso interno de Hydroloop.",
  );
  const text = `${subject}\n\n${lines.map(([k, v]) => `${k}: ${v}`).join("\n")}${refund.paymentMethod === "card" ? "" : "\n\nATENCION: el pago no fue con tarjeta, hay que coordinar la devolucion con el cliente."}\n\n${site.url}/admin/pedidos`;
  return { subject, html, text };
}

export async function sendRefundEmails(refund: RefundEmail) {
  if (!emailConfigured()) {
    console.warn("[reembolso] sin RESEND_API_KEY, no salen correos", refund.ref);
    return;
  }
  const internal = refundInternalEmail(refund);
  const to = internalRecipients();
  if (to.length) {
    await sendEmail({
      to,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      replyTo: refund.customer.email || undefined,
      idempotencyKey: `refund-internal-${refund.refundId}`,
    });
  }
  if (refund.customer.email.includes("@")) {
    const mail = refundCustomerEmail(refund);
    await sendEmail({
      to: [refund.customer.email],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: site.email,
      idempotencyKey: `refund-customer-${refund.refundId}`,
    });
  }
}
