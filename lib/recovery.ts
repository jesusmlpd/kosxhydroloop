import { createHash, randomUUID } from "crypto";
import { findCoupon, formatMoney, priceCart } from "@/lib/commerce";
import { PANEL_TZ } from "@/lib/date-range";
import { getDict } from "@/lib/dict";
import { emailConfigured, sendEmail } from "@/lib/email";
import { type Locale } from "@/lib/i18n";
import { kv, kvAvailable } from "@/lib/kv";
import { shell } from "@/lib/order-email";
import { findProductById, products, site } from "@/lib/site";

/**
 * Recuperacion de checkouts abandonados. Cuando alguien llena sus datos y llega
 * a Stripe se guarda un registro minimo (nombre, correo, telefono, articulos,
 * cupon). Un cron cada 15 minutos manda el recordatorio que toque y se detiene
 * solo si el cliente paga, pide la baja o se acaban los pasos. Todo lo que se
 * puede ajustar vive en Settings y se edita desde /admin/marketing/correos.
 */

const DAY = 86_400_000;
/** Un registro vive 14 dias; pasados 7 ya no se manda nada. */
const RECORD_TTL = 14 * 24 * 3600;
const MAX_AGE_MS = 7 * DAY;

export type Step = {
  id: string;
  enabled: boolean;
  /** Minutos desde que inicio el pago. */
  delayMinutes: number;
  subject: string;
  headline: string;
  /** Parrafos separados por una linea en blanco. Variables: {nombre} {articulos} {total} */
  body: string;
  button: string;
  /** Cupon de commerce.coupons o de la promo; vacio = sin incentivo. */
  couponCode: string;
};

export type Settings = {
  enabled: boolean;
  /** Solo se escribe a quien dejo marcada la casilla del checkout. */
  requireConsent: boolean;
  /** Horario permitido de envio, hora del Centro. */
  sendFromHour: number;
  sendToHour: number;
  steps: Step[];
};

export const DEFAULT_SETTINGS: Settings = {
  // Nace apagada: se prende a proposito desde el panel.
  enabled: false,
  requireConsent: true,
  sendFromHour: 9,
  sendToHour: 21,
  steps: [
    {
      id: "uno",
      enabled: true,
      delayMinutes: 60,
      subject: "¿Se te quedó algo en el carrito, {nombre}?",
      headline: "Tu pedido sigue esperándote",
      body: "Vimos que empezaste tu compra de Hydroloop y no alcanzaste a terminarla.\n\nTu carrito quedó guardado: {articulos}.\n\nSi tuviste una duda con el pago, la instalación o el envío, responde este correo o escríbenos por WhatsApp y te ayudamos.",
      button: "Terminar mi pedido",
      couponCode: "",
    },
    {
      id: "dos",
      enabled: true,
      delayMinutes: 24 * 60,
      subject: "Tu Hydroloop sigue apartado",
      headline: "Pagas a meses sin intereses y se instala sin obra",
      body: "Tu pedido de {articulos} sigue guardado.\n\nPuedes pagar con tarjeta a meses sin intereses, OXXO o SPEI. Si no estás seguro de qué modelo te toca, cuéntanos tu caso por WhatsApp y te recomendamos el correcto.",
      button: "Retomar mi pedido",
      couponCode: "",
    },
    {
      id: "tres",
      enabled: true,
      delayMinutes: 72 * 60,
      subject: "Última llamada por tu Hydroloop",
      headline: "Te dejamos algo para que lo termines hoy",
      body: "Tu carrito con {articulos} está a punto de liberarse.\n\nPara que lo cierres sin pensarlo más, aplicamos un descuento a tu pedido; ya va incluido en el botón de abajo.",
      button: "Aprovechar y terminar",
      couponCode: "BIENVENIDA5",
    },
  ],
};

