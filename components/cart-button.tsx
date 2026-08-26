"use client";

import { cart, useCart } from "@/lib/cart";
import { useNow } from "@/lib/clock";
import type { Dict } from "@/lib/dict";

export function CartButton({ dict }: { dict: Dict["cart"] }) {
  const now = useNow();
  const { totals } = useCart(now);

  return (
    <button
      type="button"
      onClick={() => cart.open()}
      aria-label={dict.open}
      title={dict.open}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink md:h-9 md:w-9"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 6h2.2l1.9 10.2a1.6 1.6 0 0 0 1.6 1.3h7.8a1.6 1.6 0 0 0 1.6-1.3L20.5 9H7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.2" fill="currentColor" />
        <circle cx="17.5" cy="20" r="1.2" fill="currentColor" />
      </svg>
      {totals.itemCount > 0 ? (
        <span
          suppressHydrationWarning
          className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-deep px-1 font-display text-[11px] font-bold text-white dark:bg-aqua dark:text-[#04141b]"
        >
          {totals.itemCount}
        </span>
      ) : null}
    </button>
  );
}
