import { NextResponse } from "next/server";
import { ccField, resolveInbox } from "@/lib/formsubmit";
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
        await notify(`Pago confirmado en Stripe: ${session.client_reference_id ?? "sin referencia"}`);
        await sendPurchase(session);
      }
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as { client_reference_id?: string | null };
      console.log("[stripe] fallido", session.client_reference_id);
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
