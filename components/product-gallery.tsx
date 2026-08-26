"use client";

import Image from "next/image";
import { useState } from "react";
import type { Dict } from "@/lib/dict";
import { fill } from "@/lib/i18n";

export function ProductGallery({
  images,
  alt,
  dict,
}: {
  images: string[];
  alt: string;
  dict: Dict["products"];
}) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const go = (next: number) => setIndex((next + total) % total);

  return (
    <div>
      <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-line bg-white">
        {images.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt={i === index ? alt : ""}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={i === 0}
            className={`object-contain transition-opacity duration-500 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={dict.galleryPrev}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/90 text-[#071b23] shadow-sm transition-opacity hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={dict.galleryNext}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/90 text-[#071b23] shadow-sm transition-opacity hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m10 6 6 6-6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-[#071b23]/70 px-2.5 py-1 font-display text-[12px] font-semibold tabular-nums text-white">
              {index + 1} / {total}
            </span>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <li key={src + i}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={fill(dict.galleryThumb, { n: i + 1 })}
                aria-current={i === index}
                className={`relative block h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white transition-colors ${
                  i === index ? "border-teal" : "border-line hover:border-line-strong"
                }`}
              >
                <Image src={src} alt="" fill sizes="64px" className="object-contain" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
