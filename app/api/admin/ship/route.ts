import { NextResponse } from "next/server";
import { apiAccess } from "@/lib/admin-access";
import { logAudit } from "@/lib/audit";

/**
 * Marca un pedido como enviado guardando la guia EN el propio PaymentIntent
 * de Stripe (metadata). Stripe es la base de datos: el estado sobrevive
 * deploys, no hay tabla que migrar y se ve tambien desde su dashboard.
 */
export async function POST(request: Request) {
  const access = await apiAccess("pedidos");
  if (!("session" in access)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: access.status });
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 503 });

  const body = (await request.json().catch(() => null)) as
    | { paymentIntent?: string; tracking?: string; carrier?: string }
    | null;
  if (!body?.paymentIntent) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(key);
  await stripe.paymentIntents.update(body.paymentIntent, {
    metadata: {
      shipped: "1",
      shipped_at: new Date().toISOString().slice(0, 10),
      tracking: body.tracking ?? "",
      carrier: body.carrier ?? "",
    },
  });
  await logAudit(access.session.email, "Pedido marcado como enviado", `${body.carrier ?? ""} ${body.tracking ?? ""}`.trim());
  return NextResponse.json({ ok: true });
}
