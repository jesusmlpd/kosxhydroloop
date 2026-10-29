import { NextResponse } from "next/server";
import { priceCart } from "@/lib/commerce";
import { isLocale } from "@/lib/i18n";
import { trackCheckout } from "@/lib/recovery";
import { products } from "@/lib/site";
import { loadStoreSettings } from "@/lib/store-settings-server";

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BOT = /bot|crawl|spider|headless|lighthouse/i;
const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/**
 * Guarda al cliente en cuanto escribe su correo en el checkout, antes de que
 * pague. Siempre se guarda; el consentimiento (casilla) solo decide si despues
 * se le escribe. El carrito se recalcula en el servidor: del cliente solo se
 * aceptan ids y cantidades.
 */
export async function POST(request: Request) {
  if (BOT.test(request.headers.get("user-agent") ?? "")) return NextResponse.json({ ok: true });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = clean(body?.email, 120).toLowerCase();
  if (!body || !EMAIL.test(email)) return NextResponse.json({ ok: false }, { status: 400 });

  await loadStoreSettings();
  const lines = (Array.isArray(body.lines) ? body.lines : [])
    .slice(0, 10)
    .map((line) => ({ id: clean((line as { id?: unknown })?.id, 40), qty: Math.round(Number((line as { qty?: unknown })?.qty)) }))
    .filter((line) => line.qty >= 1 && line.qty <= 20);
  const totals = priceCart(lines, products, { couponCode: clean(body.coupon, 24) || null });
  if (!totals.lines.length) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    await trackCheckout({
      ref: "lead",
      email,
      name: clean(body.name, 80),
      phone: clean(body.phone, 30),
      locale: isLocale(String(body.locale)) ? (body.locale as "es" | "en") : "es",
      items: totals.lines.map((line) => ({ id: line.id, qty: line.qty })),
      coupon: totals.couponCode ?? "",
      consent: body.consent === true,
    });
  } catch (error) {
    console.error("[recuperacion] no se guardo el lead", error);
  }
  return NextResponse.json({ ok: true });
}
