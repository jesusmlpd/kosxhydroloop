"use client";

import { cart } from "@/lib/cart";
import type { Dict } from "@/lib/dict";
import type { Product } from "@/lib/site";

/** Boton chico para sumar una pieza desde la tarjeta, sin salir del listado. */
export function QuickAdd({ product, dict }: { product: Product; dict: Dict }) {
  if (product.stock <= 0) return null;

  return (
    <button
      type="button"
      onClick={() => cart.add(product.id, 1)}
      aria-label={`${dict.products.addToCart}: ${
        dict.products.items[product.slug as keyof Dict["products"]["items"]].name
      }`}
      className="btn btn-ghost shrink-0 px-4 py-2.5 text-[13px]"
    >
      {dict.products.addToCart}
    </button>
  );
}
