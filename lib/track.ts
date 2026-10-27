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
    __hlQueue?: Array<["fbq" | "gtag", unknown[]]>;
  }
}

/**
 * Los scripts del Pixel y GA4 cargan despues de hidratar (afterInteractive),
 * asi que un evento disparado al aterrizar (ViewContent en la ficha, Purchase
 * en la pantalla de exito) llegaba antes que fbq y se perdia en silencio. Si la
 * funcion todavia no existe, el evento espera en cola y Analytics lo vacia al
 * terminar de inicializar.
 */
function send(kind: "fbq" | "gtag", args: unknown[]) {
  const fn = window[kind];
  if (fn) {
    fn(...args);
    return;
  }
  (window.__hlQueue ??= []).push([kind, args]);
}

const fbq = (...args: unknown[]) => send("fbq", args);
const gtag = (...args: unknown[]) => send("gtag", args);

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
  fbq("track", "ViewContent", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value,
    currency: "MXN",
  });
  gtag("event", "view_item", {
    currency: "MXN",
    value,
    items: items([item]).ga,
  });
}

export function trackAddToCart(list: Item[]) {
  const value = list.reduce((sum, item) => sum + item.priceCents * item.qty, 0) / 100;
  const mapped = items(list);
  fbq("track", "AddToCart", {
    contents: mapped.contents,
    content_type: "product",
    value,
    currency: "MXN",
  });
  gtag("event", "add_to_cart", { currency: "MXN", value, items: mapped.ga });
}

export function trackInitiateCheckout(list: Item[], totalCents: number) {
  const mapped = items(list);
  fbq("track", "InitiateCheckout", {
    contents: mapped.contents,
    content_type: "product",
    num_items: list.reduce((sum, item) => sum + item.qty, 0),
    value: totalCents / 100,
    currency: "MXN",
  });
  gtag("event", "begin_checkout", {
    currency: "MXN",
    value: totalCents / 100,
    items: mapped.ga,
  });
}

export function trackPurchase(payload: { ref: string; totalCents: number; items: Item[] }) {
  const mapped = items(payload.items);
  // eventID = referencia del pedido: es el mismo event_id que manda el webhook
  // por la API de conversiones, y Meta usa el par para contar una sola compra.
  fbq(
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
  gtag("event", "purchase", {
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

/**
 * Guarda de donde llego la visita (utm_campaign / utm_content) para el resto de
 * la sesion: el parametro se pierde en cuanto el cliente cambia de pagina, y el
 * mensaje de WhatsApp necesita saber de que anuncio vino.
 */
const ATTR_KEY = "hl-attr";

export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const campaign = params.get("utm_campaign");
    const content = params.get("utm_content");
    if (!campaign && !content) return;
    const previous = JSON.parse(sessionStorage.getItem(ATTR_KEY) ?? "{}") as Record<string, string>;
    sessionStorage.setItem(
      ATTR_KEY,
      JSON.stringify({
        ...previous,
        ...(campaign ? { campaign: campaign.slice(0, 40) } : {}),
        ...(content ? { content: content.slice(0, 40) } : {}),
      }),
    );
  } catch {
    // Sin sessionStorage simplemente no hay etiqueta de campana.
  }
}

export function readAttribution(): { campaign?: string; content?: string } {
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/**
 * Clic a WhatsApp = evento Contact. Va por el Pixel y por el servidor con el
 * mismo event_id (Meta deduplica); el servidor no recibe correo ni telefono,
 * solo cookies de Meta, IP y navegador.
 */
export function trackContact(origin: string) {
  const eventId = `ct-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  fbq("track", "Contact", { content_name: origin, content_category: "whatsapp" }, { eventID: eventId });
  gtag("event", "contact", { method: "whatsapp", origin });
  try {
    void fetch("/api/track/contact", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, origin, url: window.location.href, ...metaBrowserIds() }),
    }).catch(() => undefined);
  } catch {
    // El Pixel del navegador ya salio; el respaldo del servidor es opcional.
  }
}