/** Copia fija en ingles para quien compra desde /en; no es editable. */
const EN_COPY: Record<string, Pick<Step, "subject" | "headline" | "body" | "button">> = {
  uno: {
    subject: "Did you leave something in your cart, {nombre}?",
    headline: "Your order is still waiting",
    body: "We saw you started your Hydroloop purchase and did not finish it.\n\nYour cart is saved: {articulos}.\n\nIf you had a question about payment, installation or shipping, reply to this email or message us on WhatsApp.",
    button: "Complete my order",
  },
  dos: {
    subject: "Your Hydroloop is still reserved",
    headline: "Installs with no construction work, easy payment options",
    body: "Your order of {articulos} is still saved.\n\nIf you are not sure which model fits your home, tell us about it on WhatsApp and we will recommend the right one.",
    button: "Resume my order",
  },
  tres: {
    subject: "Last call for your Hydroloop",
    headline: "Here is something to finish it today",
    body: "Your cart with {articulos} is about to be released.\n\nWe applied a discount to your order; it is already included in the button below.",
    button: "Claim it and finish",
  },
};

// ---------------------------------------------------------------------------
// Ajustes
// ---------------------------------------------------------------------------
const SETTINGS_KEY = "rec:settings";
const clamp = (n: unknown, min: number, max: number, fallback: number) => {
  const value = Math.round(Number(n));
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
};
const text = (value: unknown, max: number, fallback: string) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;

/** Cupones que el panel puede ofrecer: los del sitio, nunca uno inventado. */
export function knownCoupon(code: string) {
  return code === "" || findCoupon(code, Date.now()) !== null;
}

export function sanitizeSettings(input: unknown): Settings {
  const raw = (input && typeof input === "object" ? input : {}) as Partial<Settings>;
  const steps = DEFAULT_SETTINGS.steps.map((base, index) => {
    const incoming = (Array.isArray(raw.steps) ? raw.steps[index] : undefined) as Partial<Step> | undefined;
    const coupon =
      typeof incoming?.couponCode === "string" ? incoming.couponCode.trim().toUpperCase() : base.couponCode;
    return {
      id: base.id,
      enabled: incoming?.enabled === undefined ? base.enabled : Boolean(incoming.enabled),
      delayMinutes: clamp(incoming?.delayMinutes, 15, 7 * 24 * 60, base.delayMinutes),
      subject: text(incoming?.subject, 140, base.subject),
      headline: text(incoming?.headline, 140, base.headline),
      body: text(incoming?.body, 2000, base.body),
      button: text(incoming?.button, 60, base.button),
      couponCode: knownCoupon(coupon) ? coupon : "",
    } satisfies Step;
  });
  // Los pasos van en orden de tiempo; si se cruzan se reacomodan.
  steps.sort((a, b) => a.delayMinutes - b.delayMinutes);
  return {
    enabled: Boolean(raw.enabled),
    requireConsent: raw.requireConsent === undefined ? true : Boolean(raw.requireConsent),
    sendFromHour: clamp(raw.sendFromHour, 0, 23, DEFAULT_SETTINGS.sendFromHour),
    sendToHour: clamp(raw.sendToHour, 1, 24, DEFAULT_SETTINGS.sendToHour),
    steps,
  };
}

