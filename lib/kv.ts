/**
 * Almacen clave-valor minimo para lo que el sitio necesita recordar por su
 * cuenta (reglas editables del panel, registro de recordatorios). Usa Redis de
 * Upstash por su API REST, sin dependencias: Vercel Marketplace lo conecta solo
 * y deja UPSTASH_REDIS_REST_URL / _TOKEN (o los alias KV_REST_API_*).
 *
 * En desarrollo, sin credenciales, cae a memoria para poder probar el flujo.
 * En produccion NO: sin base de datos la recuperacion queda apagada y el panel
 * lo avisa, en vez de fingir que guarda.
 */
const URL_ = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const kvConfigured = () => Boolean(URL_ && TOKEN);
/** Memoria solo fuera de produccion. */
const inMemory = () => !kvConfigured() && process.env.NODE_ENV !== "production";
export const kvAvailable = () => kvConfigured() || inMemory();

type Cmd = Array<string | number>;

async function run(cmd: Cmd): Promise<unknown> {
  const response = await fetch(URL_ as string, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => null)) as { result?: unknown; error?: string } | null;
  if (!response.ok || data?.error) throw new Error(`kv: ${data?.error ?? response.status}`);
  return data?.result ?? null;
}

// --- memoria de desarrollo -------------------------------------------------
// En globalThis para que las rutas de la API y las paginas (que Next compila por
// separado en desarrollo) vean los mismos datos.
const shared = globalThis as unknown as {
  __hlMemory?: Map<string, { value: string; expires: number | null }>;
  __hlSorted?: Map<string, Map<string, number>>;
};
const memory = (shared.__hlMemory ??= new Map());
const sorted = (shared.__hlSorted ??= new Map());

const alive = (key: string) => {
  const entry = memory.get(key);
  if (!entry) return null;
  if (entry.expires !== null && entry.expires < Date.now()) {
    memory.delete(key);
    return null;
  }
  return entry;
};

export const kv = {
  async get(key: string): Promise<string | null> {
    if (inMemory()) return alive(key)?.value ?? null;
    return (await run(["GET", key])) as string | null;
  },

  async set(key: string, value: string, ttlSeconds?: number) {
    if (inMemory()) {
      memory.set(key, { value, expires: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null });
      return;
    }
    await run(ttlSeconds ? ["SET", key, value, "EX", ttlSeconds] : ["SET", key, value]);
  },

  async del(key: string) {
    if (inMemory()) {
      memory.delete(key);
      return;
    }
    await run(["DEL", key]);
  },

  async zadd(key: string, score: number, member: string) {
    if (inMemory()) {
      const set = sorted.get(key) ?? new Map<string, number>();
      set.set(member, score);
      sorted.set(key, set);
      return;
    }
    await run(["ZADD", key, score, member]);
  },

  async zrem(key: string, member: string) {
    if (inMemory()) {
      sorted.get(key)?.delete(member);
      return;
    }
    await run(["ZREM", key, member]);
  },

  /** Miembros con score <= max, del mas viejo al mas nuevo. */
  async zrangeByScore(key: string, max: number, limit = 200): Promise<string[]> {
    if (inMemory()) {
      return [...(sorted.get(key) ?? new Map<string, number>()).entries()]
        .filter(([, score]) => score <= max)
        .sort((a, b) => a[1] - b[1])
        .slice(0, limit)
        .map(([member]) => member);
    }
    return ((await run(["ZRANGEBYSCORE", key, "-inf", max, "LIMIT", 0, limit])) as string[]) ?? [];
  },

  async zcard(key: string): Promise<number> {
    if (inMemory()) return sorted.get(key)?.size ?? 0;
    return Number((await run(["ZCARD", key])) ?? 0);
  },

  /** Los N miembros mas recientes (score mayor), para listas de "ultimos". */
  async zrevrange(key: string, count: number): Promise<string[]> {
    if (inMemory()) {
      return [...(sorted.get(key) ?? new Map<string, number>()).entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([member]) => member);
    }
    return ((await run(["ZREVRANGE", key, 0, count - 1])) as string[]) ?? [];
  },

  async incr(key: string): Promise<number> {
    if (inMemory()) {
      const next = Number(alive(key)?.value ?? 0) + 1;
      memory.set(key, { value: String(next), expires: null });
      return next;
    }
    return Number(await run(["INCR", key]));
  },
};
