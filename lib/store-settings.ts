/**
 * Ajustes de la tienda que se editan desde el panel (/admin/tienda): envio,
 * promocion e inventario/precios. Es codigo puro, sin servidor, porque lo usan
 * tanto el servidor como el navegador.
 *
 * Los valores de arranque salen de lib/commerce y lib/site. Lo que se guarda
 * en el panel solo los sobreescribe: sin base de datos el sitio sigue
 * funcionando con los valores del codigo.
 *
 * El dinero va en centavos, como en el resto de la tienda.
 */
import { commerce } from "@/lib/commerce";
import { products } from "@/lib/site";

export type PromoCopy = { title: string; body: string; cta: string };

/** Textos del hero del inicio. Vacio = el texto de fabrica (lib/dict). */
export const HERO_FIELDS = ["eyebrow", "title", "titleAccent", "body", "ctaPrimary", "ctaSecondary", "note"] as const;
export type HeroField = (typeof HERO_FIELDS)[number];
export type HeroCopy = Record<HeroField, string>;
export const EMPTY_HERO: HeroCopy = {
  eyebrow: "",
  title: "",
  titleAccent: "",
  body: "",
  ctaPrimary: "",
  ctaSecondary: "",
  note: "",
};

export type StoreSettings = {
  shipping: {
    /** Costo de envio en centavos. 0 = envio gratis para todos. */
    flatCents: number;
    /** Desde que monto el envio es gratis. Solo cuenta si flatCents > 0. */
    freeFromCents: number;
    /** Promo de envio gratis sin minimo hasta esta fecha. null = sin promo. */
    freeUntil: string | null;
  };
  promo: {
    /** Fecha fin de la barra y la ventana emergente. null = sin fecha. */
    endsAt: string | null;
    bannerEnabled: boolean;
    bannerEs: string;
    bannerEn: string;
    popupEnabled: boolean;
    popupEs: PromoCopy;
    popupEn: PromoCopy;
  };
  products: Record<string, { priceCents?: number; compareAtCents?: number | null; stock?: number }>;
  /** Cupones activos del checkout. Un cupon apagado o vencido no se acepta. */
  coupons: Array<{ code: string; percentOff: number; endsAt: string | null; enabled: boolean }>;
  hero: { es: HeroCopy; en: HeroCopy };
};

export const DEFAULT_SETTINGS: StoreSettings = {
  shipping: { flatCents: 0, freeFromCents: 0, freeUntil: null },
  promo: {
    endsAt: "2026-10-31T23:59:59-06:00",
    bannerEnabled: true,
    bannerEs: "Hasta el 31 de octubre: envío gratis en todos los modelos + 3 meses sin intereses",
    bannerEn: "Until October 31: free shipping on every model + 3 interest-free installments",
    popupEnabled: true,
    popupEs: {
      title: "Envío gratis a todo México",
      body: "Termina tu compra hoy: envío gratis en todos los modelos y hasta 3 meses sin intereses. Promoción válida hasta el 31 de octubre.",
      cta: "Ver productos",
    },
    popupEn: {
      title: "Free shipping across Mexico",
      body: "Finish your order today: free shipping on every model and up to 3 months interest-free. Offer valid until October 31.",
      cta: "See products",
    },
  },
  products: {},
  coupons: [{ code: "BIENVENIDA5", percentOff: 5, endsAt: null, enabled: true }],
  hero: { es: EMPTY_HERO, en: EMPTY_HERO },
};

// Fotografia de lo que dice el codigo, para poder volver a el si el panel
// borra un ajuste (apply siempre parte de aqui, nunca acumula).
const BASE = {
  shipping: { ...commerce.shipping },
  products: Object.fromEntries(
    products.map((p) => [p.id, { priceCents: p.priceCents, compareAtCents: p.compareAtCents, stock: p.stock }]),
  ),
};

