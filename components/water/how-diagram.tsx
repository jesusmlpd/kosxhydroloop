"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/dict";

/**
 * Replica animada del diagrama oficial de Hydroloop (el de "como funciona" en
 * hydroloop.com.mx): regadera a la izquierda, lavabo al centro con el equipo
 * debajo, calentador a la derecha, tuberia fria arriba en azul claro y tuberia
 * caliente abajo en ladrillo, sobre fondo azul marino.
 *
 * Los cinco pasos son los del diagrama original y avanzan solos; tocar un paso
 * salta a el. Todo el texto vive fuera del movimiento: si las animaciones se
 * congelan, el diagrama completo y los pasos siguen legibles.
 */

const NAVY_1 = "#1d4066";
const NAVY_2 = "#122c4a";
const HOT = "#b07878";
const HOT_GLOW = "#d99a6c";
const COLD = "#aecde0";
const LINE = "#dce9f2";
const CYAN = "#2fb9d8";

const AUTO_MS = 3400;
const MANUAL_HOLD_MS = 9000;

export function HowDiagram({ dict }: { dict: Dict["how"] }) {
  const [step, setStep] = useState(0);
  const holdUntil = useRef(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() < holdUntil.current) return;
      setStep((value) => (value + 1) % 5);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, []);

  function pick(index: number) {
    holdUntil.current = Date.now() + MANUAL_HOLD_MS;
    setStep(index);
  }

  const L = dict.labels;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-stretch">
      <figure className="card overflow-hidden">
        <div style={{ background: `linear-gradient(160deg, ${NAVY_1}, ${NAVY_2})` }}>
          <svg viewBox="0 0 900 560" className="w-full" role="img" aria-label={dict.diagramAlt}>
            <defs>
              <radialGradient id="devGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#43c6c0" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#43c6c0" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="hotGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={HOT_GLOW} stopOpacity="0.5" />
                <stop offset="100%" stopColor={HOT_GLOW} stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* ---------- Tuberia fria (arriba, azul claro) ---------- */}
            <Pipe d="M560 44 V 96" color={COLD} />
            <Pipe d="M160 96 H 805" color={COLD} />
            <Pipe d="M805 96 V 132" color={COLD} />
            {/* riser de retorno: del equipo a la linea fria, pasa detras del lavabo */}
            <Pipe d="M402 96 V 368" color={COLD} />

            {/* ---------- Tuberia caliente (abajo, ladrillo) ---------- */}
            <Pipe d="M835 300 V 462" color={HOT} />
            <Pipe d="M835 462 H 210" color={HOT} />
            <Pipe d="M438 462 V 430" color={HOT} />
            <Pipe d="M210 462 V 200 H 162" color={HOT} />

            {/* ---------- Flujos animados ---------- */}
            {step === 1 ? (
              <>
                <Flow d="M835 300 V 462" color="#ffffff" />
                <Flow d="M835 462 H 438" color="#ffffff" />
                <Flow d="M438 462 V 430" color="#ffffff" />
              </>
            ) : null}
            {step === 2 ? (
              <>
                <Flow d="M402 368 V 96" color={CYAN} />
                <Flow d="M402 96 H 805" color={CYAN} />
                <Flow d="M805 96 V 132" color={CYAN} />
              </>
            ) : null}
            {step === 4 ? (
              <>
                <Flow d="M835 300 V 462" color={HOT_GLOW} />
                <Flow d="M835 462 H 210" color={HOT_GLOW} />
                <Flow d="M210 462 V 200 H 162" color={HOT_GLOW} />
                <circle cx="150" cy="205" r="38" fill="url(#hotGlow)" />
              </>
            ) : null}

            {/* ---------- Regadera ---------- */}
            <g stroke={LINE} strokeWidth="5" strokeLinecap="round" fill="none">
              <path d="M162 200 h -12 v 4" />
              <path d="M122 214 a 28 14 0 0 1 56 0 Z" fill={LINE} stroke="none" />
            </g>
            {step === 4 ? (
              <g fill={COLD}>
                {[128, 139, 150, 161, 172].map((x, i) => (
                  <circle key={x} cx={x} cy={226} r={3.4} className="drop" style={{ animationDelay: `${i * 0.35}s` }} />
                ))}
              </g>
            ) : null}

            {/* ---------- Lavabo (encima del riser) ---------- */}
            <g>
              <path d="M340 306 h 160 a 80 42 0 0 1 -160 0 Z" fill={NAVY_2} stroke={LINE} strokeWidth="5" />
              <path d="M408 274 v 24 M 432 274 v 24" stroke={LINE} strokeWidth="5" strokeLinecap="round" />
              <path d="M396 268 h 48" stroke={LINE} strokeWidth="7" strokeLinecap="round" />
            </g>

            {/* ---------- Equipo Hydroloop ---------- */}
            {step === 3 ? <circle cx="420" cy="400" r="60" fill="url(#devGlow)" /> : null}
            <g>
              <rect x="378" y="368" width="84" height="62" rx="12" fill="#f6fafc" />
              <path
                d="M420 382c8.5 9.5 13 16 13 21.5a13 13 0 0 1-26 0c0-5.5 4.5-12 13-21.5Z"
                fill={step === 3 ? "#0aa79b" : "#0f6f86"}
              />
              {step === 3 ? (
                <path d="m408 412 8 8 16-16" stroke="#0aa79b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              ) : null}
            </g>

            {/* ---------- Calentador ---------- */}
            <g>
              <rect x="745" y="132" width="120" height="168" rx="18" fill={NAVY_2} stroke={LINE} strokeWidth="5" />
              <rect x="787" y="196" width="36" height="58" rx="8" fill="none" stroke={LINE} strokeWidth="4" />
              <circle cx="805" cy="172" r="9" fill="none" stroke={LINE} strokeWidth="4" />
              <path
                d="M805 240c-6-5-10-10-10-15.5 0-6 5-10 10-17 5 7 10 11 10 17 0 5.5-4 10.5-10 15.5Z"
                fill={step >= 1 ? "#f0a92b" : "#8fa8bd"}
              />
            </g>

            {/* ---------- Boton de inicio ---------- */}
            <g>
              {step === 0 ? (
                <>
                  <circle cx="600" cy="208" r="20" fill="none" stroke={CYAN} strokeWidth="3" className="ripple" style={{ transformOrigin: "600px 208px" }} />
                  <circle cx="600" cy="208" r="20" fill="none" stroke={CYAN} strokeWidth="3" className="ripple" style={{ transformOrigin: "600px 208px", animationDelay: "1.4s" }} />
                </>
              ) : null}
              <circle cx="600" cy="208" r="17" fill="#f6fafc" />
              <circle cx="600" cy="208" r="7" fill={step === 0 ? CYAN : "#5c7d99"} />
            </g>

            {/* ---------- Etiquetas ---------- */}
            <Chip x={560} y={24} text={L.feed} anchor="middle" />
            <Chip x={272} y={76} text={L.coldLine} anchor="middle" />
            <Chip x={545} y={492} text={L.hotLine} anchor="middle" />
            <Chip x={805} y={324} text={L.heater} anchor="middle" />
            <Chip x={600} y={248} text={L.button} anchor="middle" />
            <Chip x={420} y={452} text={L.device} anchor="middle" />
            {step === 4 ? <Chip x={150} y={262} text={L.noWaste} anchor="middle" accent /> : null}

            {/* ---------- Numeros de paso sobre el diagrama ---------- */}
            <StepDot n={1} x={648} y={176} active={step === 0} onPick={pick} />
            <StepDot n={2} x={770} y={420} active={step === 1} onPick={pick} />
            <StepDot n={3} x={352} y={180} active={step === 2} onPick={pick} />
            <StepDot n={4} x={318} y={398} active={step === 3} onPick={pick} />
            <StepDot n={5} x={98} y={148} active={step === 4} onPick={pick} />
          </svg>
        </div>
      </figure>

      <div className="flex flex-col gap-2" role="tablist" aria-label={dict.eyebrow}>
        {dict.steps.map((text, index) => {
          const active = index === step;
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => pick(index)}
              className={`flex flex-1 items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-300 ${
                active
                  ? "border-teal bg-surface shadow-[var(--shadow-card)]"
                  : "border-line bg-transparent hover:border-line-strong"
              }`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-[14px] font-bold transition-colors ${
                  active ? "bg-teal text-white" : "bg-mist text-ink-3"
                }`}
              >
                {index + 1}
              </span>
              <span className={`text-[14.5px] leading-snug ${active ? "text-ink" : "text-ink-2"}`}>
                {text}
              </span>
            </button>
          );
        })}
        <p className="mt-1 text-[12px] text-ink-3">{dict.autoplay}</p>
      </div>
    </div>
  );
}

function Pipe({ d, color }: { d: string; color: string }) {
  return (
    <>
      <path d={d} fill="none" stroke="#0c2035" strokeWidth="15" strokeLinecap="round" opacity="0.55" />
      <path d={d} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" />
    </>
  );
}

/** Puntos que corren por la tuberia; el sentido lo da la direccion del path. */
function Flow({ d, color }: { d: string; color: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray="2 16"
      className="flow-line"
      opacity="0.95"
    />
  );
}

function Chip({
  x,
  y,
  text,
  anchor,
  accent = false,
}: {
  x: number;
  y: number;
  text: string;
  anchor: "middle" | "start";
  accent?: boolean;
}) {
  const width = text.length * 7.4 + 22;
  const rectX = anchor === "middle" ? x - width / 2 : x;
  return (
    <g>
      <rect
        x={rectX}
        y={y - 13}
        width={width}
        height={24}
        rx={12}
        fill={accent ? "#43c6c0" : "#eaf2f8"}
        opacity={accent ? 1 : 0.92}
      />
      <text
        x={anchor === "middle" ? x : x + width / 2}
        y={y + 4}
        textAnchor="middle"
        fontSize="12.5"
        fontWeight="700"
        fill="#122c4a"
        style={{ letterSpacing: "0.04em", textTransform: "uppercase" }}
      >
        {text}
      </text>
    </g>
  );
}

function StepDot({
  n,
  x,
  y,
  active,
  onPick,
}: {
  n: number;
  x: number;
  y: number;
  active: boolean;
  onPick: (index: number) => void;
}) {
  return (
    <g
      onClick={() => onPick(n - 1)}
      style={{ cursor: "pointer" }}
      role="button"
      aria-label={String(n)}
    >
      {active ? (
        <circle cx={x} cy={y} r={15} fill="none" stroke={CYAN} strokeWidth="2.5" className="ripple" style={{ transformOrigin: `${x}px ${y}px` }} />
      ) : null}
      <circle cx={x} cy={y} r={14} fill={active ? CYAN : "#28516f"} stroke="#eaf2f8" strokeWidth={active ? 0 : 1.5} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#ffffff">
        {n}
      </text>
    </g>
  );
}
