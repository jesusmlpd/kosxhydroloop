import { NextResponse } from "next/server";

/**
 * Webhook de Mercado Pago. La notificacion no trae el estado, solo el id del
 * pago, asi que hay que preguntarle a la API: creerle al cuerpo del webhook es
 * como aceptar un recibo escrito a mano.
 *
 * PENDIENTE: falta validar la cabecera x-signature con MERCADOPAGO_WEBHOOK_SECRET
 * y persistir el pedido cuando exista base de datos.
 */
export async function POST(request: Request) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  const body = (await request.json().catch(() => null)) as
    | { type?: string; action?: string; data?: { id?: string } }
    | null;

  const paymentId = body?.data?.id;
  if (!paymentId) return NextResponse.json({ received: true });

  try {
    const { MercadoPagoConfig, Payment } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = await new Payment(client).get({ id: paymentId });

    console.log("[mercadopago]", payment.status, payment.external_reference);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[mercadopago] no se pudo consultar el pago", error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
