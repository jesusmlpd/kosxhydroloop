import { revalidateTag } from "next/cache";
import { kv, kvAvailable, kvConfigured } from "@/lib/kv";
import { getDict } from "@/lib/dict";
import { HERO_FIELDS, DEFAULT_SETTINGS, applySettings, sanitizeSettings, type StoreSettings } from "@/lib/store-settings";

const KEY = "hl:store-settings";
const TAG = "store-settings";

const URL_ = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

/**
 * Con Redis la lectura es un GET con cache de datos de Next (60 s y etiqueta):
 * las paginas siguen siendo estaticas y un guardado del panel las refresca al
 * instante con revalidateTag. kv.get usa POST sin cache, por eso aqui no se usa.
 */
async function raw(fresh: boolean): Promise<string | null> {
  if (!kvConfigured()) return kvAvailable() ? kv.get(KEY) : null;
  const response = await fetch(`${URL_}/get/${encodeURIComponent(KEY)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 60, tags: [TAG] } }),
  });
  if (!response.ok) throw new Error(`kv: ${response.status}`);
  const data = (await response.json()) as { result?: string | null };
  return data.result ?? null;
}

async function read(fresh: boolean): Promise<StoreSettings> {
  try {
    const value = await raw(fresh);
    return value ? sanitizeSettings(JSON.parse(value)) : DEFAULT_SETTINGS;
  } catch (error) {
    // Redis caido o sin configurar: el sitio sigue con los valores del codigo.
    console.error("[store-settings] no se pudo leer", error);
    return DEFAULT_SETTINGS;
  }
}

// Textos de fabrica del hero, para poder volver a ellos si el panel borra uno.
export const HERO_BASE = {
  es: { ...getDict("es").hero },
  en: { ...getDict("en").hero },
};

/** Pone los textos del hero del panel en el diccionario (solo servidor: el hero se pinta en servidor). */
function applyHero(settings: StoreSettings) {
  for (const locale of ["es", "en"] as const) {
    const hero = getDict(locale).hero;
    for (const field of HERO_FIELDS) {
      hero[field] = settings.hero[locale][field] || HERO_BASE[locale][field];
    }
  }
}

/** Lee los ajustes y los aplica al catalogo del proceso. Llamar al inicio de cada pagina o ruta que muestre o cobre precios. */
export async function loadStoreSettings(): Promise<StoreSettings> {
  const settings = await read(false);
  applySettings(settings);
  applyHero(settings);
  return settings;
}

/** Lectura directa, sin cache: para el panel. */
export const readStoreSettings = () => read(true);

export async function saveStoreSettings(settings: StoreSettings) {
  await kv.set(KEY, JSON.stringify(settings));
  revalidateTag(TAG, { expire: 0 });
}
