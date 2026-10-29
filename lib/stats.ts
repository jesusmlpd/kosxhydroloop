/**
 * Medicion propia del embudo: contadores diarios en Redis, sin datos
 * personales. Las ventas no se miden aqui, salen de Stripe (lib/admin-data).
 *
 * Claves: st:{dia}:{evento} y st:{dia}:{evento}:{detalle}, donde dia es la
 * fecha del Centro de Mexico (YYYY-MM-DD).
 */
import { dayFromMs } from "@/lib/date-range";
import { kv, kvAvailable } from "@/lib/kv";

/** session = visita nueva; el resto es el embudo. */
export const EVENTS = ["session", "view_product", "add_to_cart", "checkout"] as const;
export type StatEvent = (typeof EVENTS)[number];

const TTL = 400 * 24 * 3600;
const slug = (value: unknown, max = 40) =>
  typeof value === "string" ? value.toLowerCase().replace(/[^a-z0-9_.-]/g, "").slice(0, max) : "";

/** Fuentes agrupadas: asi se pueden leer todas con un solo MGET, sin listar claves. */
export const SOURCES = ["directo", "meta", "google", "whatsapp", "tiktok", "correo", "otros"] as const;
export type Source = (typeof SOURCES)[number];
export const SOURCE_LABEL: Record<Source, string> = {
  directo: "Directo",
  meta: "Facebook e Instagram",
  google: "Google",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
  correo: "Correo",
  otros: "Otros sitios",
};

export function bucketSource(raw: unknown): Source {
  const value = slug(raw, 60);
  if (!value || value === "directo") return "directo";
  if (/facebook|instagram|^fb$|^ig$|meta|fbclid/.test(value)) return "meta";
  if (/google|goog|gclid|bing|duckduckgo/.test(value)) return "google";
  if (/whatsapp|wa\.me/.test(value)) return "whatsapp";
  if (/tiktok/.test(value)) return "tiktok";
  if (/recovery|email|correo|mail/.test(value)) return "correo";
  return "otros";
}

export async function recordEvent(input: { event: string; product?: unknown; source?: unknown; now?: number }) {
  if (!kvAvailable() || !EVENTS.includes(input.event as StatEvent)) return false;
  const day = dayFromMs(input.now ?? Date.now());
  const base = `st:${day}:${input.event}`;
  const writes = [kv.incr(base)];
  const product = slug(input.product);
  if (product && input.event !== "session") writes.push(kv.incr(`${base}:p:${product}`));
  // La fuente solo se cuenta al abrir la visita, para medir de donde llega la gente.
  if (input.event === "session") writes.push(kv.incr(`${base}:s:${bucketSource(input.source)}`));
  await Promise.all(writes);
  return true;
}

export type DayStats = { day: string } & Record<StatEvent, number>;

/** Totales por dia del rango (ambos incluidos, YYYY-MM-DD). */
export async function loadDailyStats(days: string[]): Promise<DayStats[]> {
  if (!kvAvailable() || !days.length) return days.map((day) => ({ day, session: 0, view_product: 0, add_to_cart: 0, checkout: 0 }));
  const keys = days.flatMap((day) => EVENTS.map((event) => `st:${day}:${event}`));
  const values = await kv.mget(keys);
  return days.map((day, i) => {
    const row = { day } as DayStats;
    EVENTS.forEach((event, j) => {
      row[event] = Number(values[i * EVENTS.length + j] ?? 0);
    });
    return row;
  });
}

/** Visitas por fuente en el rango. */
export async function loadSources(days: string[]): Promise<Array<{ source: Source; sessions: number }>> {
  const totals = SOURCES.map((source) => ({ source, sessions: 0 }));
  if (!kvAvailable() || !days.length) return totals;
  const keys = days.flatMap((day) => SOURCES.map((source) => `st:${day}:session:s:${source}`));
  const values = await kv.mget(keys);
  values.forEach((value, i) => {
    totals[i % SOURCES.length].sessions += Number(value ?? 0);
  });
  return totals.sort((a, b) => b.sessions - a.sessions);
}

export { TTL as STATS_TTL };
