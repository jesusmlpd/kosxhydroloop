"use client";

import { useEffect, useRef } from "react";

/**
 * Aparicion al hacer scroll, manejada por JS y no por CSS puro: si el
 * navegador congela las animaciones (pestana en background, panel de preview
 * oculto) el contenido tiene que quedar visible. Falla abierto siempre.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.dataset.reveal = "in";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          window.setTimeout(() => {
            node.dataset.reveal = "in";
          }, delay);
          observer.unobserve(node);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
    );

    observer.observe(node);
    // Red de seguridad: si en 2.5s nunca disparo, se muestra igual.
    const failOpen = window.setTimeout(() => {
      node.dataset.reveal = "in";
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failOpen);
    };
  }, [delay]);

  return (
    <div ref={ref} data-reveal="out" className={className}>
      {children}
    </div>
  );
}
