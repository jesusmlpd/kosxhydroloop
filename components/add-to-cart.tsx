"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuantityStepper } from "@/components/quantity-stepper";
import { cart } from "@/lib/cart";
import type { Dict } from "@/lib/dict";
import type { Product } from "@/lib/site";

export function AddToCart({
  product,
  dict,
  checkoutHref,
}: {
  product: Product;
  dict: Dict;
  checkoutHref: string;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;

  return (
    <div>
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
          onClick={() => cart.add(product.id, qty)}
          className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {dict.products.addToCart}
        </button>
        {!soldOut ? (
          <button
            type="button"
            onClick={() => {
              // Agregar y mandar directo a pagar: el drawer se queda cerrado
              // para no meter un paso extra en el camino.
              cart.add(product.id, qty);
              cart.close();
              router.push(checkoutHref);
            }}
            className="btn btn-ghost"
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
