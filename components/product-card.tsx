import Image from "next/image";
import Link from "next/link";
import { QuickAdd } from "@/components/quick-add";
import { Stars } from "@/components/stars";
import { StockBadge } from "@/components/stock-badge";
import { formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { fill, localePath, type Locale } from "@/lib/i18n";
import { reviewsFor, summarize } from "@/lib/reviews";
import type { Product } from "@/lib/site";

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dict;
}) {
  const copy = dict.products.items[product.slug as keyof Dict["products"]["items"]];
  const href = localePath(locale, `/products/${product.slug}`);
  const summary = summarize(reviewsFor(product.id));

  return (
    <article className="card card-hover flex h-full flex-col overflow-hidden">
      <Link href={href} className="relative block aspect-[4/3] w-full bg-white">
        <Image
          src={product.image}
          alt={copy.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain p-5 transition-transform duration-500 hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          {product.comingSoon ? (
            <span className="inline-flex items-center rounded-full bg-mist px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">
              {dict.products.comingSoon}
            </span>
          ) : (
            <StockBadge stock={product.stock} dict={dict.urgency} />
          )}
          {product.accessory ? (
            <span className="inline-flex items-center rounded-full bg-foam px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-deep dark:bg-[#0d3a45] dark:text-aqua">
              {dict.products.accessory}
            </span>
          ) : null}
        </div>

        <h3 className="mt-2 text-[20px]">
          <Link href={href} className="hover:underline">
            {copy.name}
          </Link>
        </h3>
        <p className="mt-1 text-[15px] text-ink-2">{copy.tagline}</p>

        {summary.count ? (
          <div className="mt-3 flex items-center gap-2">
            <Stars rating={summary.average} size={14} />
            <span className="text-[12px] text-ink-3">
              {fill(dict.reviews.basedOn, { n: summary.count })}
            </span>
          </div>
        ) : null}

        <div className="mt-auto pt-5">
          {product.comingSoon ? (
            <Link href={href} className="btn btn-ghost w-full">
              {dict.products.cta}
            </Link>
          ) : (
            <div className="flex items-end justify-between gap-3">
              <p className="font-display text-[19px] font-bold leading-tight text-ink">
                {formatMoney(product.priceCents, locale, product.currency)}
                {product.compareAtCents ? (
                  <span className="ml-2 text-[14px] font-medium text-ink-3 line-through">
                    {formatMoney(product.compareAtCents, locale, product.currency)}
                  </span>
                ) : null}
                <span className="mt-0.5 block text-[11px] font-medium text-ink-3">
                  {dict.products.ivaIncluded}
                </span>
              </p>
              <QuickAdd product={product} dict={dict} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
