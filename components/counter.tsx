"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Numero que cuenta hacia arriba cuando entra a la vista.
 *
 * Arranca en el valor final y solo despues baja a cero para animar: asi, si el
 * navegador nunca corre el efecto (JS apagado, pestana congelada), lo que se
 * queda en pantalla es el numero correcto y no un cero.
 */
export function Counter({
  value,
  locale,
  duration = 1400,
  className = "",
}: {
  value: number;
  locale: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined" || typeof requestAnimationFrame === "undefined") {
      return;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let cancelled = false;

    const run = (start: number) => {
      const step = (now: number) => {
        if (cancelled) return;
        const progress = Math.min(1, (now - start) / duration);
        // easeOutCubic: rapido al principio, frena al final.
        const eased = 1 - Math.pow(1 - progress, 3);
        setShown(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(node);
          setShown(0);
          requestAnimationFrame((now) => run(now));
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`} suppressHydrationWarning>
      {new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX").format(shown)}
    </span>
  );
}
