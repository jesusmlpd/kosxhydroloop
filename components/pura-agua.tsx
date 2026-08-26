"use client";

import { useState } from "react";
import type { Dict } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";

/**
 * Suscripcion al newsletter PURA AGUA.
 *
 * Dos presentaciones: "wide" (home e indice del blog, titulo a la izquierda y
 * formulario a la derecha) y apilada (columnas angostas como el cuerpo de un
 * articulo). Antes el grid de dos columnas se metia en contenedores de 700px
 * y todo quedaba apretado y chueco: la variante se elige donde se usa, no a
 * ojo del navegador.
 */
export function PuraAgua({
  locale,
  dict,
  wide = false,
}: {
  locale: Locale;
  dict: Dict;
  wide?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const result = (await response.json()) as { ok?: boolean };
      if (!result.ok) throw new Error("rejected");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const field =
    "h-12 w-full rounded-full border border-white/25 bg-white/10 px-5 text-[15px] text-white placeholder:text-white/50 backdrop-blur-sm focus:border-aqua focus:outline-none";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-deep-2 p-7 text-white md:p-10">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(110%_120%_at_85%_-10%,rgba(0,136,168,0.55)_0%,rgba(1,42,58,0.9)_55%,rgba(1,26,37,1)_100%)]"
      />
      <div aria-hidden="true" className="caustics opacity-40 mix-blend-screen" />

      <div className={`relative grid gap-8 ${wide ? "lg:grid-cols-[1fr_1fr] lg:items-center" : ""}`}>
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-aqua">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.5c5 5.2 7.8 9 7.8 12.4a7.8 7.8 0 1 1-15.6 0C4.2 11.5 7 7.7 12 2.5Z" />
            </svg>
            {dict.puraAgua.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-[clamp(28px,4vw,42px)] font-bold leading-none tracking-[0.05em] text-white">
            {dict.puraAgua.title}
          </h2>
          <p className="mt-2 font-display text-[14.5px] font-semibold text-aqua">
            {dict.puraAgua.tagline}
          </p>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-white/80">
            {dict.puraAgua.body}
          </p>
        </div>

        {status === "done" ? (
          <div className="flex items-center gap-4 self-center rounded-2xl border border-aqua/40 bg-aqua/10 p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-aqua text-[#04141b]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="text-[15px] text-white/90">{dict.puraAgua.success}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 self-center">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder={dict.puraAgua.namePlaceholder}
                className={field}
              />
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder={dict.puraAgua.emailPlaceholder}
                className={field}
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn w-full bg-aqua text-[#04141b] hover:brightness-105"
            >
              {status === "sending" ? dict.puraAgua.sending : dict.puraAgua.submit}
            </button>
            {/* Honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            {status === "error" ? (
              <p role="alert" className="text-[13px] text-[#ffb4ae]">
                {dict.puraAgua.error}
              </p>
            ) : null}
            <p className="text-center text-[12px] text-white/55">{dict.puraAgua.privacy}</p>
          </form>
        )}
      </div>
    </div>
  );
}
