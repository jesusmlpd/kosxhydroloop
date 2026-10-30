import { AdminLogin, AdminShell, NoAccess } from "@/components/admin-shell";
import { StoreEditor, type StoreSection } from "@/components/admin-store";
import { adminAccess } from "@/lib/admin-access";
import { getDict } from "@/lib/dict";
import { kvAvailable, kvConfigured } from "@/lib/kv";
import { CODE_DEFAULTS, HERO_FIELDS, type HeroCopy } from "@/lib/store-settings";
import { HERO_BASE, readStoreSettings } from "@/lib/store-settings-server";
import { products } from "@/lib/site";

/** Pagina de edicion de una parte de la tienda: comparte datos y marco, cambia lo que se edita. */
export async function renderStorePage({
  section,
  path,
  title,
  intro,
  searchParams,
}: {
  section: StoreSection;
  path: string;
  title: string;
  intro: string;
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const access = await adminAccess(section === "descuentos" ? "descuentos" : "tienda");
  if (access === "login") {
    return <AdminLogin error={Boolean(error)} next={path} />;
  }
  if (access === "denied") return <NoAccess />;

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
    <AdminShell active={path} title={title}>
      <p className="mt-3 max-w-2xl text-[14.5px] text-ink-2">{intro}</p>
      {!kvAvailable() ? (
        <div className="card mt-8 border-[#e7c9a8] bg-[#fff8ee] p-6">
          <h2 className="text-[18px]">Falta conectar la base de datos</h2>
          <p className="mt-2 text-[14px] text-ink-2">
            Para guardar cambios desde aquí hay que conectar Upstash Redis en Vercel (Storage → Marketplace). Mientras
            tanto el sitio usa los valores de fábrica: envío gratis a todo México.
          </p>
        </div>
      ) : null}
      <StoreEditor section={section} initial={settings} items={items} heroDefaults={heroDefaults} canSave={kvAvailable()} usingMemory={!kvConfigured()} />
    </AdminShell>
  );
}
