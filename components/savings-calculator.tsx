"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";
import { findProduct } from "@/lib/site";

/**
 * Calculadora de agua desperdiciada.
 *
 * Los valores por default reproducen exactamente las cifras que Hydroloop
 * publica en su sitio: 2 usos al dia por persona x 10 litros por espera x 365
 * dias = 7,300 litros al ano por persona, y 90 segundos de espera por uso = 18
 * horas al ano. Todo es editable porque el ahorro real depende de la casa, y
 * la formula esta a la vista para que nadie tenga que creernos.
 */
const LITERS_PER_SHOWER = 72; // ducha de 8 minutos a 9 L/min

type Field = {
  key: "people" | "uses" | "liters" | "seconds" | "price";
  min: number;
  max: number;
  step: number;
  suffix?: string;
};

const fields: Field[] = [
  { key: "people", min: 1, max: 10, step: 1 },
  { key: "uses", min: 1, max: 6, step: 1 },
  { key: "liters", min: 2, max: 30, step: 1, suffix: "L" },
  { key: "seconds", min: 10, max: 240, step: 5, suffix: "s" },
  { key: "price", min: 5, max: 90, step: 1, suffix: "$/m³" },
];

export function SavingsCalculator({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [values, setValues] = useState({
    people: 4,
    uses: 2,
    liters: 10,
    seconds: 90,
    price: 25,
  });

  const result = useMemo(() => {
    const usesPerYear = values.people * values.uses * 365;
    const litersPerYear = usesPerYear * values.liters;
    const hoursPerYear = (usesPerYear * values.seconds) / 3600;
    const moneyPerYear = (litersPerYear / 1000) * values.price;

    const manual = findProduct("hydroloop-manual");
    const unitPrice = manual ? manual.priceCents / 100 : 0;
    const paybackMonths = moneyPerYear > 0 ? (unitPrice / moneyPerYear) * 12 : 0;

    return {
      litersPerYear,
      litersPerPerson: Math.round(litersPerYear / values.people),
      hoursPerYear,
      moneyPerYear,
      paybackMonths,
      showers: Math.round(litersPerYear / LITERS_PER_SHOWER),
    };
  }, [values]);

  const nf = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    maximumFractionDigits: 0,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
      <div className="card p-6 md:p-8">
        <div className="space-y-6">
          {fields.map((field) => (
            <label key={field.key} className="block">
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-[14px] font-medium text-ink-2">
                  {dict.savings.fields[field.key]}
                </span>
                <span className="font-display text-[16px] font-bold tabular-nums text-ink">
                  {field.key === "price"
                    ? formatMoney(values.price * 100, locale)
                    : `${values[field.key]}${field.suffix ? ` ${field.suffix}` : ""}`}
                </span>
              </span>
              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={values[field.key]}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, [field.key]: Number(event.target.value) }))
                }
                className="range mt-3"
              />
            </label>
          ))}
        </div>
        <p className="mt-6 text-[12px] leading-relaxed text-ink-3">{dict.savings.disclaimer}</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl bg-invert p-7 text-invert-fg md:p-9">
          <p className="text-[13px] uppercase tracking-[0.14em] opacity-70">
            {dict.savings.results.liters}
          </p>
          <p className="mt-2 font-display text-[clamp(40px,7vw,68px)] font-bold leading-none tabular-nums">
            {nf.format(result.litersPerYear)}
            <span className="ml-2 text-[24px] font-semibold opacity-70">L</span>
          </p>
          <p className="mt-3 text-[14px] opacity-80">
            {dict.savings.results.showers} {nf.format(result.showers)}{" "}
            {dict.savings.results.showersUnit}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Metric
            label={dict.savings.results.hours}
            value={`${nf.format(Math.round(result.hoursPerYear))} h`}
          />
          <Metric
            label={dict.savings.results.money}
            value={formatMoney(Math.round(result.moneyPerYear) * 100, locale)}
          />
          <Metric
            label={dict.savings.results.payback}
            value={
              result.paybackMonths > 0 && result.paybackMonths < 600
                ? nf.format(Math.round(result.paybackMonths))
                : "-"
            }
            note={dict.savings.results.paybackNote}
          />
        </div>

        <Link href={localePath(locale, "/products")} className="btn btn-primary w-full">
          {dict.savings.cta}
        </Link>
      </div>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="card h-full p-5">
      <p className="font-display text-[24px] font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-[13px] text-ink-2">{label}</p>
      {note ? <p className="mt-2 text-[11px] text-ink-3">{note}</p> : null}
    </div>
  );
}
