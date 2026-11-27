"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cart } from "@/lib/cart";
import { pad, splitDuration, useNow } from "@/lib/clock";
import { blackFridayLive, commerce, formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { fill, localePath, type Locale } from "@/lib/i18n";

/**
 * Temática de Black Friday + Cyber Monday. Todo sale de commerce.blackFriday
 * (se edita en el panel): fuera de las fechas o apagada, nada de esto se dibuja.
 */
export function useBlackFriday() {
  const now = useNow();
  const { code, percentOff, endsAt } = commerce.blackFriday;
  const live = now > 0 && blackFridayLive(now);
  const msLeft = Math.max(0, new Date(endsAt).getTime() - now);
  // El último día de la promo es Cyber Monday.
  const lastDay = live && msLeft <= 86_400_000;
  return { live, msLeft, lastDay, code, percentOff };
}

const values = (percentOff: number, code: string) => ({ percent: percentOff, code });

/** Pone la paleta negro y amarillo en todo el sitio mientras dura la promo. */
export function BlackFridayTheme() {
  const { live } = useBlackFriday();
  useEffect(() => {
    const root = document.documentElement;
    if (live) root.dataset.promo = "blackfriday";
    else delete root.dataset.promo;
  }, [live]);
  return null;
}

function Clock({ msLeft }: { msLeft: number }) {
  const { days, hours, minutes, seconds } = splitDuration(msLeft);
  return (
    <span className="flex items-center gap-1.5 text-center">
      {(
        [
          [days, "d"],
          [hours, "h"],
          [minutes, "m"],
          [seconds, "s"],
        ] as const
      ).map(([value, unit]) => (
        <span key={unit} className="min-w-[52px] rounded-xl border border-[#ffd400]/40 bg-black/60 px-2 py-2">
          <span className="block font-display text-[22px] font-bold tabular-nums leading-none text-[#ffd400]">{pad(value)}</span>
          <span className="text-[10px] uppercase text-white/60">{unit}</span>
        </span>
      ))}
    </span>
  );
}

/** Aplica el cupón al carrito con un clic; si hay destino, además navega. */
export function BlackFridayApply({
  dict,
  href,
  className = "",
}: {
  dict: Dict["blackFriday"];
  href?: string;
  className?: string;
}) {
  const router = useRouter();
  const { code, percentOff } = useBlackFriday();
  return (
    <button
      type="button"
      onClick={() => {
        cart.applyCoupon(code);
        if (href) router.push(href);
      }}
      className={`btn bg-[#ffd400] text-black hover:brightness-95 ${className}`}
    >
      {fill(href ? dict.applyAndShop : dict.apply, values(percentOff, code))}
    </button>
  );
}

/** Portada de la promo en el inicio, arriba de todo. */
export function BlackFridayHero({ locale, dict }: { locale: Locale; dict: Dict }) {
  const { live, msLeft, lastDay, code, percentOff } = useBlackFriday();
  if (!live) return null;
  const text = dict.blackFriday;

  return (
    <section
      aria-label={text.title}
      className="relative overflow-hidden bg-[radial-gradient(90%_140%_at_85%_10%,#3d3300_0%,#141200_45%,#050505_100%)] text-white"
    >
      <div aria-hidden="true" className="h-2 bg-[repeating-linear-gradient(135deg,#ffd400_0_18px,#050505_18px_36px)]" />
      <div className="shell grid items-center gap-8 py-10 md:grid-cols-[1.3fr_1fr] md:py-14">
        <div>
          <p className="inline-block rounded-md bg-[#ffd400] px-3 py-1 font-display text-[13px] font-extrabold uppercase tracking-[0.16em] text-black">
            {lastDay ? text.lastDay : text.title}
          </p>
          <p className="mt-4 font-display text-[clamp(64px,13vw,150px)] font-extrabold leading-[0.9] tracking-tight">
            <span className="text-[#ffd400]">{percentOff}%</span> OFF
          </p>
          <p className="mt-3 text-[clamp(17px,2.2vw,22px)] font-semibold">{text.headline}</p>
          <p className="mt-2 inline-flex items-center gap-2 text-[15px] text-white/80">
            {text.codeLabel}
            <span className="rounded-lg border-2 border-dashed border-[#ffd400] px-3 py-1 font-display text-[18px] font-bold tracking-wider text-[#ffd400]">
              {code}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-5 md:items-end">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">{text.endsIn}</p>
            <Clock msLeft={msLeft} />
          </div>
          <BlackFridayApply dict={text} href={localePath(locale, "/products")} />
          <p className="max-w-xs text-[12px] text-white/55 md:text-right">{text.note}</p>
        </div>
      </div>
      <div aria-hidden="true" className="h-2 bg-[repeating-linear-gradient(135deg,#ffd400_0_18px,#050505_18px_36px)]" />
    </section>
  );
}

/** Precio con la promo, para tarjetas y página de producto. */
export function BlackFridayPrice({
  priceCents,
  locale,
  dict,
}: {
  priceCents: number;
  locale: Locale;
  dict: Dict["blackFriday"];
}) {
  const { live, code, percentOff } = useBlackFriday();
  if (!live) return null;
  const price = priceCents - Math.round((priceCents * percentOff) / 100);
  return (
    <p className="mt-2 inline-block rounded-lg bg-black px-3 py-1.5 text-[13.5px] font-semibold text-white">
      <span className="mr-2 rounded bg-[#ffd400] px-1.5 py-0.5 font-bold text-black">-{percentOff}%</span>
      {fill(dict.price, { price: formatMoney(price, locale), code })}
    </p>
  );
}

/** Burbuja flotante arriba de WhatsApp. No sale en el pago. */
export function BlackFridayBubble({ locale, dict }: { locale: Locale; dict: Dict }) {
  const pathname = usePathname() ?? "";
  const { live, code, percentOff } = useBlackFriday();
  const [open, setOpen] = useState(false);
  if (!live || /\/(checkout|thank-you|order)(\/|$)/.test(pathname)) return null;
  const text = dict.blackFriday;

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3">
      {open ? (
        <div
          role="dialog"
          aria-label={text.title}
          className="w-[300px] max-w-[calc(100vw-2rem)] rounded-3xl border border-[#ffd400]/40 bg-[#0b0b0b] p-5 text-white shadow-[var(--shadow-lift)]"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-display text-[17px] font-bold leading-tight text-[#ffd400]">{text.title}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label={text.close} className="text-white/60 hover:text-white">
              ✕
            </button>
          </div>
          <p className="mt-3 text-[14px] leading-snug">{fill(text.bubble, values(percentOff, code))}</p>
          <BlackFridayApply dict={text} href={localePath(locale, "/products")} className="mt-4 w-full" />
          <p className="mt-3 text-[12px] text-white/55">{text.note}</p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={text.open}
        title={text.open}
        className="relative grid h-[68px] w-[68px] place-items-center rounded-full border-2 border-[#ffd400] bg-black text-center shadow-[0_14px_40px_-10px_rgba(255,212,0,0.75)] transition-transform hover:scale-105 active:scale-95"
      >
        <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#ffd400]/30 motion-safe:animate-ping" />
        <span className="relative font-display leading-none">
          <span className="block text-[19px] font-extrabold text-[#ffd400]">-{percentOff}%</span>
          <span className="block text-[9px] font-bold uppercase tracking-wider text-white">Black</span>
        </span>
      </button>
    </div>
  );
}

/** Contenido de la barra de anuncios durante la promo. */
export function BlackFridayBar({ dict }: { dict: Dict["blackFriday"] }) {
  const { msLeft, lastDay, code, percentOff } = useBlackFriday();
  const { days, hours, minutes, seconds } = splitDuration(msLeft);
  return (
    <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 py-1.5 font-semibold">
      <span className="font-display font-extrabold uppercase text-[#ffd400]">{lastDay ? dict.lastDay : dict.title}</span>
      <span>{fill(dict.bar, values(percentOff, code))}</span>
      <span className="tabular-nums text-[#ffd400]">
        {days > 0 ? `${days}d ` : null}
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    </span>
  );
}
