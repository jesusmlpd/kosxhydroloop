import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { OfferCountdown } from "@/components/offer-countdown";
import { Reveal } from "@/components/reveal";
import { StockBadge } from "@/components/stock-badge";
import { getDict, type Dict } from "@/lib/dict";
import { isLocale, locales, localePath } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";
import { graph, productSchema } from "@/lib/schema";
import { formatMoney } from "@/lib/commerce";
import { findProduct, products, site } from "@/lib/site";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    products.map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = findProduct(slug);
  if (!product) return {};
  const dict = getDict(locale);
  const copy = dict.products.items[slug as keyof Dict["products"]["items"]];

  return pageMeta({
    locale,
    path: `/products/${slug}`,
    title: `${copy.name} | ${site.name}`,
    description: copy.body,
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = findProduct(slug);
  if (!product) notFound();
  const dict = getDict(locale);
  const copy = dict.products.items[slug as keyof Dict["products"]["items"]];

  return (
    <article className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph([
              productSchema({
                name: copy.name,
                description: copy.body,
                sku: product.id,
                priceCents: product.priceCents,
                currency: product.currency,
                available: product.stock > 0,
                url: `${site.url}/${locale}/products/${slug}`,
              }),
            ]),
          ),
        }}
      />
      <div className="shell">
        <Link
          href={localePath(locale, "/products")}
          className="text-[14px] font-medium text-ink-3 transition-colors hover:text-ink"
        >
          {dict.products.backToProducts}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line">
              <Image
                src={product.image}
                alt={copy.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>

          <Reveal delay={80}>
            <StockBadge stock={product.stock} dict={dict.urgency} />
            <h1 className="mt-2 text-[clamp(30px,4.4vw,48px)]">{copy.name}</h1>
            <p className="mt-2 text-[17px] text-ink-2">{copy.tagline}</p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <p className="font-display text-[28px] font-bold">
                {formatMoney(product.priceCents, locale, product.currency)}
              </p>
              {product.compareAtCents ? (
                <p className="text-[17px] text-ink-3 line-through">
                  {formatMoney(product.compareAtCents, locale, product.currency)}
                </p>
              ) : null}
            </div>
            <div className="mt-2">
              <OfferCountdown dict={dict.urgency} variant="inline" />
            </div>

            <p className="mt-5 text-[16px] text-ink-2">{copy.body}</p>

            <div className="mt-8">
              {product.stock > 0 ? (
                <AddToCart
                  product={product}
                  dict={dict}
                  checkoutHref={localePath(locale, "/checkout")}
                />
              ) : (
                <Link href={localePath(locale, "/contact")} className="btn btn-primary">
                  {dict.products.quote}
                </Link>
              )}
            </div>

            <div className="mt-10">
              <h2 className="eyebrow">{dict.products.specsTitle}</h2>
              <dl className="mt-3 divide-y divide-line border-y border-line">
                {copy.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-6 py-3 text-[15px]">
                    <dt className="text-ink-3">{spec.label}</dt>
                    <dd className="text-right font-medium text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8">
              <h2 className="eyebrow">{dict.products.includesTitle}</h2>
              <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
                {copy.includes.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
