"use client";

/**
 * Puente unico hacia el Pixel de Meta y GA4. Si ninguno esta configurado,
 * todo es un no-op silencioso: el sitio nunca depende de que el tracking
 * exista. Los nombres siguen los eventos estandar de cada plataforma.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

type Item = { id: string; name: string; qty: number; priceCents: number };

function items(list: Item[]) {
  return {
    contents: list.map((item) => ({ id: item.id, quantity: item.qty })),
    content_ids: list.map((item) => item.id),
    ga: list.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      quantity: item.qty,
      price: item.priceCents / 100,
    })),
  };
}

export function trackViewContent(item: Item) {
  const value = (item.priceCents * item.qty) / 100;
  window.fbq?.("track", "ViewContent", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value,
    currency: "MXN",
  });
  window.gtag?.("event", "view_item", {
    currency: "MXN",
    value,
    items: items([item]).ga,
  });
}

export function trackAddToCart(list: Item[]) {
  const value = list.reduce((sum, item) => sum + item.priceCents * item.qty, 0) / 100;
  const mapped = items(list);
  window.fbq?.("track", "AddToCart", {
    contents: mapped.contents,
    content_type: "product",
    value,
    currency: "MXN",
  });
  window.gtag?.("event", "add_to_cart", { currency: "MXN", value, items: mapped.ga });
}

export function trackInitiateCheckout(list: Item[], totalCents: number) {
  const mapped = items(list);
  window.fbq?.("track", "InitiateCheckout", {
    contents: mapped.contents,
    content_type: "product",
    num_items: list.reduce((sum, item) => sum + item.qty, 0),
    value: totalCents / 100,
    currency: "MXN",
  });
  window.gtag?.("event", "begin_checkout", {
    currency: "MXN",
    value: totalCents / 100,
    items: mapped.ga,
  });
}

export function trackPurchase(payload: { ref: string; totalCents: number; items: Item[] }) {
  const mapped = items(payload.items);
  // eventID = referencia del pedido: es el mismo event_id que manda el webhook
  // por la API de conversiones, y Meta usa el par para contar una sola compra.
  window.fbq?.(
    "track",
    "Purchase",
    {
      contents: mapped.contents,
      content_ids: mapped.content_ids,
      content_type: "product",
      num_items: payload.items.reduce((sum, item) => sum + item.qty, 0),
      order_id: payload.ref,
      value: payload.totalCents / 100,
      currency: "MXN",
    },
    { eventID: payload.ref },
  );
  window.gtag?.("event", "purchase", {
    transaction_id: payload.ref,
    currency: "MXN",
    value: payload.totalCents / 100,
    items: mapped.ga,
  });
}

/** Cookies de Meta que el servidor necesita para empatar el evento con el anuncio. */
export function metaBrowserIds() {
  const read = (name: string) =>
    document.cookie
      .split("; ")
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1);
  return { fbp: read("_fbp") ?? null, fbc: read("_fbc") ?? null };
}

/**
 * El checkout guarda aqui lo necesario para que la pantalla de exito dispare
 * Purchase una sola vez, aunque el carrito ya se haya vaciado.
 */
const PURCHASE_KEY = "hl-purchase";

export function storePendingPurchase(payload: { ref: string; totalCents: number; items: Item[] }) {
  try {
    sessionStorage.setItem(PURCHASE_KEY, JSON.stringify(payload));
  } catch {
    // Sin sessionStorage (modo privado estricto) simplemente no hay Purchase.
  }
}

export function firePendingPurchase() {
  try {
    const raw = sessionStorage.getItem(PURCHASE_KEY);
    if (!raw) return;
    sessionStorage.removeItem(PURCHASE_KEY);
    const payload = JSON.parse(raw) as { ref: string; totalCents: number; items: Item[] };
    if (payload?.ref) trackPurchase(payload);
  } catch {
    // Datos corruptos: mejor perder un evento que romper la pantalla de exito.
  }
}
