import { NextResponse } from "next/server";
import { ccField, resolveInbox } from "@/lib/formsubmit";
import { emailConfigured } from "@/lib/email";
import { markPaid } from "@/lib/recovery";
import { orderFromStripeSession, sendOrderEmails, sendRefundEmails } from "@/lib/order-email";
import { isLocale, type Locale } from "@/lib/i18n";
import { sendMetaEvent } from "@/lib/meta-capi";
import { site } from "@/lib/site";

/**
 * Webhook de Stripe. Verifica la firma con el secreto del endpoint: sin eso
 * cualquiera podria avisar que un pedido ya se pago.
 *
 * PENDIENTE: hoy solo deja rastro en el log y avisa por correo. Cuando exista
 * base de datos, aqui se marca el pedido como pagado y se descuenta inventario.
 */
export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ ok: false }, { status: 400 });

  // El cuerpo tiene que leerse crudo: cualquier parseo previo invalida la firma.
  const payload = await request.text();

  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(key);
    const event = await stripe.webhooks.constructEventAsync(payload, signature, secret);

    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as {
        client_reference_id?: string | null;
        amount_total?: number | null;
        payment_status?: string;
        customer_email?: string | null;
        customer_details?: { email?: string | null; phone?: string | null } | null;
        metadata?: Record<string, string> | null;
      };
      // checkout.session.completed tambien llega con OXXO o SPEI sin pagar:
      // ahi todavia no hay venta. El pago real vendra como async_payment_succeeded.
      const paid = event.type === "checkout.session.async_payment_succeeded" || session.payment_status === "paid";
      if (paid) {
        console.log("[stripe] pagado", session.client_reference_id, session.amount_total);
        // Frena los recordatorios de carrito abandonado de ese correo y, si ya
        // le habia llegado uno, lo cuenta como recuperado.
        await markPaid({
          email: session.customer_details?.email ?? session.customer_email ?? "",
          ref: session.client_reference_id ?? "",
          cents: session.amount_total ?? 0,
        });
        // Correos del pedido (equipo + recibo del cliente) por Resend; el aviso de
        // una linea por FormSubmit queda solo de respaldo si Resend no esta listo.
        const order = orderFromStripeSession(session);
        if (order && emailConfigured()) {
          await sendOrderEmails(order, { customerReceipt: true });
        } else {
          await notify(`Pago confirmado en Stripe: ${session.client_reference_id ?? "sin referencia"}`);
        }
        await sendPurchase(session);
      }
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as { client_reference_id?: string | null };
      console.log("[stripe] fallido", session.client_reference_id);
    }

    // Reembolso emitido desde el dashboard de Stripe: avisa al cliente (con el
    // plazo de espera) y al equipo. El panel /admin lo lee directo de Stripe.
    if (event.type === "charge.refunded") {
      await handleRefund(stripe, event.data.object as { id: string; payment_intent?: string | null; amount: number });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe] firma invalida", error);
    return NextResponse.json({ ok: false, error: "bad_signature" }, { status: 400 });
  }
}

async function notify(text: string) {
  const to = resolveInbox();
  if (!to) return;
  await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Origin: site.url },
    body: JSON.stringify({ ...ccField(), _subject: `${site.name}: pago confirmado`, Mensaje: text }),
  }).catch(() => null);
}

/**
 * Purchase por la API de conversiones. El event_id es la referencia del pedido,
 * la misma que el navegador manda en la pantalla de exito: Meta deduplica.
 * Stripe reintenta los webhooks, pero el event_id repetido tampoco duplica.
 */
async function sendPurchase(session: {
  client_reference_id?: string | null;
  amount_total?: number | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null; phone?: string | null } | null;
  metadata?: Record<string, string> | null;
}) {
  const ref = session.client_reference_id ?? session.metadata?.ref;
  if (!ref || !session.amount_total) return;
  const meta = session.metadata ?? {};
  const lines = (meta.items ?? "")
    .split(",")
    .filter(Boolean)
    .map((part) => {
      const [id, qty, price] = part.split(":");
      return { id, quantity: Number(qty) || 1, item_price: (Number(price) || 0) / 100 };
    });

  await sendMetaEvent({
    name: "Purchase",
    eventId: ref,
    sourceUrl: meta.src,
    user: {
      email: session.customer_details?.email ?? session.customer_email,
      phone: session.customer_details?.phone ?? meta.phone,
      name: meta.name,
      city: meta.city,
      state: meta.state,
      zip: meta.zip,
      fbp: meta.fbp,
      fbc: meta.fbc,
      ip: meta.ip,
      userAgent: meta.ua,
    },
    custom: {
      value: session.amount_total / 100,
      currency: "MXN",
      order_id: ref,
      content_type: "product",
      content_ids: lines.map((line) => line.id),
      contents: lines.map((line) => ({ id: line.id, quantity: line.quantity, item_price: line.item_price })),
      num_items: lines.reduce((sum, line) => sum + line.quantity, 0),
    },
  });
}

async function handleRefund(
  stripe: import("stripe").default,
  charge: { id: string; payment_intent?: string | null; amount: number },
) {
  const intentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
  if (!intentId) return;

  const [refunds, sessions] = await Promise.all([
    stripe.refunds.list({ charge: charge.id, limit: 20 }),
    stripe.checkout.sessions.list({ payment_intent: intentId, limit: 1 }),
  ]);
  // El evento llega por cada reembolso; el mas reciente es el que lo disparo.
  const refund = refunds.data[0];
  const session = sessions.data[0];
  if (!refund || !session) return;
  if (refund.status === "failed" || refund.status === "canceled") return;

  const meta = session.metadata ?? {};
  const locale: Locale = isLocale(meta.locale ?? "") ? (meta.locale as Locale) : "es";
  const total = session.amount_total ?? charge.amount;
  const refundedTotal = refunds.data
    .filter((r) => r.status !== "failed" && r.status !== "canceled")
    .reduce((sum, r) => sum + r.amount, 0);

  await sendRefundEmails({
    ref: session.client_reference_id ?? meta.ref ?? session.id.slice(-8),
    locale,
    refundId: refund.id,
    refundCents: refund.amount,
    orderTotalCents: total,
    full: refundedTotal >= total,
    paymentMethod: session.payment_method_types?.[0] ?? "card",
    customer: {
      name: meta.name || session.customer_details?.name || "",
      email: session.customer_details?.email ?? session.customer_email ?? "",
    },
  });
}
