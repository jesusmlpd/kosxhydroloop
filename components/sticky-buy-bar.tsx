"use client";

import { useEffect, useState } from "react";
import { cart } from "@/lib/cart";
import { formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";
import type { Product } from "@/lib/site";

/**
 * Barra de compra fija en movil. Aparece cuando el boton principal ya salio
 * de la pantalla, para que "Agregar al carrito" nunca quede a tres pantallas
 * de distancia. En escritorio no existe: alla el panel de compra es sticky.
 */
export function StickyBuyBar({
  product,
  name,
  locale,
  dict,
}: {
  product: Product;
  name: string;
  locale: Locale;
  dict: Dict;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById("buy-anchor");

    // Doble senal a proposito: el IntersectionObserver es preciso, pero hay
    // contextos donde no dispara (paneles ocultos, webviews raras). El scroll
    // listener pasivo garantiza que la barra aparezca igual.
    const onScroll = () => {
      if (!anchor) {
        setVisible(window.scrollY > 480);
        return;
      }
      setVisible(anchor.getBoundingClientRect().top < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let observer: IntersectionObserver | null = null;
    if (anchor && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
        { threshold: 0 },
      );
      observer.observe(anchor);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  if (product.stock <= 0 || !product.buyable) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[14px] font-semibold">{name}</p>
          <p className="text-[15px] font-bold tabular-nums">
            {formatMoney(product.priceCents, locale, product.currency)}{" "}
            <span className="text-[11px] font-medium text-ink-3">{dict.products.ivaIncluded}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => cart.add(product.id, 1)}
          className="btn btn-primary shrink-0"
        >
          {dict.products.addToCart}
        </button>
      </div>
    </div>
  );
}
