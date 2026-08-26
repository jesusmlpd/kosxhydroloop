"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuantityStepper } from "@/components/quantity-stepper";
import { cart } from "@/lib/cart";
import { formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";
import { findProduct, type Product } from "@/lib/site";

export function AddToCart({
  product,
  dict,
  locale,
  checkoutHref,
}: {
  product: Product;
  dict: Dict;
  locale: Locale;
  checkoutHref: string;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [withKit, setWithKit] = useState(false);
  const soldOut = product.stock <= 0;
  // El bundle del kit solo aplica a los equipos, no al kit mismo.
  const kit = !product.accessory ? findProduct("kit-caja-de-instalacion") : undefined;

  function addAll(options: { open: boolean }) {
    cart.add(product.id, qty, options);
    if (withKit && kit) cart.add(kit.id, 1, { open: false });
  }

  return (
    <div>
      {kit && kit.stock > 0 ? (
        <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-mist p-3.5 transition-colors hover:border-line-strong">
          <input
            type="checkbox"
            checked={withKit}
            onChange={(event) => setWithKit(event.target.checked)}
            className="h-5 w-5 shrink-0 accent-[#006781]"
          />
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
            <Image src={kit.image} alt="" fill sizes="44px" className="object-contain p-0.5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold leading-tight">
              {dict.pdp.bundleAdd}{" "}
              <span className="whitespace-nowrap font-bold tabular-nums">
                +{formatMoney(kit.priceCents, locale, kit.currency)}
              </span>
            </span>
            <span className="block text-[12px] text-ink-3">{dict.pdp.bundleHint}</span>
          </span>
        </label>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {!soldOut ? (
          <QuantityStepper
            value={qty}
            max={product.stock}
            label={dict.cart.qty}
            onChange={(next) => setQty(Math.max(1, Math.min(next, product.stock)))}
          />
        ) : null}
        <button
          type="button"
          disabled={soldOut}
          onClick={() => addAll({ open: true })}
          className="btn btn-primary flex-1 sm:flex-none"
        >
          {dict.products.addToCart}
        </button>
        {!soldOut ? (
          <button
            type="button"
            onClick={() => {
              // Agregar y mandar directo a pagar: el drawer se queda cerrado
              // para no meter un paso extra en el camino.
              addAll({ open: false });
              cart.close();
              router.push(checkoutHref);
            }}
            className="btn btn-ghost w-full sm:w-auto"
          >
            {dict.products.buyNow}
          </button>
        ) : null}
      </div>
      {!soldOut && qty >= product.stock ? (
        <p className="mt-2 text-[13px] text-ink-3">{dict.cart.maxStock}</p>
      ) : null}
    </div>
  );
}
