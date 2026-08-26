import { NextResponse } from "next/server";
import { resolveInbox } from "@/lib/formsubmit";
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
      const session = event.data.object as { client_reference_id?: string | null; amount_total?: number | null };
      console.log("[stripe] pagado", session.client_reference_id, session.amount_total);
      await notify(`Pago confirmado en Stripe: ${session.client_reference_id ?? "sin referencia"}`);
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
    body: JSON.stringify({ _subject: `${site.name}: pago confirmado`, Mensaje: text }),
  }).catch(() => null);
}
