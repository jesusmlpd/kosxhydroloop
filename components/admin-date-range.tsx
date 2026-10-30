"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  addMonths,
  formatDay,
  formatMonth,
  monthGrid,
  monthOf,
  spanDays,
  type Preset,
} from "@/lib/date-range";

const WEEKDAYS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

type Props = {
  /** Ruta a la que se navega con ?desde=&hasta= (por ejemplo /admin/marketing/meta). */
  action: string;
  since: string;
  until: string;
  /** Primer y ultimo dia seleccionables. */
  min: string;
  max: string;
  presets: Preset[];
  /** Tope de dias por consulta (Meta limita los reportes). */
  maxSpan?: number;
  /** Hora de la consulta ya formateada en el servidor, para no desfasar el HTML. */
  updatedLabel: string;
};

/**
 * Selector de rango: presets a la izquierda, calendario de dos meses, y el
 * rango solo se aplica con "Actualizar" (como en Ads Manager). "Descargar PDF"
 * usa la impresion del navegador; el CSS de impresion oculta los controles.
 */
export function DateRange({ action, since, until, min, max, presets, maxSpan, updatedLabel }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(since);
  const [end, setEnd] = useState<string | null>(until);
  const [view, setView] = useState(monthOf(since));
  const [warning, setWarning] = useState("");
  const box = useRef<HTMLDivElement>(null);

  const applied = presets.find((p) => !p.disabled && p.since === since && p.until === until);
  const draft = presets.find((p) => !p.disabled && p.since === start && p.until === (end ?? start));

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (box.current && !box.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openPanel() {
    setStart(since);
    setEnd(until);
    setWarning("");
    // Si el rango cruza meses se arranca en el primero para ver el inicio.
    setView(monthOf(since));
    setOpen(true);
  }

  function pickPreset(preset: Preset) {
    if (preset.disabled) return;
    setStart(preset.since);
    setEnd(preset.until);
    setWarning("");
    setView(monthOf(preset.since));
  }

  function pickDay(day: string) {
    if (day < min || day > max) return;
    setWarning("");
    if (!start || end !== null) {
      setStart(day);
      setEnd(null);
      return;
    }
    const [from, to] = day < start ? [day, start] : [start, day];
    if (maxSpan && spanDays(from, to) > maxSpan) {
      setWarning(`El máximo por consulta es de ${maxSpan} días.`);
      return;
    }
    setStart(from);
    setEnd(to);
  }

  function apply() {
    const to = end ?? start;
    setOpen(false);
    startTransition(() => router.push(`${action}?desde=${start}&hasta=${to}`));
  }

  const right = addMonths(view, 1);
  const canPrev = view > monthOf(min);
  const canNext = right < monthOf(max);
  const shownEnd = end ?? start;

  return (
    <div ref={box} className="relative flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="no-print flex items-center gap-3 rounded-full border border-line-strong bg-surface px-5 py-2.5 text-left transition-colors hover:border-deep"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-deep">
          <rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3">
            {applied ? applied.label : "Personalizado"}
          </span>
          <span className="block text-[15px] font-semibold tabular-nums">
            {formatDay(since)} – {formatDay(until)}
          </span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-ink-3">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="no-print btn btn-primary btn-sm"
      >
        Descargar PDF
      </button>
      <span className="no-print text-[13px] text-ink-3" aria-live="polite">
        {pending ? "Actualizando…" : `Actualizado ${updatedLabel}`}
      </span>
      {/* Solo en el PDF: el rango y la hora, porque los controles no se imprimen. */}
      <p className="hidden text-[13px] text-ink-2 print:block">
        {formatDay(since)} – {formatDay(until)} · Actualizado {updatedLabel}
      </p>

      {open ? (
        <div
          role="dialog"
          aria-label="Elegir rango de fechas"
          className="no-print absolute left-0 top-full z-30 mt-2 w-[min(94vw,880px)] rounded-3xl border border-line bg-surface p-5 shadow-[0_24px_60px_-20px_rgba(1,32,45,0.35)] sm:p-6"
        >
          <div className="flex flex-col gap-5 md:flex-row">
            <ul className="flex shrink-0 gap-1 overflow-x-auto md:w-52 md:flex-col md:overflow-visible">
              {presets.map((preset) => {
                const active = draft?.id === preset.id;
                return (
                  <li key={preset.id} className="shrink-0">
                    <button
                      type="button"
                      disabled={preset.disabled}
                      onClick={() => pickPreset(preset)}
                      className={`w-full whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-[15px] transition-colors ${
                        active
                          ? "bg-deep font-semibold text-white"
                          : "text-ink-2 hover:bg-mist hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                      }`}
                    >
                      {preset.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="min-w-0 flex-1">
              <div className="grid gap-6 md:grid-cols-2">
                <Month
                  month={view}
                  start={start}
                  end={end}
                  min={min}
                  max={max}
                  onPick={pickDay}
                  nav={
                    <NavButton label="Mes anterior" disabled={!canPrev} onClick={() => setView(addMonths(view, -1))} dir="prev" />
                  }
                />
                <div className="hidden md:block">
                  <Month
                    month={right}
                    start={start}
                    end={end}
                    min={min}
                    max={max}
                    onPick={pickDay}
                    nav={
                      <NavButton label="Mes siguiente" disabled={!canNext} onClick={() => setView(addMonths(view, 1))} dir="next" />
                    }
                  />
                </div>
              </div>
              <p className="mt-3 text-[13px] text-ink-3">Las fechas se muestran en hora del Centro.</p>
              {warning ? (
                <p role="alert" className="mt-1 text-[13px] text-[#a1332f]">
                  {warning}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="text-[16px] font-semibold tabular-nums">
              {formatDay(start)}
              {end !== null && end !== start ? ` – ${formatDay(shownEnd)}` : end === null ? " – elige el último día" : ""}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm">
                Cancelar
              </button>
              <button type="button" onClick={apply} disabled={end === null} className="btn btn-primary btn-sm">
                Actualizar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  dir,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  dir: "prev" | "next";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-deep hover:text-deep disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink-2"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={dir === "prev" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function Month({
  month,
  start,
  end,
  min,
  max,
  onPick,
  nav,
}: {
  month: string;
  start: string;
  end: string | null;
  min: string;
  max: string;
  onPick: (day: string) => void;
  nav: React.ReactNode;
}) {
  const to = end ?? start;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-display text-[16px] font-bold">{formatMonth(month)}</span>
        {nav}
      </div>
      <table className="w-full table-fixed border-separate border-spacing-y-1 text-center text-[14px]">
        <thead>
          <tr>
            {WEEKDAYS.map((name) => (
              <th key={name} className="pb-1 text-[12.5px] font-normal text-ink-3">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthGrid(month).map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => {
                if (!day) return <td key={j} />;
                const off = day < min || day > max;
                const isStart = day === start;
                const isEnd = day === to;
                const inRange = day >= start && day <= to;
                return (
                  <td
                    key={day}
                    className={`p-0 ${inRange && !off ? "bg-aqua/25" : ""} ${
                      isStart ? "rounded-l-xl" : ""
                    } ${isEnd ? "rounded-r-xl" : ""}`}
                  >
                    <button
                      type="button"
                      disabled={off}
                      onClick={() => onPick(day)}
                      aria-pressed={isStart || isEnd}
                      aria-label={formatDay(day)}
                      className={`h-10 w-full rounded-xl tabular-nums transition-colors ${
                        isStart || isEnd
                          ? "bg-deep font-semibold text-white"
                          : off
                            ? "cursor-not-allowed text-ink-3/50"
                            : "hover:bg-aqua/30"
                      }`}
                    >
                      {Number(day.slice(8))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
