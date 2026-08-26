"use client";

import Image from "next/image";
import { cart } from "@/lib/cart";
import { formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import type { Locale } from "@/lib/i18n";
import { findProduct } from "@/lib/site";

/** Paquetes de un clic: equipo + kit, directo al carrito. */
export function BundleCards({ locale, dict }: { locale: Locale; dict: Dict }) {
  const kit = findProduct("kit-caja-de-instalacion");
  const bundles = ["hydroloop-manual", "hydroloop-wifi"]
    .map((slug) => findProduct(slug))
    .filter((product) => product && product.stock > 0 && kit && kit.stock > 0)
    .map((product) => ({
      product: product!,
      totalCents: product!.priceCents + (kit?.priceCents ?? 0),
    }));

  if (!bundles.length || !kit) return null;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {bundles.map(({ product, totalCents }) => {
        const copy = dict.products.items[product.slug as keyof Dict["products"]["items"]];
        const kitCopy = dict.products.items["kit-caja-de-instalacion"];
        return (
          <article key={product.id} className="card flex items-center gap-5 p-6">
            <div className="relative flex h-24 w-28 shrink-0 items-end">
              <span className="relative block h-24 w-20">
                <Image src={product.image} alt={copy.name} fill sizes="80px" className="object-contain" />
              </span>
              <span className="absolute -right-1 bottom-0 block h-12 w-12 rounded-xl border border-line bg-white p-1">
                <span className="relative block h-full w-full">
                  <Image src={kit.image} alt={kitCopy.name} fill sizes="48px" className="object-contain" />
                </span>
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-[17px] font-bold leading-tight">
                {copy.name} + Kit
              </h3>
              <p className="mt-1 text-[13px] text-ink-2">
                {dict.bundles.includes}: {copy.name}, {kitCopy.name}
              </p>
              <p className="mt-2 font-display text-[19px] font-bold tabular-nums">
                {formatMoney(totalCents, locale)}
                <span className="ml-1.5 text-[12px] font-medium text-ink-3">
                  {dict.products.ivaIncluded}
                </span>
              </p>
              <button
                type="button"
                onClick={() => {
                  cart.add(product.id, 1, { open: false });
                  cart.add(kit.id, 1, { open: false });
                  cart.open();
                }}
                className="btn btn-primary mt-3 px-5 py-2.5 text-[14px]"
                style={{ minHeight: 42 }}
              >
                {dict.bundles.add}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
