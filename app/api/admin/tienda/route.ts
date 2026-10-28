import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdmin } from "@/lib/admin";
import { kvAvailable } from "@/lib/kv";
import { sanitizeSettings } from "@/lib/store-settings";
import { saveStoreSettings } from "@/lib/store-settings-server";

/** Guarda los ajustes de la tienda (envio, promo, inventario y precios) desde el panel. */
export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const jar = await cookies();
  if (!isAdmin(jar.get(ADMIN_COOKIE)?.value)) return NextResponse.json({ ok: false }, { status: 401 });
  if (!kvAvailable()) return NextResponse.json({ ok: false, error: "no_database" }, { status: 503 });

  const settings = sanitizeSettings(await request.json().catch(() => null));
  try {
    await saveStoreSettings(settings);
  } catch (error) {
    console.error("[tienda] no se pudo guardar", error);
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, settings });
}
