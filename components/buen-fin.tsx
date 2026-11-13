"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { splitDuration, useNow, pad } from "@/lib/clock";
import { commerce } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";
import type { StoreSettings } from "@/lib/store-settings";

/** Ventana de la promo: 0 en el servidor y primer render, así que no aparece hasta hidratar. */
function useBuenFin(settings: StoreSettings) {
  const now = useNow();
  const { startsAt, endsAt } = commerce.buenFin;
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  const live = settings.buenFin.enabled && now >= start && now <= end;
  return { live, msLeft: Math.max(0, end - now) };
}

function Offers({ dict }: { dict: Dict["buenFin"] }) {
  const items = [
    { icon: "🎁", text: dict.kit },
    { icon: "🏷️", text: dict.discount },
    { icon: "🚚", text: dict.shipping },
    { icon: "💳", text: dict.msi },
  ];
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.text} className="flex items-start gap-2.5 text-[14px] leading-snug">
          <span aria-hidden="true" className="mt-px text-[16px]">
            {item.icon}
          </span>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Burbuja flotante con el logo del Buen Fin que abre las promos activas. Va
 * arriba del botón de WhatsApp y se apaga sola al terminar la promo (o con el
 * interruptor "Promo Buen Fin" del panel). No sale en el pago.
 */
export function BuenFinBubble({ locale, dict, settings }: { locale: Locale; dict: Dict; settings: StoreSettings }) {
  const pathname = usePathname() ?? "";
  const { live } = useBuenFin(settings);
  const [open, setOpen] = useState(false);
  if (!live || /\/(checkout|thank-you|order)(\/|$)/.test(pathname)) return null;
  const text = dict.buenFin;

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3">
      {open ? (
        <div
          role="dialog"
          aria-label={text.title}
          className="w-[300px] max-w-[calc(100vw-2rem)] rounded-3xl border border-line bg-paper p-5 shadow-[var(--shadow-lift)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">{text.dates}</p>
              <h2 className="mt-1 font-display text-[18px] font-bold leading-tight">{text.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={text.close}
              className="text-ink-3 transition-colors hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="mt-4">
            <Offers dict={text} />
          </div>
          <p className="mt-3 text-[12px] text-ink-3">{text.note}</p>
          <Link
            href={localePath(locale, "/products")}
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-4 w-full"
          >
            {text.cta}
          </Link>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={text.open}
        title={text.open}
        className="group relative grid h-[68px] w-[68px] place-items-center rounded-full border border-line bg-white shadow-[0_14px_40px_-10px_rgba(224,32,32,0.55)] transition-transform hover:scale-105 active:scale-95"
      >
        <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#e02020]/25 motion-safe:animate-ping" />
        <Image src="/media/buen-fin.png" alt="" width={56} height={56} className="relative h-14 w-14 object-contain" />
      </button>
    </div>
  );
}

/** Franja del Buen Fin para el inicio: las promos y cuánto falta para que terminen. */
export function BuenFinStrip({ locale, dict, settings }: { locale: Locale; dict: Dict; settings: StoreSettings }) {
  const { live, msLeft } = useBuenFin(settings);
  if (!live) return null;
  const text = dict.buenFin;
  const { days, hours, minutes, seconds } = splitDuration(msLeft);
  const cards = [
    { icon: "🎁", title: text.kitTitle, body: text.kit },
    { icon: "🏷️", title: text.discountTitle, body: text.discount },
    { icon: "🚚", title: text.shippingTitle, body: `${text.shipping} · ${text.msi}` },
  ];

  return (
    <section className="section pb-0" aria-label={text.title}>
      <div className="shell">
        <div className="overflow-hidden rounded-[28px] bg-deep-2 p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <Image src="/media/buen-fin.png" alt="" width={72} height={72} className="h-[72px] w-[72px] shrink-0 rounded-2xl bg-white object-contain p-1" />
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-aqua">{text.dates}</p>
                <h2 className="font-display text-[clamp(22px,3vw,32px)] font-bold leading-tight text-white">{text.title}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 text-center" aria-label={text.endsIn}>
              <span className="mr-1 text-[12px] uppercase tracking-wider text-white/70">{text.endsIn}</span>
              {[
                [days, "d"],
                [hours, "h"],
                [minutes, "m"],
                [seconds, "s"],
              ].map(([value, unit]) => (
                <span key={unit as string} className="min-w-[46px] rounded-xl bg-white/10 px-2 py-1.5">
                  <span className="block font-display text-[20px] font-bold tabular-nums leading-none">{pad(value as number)}</span>
                  <span className="text-[10px] uppercase text-white/60">{unit}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[22px]" aria-hidden="true">
                  {card.icon}
                </p>
                <p className="mt-1 font-display text-[16px] font-bold">{card.title}</p>
                <p className="mt-1 text-[13.5px] leading-snug text-white/75">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href={localePath(locale, "/products")} className="btn btn-primary">
              {text.cta}
            </Link>
            <p className="text-[12.5px] text-white/60">{text.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
