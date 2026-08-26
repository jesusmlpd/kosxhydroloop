import Image from "next/image";
import Link from "next/link";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";
import { formatPrice, type Product } from "@/lib/site";

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

  return (
    <Link
      href={localePath(locale, `/products/${product.slug}`)}
      className="card card-hover flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={product.image}
          alt={copy.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3">
          {product.available ? dict.products.available : dict.products.soldOut}
        </span>
        <h3 className="mt-2 text-[20px]">{copy.name}</h3>
        <p className="mt-1 flex-1 text-[15px] text-ink-2">{copy.tagline}</p>
        <p className="mt-4 font-display text-[17px] font-bold text-ink">
          <span className="mr-1 text-[13px] font-medium text-ink-3">{dict.products.price}</span>
          {formatPrice(product, locale)}
        </p>
      </div>
    </Link>
  );
}
