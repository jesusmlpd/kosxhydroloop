import Link from "next/link";
import { formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";
import { findProduct } from "@/lib/site";

/**
 * Selector de modelo estilo variante: Manual y WiFi lado a lado con precio,
 * el activo resaltado. Cambiar de modelo es un enlace, no un estado, asi que
 * cada variante conserva su URL, su SEO y su OG propia.
 */
export function VariantSwitcher({
  current,
  locale,
  dict,
}: {
  current: string;
  locale: Locale;
  dict: Dict;
}) {
  const variants = ["hydroloop-manual", "hydroloop-wifi"]
    .map((slug) => ({ slug, product: findProduct(slug) }))
    .filter((entry) => entry.product);

  if (!variants.some((entry) => entry.slug === current)) return null;

  return (
    <div className="mt-6">
      <p className="eyebrow">{dict.variants.title}</p>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {variants.map(({ slug, product }) => {
          const copy = dict.products.items[slug as keyof Dict["products"]["items"]];
          const active = slug === current;
          const short = copy.name.replace("Hydroloop® ", "");
          return (
            <Link
              key={slug}
              href={localePath(locale, `/products/${slug}`)}
              aria-current={active ? "true" : undefined}
              className={`rounded-2xl border-2 p-3.5 transition-colors ${
                active
                  ? "border-teal bg-foam/50 dark:bg-[#0d3a45]"
                  : "border-line hover:border-line-strong"
              }`}
            >
              <span className="block font-display text-[15px] font-bold">{short}</span>
              <span className="mt-0.5 block text-[13.5px] tabular-nums text-ink-2">
                {formatMoney(product!.priceCents, locale, product!.currency)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
