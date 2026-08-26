"use client";

import { pad, splitDuration, useNow } from "@/lib/clock";
import { commerce, promoRemaining } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { fill } from "@/lib/i18n";

/**
 * Cuenta regresiva contra una fecha real de fin de promocion. Si la promo ya
 * paso, el componente no dibuja nada: nada de relojes que se reinician solos
 * para fingir prisa.
 */
export function OfferCountdown({
  dict,
  variant = "banner",
}: {
  dict: Dict["urgency"];
  variant?: "banner" | "inline" | "bare";
}) {
  const now = useNow();
  if (!commerce.urgency.offerCountdown) return null;

  // En el servidor el reloj vale 0 y no hay hora que mostrar, asi que no se
  // dibuja nada hasta que el navegador da el primer tick. Es un cuadro menos
  // en el primer paint y a cambio el HTML nunca viaja con una hora vieja
  // pegada ni se pide Date.now() durante el render.
  if (now === 0) return null;

  const remaining = promoRemaining(now);
  if (remaining === null) return null;

  const { days, hours, minutes, seconds } = splitDuration(remaining);

  const clock = (
    <span className="font-display font-bold tabular-nums" suppressHydrationWarning>
      {days > 0 ? `${days}${dict.days} ` : null}
      {pad(hours)}
      {dict.hours} {pad(minutes)}
      {dict.minutes} {pad(seconds)}
      {dict.seconds}
    </span>
  );

  if (variant === "inline") {
    return (
      <p className="text-[14px] text-ink-2">
        {dict.offerEnds} {clock}
      </p>
    );
  }

  // "bare": mismo contenido del banner, sin fondo propio (para la barra rotativa)
  if (variant === "bare") {
    return (
      <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
        <span>
          {dict.offerEnds} {clock}
        </span>
        <span className="opacity-70">
          {fill(dict.offerCode, { code: commerce.promo.code, percent: commerce.promo.percentOff })}
        </span>
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-invert px-4 py-2.5 text-center text-[14px] text-invert-fg">
      <span>
        {dict.offerEnds} {clock}
      </span>
      <span className="opacity-70">
        {fill(dict.offerCode, {
          code: commerce.promo.code,
          percent: commerce.promo.percentOff,
        })}
      </span>
    </div>
  );
}
