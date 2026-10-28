/**
 * Reglas de la tienda en un solo lugar: envio, impuestos, urgencia y cupones.
 *
 * Todo el dinero se maneja en centavos y como entero. Nunca en flotante, que
 * es como se acaban cobrando 1,299.9999999 pesos.
 *
 * PLACEHOLDER: los montos y las fechas son de arranque. Ver PLACEHOLDERS.md.
 */
export const commerce = {
  currency: "MXN" as const,

  /** En Mexico el precio de mostrador ya trae IVA, asi que no se suma aparte. */
  pricesIncludeTax: true,
  taxRate: 0.16,

  /**
   * Envio gratis a todo Mexico: flatCents en 0. El panel (/admin/tienda) puede
   * ponerle costo, un minimo para envio gratis o una fecha de envio gratis.
   */
  shipping: {
    flatCents: 0,
    freeFromCents: 0,
    freeUntil: null as string | null,
  },

  /** Reserva del carrito. En minutos. Poner 0 la apaga. */
  reservation: {
    minutes: 15,
    /** false = al vencer solo avisa, no le borra el carrito a nadie. */
    clearOnExpire: false,
  },

  /** Promocion con fecha real de fin. Poner endsAt en null la apaga. */
  promo: {
    code: "AGUA10",
    percentOff: 10,
    endsAt: "2026-09-07T23:59:59-06:00" as string | null,
  },

  /** Debajo de este inventario se avisa que queda poco. */
  lowStockThreshold: 10,
  /** Debajo de este inventario se muestra la barra de disponibilidad. */
  stockBarThreshold: 15,

  /** Interruptores de cada mecanismo de urgencia. */
  urgency: {
    offerCountdown: true,
    cartReservation: true,
    lowStock: true,
    freeShippingBar: true,
    socialProof: true,
  },

  /**
   * Prueba social SIMULADA. Los "viendo ahora" y los avisos de compra son
   * cifras generadas, no telemetria real: el cliente lo pidio asi mientras
   * no exista analitica conectada. Cuando haya datos reales, este bloque es
   * el unico lugar que hay que recablear, o poner urgency.socialProof en
   * false y desaparece todo.
   */
  socialProof: {
    /** Rango de "personas viendo ahora" por producto. */
    viewersMin: 3,
    viewersMax: 9,
    /** Toasts de "alguien agrego al carrito": cadencia y tope por visita. */
    toastFirstMs: 12000,
    toastEveryMs: 28000,
    toastMaxPerSession: 4,
  },

  /** Cupones extra al de la promo. El de la promo entra solo. */
  coupons: [{ code: "BIENVENIDA5", percentOff: 5 }],
};

export function formatMoney(cents: number, locale: string, currency: string = commerce.currency) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export type CartLine = { id: string; qty: number };

export type PricedLine = {
  id: string;
  slug: string;
  qty: number;
  unitCents: number;
  compareAtCents: number | null;
  lineCents: number;
};

export type Totals = {
  lines: PricedLine[];
  itemCount: number;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  freeShippingMissingCents: number;
  taxIncludedCents: number;
  totalCents: number;
  couponCode: string | null;
};

/** Cupon valido, en mayusculas, o null. El de una promo vencida no cuenta. */
export function findCoupon(code: string | null | undefined, now: number) {
  if (!code) return null;
  const wanted = code.trim().toUpperCase();
  if (!wanted) return null;

  const promoLive =
    commerce.promo.endsAt === null || new Date(commerce.promo.endsAt).getTime() > now;
  if (promoLive && wanted === commerce.promo.code) {
    return { code: commerce.promo.code, percentOff: commerce.promo.percentOff };
  }

  return commerce.coupons.find((coupon) => coupon.code === wanted) ?? null;
}

/**
 * Unica fuente de la verdad para los totales. La usa el carrito en el
 * navegador y tambien el servidor antes de cobrar: el cliente manda ids y
 * cantidades, jamas precios.
 */
export function priceCart(
  lines: CartLine[],
  catalog: Array<{
    id: string;
    slug: string;
    priceCents: number;
    compareAtCents?: number | null;
    stock: number;
  }>,
  options: { couponCode?: string | null; now?: number } = {},
): Totals {
  const now = options.now ?? Date.now();

  const priced: PricedLine[] = [];
  for (const line of lines) {
    const product = catalog.find((item) => item.id === line.id);
    if (!product) continue;
    // El tope es el inventario: nadie compra 40 piezas de algo que tiene 3.
    const qty = Math.max(0, Math.min(line.qty, product.stock));
    if (qty === 0) continue;
    priced.push({
      id: product.id,
      slug: product.slug,
      qty,
      unitCents: product.priceCents,
      compareAtCents: product.compareAtCents ?? null,
      lineCents: product.priceCents * qty,
    });
  }

  const subtotalCents = priced.reduce((sum, line) => sum + line.lineCents, 0);
  const coupon = findCoupon(options.couponCode, now);
  const discountCents = coupon ? Math.round((subtotalCents * coupon.percentOff) / 100) : 0;
  const afterDiscount = subtotalCents - discountCents;

  const freeShippingPromo =
    commerce.shipping.freeUntil !== null && new Date(commerce.shipping.freeUntil).getTime() > now;
  const qualifies =
    commerce.shipping.flatCents <= 0 ||
    freeShippingPromo ||
    afterDiscount >= commerce.shipping.freeFromCents;
  const shippingCents = afterDiscount === 0 ? 0 : qualifies ? 0 : commerce.shipping.flatCents;
  const freeShippingMissingCents = qualifies
    ? 0
    : Math.max(0, commerce.shipping.freeFromCents - afterDiscount);

  const totalCents = afterDiscount + shippingCents;
  // El IVA ya viene dentro del precio, asi que se desglosa hacia atras.
  const taxIncludedCents = commerce.pricesIncludeTax
    ? Math.round(totalCents - totalCents / (1 + commerce.taxRate))
    : 0;

  return {
    lines: priced,
    itemCount: priced.reduce((sum, line) => sum + line.qty, 0),
    subtotalCents,
    discountCents,
    shippingCents,
    freeShippingMissingCents,
    taxIncludedCents,
    totalCents,
    couponCode: coupon?.code ?? null,
  };
}

/** true mientras dure la promo de envio gratis sin minimo. */
export function freeShippingPromoLive(now = Date.now()) {
  return commerce.shipping.freeUntil !== null && new Date(commerce.shipping.freeUntil).getTime() > now;
}

/** Milisegundos que faltan para el fin de la promo, o null si no hay. */
export function promoRemaining(now = Date.now()) {
  if (!commerce.promo.endsAt) return null;
  const remaining = new Date(commerce.promo.endsAt).getTime() - now;
  return remaining > 0 ? remaining : null;
}
