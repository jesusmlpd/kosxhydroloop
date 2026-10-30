/**
 * Leads: quien escribio su correo en el checkout, aunque no haya pagado. Se
 * guardan siempre; a quien no marco el consentimiento no se le escribe ni se
 * exporta para marketing. Se pueden borrar desde el panel (derecho de cancelacion).
 */
import { createHash } from "crypto";
import { kv, kvAvailable } from "@/lib/kv";

const INDEX = "lead:index";
const leadKey = (hash: string) => `lead:${hash}`;
export const leadHash = (email: string) => createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32);

export type Lead = {
  id: string;
  email: string;
  name: string;
  phone: string;
  locale: string;
  /** Marco la casilla (el dato mas reciente). */
  consent: boolean;
  optedOut: boolean;
  purchased: boolean;
  items: Array<{ id: string; qty: number }>;
  coupon: string;
  firstSeen: number;
  lastSeen: number;
};

async function read(id: string): Promise<Lead | null> {
  const raw = await kv.get(leadKey(id));
  return raw ? (JSON.parse(raw) as Lead) : null;
}

export async function upsertLead(input: {
  email: string;
  name: string;
  phone: string;
  locale: string;
  items: Lead["items"];
  coupon: string;
  consent: boolean;
  now?: number;
}) {
  if (!kvAvailable() || !input.email.includes("@")) return;
  const now = input.now ?? Date.now();
  const id = leadHash(input.email);
  const previous = await read(id);
  const lead: Lead = {
    id,
    email: input.email.trim().toLowerCase(),
    name: input.name || previous?.name || "",
    phone: input.phone || previous?.phone || "",
    locale: input.locale,
    consent: previous?.optedOut ? false : input.consent,
    optedOut: previous?.optedOut ?? false,
    purchased: previous?.purchased ?? false,
    items: input.items,
    coupon: input.coupon,
    firstSeen: previous?.firstSeen ?? now,
    lastSeen: now,
  };
  await kv.set(leadKey(id), JSON.stringify(lead));
  await kv.zadd(INDEX, lead.lastSeen, id);
}

async function patch(email: string, change: Partial<Lead>) {
  if (!kvAvailable()) return;
  const id = leadHash(email);
  const lead = await read(id);
  if (lead) await kv.set(leadKey(id), JSON.stringify({ ...lead, ...change }));
}

export const markLeadPurchased = (email: string) => patch(email, { purchased: true });
export const markLeadOptedOut = (email: string) => patch(email, { optedOut: true, consent: false });

export async function listLeads(limit = 500): Promise<Lead[]> {
  if (!kvAvailable()) return [];
  const ids = await kv.zrevrange(INDEX, limit);
  if (!ids.length) return [];
  const raws = await kv.mget(ids.map(leadKey));
  return raws.flatMap((raw) => {
    try {
      return raw ? [JSON.parse(raw) as Lead] : [];
    } catch {
      return [];
    }
  });
}

export async function deleteLead(id: string) {
  if (!kvAvailable() || !/^[a-f0-9]{32}$/.test(id)) return false;
  await kv.del(leadKey(id));
  await kv.zrem(INDEX, id);
  return true;
}
