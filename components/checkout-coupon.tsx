"use client";

import { useState } from "react";
import { BlackFridayApply, useBlackFriday } from "@/components/black-friday";
import { cart } from "@/lib/cart";
import { findCoupon } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { fill } from "@/lib/i18n";

/** Campo de cupón para el resumen del checkout (mismo comportamiento que el carrito). */
export function CheckoutCoupon({
  dict,
  couponCode,
  now,
}: {
  dict: Dict;
  couponCode: string | null;
  now: number;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const blackFriday = useBlackFriday();

  function onApply() {
    const found = findCoupon(value, now || 0);
    if (!found) {
      setError(true);
      return;
    }
    setError(false);
    cart.applyCoupon(found.code);
    setValue("");
  }

  if (couponCode) {
    const percent = findCoupon(couponCode, now)?.percentOff ?? 0;
    return (
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-mist px-4 py-3">
        <p className="text-[13px] text-ink-2">
          {fill(dict.cart.couponApplied, { code: couponCode, percent })}
        </p>
        <button
          type="button"
          onClick={() => cart.applyCoupon(null)}
          className="text-[13px] font-semibold text-ink-3 underline transition-colors hover:text-ink"
        >
          {dict.cart.couponRemove}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {blackFriday.live ? <BlackFridayApply dict={dict.blackFriday} className="btn-sm mb-2.5 w-full" /> : null}
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onApply();
            }
          }}
          placeholder={dict.cart.couponPlaceholder}
          aria-label={dict.cart.couponPlaceholder}
          className="field"
        />
        <button type="button" onClick={onApply} className="btn btn-ghost shrink-0">
          {dict.cart.couponApply}
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-[13px] text-ink-2">
          {dict.cart.couponInvalid}
        </p>
      ) : null}
    </div>
  );
}
