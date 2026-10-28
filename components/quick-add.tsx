"use client";

import { useRouter } from "next/navigation";
import { cart } from "@/lib/cart";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";
import type { Product } from "@/lib/site";
import { trackAddToCart } from "@/lib/track";

/**
 * Botones de la tarjeta: "Comprar ahora" suma la pieza y manda directo a pagar;
 * "Agregar al carrito" la suma sin salir del listado.
 */
export function QuickAdd({ product, dict, locale }: { product: Product; dict: Dict; locale: Locale }) {
  const router = useRouter();
  if (!product.buyable || product.stock <= 0) return null;

  const name = dict.products.items[product.slug as keyof Dict["products"]["items"]].name;
  const track = () => trackAddToCart([{ id: product.id, name, qty: 1, priceCents: product.priceCents }]);

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={() => {
          cart.add(product.id, 1, { open: false });
          cart.close();
          track();
          router.push(localePath(locale, "/checkout"));
        }}
        aria-label={`${dict.products.buyNow}: ${name}`}
        className="btn btn-primary btn-sm flex-1"
      >
        {dict.products.buyNow}
      </button>
      <button
        type="button"
        onClick={() => {
          cart.add(product.id, 1);
          track();
        }}
        aria-label={`${dict.products.addToCart}: ${name}`}
        className="btn btn-ghost btn-sm flex-1"
      >
        {dict.products.addToCart}
      </button>
    </div>
  );
}