export async function loadSettings(): Promise<Settings> {
  if (!kvAvailable()) return DEFAULT_SETTINGS;
  try {
    const stored = await kv.get(SETTINGS_KEY);
    return stored ? sanitizeSettings(JSON.parse(stored)) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error("[recuperacion] no se pudieron leer los ajustes", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings) {
  await kv.set(SETTINGS_KEY, JSON.stringify(settings));
}

// ---------------------------------------------------------------------------
// Registros
// ---------------------------------------------------------------------------
export type RecoveryRecord = {
  id: string;
  ref: string;
  createdAt: number;
  email: string;
  name: string;
  phone: string;
  locale: Locale;
  items: Array<{ id: string; qty: number }>;
  coupon: string;
  consent: boolean;
  sent: Array<{ step: string; at: number }>;
};

const PENDING = "rec:pending";
const recordKey = (id: string) => `rec:r:${id}`;
export const emailHash = (email: string) =>
  createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32);

export async function trackCheckout(input: {
  ref: string;
  email: string;
  name: string;
  phone: string;
  locale: Locale;
  items: Array<{ id: string; qty: number }>;
  coupon: string;
  consent: boolean;
  now?: number;
}) {
  if (!kvAvailable() || !input.email.includes("@")) return null;
  const now = input.now ?? Date.now();
  const email = input.email.trim().toLowerCase();
  const byEmail = `rec:byemail:${emailHash(email)}`;

  // Un mismo correo reutiliza su registro mientras siga abierto: el lead se
  // guarda al escribir los datos y el checkout lo actualiza, sin duplicados.
  const existingId = await kv.get(byEmail);
  let record = existingId ? await loadRecord(existingId) : null;
  if (record) {
    const paidAt = Number((await kv.get(paidKey(email))) ?? 0);
    if (now - record.createdAt > MAX_AGE_MS || paidAt >= record.createdAt) record = null;
  }

  if (record) {
    // Mientras siga llenando el formulario no se le escribe: el reloj de los
    // recordatorios parte de su ultima actividad (salvo que ya recibio alguno).
    if (record.sent.length === 0) record.createdAt = now;
    Object.assign(record, {
      ref: input.ref || record.ref,
      name: input.name || record.name,
      phone: input.phone || record.phone,
      locale: input.locale,
      items: input.items,
      coupon: input.coupon,
      consent: input.consent,
    });
  } else {
    record = {
      id: randomUUID().replace(/-/g, ""),
      ref: input.ref,
      createdAt: now,
      email,
      name: input.name,
      phone: input.phone,
      locale: input.locale,
      items: input.items,
      coupon: input.coupon,
      consent: input.consent,
      sent: [],
    };
  }
  await kv.set(recordKey(record.id), JSON.stringify(record), RECORD_TTL);
  await kv.set(byEmail, record.id, RECORD_TTL);
  await kv.zadd(PENDING, record.createdAt, record.id);
  return record;
}

export async function loadRecord(id: string): Promise<RecoveryRecord | null> {
  if (!kvAvailable() || !/^[a-f0-9]{32}$/.test(id)) return null;
  try {
    const raw = await kv.get(recordKey(id));
    return raw ? (JSON.parse(raw) as RecoveryRecord) : null;
  } catch {
    return null;
  }
}

const optOutKey = (email: string) => `rec:optout:${emailHash(email)}`;
const paidKey = (email: string) => `rec:paid:${emailHash(email)}`;
const lastSentKey = (email: string) => `rec:last:${emailHash(email)}`;

export async function optOut(email: string) {
  await kv.set(optOutKey(email), "1");
}

/**
 * Pago confirmado: se frena todo recordatorio pendiente de ese correo y, si ya
 * habia recibido alguno en los ultimos 7 dias, cuenta como recuperado.
 */
export async function markPaid(input: { email: string; ref: string; cents: number; now?: number }) {
  if (!kvAvailable() || !input.email.includes("@")) return;
  const now = input.now ?? Date.now();
  try {
    await kv.set(paidKey(input.email), String(now), 30 * 24 * 3600);
    const last = await kv.get(lastSentKey(input.email));
    if (last) {
      const { step, at } = JSON.parse(last) as { step: string; at: number };
      if (now - at <= MAX_AGE_MS) {
        await kv.zadd("rec:recovered", now, JSON.stringify({ ref: input.ref, cents: input.cents, step, at: now }));
      }
    }
  } catch (error) {
    console.error("[recuperacion] no se pudo registrar el pago", error);
  }
}

// ---------------------------------------------------------------------------
// Decision y envio
// ---------------------------------------------------------------------------
export function hourInPanel(now: number) {
  return (
    Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: PANEL_TZ }).format(new Date(now))) %
    24
  );
}

export function withinSendWindow(settings: Settings, now: number) {
  const hour = hourInPanel(now);
  return settings.sendFromHour <= settings.sendToHour
    ? hour >= settings.sendFromHour && hour < settings.sendToHour
    : hour >= settings.sendFromHour || hour < settings.sendToHour;
}

