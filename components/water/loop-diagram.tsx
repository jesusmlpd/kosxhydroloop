"use client";

import { useState } from "react";
import type { Dict } from "@/lib/dict";

/**
 * El diagrama del hidro-retorno, con interruptor entre el antes y el despues.
 *
 * Es la pieza que explica el producto en tres segundos: con Hydroloop apagado
 * el agua se va al drenaje, con Hydroloop encendido regresa al calentador. El
 * movimiento es decorativo, las etiquetas y los textos siempre se leen.
 */
export function LoopDiagram({ dict }: { dict: Dict["how"] }) {
  const [on, setOn] = useState(true);
  const copy = dict.diagram;

  return (
    <figure className="card overflow-hidden">
      <div
        role="group"
        aria-label={copy.after}
        className="flex items-center gap-1 border-b border-line bg-mist p-2"
      >
        {[
          { id: false, label: copy.before },
          { id: true, label: copy.after },
        ].map((option) => (
          <button
            key={String(option.id)}
            type="button"
            onClick={() => setOn(option.id)}
            aria-pressed={on === option.id}
            className={`flex-1 rounded-xl px-4 py-2.5 font-display text-[14px] font-semibold transition-colors ${
              on === option.id ? "bg-surface text-ink shadow-sm" : "text-ink-3 hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="bg-surface p-4 sm:p-6">
        <svg viewBox="0 0 720 380" className="w-full" role="img" aria-label={dict.diagramAlt}>
          {/* Muro y piso */}
          <rect x="0" y="0" width="720" height="380" fill="transparent" />
          <line x1="40" y1="330" x2="680" y2="330" stroke="var(--line)" strokeWidth="2" />

          {/* Calentador */}
          <g>
            <rect x="556" y="120" width="104" height="150" rx="14" fill="var(--bg-2)" stroke="var(--line-strong)" strokeWidth="2" />
            <rect x="576" y="140" width="64" height="46" rx="8" fill="var(--color-foam)" />
            <path
              d="M608 250c-10-8-16-16-16-25 0-10 8-16 16-27 8 11 16 17 16 27 0 9-6 17-16 25Z"
              fill={on ? "#f0a92b" : "var(--line-strong)"}
            />
            <text x="608" y="292" textAnchor="middle" className="fill-[var(--fg-2)]" fontSize="15" fontFamily="var(--font-sans)">
              {copy.heater}
            </text>
          </g>

          {/* Regadera */}
          <g>
            <path d="M120 96v56" stroke="var(--line-strong)" strokeWidth="6" strokeLinecap="round" />
            <path d="M96 152h48l-8 18H104z" fill="var(--line-strong)" />
            <text x="120" y="86" textAnchor="middle" className="fill-[var(--fg-2)]" fontSize="15" fontFamily="var(--font-sans)">
              {copy.shower}
            </text>
          </g>

          {/* Tubo caliente (arriba) */}
          <path
            id="hot"
            d="M120 118H460c30 0 30 0 30 0h66"
            fill="none"
            stroke="var(--line)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M120 118H556"
            fill="none"
            stroke="#f0a92b"
            strokeOpacity="0.35"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Tubo frio (abajo) */}
          <path
            d="M120 300H556"
            fill="none"
            stroke="var(--line)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M120 300H556"
            fill="none"
            stroke="var(--color-teal)"
            strokeOpacity="0.3"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Bajada de la regadera al equipo o al drenaje */}
          <path
            d="M120 118v182"
            fill="none"
            stroke="var(--line)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Flujo: sin equipo el agua baja y se va al drenaje */}
          {!on ? (
            <>
              <path
                d="M120 170v150"
                fill="none"
                stroke="#c4423c"
                strokeWidth="5"
                strokeLinecap="round"
                className="flow-line"
              />
              <path d="M104 330h32l-6 26h-20z" fill="var(--line-strong)" />
              <text x="120" y="374" textAnchor="middle" className="fill-[var(--fg-3)]" fontSize="14" fontFamily="var(--font-sans)">
                {copy.drain}
              </text>
            </>
          ) : (
            <>
              {/* Con equipo el agua regresa por el tubo frio al calentador */}
              <path
                d="M120 300H556"
                fill="none"
                stroke="var(--color-teal)"
                strokeWidth="5"
                strokeLinecap="round"
                className="flow-line"
              />
              <path
                d="M120 130v170"
                fill="none"
                stroke="var(--color-teal)"
                strokeWidth="5"
                strokeLinecap="round"
                className="flow-line"
              />
              <g>
                <rect x="176" y="252" width="92" height="66" rx="12" fill="var(--color-deep)" />
                <path
                  d="M222 268c8 9 12 15 12 20a12 12 0 0 1-24 0c0-5 4-11 12-20Z"
                  fill="#ffffff"
                  opacity="0.92"
                />
                <text x="222" y="340" textAnchor="middle" className="fill-[var(--fg-2)]" fontSize="14" fontFamily="var(--font-sans)">
                  {copy.device}
                </text>
              </g>
              {/* Flecha de retorno */}
              <path
                d="M470 286l18 14-18 14"
                fill="none"
                stroke="var(--color-teal)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Etiquetas de tuberia */}
          <text x="330" y="104" textAnchor="middle" className="fill-[var(--fg-3)]" fontSize="13" fontFamily="var(--font-sans)">
            {copy.hotLine}
          </text>
          <text x="330" y="326" textAnchor="middle" className="fill-[var(--fg-3)]" fontSize="13" fontFamily="var(--font-sans)">
            {copy.coldLine}
          </text>
        </svg>
      </div>

      <figcaption className="border-t border-line bg-mist px-5 py-4 text-[14px] text-ink-2">
        {on ? copy.afterCaption : copy.beforeCaption}
      </figcaption>
    </figure>
  );
}
