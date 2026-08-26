"use client";

import { cart } from "@/lib/cart";
import type { Dict } from "@/lib/dict";
import type { Product } from "@/lib/site";

/** Boton chico para sumar una pieza desde la tarjeta, sin salir del listado. */
export function QuickAdd({ product, dict }: { product: Product; dict: Dict }) {
  if (!product.buyable || product.stock <= 0) return null;

  return (
    <button
      type="button"
      onClick={() => cart.add(product.id, 1)}
      aria-label={`${dict.products.addToCart}: ${
        dict.products.items[product.slug as keyof Dict["products"]["items"]].name
      }`}
      className="btn btn-primary btn-sm shrink-0"
    >
      {dict.products.addToCart}
    </button>
  );
}
