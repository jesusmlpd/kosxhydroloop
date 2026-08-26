"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Video de YouTube con fachada: en el primer paint solo hay una imagen local
 * y un boton de play. El iframe (y todo el JavaScript de YouTube) se carga
 * hasta que alguien reproduce. Es la diferencia entre un LCP limpio y cargarle
 * medio megabyte de player a quien nunca le dio play.
 */
export function VideoEmbed({
  videoId,
  thumbnail,
  title,
  playLabel,
  consent,
}: {
  videoId: string;
  thumbnail: string;
  title: string;
  playLabel: string;
  consent: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="group relative aspect-video w-full overflow-hidden rounded-3xl border border-line bg-[#0b1f2e] shadow-[var(--shadow-card)]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`${playLabel}: ${title}`}
          className="absolute inset-0 h-full w-full text-left"
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 720px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,20,30,0.05)_40%,rgba(2,20,30,0.65))]"
          />
          <span className="absolute left-1/2 top-1/2 grid h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-aqua text-[#04141b] shadow-[0_18px_50px_-10px_rgba(67,198,192,0.8)] transition-transform duration-300 group-hover:scale-110">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8.5 5.8v12.4c0 .9 1 1.5 1.8 1l9.6-6.2c.7-.5.7-1.5 0-2L10.3 4.8c-.8-.5-1.8.1-1.8 1Z" />
            </svg>
          </span>
          <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-5">
            <span className="font-display text-[16px] font-semibold text-white drop-shadow">{title}</span>
            <span className="text-[11px] text-white/60">{consent}</span>
          </span>
        </button>
      )}
    </figure>
  );
}
