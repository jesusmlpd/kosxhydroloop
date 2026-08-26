"use client";

import { cart } from "@/lib/cart";
import { pad, splitDuration } from "@/lib/clock";
import { commerce } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { fill } from "@/lib/i18n";

/**
 * Reserva del carrito. El reloj corre desde el ultimo movimiento y al vencer
 * avisa de verdad en vez de reiniciarse a escondidas.
 */
export function ReservationTimer({
  msLeft,
  expired,
  dict,
}: {
  msLeft: number | null;
  expired: boolean;
  dict: Dict["cart"];
}) {
  if (!commerce.urgency.cartReservation) return null;

  if (expired) {
    return (
      <div className="rounded-xl border border-line bg-mist px-4 py-3">
        <p className="text-[13px] text-ink-2">{dict.reservationExpired}</p>
        <button
          type="button"
          onClick={() => cart.extendReservation()}
          className="mt-2 text-[13px] font-semibold text-teal underline"
        >
          {dict.extend}
        </button>
      </div>
    );
  }

  if (msLeft === null) return null;

  const { minutes, seconds } = splitDuration(msLeft);
  const urgent = msLeft < 120_000;

  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-[13px] ${
        urgent ? "bg-[#fdeeee] text-[#a1332f] dark:bg-[#3a1a1a] dark:text-[#ff9c96]" : "bg-mist text-ink-2"
      }`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="12" cy="13" r="8.2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 9.4V13l2.4 1.6M9.2 3.4h5.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <span suppressHydrationWarning>
        {fill(dict.reservedFor, { time: `${pad(minutes)}:${pad(seconds)}` })}
      </span>
    </div>
  );
}
