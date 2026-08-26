"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/dict";
import { fill, type Locale } from "@/lib/i18n";

/**
 * Fecha estimada de entrega, calculada de la politica real de envios:
 * 1 a 2 dias habiles de preparacion mas 2 a 7 de paqueteria = 3 a 9 dias
 * habiles. Se calcula en el navegador (la zona horaria del visitante manda)
 * y hasta entonces no se muestra nada: nunca una fecha equivocada.
 */
function addBusinessDays(from: Date, days: number) {
  const date = new Date(from);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return date;
}

export function DeliveryEstimate({ locale, dict }: { locale: Locale; dict: Dict["pdp"] }) {
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    // En un frame, no en el cuerpo del efecto: mismo resultado sin el
    // render en cascada que marca el lint.
    const id = requestAnimationFrame(() => {
      const formatter = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-MX", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      const now = new Date();
      setRange({
        from: formatter.format(addBusinessDays(now, 3)),
        to: formatter.format(addBusinessDays(now, 9)),
      });
    });
    return () => cancelAnimationFrame(id);
  }, [locale]);

  if (!range) return null;

  return (
    <p className="flex items-center gap-2 text-[14px] text-ink-2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-teal">
        <path d="M3 7h11v9H3zm11 3h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <circle cx="7" cy="17.4" r="1.6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="17.4" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span>
        <strong className="font-semibold text-ink">
          {fill(dict.delivery, { from: range.from, to: range.to })}
        </strong>{" "}
        <span className="text-ink-3">({dict.deliveryNote})</span>
      </span>
    </p>
  );
}
