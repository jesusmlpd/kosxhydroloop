"use client";

import { useEffect, useState } from "react";
import { OfferCountdown } from "@/components/offer-countdown";
import { commerce, formatMoney, freeShippingPromoLive } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { fill, type Locale } from "@/lib/i18n";

/**
 * Barra de anuncios rotativa: promocion con reloj, envio gratis y la garantia
 * hecha en Mexico se turnan cada seis segundos con un fundido. Sin JS queda
 * fija en la promocion, que es el mensaje mas importante.
 */
export function AnnouncementBar({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [slide, setSlide] = useState(0);

  const promoLive = freeShippingPromoLive();

  const slides = [
    ...(promoLive ? [<span key="free" className="font-medium">{dict.announcement.promo}</span>] : []),
    <OfferCountdown key="promo" dict={dict.urgency} variant="bare" />,
    <span key="ship">
      {fill(dict.announcement.shipping, {
        amount: formatMoney(commerce.shipping.freeFromCents, locale),
      })}
    </span>,
    <span key="mx">{dict.announcement.mx}</span>,
  ];

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setSlide((value) => (value + 1) % slides.length), 6000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex min-h-[42px] items-center justify-center overflow-hidden bg-invert px-4 text-center text-[13.5px] text-invert-fg">
      {slides.map((content, index) => (
        <div
          key={index}
          aria-hidden={index !== slide}
          className={`col-start-1 row-start-1 flex items-center justify-center gap-2 transition-opacity duration-500 ${
            index === slide ? "opacity-100" : "pointer-events-none absolute opacity-0"
          }`}
        >
          {content}
        </div>
      ))}
    </div>
  );
}
