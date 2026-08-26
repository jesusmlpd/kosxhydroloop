import Image from "next/image";
import Link from "next/link";
import { QuickAdd } from "@/components/quick-add";
import { StockBadge } from "@/components/stock-badge";
import { formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";
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

  return (
    <article className="card card-hover flex h-full flex-col overflow-hidden">
      <Link href={href} className="relative block aspect-[4/3] w-full">
        <Image
          src={product.image}
          alt={copy.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2">
          <StockBadge stock={product.stock} dict={dict.urgency} />
        </div>
        <h3 className="mt-2 text-[20px]">
          <Link href={href} className="hover:underline">
            {copy.name}
          </Link>
        </h3>
        <p className="mt-1 flex-1 text-[15px] text-ink-2">{copy.tagline}</p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="font-display text-[18px] font-bold text-ink">
            {formatMoney(product.priceCents, locale, product.currency)}
            {product.compareAtCents ? (
              <span className="ml-2 text-[14px] font-medium text-ink-3 line-through">
                {formatMoney(product.compareAtCents, locale, product.currency)}
              </span>
            ) : null}
          </p>
          <QuickAdd product={product} dict={dict} />
        </div>
      </div>
    </article>
  );
}
