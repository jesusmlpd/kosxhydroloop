import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminLogin, AdminShell } from "@/components/admin-shell";
import { StoreEditor } from "@/components/admin-store";
import { ADMIN_COOKIE, isAdmin } from "@/lib/admin";
import { getDict } from "@/lib/dict";
import { kvAvailable, kvConfigured } from "@/lib/kv";
import { CODE_DEFAULTS, HERO_FIELDS, type HeroCopy } from "@/lib/store-settings";
import { HERO_BASE, readStoreSettings } from "@/lib/store-settings-server";
import { products } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tienda | Hydroloop®",
  robots: { index: false, follow: false },
};

// Siempre fresco: el formulario parte de lo que hay guardado en este momento.
export const dynamic = "force-dynamic";

export default async function AdminStorePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const jar = await cookies();
  const { error } = await searchParams;
  if (!isAdmin(jar.get(ADMIN_COOKIE)?.value)) {
    return <AdminLogin error={Boolean(error)} next="/admin/tienda" />;
  }

  const settings = await readStoreSettings();
  const names = getDict("es").products.items as Record<string, { name: string }>;
  const items = products
    .filter((product) => product.buyable)
    .map((product) => ({
      id: product.id,
      name: names[product.slug]?.name ?? product.slug,
      base: CODE_DEFAULTS.products[product.id],
    }));

  // De fabrica, no lo que ya aplico el panel al diccionario de este proceso.
  const heroDefaults = Object.fromEntries(
    (["es", "en"] as const).map((locale) => [
      locale,
      Object.fromEntries(HERO_FIELDS.map((field) => [field, (HERO_BASE[locale] as unknown as Record<string, string>)[field] ?? ""])),
    ]),
  ) as { es: HeroCopy; en: HeroCopy };

  return (
    <AdminShell active="/admin/tienda" title="Tienda">
      {!kvAvailable() ? (
        <div className="card mt-8 border-[#e7c9a8] bg-[#fff8ee] p-6">
          <h2 className="text-[18px]">Falta conectar la base de datos</h2>
          <p className="mt-2 text-[14px] text-ink-2">
            Para guardar cambios desde aquí hay que conectar Upstash Redis en Vercel (Storage → Marketplace). Mientras
            tanto el sitio usa los valores de fábrica: envío gratis a todo México.
          </p>
        </div>
      ) : null}
      <StoreEditor initial={settings} items={items} heroDefaults={heroDefaults} canSave={kvAvailable()} usingMemory={!kvConfigured()} />
    </AdminShell>
  );
}
