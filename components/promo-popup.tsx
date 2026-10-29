"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { localePath, type Locale } from "@/lib/i18n";
import { notExpired, type StoreSettings } from "@/lib/store-settings";

const SEEN = "hydroloop-promo-popup";
const DELAY_MS = 8000;

/**
 * Ventana emergente de la promocion activa: una vez por visita, a los 8 s, y
 * nunca en el pago ni en las paginas de confirmacion. Texto, fecha y encendido
 * se editan en el panel (/admin/tienda).
 */
export function PromoPopup({ locale, settings }: { locale: Locale; settings: StoreSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { promo } = settings;
  const copy = locale === "en" ? promo.popupEn : promo.popupEs;
  const quiet = /\/(checkout|thank-you|order)(\/|$)/.test(pathname);
  const eligible = promo.popupEnabled && copy.title !== "" && !quiet;

  useEffect(() => {
    if (!eligible || !notExpired(promo.endsAt)) return;
    try {
      if (window.sessionStorage.getItem(SEEN)) return;
    } catch {
      // Storage bloqueado: se muestra, y como mucho se repite en otra visita.
    }
    const id = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(id);
  }, [eligible, promo.endsAt]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    try {
      window.sessionStorage.setItem(SEEN, "1");
    } catch {
      // nada que guardar
    }
  }

  if (!open || !eligible) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 px-5" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-surface p-7 text-center shadow-[0_24px_60px_-20px_rgba(1,32,45,0.5)]"
      >
        <button
          type="button"
          onClick={close}
          aria-label={locale === "en" ? "Close" : "Cerrar"}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-line text-ink-2 hover:border-deep"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <p className="eyebrow">Hydroloop®</p>
        <h2 className="mt-2 text-[26px]">{copy.title}</h2>
        <p className="mt-3 text-[15px] text-ink-2">{copy.body}</p>
        <Link href={localePath(locale, "/products")} onClick={close} className="btn btn-primary mt-6 w-full">
          {copy.cta}
        </Link>
      </div>
    </div>
  );
}
