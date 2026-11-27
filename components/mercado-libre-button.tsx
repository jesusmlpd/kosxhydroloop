"use client";

import type { Locale } from "@/lib/i18n";

/** Enlace a la publicación del producto en Mercado Libre. El enlace se edita en el panel. */
export function MercadoLibreButton({
  href,
  productId,
  locale,
  className = "",
}: {
  href: string;
  productId: string;
  locale: Locale;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => window.gtag?.("event", "mercado_libre_click", { item_id: productId })}
      className={`btn btn-ml w-full bg-[#ffe600] text-[#2d3277] hover:brightness-95 ${className}`}
    >
      {locale === "es" ? "Comprar en Mercado Libre" : "Buy on Mercado Libre"}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
