"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";
import { findProduct } from "@/lib/site";

const KEY = "hl-recently-viewed";

/** Registra la visita al producto actual y muestra los otros que ya viste. */
export function RecentlyViewed({
  current,
  locale,
  dict,
}: {
  current: string;
  locale: Locale;
  dict: Dict;
}) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const stored: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
        setSlugs(stored.filter((slug) => slug !== current && findProduct(slug)));
        const next = [current, ...stored.filter((slug) => slug !== current)].slice(0, 6);
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // storage bloqueado: la fila simplemente no aparece
      }
    });
    return () => cancelAnimationFrame(id);
  }, [current]);

  if (!slugs.length) return null;

  return (
    <section className="section pt-0">
      <div className="shell">
        <h2 className="eyebrow">{dict.recentlyViewed.title}</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {slugs.map((slug) => {
            const product = findProduct(slug)!;
            const copy = dict.products.items[slug as keyof Dict["products"]["items"]];
            return (
              <Link
                key={slug}
                href={localePath(locale, `/products/${slug}`)}
                className="card card-hover flex w-[210px] shrink-0 flex-col p-4"
              >
                <span className="relative block h-28 w-full">
                  <Image src={product.image} alt={copy.name} fill sizes="200px" className="object-contain" />
                </span>
                <span className="mt-3 font-display text-[14px] font-semibold leading-tight">
                  {copy.name}
                </span>
                <span className="mt-1 text-[13.5px] font-bold tabular-nums">
                  {product.buyable
                    ? formatMoney(product.priceCents, locale, product.currency)
                    : dict.products.comingSoon}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