/**
 * El paso que toca mandar ahora, o null. Si el cron estuvo caido y ya vencieron
 * varios pasos, se manda el mas reciente y no una rafaga de correos atrasados.
 */
export function dueStep(record: RecoveryRecord, settings: Settings, now: number): Step | null {
  const age = now - record.createdAt;
  if (age > MAX_AGE_MS) return null;
  const sentIds = new Set(record.sent.map((entry) => entry.step));
  const due = settings.steps.filter((step) => step.enabled && age >= step.delayMinutes * 60_000);
  const latest = due[due.length - 1];
  if (!latest || sentIds.has(latest.id)) return null;
  // Si ya se mando uno posterior a este, no se retrocede.
  const lastSentIndex = Math.max(-1, ...settings.steps.map((s, i) => (sentIds.has(s.id) ? i : -1)));
  return settings.steps.indexOf(latest) > lastSentIndex ? latest : null;
}

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function describeItems(record: RecoveryRecord) {
  const dict = getDict(record.locale);
  const names = dict.products.items as Record<string, { name: string }>;
  return record.items
    .map((item) => {
      const product = findProductById(item.id);
      const name = (product && names[product.slug]?.name) || item.id;
      return `${item.qty} x ${name}`;
    })
    .join(", ");
}

export function recoveryLink(record: RecoveryRecord, step: Step) {
  const cart = record.items.map((item) => `${item.id}:${item.qty}`).join(",");
  const coupon = step.couponCode || record.coupon;
  const params = new URLSearchParams({ cart });
  if (coupon) params.set("coupon", coupon);
  params.set("r", record.id);
  params.set("utm_source", "recovery");
  params.set("utm_medium", "email");
  params.set("utm_campaign", `carrito-${step.id}`);
  return `${site.url}/${record.locale}/checkout?${params.toString()}`;
}

export function buildRecoveryEmail(record: RecoveryRecord, step: Step) {
  const en = record.locale === "en";
  const copy = en ? { ...step, ...EN_COPY[step.id] } : step;
  const first = record.name.trim().split(/\s+/)[0] || (en ? "there" : "hola");
  const items = describeItems(record);
  const totals = priceCart(
    record.items.map((item) => ({ id: item.id, qty: item.qty })),
    products,
    { couponCode: step.couponCode || record.coupon },
  );
  const fill = (value: string) =>
    value
      .replaceAll("{nombre}", first)
      .replaceAll("{articulos}", items)
      .replaceAll("{total}", formatMoney(totals.totalCents, record.locale));

  const subject = fill(copy.subject);
  const paragraphs = fill(copy.body)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const link = recoveryLink(record, step);
  const unsubscribe = `${site.url}/api/recovery/baja?r=${record.id}`;
  const totalLabel = en ? "Order total" : "Total de tu pedido";
  const unsubscribeLabel = en ? "Stop these reminders" : "Dejar de recibir estos recordatorios";
  const legal = en
    ? `You are receiving this email because you started an order at ${site.name}.`
    : `Recibes este correo porque iniciaste un pedido en ${site.name}.`;

  const html = shell(
    esc(fill(copy.headline)),
    `${paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.55">${esc(p)}</p>`).join("")}
