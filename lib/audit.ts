/** Historial de cambios del panel: quien hizo que y cuando. Si la base falla, nunca bloquea la accion. */
import { randomUUID } from "crypto";
import { kv, kvAvailable } from "@/lib/kv";

const KEY = "adm:audit";

export type AuditEntry = { at: number; who: string; action: string; detail: string };

export async function logAudit(who: string, action: string, detail = "") {
  if (!kvAvailable()) return;
  try {
    const entry: AuditEntry & { n: string } = { at: Date.now(), who, action, detail: detail.slice(0, 300), n: randomUUID().slice(0, 8) };
    await kv.zadd(KEY, entry.at, JSON.stringify(entry));
  } catch (error) {
    console.error("[historial] no se pudo registrar", error);
  }
}

export async function listAudit(limit = 150): Promise<AuditEntry[]> {
  if (!kvAvailable()) return [];
  try {
    const raw = await kv.zrevrange(KEY, limit);
    return raw.flatMap((item) => {
      try {
        return [JSON.parse(item) as AuditEntry];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
}
