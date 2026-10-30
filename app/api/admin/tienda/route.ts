import { NextResponse } from "next/server";
import { apiAccess } from "@/lib/admin-access";
import { logAudit } from "@/lib/audit";
import { kvAvailable } from "@/lib/kv";
import { sanitizeSettings } from "@/lib/store-settings";
import { readStoreSettings, saveStoreSettings } from "@/lib/store-settings-server";

/** Guarda los ajustes de la tienda (envio, promo, inventario y precios) desde el panel. */
export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  // Los cupones son de la seccion Descuentos; lo demas, de Tienda.
  const access = await apiAccess(body && "coupons" in body ? "descuentos" : "tienda");
  if (!("session" in access)) return NextResponse.json({ ok: false }, { status: access.status });
  if (!kvAvailable()) return NextResponse.json({ ok: false, error: "no_database" }, { status: 503 });

  // Cada pagina del panel manda solo su parte (envio y promos, productos, hero o
  // cupones): se mezcla con lo ya guardado para no pisar lo de las demas.
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false, error: "bad_body" }, { status: 400 });
  const parts = Object.fromEntries(
    (["shipping", "promo", "products", "coupons", "hero"] as const).filter((key) => key in body).map((key) => [key, body[key]]),
  );
  if (!Object.keys(parts).length) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  const settings = sanitizeSettings({ ...(await readStoreSettings()), ...parts });
  try {
    await saveStoreSettings(settings);
    const labels: Record<string, string> = { shipping: "envío", promo: "promoción", products: "productos", coupons: "cupones", hero: "textos del inicio" };
    await logAudit(access.session.email, "Cambió ajustes de la tienda", Object.keys(parts).map((key) => labels[key]).join(", "));
  } catch (error) {
    console.error("[tienda] no se pudo guardar", error);
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, settings });
}
