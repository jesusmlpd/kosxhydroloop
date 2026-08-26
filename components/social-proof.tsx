"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { commerce } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { fill } from "@/lib/i18n";

/**
 * ============================================================================
 * PRUEBA SOCIAL SIMULADA (pedida explicitamente por el cliente).
 * ============================================================================
 * Ni los "viendo ahora" ni los avisos de compra vienen de telemetria real:
 * se generan aqui con numeros plausibles y deterministas. Cuando exista
 * analitica real hay que alimentar estos componentes con ella, o apagar
 * commerce.urgency.socialProof y desaparece todo el bloque.
 */

/** Hash simple y estable para que el mismo producto y la misma hora den el mismo numero. */
function hash(text: string) {
  let value = 0;
  for (let i = 0; i < text.length; i += 1) value = (value * 31 + text.charCodeAt(i)) % 100003;
  return value;
}

export function ViewersNow({ slug, dict }: { slug: string; dict: Dict["socialProof"] }) {
  const [viewers, setViewers] = useState<number | null>(null);

  useEffect(() => {
    if (!commerce.urgency.socialProof) return;
    const { viewersMin, viewersMax } = commerce.socialProof;
    const span = viewersMax - viewersMin + 1;

    const compute = () => {
      const hour = Math.floor(Date.now() / 3_600_000);
      return viewersMin + (hash(`${slug}:${hour}`) % span);
    };
    // El primer valor entra en un frame, no en el cuerpo del efecto.
    const first = requestAnimationFrame(() => setViewers(compute()));
    const id = window.setInterval(() => {
      setViewers((current) => {
        if (current === null) return compute();
        // deriva de +-1 sin salirse del rango, para que respire sin brincar
        const step = (Math.floor(Date.now() / 21_000) % 2 === 0 ? 1 : -1);
        return Math.min(viewersMax, Math.max(viewersMin, current + step));
      });
    }, 21_000);
    return () => {
      cancelAnimationFrame(first);
      window.clearInterval(id);
    };
  }, [slug]);

  if (viewers === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
      </span>
      {fill(dict.viewing, { n: viewers })}
    </span>
  );
}

/** Nombres y ciudades del pool de resenas: consistente con lo que ya se muestra. */
const NAMES = ["Mariana", "Jorge", "Alejandra", "Ricardo", "Karla", "Héctor", "Paola", "Sergio", "Lucía", "Andrés", "Susana", "Raúl", "Carmen", "Emilio", "Regina", "Tomás"];
const CITIES = ["Querétaro", "Monterrey", "Guadalajara", "Ciudad de México", "León", "Torreón", "Mérida", "Chihuahua", "Toluca", "Puebla", "San Luis Potosí", "Ciudad Juárez"];

export function PurchaseToasts({ dict, productNames }: { dict: Dict["socialProof"]; productNames: string[] }) {
  const [toast, setToast] = useState<{ name: string; city: string; product: string; ago: number } | null>(null);
  const shown = useRef(0);
  const muted = useRef(false);
  const pathname = usePathname() ?? "";
  // En el PDP movil la barra fija ocupa el fondo: el toast sube. En checkout
  // no hay teatro: cero distracciones junto al pago.
  const onPdp = /\/products\/[^/]+$/.test(pathname);
  const onCheckout = /\/(checkout|order)(\/|$)/.test(pathname);

  useEffect(() => {
    if (!commerce.urgency.socialProof) return;
    try {
      if (sessionStorage.getItem("hl-toasts-off") === "1") return;
    } catch {
      // sin storage igual funciona, solo no recuerda el cierre
    }
    const { toastFirstMs, toastEveryMs, toastMaxPerSession } = commerce.socialProof;

    const fire = () => {
      if (muted.current || shown.current >= toastMaxPerSession) return;
      const seed = Math.floor(Date.now() / toastEveryMs);
      setToast({
        name: NAMES[hash(`n${seed}`) % NAMES.length],
        city: CITIES[hash(`c${seed}`) % CITIES.length],
        product: productNames[hash(`p${seed}`) % productNames.length],
        ago: 3 + (hash(`a${seed}`) % 38),
      });
      shown.current += 1;
      window.setTimeout(() => setToast(null), 6500);
    };

    const first = window.setTimeout(fire, toastFirstMs);
    const loop = window.setInterval(fire, toastEveryMs);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(loop);
    };
  }, [productNames]);

  if (!toast || onCheckout) return null;

  return (
    <div
      role="status"
      className={`fixed bottom-4 left-4 z-40 flex max-w-[320px] items-start gap-3 rounded-2xl border border-line bg-paper p-4 shadow-[var(--shadow-lift)] ${
        onPdp ? "max-md:bottom-24" : ""
      }`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-foam text-deep dark:bg-[#0d3a45] dark:text-aqua">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6h2.2l1.9 10.2a1.6 1.6 0 0 0 1.6 1.3h7.8a1.6 1.6 0 0 0 1.6-1.3L20.5 9H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="min-w-0 text-[13px] leading-snug">
        <p className="text-ink">
          {fill(dict.toast, { name: toast.name, city: toast.city, product: toast.product })}
        </p>
        <p className="mt-0.5 text-[12px] text-ink-3">{fill(dict.toastAgo, { n: toast.ago })}</p>
      </div>
      <button
        type="button"
        aria-label={dict.close}
        onClick={() => {
          muted.current = true;
          setToast(null);
          try {
            sessionStorage.setItem("hl-toasts-off", "1");
          } catch {
            // nada
          }
        }}
        className="shrink-0 text-ink-3 transition-colors hover:text-ink"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function StockBar({ stock, dict }: { stock: number; dict: Dict["socialProof"] }) {
  if (!commerce.urgency.socialProof || stock <= 0 || stock > commerce.stockBarThreshold) return null;
  const percent = Math.max(8, Math.round((stock / commerce.stockBarThreshold) * 100));

  return (
    <div className="mt-3">
      <p className="text-[13px] font-semibold text-[#a1332f] dark:text-[#ff9c96]">
        {fill(dict.stockBar, { n: stock })}
      </p>
      <div className="mt-1.5 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#c4423c,#e08a3c)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/** Vendidos del mes: numero estatico del catalogo, sin teatro. */
export function SoldBadge({ sold, dict }: { sold: number; dict: Dict["socialProof"] }) {
  if (!commerce.urgency.socialProof || sold <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-2">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-teal">
        <path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      {fill(dict.sold, { n: sold })}
    </span>
  );
}