const int = (value: unknown, min: number, max: number, fallback: number) => {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const text = (value: unknown, fallback: string, max = 400) =>
  typeof value === "string" ? value.trim().slice(0, max) : fallback;
const date = (value: unknown, fallback: string | null) => {
  if (value === null || value === "") return null;
  if (typeof value !== "string") return fallback;
  return Number.isNaN(Date.parse(value)) ? fallback : value;
};
const copy = (value: unknown, fallback: PromoCopy): PromoCopy => {
  const v = (value ?? {}) as Record<string, unknown>;
  return { title: text(v.title, fallback.title, 90), body: text(v.body, fallback.body, 300), cta: text(v.cta, fallback.cta, 40) };
};

const heroCopy = (value: unknown): HeroCopy => {
  const v = (value ?? {}) as Record<string, unknown>;
  const out = { ...EMPTY_HERO };
  for (const field of HERO_FIELDS) out[field] = text(v[field], "", field === "body" ? 400 : 120);
  return out;
};

/** Acepta lo que venga (el panel o la base) y devuelve algo seguro de usar. */
export function sanitizeSettings(input: unknown): StoreSettings {
  const raw = (input ?? {}) as Record<string, Record<string, unknown> | undefined>;
  const d = DEFAULT_SETTINGS;
  const shipping = raw.shipping ?? {};
  const promo = raw.promo ?? {};

  const out: StoreSettings = {
    shipping: {
      flatCents: int(shipping.flatCents, 0, 500_000, d.shipping.flatCents),
      freeFromCents: int(shipping.freeFromCents, 0, 50_000_000, d.shipping.freeFromCents),
      freeUntil: date(shipping.freeUntil, d.shipping.freeUntil),
    },
    promo: {
      endsAt: date(promo.endsAt, d.promo.endsAt),
      bannerEnabled: promo.bannerEnabled === undefined ? d.promo.bannerEnabled : Boolean(promo.bannerEnabled),
      bannerEs: text(promo.bannerEs, d.promo.bannerEs, 200),
      bannerEn: text(promo.bannerEn, d.promo.bannerEn, 200),
      popupEnabled: promo.popupEnabled === undefined ? d.promo.popupEnabled : Boolean(promo.popupEnabled),
      popupEs: copy(promo.popupEs, d.promo.popupEs),
      popupEn: copy(promo.popupEn, d.promo.popupEn),
    },
    products: {},
    coupons: d.coupons,
    hero: { es: heroCopy(raw.hero?.es), en: heroCopy(raw.hero?.en) },
  };

  if (Array.isArray(raw.coupons)) {
    const seen = new Set<string>();
    out.coupons = [];
    for (const item of raw.coupons as unknown as Array<Record<string, unknown>>) {
      const code = typeof item?.code === "string" ? item.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 24) : "";
      if (!code || seen.has(code)) continue;
      seen.add(code);
      out.coupons.push({
        code,
        percentOff: int(item.percentOff, 1, 90, 5),
        endsAt: date(item.endsAt, null),
        enabled: item.enabled === undefined ? true : Boolean(item.enabled),
      });
      if (out.coupons.length >= 20) break;
    }
  }

  const items = (raw.products ?? {}) as Record<string, Record<string, unknown> | undefined>;
  for (const product of products) {
    const item = items[product.id];
    if (!item) continue;
    const entry: StoreSettings["products"][string] = {};
    if (item.priceCents !== undefined) entry.priceCents = int(item.priceCents, 0, 100_000_000, product.priceCents);
    if (item.compareAtCents !== undefined) {
      entry.compareAtCents = item.compareAtCents === null ? null : int(item.compareAtCents, 0, 100_000_000, 0) || null;
    }
    if (item.stock !== undefined) entry.stock = int(item.stock, 0, 100_000, product.stock);
    out.products[product.id] = entry;
  }
  return out;
}

/**
 * Pone los ajustes en `commerce` y `products`, que es de donde lee todo el
 * sitio. Siempre parte de los valores del codigo, asi que es idempotente y
 * quitar un ajuste en el panel lo devuelve a su valor original.
 */
export function applySettings(settings: StoreSettings) {
  commerce.shipping.flatCents = settings.shipping.flatCents;
  commerce.shipping.freeFromCents = settings.shipping.freeFromCents;
  commerce.shipping.freeUntil = settings.shipping.freeUntil;

  commerce.coupons = settings.coupons
    .filter((coupon) => coupon.enabled)
    .map(({ code, percentOff, endsAt }) => ({ code, percentOff, endsAt }));

  for (const product of products) {
    const base = BASE.products[product.id];
    const over = settings.products[product.id] ?? {};
    product.priceCents = over.priceCents ?? base.priceCents;
    product.compareAtCents = over.compareAtCents === undefined ? base.compareAtCents : over.compareAtCents;
    product.stock = over.stock ?? base.stock;
  }
}

/** Para el panel: lo que dice el codigo, sin ajustes. */
export const CODE_DEFAULTS = BASE;

/** true mientras la fecha no haya pasado (o no haya fecha). */
export const notExpired = (endsAt: string | null, now = Date.now()) =>
  endsAt === null || new Date(endsAt).getTime() > now;