<p style="margin:18px 0;font-size:14px;color:#4b6270">${totalLabel}: <strong style="color:#0b1f2a">${formatMoney(totals.totalCents, record.locale)}</strong></p>
<p style="margin:0"><a href="${esc(link)}" style="background:#0a7f94;color:#fff;text-decoration:none;padding:13px 22px;border-radius:999px;font-weight:600;font-size:15px">${esc(copy.button)}</a></p>
<p style="margin:22px 0 0;font-size:12px;color:#6b8290"><a href="${esc(unsubscribe)}" style="color:#6b8290">${unsubscribeLabel}</a></p>`,
    esc(legal),
  );
  const plain = `${fill(copy.headline)}\n\n${paragraphs.join("\n\n")}\n\n${totalLabel}: ${formatMoney(totals.totalCents, record.locale)}\n\n${copy.button}: ${link}\n\n${unsubscribeLabel}: ${unsubscribe}`;
  return { subject, html, text: plain };
}

export type RunResult = { checked: number; sent: number; skipped: number; reason?: string };

export async function runRecovery(deps: { now?: number; send?: typeof sendEmail } = {}): Promise<RunResult> {
  const now = deps.now ?? Date.now();
  const send = deps.send ?? sendEmail;
  const settings = await loadSettings();
  if (!settings.enabled) return { checked: 0, sent: 0, skipped: 0, reason: "apagada" };
  if (!kvAvailable()) return { checked: 0, sent: 0, skipped: 0, reason: "sin_base_de_datos" };
  if (!deps.send && !emailConfigured()) return { checked: 0, sent: 0, skipped: 0, reason: "sin_correo" };
  if (!withinSendWindow(settings, now)) return { checked: 0, sent: 0, skipped: 0, reason: "fuera_de_horario" };

  const delays = settings.steps.filter((s) => s.enabled).map((s) => s.delayMinutes);
  if (!delays.length) return { checked: 0, sent: 0, skipped: 0, reason: "sin_pasos" };
  const firstDelay = Math.min(...delays);

  const ids = await kv.zrangeByScore(PENDING, now - firstDelay * 60_000);
  let sent = 0;
  let skipped = 0;

  for (const id of ids) {
    const record = await loadRecord(id);
    // Registro vencido o borrado: se saca de la cola.
    if (!record || now - record.createdAt > MAX_AGE_MS) {
      await kv.zrem(PENDING, id);
      skipped += 1;
      continue;
    }
    const paidAt = Number((await kv.get(paidKey(record.email))) ?? 0);
    const optedOut = (await kv.get(optOutKey(record.email))) !== null;
    if (paidAt >= record.createdAt || optedOut || (settings.requireConsent && !record.consent)) {
      await kv.zrem(PENDING, id);
      skipped += 1;
      continue;
    }

    const step = dueStep(record, settings, now);
    if (!step) {
      // Nada que mandar ahora; si ya no quedan pasos futuros, se retira.
      const sentIds = new Set(record.sent.map((entry) => entry.step));
      if (settings.steps.every((s) => !s.enabled || sentIds.has(s.id))) await kv.zrem(PENDING, id);
      skipped += 1;
      continue;
    }

    const mail = buildRecoveryEmail(record, step);
    const ok = await send({
      to: [record.email],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: site.email,
      idempotencyKey: `rec-${record.id}-${step.id}`,
    });
    if (!ok) {
      skipped += 1;
      continue;
    }
    record.sent.push({ step: step.id, at: now });
    await kv.set(recordKey(record.id), JSON.stringify(record), RECORD_TTL);
    await kv.set(lastSentKey(record.email), JSON.stringify({ step: step.id, at: now }), 8 * 24 * 3600);
    await kv.incr(`rec:stat:sent:${step.id}`);
    sent += 1;
  }
  return { checked: ids.length, sent, skipped };
}

// ---------------------------------------------------------------------------
// Numeros para el panel
// ---------------------------------------------------------------------------
export async function loadStats() {
  if (!kvAvailable()) return null;
  const [pending, one, two, three, recoveredRaw] = await Promise.all([
    kv.zcard(PENDING),
    kv.get("rec:stat:sent:uno"),
    kv.get("rec:stat:sent:dos"),
    kv.get("rec:stat:sent:tres"),
    kv.zrevrange("rec:recovered", 200),
  ]);
  type Recovered = { ref: string; cents: number; step: string; at: number };
  const recovered = recoveredRaw
    .map((raw) => {
      try {
        return JSON.parse(raw) as Recovered;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is Recovered => entry !== null);
  return {
    pending,
    sentByStep: { uno: Number(one ?? 0), dos: Number(two ?? 0), tres: Number(three ?? 0) } as Record<string, number>,
    recoveredCount: recovered.length,
    recoveredCents: recovered.reduce((sum, entry) => sum + entry.cents, 0),
    recent: recovered.slice(0, 8),
  };
}
