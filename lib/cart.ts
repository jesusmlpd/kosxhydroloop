"use client";

import { useSyncExternalStore } from "react";
import { commerce, priceCart, type CartLine, type Totals } from "@/lib/commerce";
import { findProductById, products } from "@/lib/site";

const KEY = "hydroloop-cart";

export type CartState = {
  lines: CartLine[];
  coupon: string | null;
  /** Momento de la ultima modificacion: de ahi corre la reserva. */
  reservedAt: number | null;
  open: boolean;
};

const EMPTY: CartState = { lines: [], coupon: null, reservedAt: null, open: false };

/**
 * El carrito vive en un store de modulo y no en un contexto de React a
 * proposito: useSyncExternalStore deja hidratar con el carrito vacio del
 * servidor y saltar al carrito real del navegador sin setState dentro de un
 * efecto, que es lo que dispara renders en cascada.
 */
let state: CartState = EMPTY;
const listeners = new Set<() => void>();

function read(): CartState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<CartState>;
    const lines = Array.isArray(parsed.lines)
      ? parsed.lines
          .filter((line): line is CartLine => Boolean(line && typeof line.id === "string"))
          .map((line) => ({ id: line.id, qty: Math.max(1, Math.floor(Number(line.qty) || 1)) }))
          // Un id que ya no existe en el catalogo se cae aqui y no revienta la vista.
          .filter((line) => Boolean(findProductById(line.id)))
      : [];
    return {
      lines,
      coupon: typeof parsed.coupon === "string" ? parsed.coupon : null,
      reservedAt: typeof parsed.reservedAt === "number" ? parsed.reservedAt : null,
      open: false,
    };
  } catch {
    return EMPTY;
  }
}

if (typeof window !== "undefined") {
  state = read();
  // Otra pestana del mismo navegador comparte carrito.
  window.addEventListener("storage", (event) => {
    if (event.key !== KEY) return;
    state = { ...read(), open: state.open };
    for (const listener of listeners) listener();
  });
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    const { lines, coupon, reservedAt } = state;
    window.localStorage.setItem(KEY, JSON.stringify({ lines, coupon, reservedAt }));
  } catch {
    // Storage bloqueado: el carrito vive solo en esta pestana.
  }
}

function commit(next: CartState) {
  state = next;
  persist();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

/** Cualquier movimiento reinicia la reserva: el reloj corre desde el ultimo cambio. */
function touched(lines: CartLine[]) {
  return lines.length > 0 ? Date.now() : null;
}

export const cart = {
  /**
   * options.open en false suma sin abrir el drawer. Lo usa el carrito armado
   * desde la URL: aterrizar en el checkout con un panel encima tapando el
   * formulario no es una ayuda, es un estorbo.
   */
  add(id: string, qty = 1, options: { open?: boolean } = {}) {
    const product = findProductById(id);
    if (!product || product.stock <= 0) return;

    const existing = state.lines.find((line) => line.id === id);
    const nextQty = Math.min((existing?.qty ?? 0) + qty, product.stock);
    const lines = existing
      ? state.lines.map((line) => (line.id === id ? { ...line, qty: nextQty } : line))
      : [...state.lines, { id, qty: nextQty }];

    commit({ ...state, lines, reservedAt: touched(lines), open: options.open ?? true });
  },

  setQty(id: string, qty: number) {
    const product = findProductById(id);
    if (!product) return;
    const clamped = Math.max(0, Math.min(Math.floor(qty), product.stock));
    const lines =
      clamped === 0
        ? state.lines.filter((line) => line.id !== id)
        : state.lines.map((line) => (line.id === id ? { ...line, qty: clamped } : line));
    commit({ ...state, lines, reservedAt: touched(lines) });
  },

  remove(id: string) {
    const lines = state.lines.filter((line) => line.id !== id);
    commit({ ...state, lines, reservedAt: touched(lines) });
  },

  clear() {
    commit({ ...EMPTY, open: state.open });
  },

  applyCoupon(code: string | null) {
    commit({ ...state, coupon: code ? code.trim().toUpperCase() : null });
  },

  open() {
    commit({ ...state, open: true });
  },

  close() {
    commit({ ...state, open: false });
  },

  /** Empuja la reserva otros 15 minutos, sin tocar el contenido. */
  extendReservation() {
    if (state.lines.length === 0) return;
    commit({ ...state, reservedAt: Date.now() });
  },
};

export type CartView = {
  state: CartState;
  totals: Totals;
  /** Milisegundos que le quedan a la reserva, null si no aplica. */
  reservationMsLeft: number | null;
  reservationExpired: boolean;
};

export function useCart(now?: number): CartView {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const clock = now ?? 0;

  // Con clock en 0 (servidor y primer render) una promo con fecha futura
  // cuenta como viva, que es justo lo que corresponde. Nada de Date.now() en
  // render: eso hace impuro el componente y el resultado deja de ser estable.
  const totals = priceCart(current.lines, products, {
    couponCode: current.coupon,
    now: clock,
  });

  let reservationMsLeft: number | null = null;
  let reservationExpired = false;

  if (
    commerce.urgency.cartReservation &&
    commerce.reservation.minutes > 0 &&
    current.reservedAt &&
    totals.itemCount > 0 &&
    clock > 0
  ) {
    const deadline = current.reservedAt + commerce.reservation.minutes * 60_000;
    reservationMsLeft = Math.max(0, deadline - clock);
    reservationExpired = reservationMsLeft === 0;
  }

  return { state: current, totals, reservationMsLeft, reservationExpired };
}
