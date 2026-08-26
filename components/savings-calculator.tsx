"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { fill, localePath, type Locale } from "@/lib/i18n";
import { findProduct } from "@/lib/site";

/**
 * Calculadora de agua desperdiciada.
 *
 * Los defaults reproducen exactamente las cifras que Hydroloop publica: 2 usos
 * al dia por persona x 10 litros por espera x 365 dias = 7,300 litros al ano
 * por persona, y 90 segundos por uso = 18 horas al ano. Todo es editable
 * porque el ahorro real depende de cada casa, y la formula queda a la vista.
 */
const LITERS_PER_SHOWER = 72; // ducha de 8 minutos a 9 L/min
const LITERS_PER_TANK = 1100; // tinaco domestico tipico

type Values = { people: number; uses: number; liters: number; seconds: number; price: number };

type Field = {
  key: keyof Values;
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

/** Numero que persigue su objetivo con easing, para que el resultado fluya
 *  como agua en vez de brincar. Arranca en el objetivo: sin animacion nunca
 *  se ve un valor equivocado. */
function useChase(target: number) {
  const [shown, setShown] = useState(target);
  const raf = useRef(0);
  const current = useRef(target);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cancelAnimationFrame(raf.current);
    const from = current.current;
    const start = performance.now();
    const DURATION = reduced ? 0 : 500;
    // El primer setState pasa dentro de un frame, nunca en el cuerpo del
    // efecto: es lo que pide la regla de lint y ademas evita un render extra.
    const step = (now: number) => {
      const t = DURATION === 0 ? 1 : Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = from + (target - from) * eased;
      current.current = value;
      setShown(value);
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);

  return shown;
}

export function SavingsCalculator({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [values, setValues] = useState<Values>({
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
      hoursPerYear,
      moneyPerYear,
      paybackMonths,
      showers: litersPerYear / LITERS_PER_SHOWER,
      tanks: litersPerYear / LITERS_PER_TANK,
    };
  }, [values]);

  const liters = useChase(result.litersPerYear);
  const hours = useChase(result.hoursPerYear);
  const money = useChase(result.moneyPerYear);

  const nf = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    maximumFractionDigits: 0,
  });

  const activePreset = dict.savings.presets.findIndex(
    (preset) => preset.people === values.people && preset.uses === values.uses,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
      <div className="card flex flex-col p-6 md:p-8">
        {/* Presets: un clic para caer en un escenario tipico */}
        <div className="flex flex-wrap gap-2">
          {dict.savings.presets.map((preset, index) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setValues((prev) => ({ ...prev, people: preset.people, uses: preset.uses }))}
              aria-pressed={index === activePreset}
              className={`rounded-full border px-4 py-1.5 font-display text-[13px] font-semibold transition-colors ${
                index === activePreset
                  ? "border-teal bg-foam text-deep dark:bg-[#0d3a45] dark:text-aqua"
                  : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-7 flex-1 space-y-6">
          {fields.map((field) => {
            const value = values[field.key];
            const percent = ((value - field.min) / (field.max - field.min)) * 100;
            return (
              <label key={field.key} className="block">
                <span className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px] font-medium text-ink-2">
                    {dict.savings.fields[field.key]}
                  </span>
                  <span className="font-display text-[16px] font-bold tabular-nums text-ink">
                    {field.key === "price"
                      ? formatMoney(value * 100, locale)
                      : `${value}${field.suffix ? ` ${field.suffix}` : ""}`}
                  </span>
                </span>
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={value}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, [field.key]: Number(event.target.value) }))
                  }
                  className="range mt-3"
                  style={{
                    background: `linear-gradient(90deg, var(--color-teal) ${percent}%, var(--line-strong) ${percent}%)`,
                  }}
                />
              </label>
            );
          })}
        </div>
        <p className="mt-7 text-[12px] leading-relaxed text-ink-3">{dict.savings.disclaimer}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-3xl bg-invert p-7 text-invert-fg md:p-9">
          {/* Nivel de agua decorativo que sube con el desperdicio */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(67,198,192,0.14),rgba(67,198,192,0.05))] transition-[height] duration-700 ease-out"
            style={{ height: `${Math.min(85, 12 + (result.litersPerYear / 90000) * 73)}%` }}
          />
          <div className="relative">
            <p className="text-[13px] uppercase tracking-[0.14em] opacity-70">
              {dict.savings.results.liters}
            </p>
            <p className="mt-2 font-display text-[clamp(42px,7vw,72px)] font-bold leading-none tabular-nums">
              {nf.format(Math.round(liters))}
              <span className="ml-2 text-[24px] font-semibold opacity-70">L</span>
            </p>
            <p className="mt-3 text-[14px] opacity-80">
              {dict.savings.results.showers} {nf.format(Math.round(result.showers))}{" "}
              {dict.savings.results.showersUnit}
              {result.tanks >= 1 ? (
                <>
                  {" "}
                  {fill(dict.savings.results.tanks, { n: nf.format(Math.round(result.tanks)) })}
                </>
              ) : null}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Metric
            label={dict.savings.results.hours}
            value={`${nf.format(Math.round(hours))} h`}
          />
          <Metric
            label={dict.savings.results.money}
            value={formatMoney(Math.round(money) * 100, locale)}
          />
          <Metric
            label={dict.savings.results.payback}
            value={
              result.paybackMonths > 0 && result.paybackMonths <= 24
                ? nf.format(Math.max(1, Math.round(result.paybackMonths)))
                : dict.savings.results.paybackLong
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
      <p className="font-display text-[22px] font-bold leading-tight tabular-nums">{value}</p>
      <p className="mt-1 text-[13px] text-ink-2">{label}</p>
      {note ? <p className="mt-2 text-[11px] text-ink-3">{note}</p> : null}
    </div>
  );
}
