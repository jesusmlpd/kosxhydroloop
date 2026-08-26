import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { FaqList } from "@/components/faq-list";
import { OfferCountdown } from "@/components/offer-countdown";
import { PaymentBadges } from "@/components/payment-badges";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { Reveal } from "@/components/reveal";
import { ReviewsBlock } from "@/components/reviews-block";
import { SavingsCalculator } from "@/components/savings-calculator";
import { Stars } from "@/components/stars";
import { StickyBuyBar } from "@/components/sticky-buy-bar";
import { StockBadge } from "@/components/stock-badge";
import { VideoEmbed } from "@/components/video-embed";
import { commerce, formatMoney } from "@/lib/commerce";
import { getDict, type Dict } from "@/lib/dict";
import { fill, isLocale, locales, localePath } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";
import { breadcrumbSchema, graph, productSchema } from "@/lib/schema";
import { reviewsAreReal, reviewsFor, summarize } from "@/lib/reviews";
import { findProduct, products, site } from "@/lib/site";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((product) => ({ locale, slug: product.slug })));
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
    title: copy.name,
    description: copy.body.slice(0, 180),
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = findProduct(slug);
  if (!product) notFound();

  const dict = getDict(locale);
  const copy = dict.products.items[slug as keyof Dict["products"]["items"]];
  const productReviews = reviewsFor(product.id);
  const summary = summarize(productReviews);
  const related = products.filter((item) => item.id !== product.id && item.buyable).slice(0, 3);
  const freeShipping = formatMoney(commerce.shipping.freeFromCents, locale);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph([
              breadcrumbSchema([
                { name: site.name, url: `${site.url}/${locale}` },
                { name: dict.products.eyebrow, url: `${site.url}/${locale}/products` },
                { name: copy.name, url: `${site.url}/${locale}/products/${slug}` },
              ]),
              productSchema({
                name: copy.name,
                description: copy.body,
                sku: product.sku,
                priceCents: product.priceCents,
                currency: product.currency,
                available: product.stock > 0 && product.buyable,
                url: `${site.url}/${locale}/products/${slug}`,
                image: `${site.url}${product.image}`,
                // Sin resenas reales no se emite calificacion agregada: no se
                // le manda a Google una estrella que nadie dejo.
                rating:
                  reviewsAreReal && summary.count
                    ? { value: summary.average, count: summary.count }
                    : null,
              }),
            ]),
          ),
        }}
      />

      {/* Compra */}
      <section className="section pb-0">
        <div className="shell">
          <nav aria-label="breadcrumb" className="text-[13px] text-ink-3">
            <Link href={localePath(locale, "/products")} className="transition-colors hover:text-ink">
              {dict.products.backToProducts}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-2">{copy.name}</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
            <Reveal>
              <ProductGallery images={product.gallery} alt={copy.name} dict={dict.products} />
            </Reveal>

            <Reveal delay={80}>
              <div className="lg:sticky lg:top-[92px]">
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
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-0.5 pl-1 pr-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-2">
                    <Image
                      src="/media/brand/hecho-en-mexico.png"
                      alt=""
                      width={110}
                      height={110}
                      className="h-6 w-6 object-contain"
                    />
                    {dict.products.madeInMx}
                  </span>
                </div>

                <h1 className="mt-3 text-[clamp(28px,4.2vw,44px)]">{copy.name}</h1>
                <p className="mt-2 text-[17px] text-ink-2">{copy.tagline}</p>

                {productReviews.length ? (
                  <a href="#opiniones" className="mt-4 flex items-center gap-2 text-[13px] text-ink-2">
                    <Stars rating={summary.average} size={15} />
                    <span className="font-semibold">{summary.average.toFixed(1)}</span>
                    <span className="text-ink-3">
                      {fill(dict.reviews.basedOn, { n: summary.count })}
                    </span>
                  </a>
                ) : null}

                {!product.comingSoon ? (
                  <>
                    <div className="mt-6 flex flex-wrap items-baseline gap-3">
                      <p className="font-display text-[34px] font-bold leading-none">
                        {formatMoney(product.priceCents, locale, product.currency)}
                      </p>
                      {product.compareAtCents ? (
                        <p className="text-[17px] text-ink-3 line-through">
                          {formatMoney(product.compareAtCents, locale, product.currency)}
                        </p>
                      ) : null}
                      <span className="text-[13px] text-ink-3">{dict.products.ivaIncluded}</span>
                    </div>

                    <div className="mt-2">
                      <OfferCountdown dict={dict.urgency} variant="inline" />
                    </div>

                    <p className="mt-5 text-[16px] text-ink-2">{copy.body}</p>

                    <div className="mt-7" id="buy-anchor">
                      <AddToCart
                        product={product}
                        dict={dict}
                        checkoutHref={localePath(locale, "/checkout")}
                      />
                      {productReviews.length ? (
                        <a
                          href="#opiniones"
                          className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-teal hover:underline"
                        >
                          <Stars rating={summary.average} size={14} />
                          {fill(dict.products.readReviews, { n: summary.count })}
                        </a>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-6 text-[16px] text-ink-2">{copy.body}</p>
                    <Link href={localePath(locale, "/contact")} className="btn btn-primary mt-7">
                      {dict.products.notifyTitle}
                    </Link>
                  </>
                )}

                {/* Confianza pegada al boton, que es donde se decide la compra */}
                <ul className="mt-7 grid gap-2.5 border-t border-line pt-6 text-[14px] text-ink-2">
                  <li className="flex gap-2.5">
                    <Check />
                    {dict.trust.badges[1].title}: {dict.trust.badges[1].body}
                  </li>
                  <li className="flex gap-2.5">
                    <Check />
                    {locale === "en"
                      ? `Free shipping on orders over ${freeShipping}.`
                      : `Envío gratis en pedidos desde ${freeShipping}.`}
                  </li>
                  <li className="flex gap-2.5">
                    <Check />
                    {dict.trust.badges[3].body}
                  </li>
                </ul>

                <div className="mt-6 rounded-2xl border border-line bg-mist p-5">
                  <h2 className="eyebrow">{dict.trust.paymentsTitle}</h2>
                  <PaymentBadges className="mt-3" />
                </div>

                <p className="mt-4 text-[12px] text-ink-3">
                  {dict.products.sku}: {product.sku}
                  {product.weightKg ? ` · ${product.weightKg} kg` : null}
                  {product.dimensions ? ` · ${product.dimensions}` : null}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Incluye, ideal y ficha */}
      <section className="section">
        <div className="shell grid gap-8 lg:grid-cols-3">
          <Reveal>
            <div className="card h-full p-7">
              <h2 className="eyebrow">{dict.products.includesTitle}</h2>
              <ul className="mt-4 space-y-2.5 text-[15px] text-ink-2">
                {copy.includes.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <div className="card h-full p-7">
              <h2 className="eyebrow">{dict.products.specsTitle}</h2>
              <dl className="mt-4 divide-y divide-line">
                {copy.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-6 py-2.5 text-[14px]">
                    <dt className="text-ink-3">{spec.label}</dt>
                    <dd className="text-right font-medium text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="card h-full overflow-hidden">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/media/diagrams/funcionamiento.webp"
                  alt={dict.how.diagramAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-7">
                <h2 className="eyebrow">{dict.products.idealTitle}</h2>
                <p className="mt-3 text-[16px] text-ink-2">{copy.ideal}</p>
                <p className="mt-4 text-[14px] text-ink-3">{dict.how.note}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tutorial oficial de instalacion */}
      {!product.accessory && !product.comingSoon ? (
        <section className="section pt-0">
          <div className="shell grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <Reveal>
              <VideoEmbed
                videoId="QsvtjfhKRAs"
                thumbnail="/media/video/instalacion.webp"
                title={dict.video.install.title}
                playLabel={dict.video.install.cta}
                consent={dict.video.consent}
              />
            </Reveal>
            <Reveal delay={80}>
              <p className="eyebrow">{dict.coverage.eyebrow}</p>
              <h2 className="mt-3 text-[clamp(24px,3.4vw,38px)]">{dict.video.install.title}</h2>
              <p className="lede mt-4">{dict.video.install.body}</p>
              <p className="mt-5 text-[14px] text-ink-2">{dict.trust.badges[3].body}</p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Calculadora en el PDP: el argumento de compra en numeros */}
      {!product.accessory ? (
        <section className="section bg-mist">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">{dict.savings.eyebrow}</p>
              <h2 className="mt-3 max-w-2xl text-[clamp(26px,3.8vw,42px)]">{dict.savings.title}</h2>
              <p className="lede mt-4 max-w-2xl">{dict.savings.body}</p>
            </Reveal>
            <div className="mt-9">
              <SavingsCalculator locale={locale} dict={dict} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Opiniones */}
      {productReviews.length ? (
        <section className="section" id="opiniones">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">{dict.reviews.eyebrow}</p>
              <h2 className="mt-3 max-w-2xl text-[clamp(26px,3.8vw,42px)]">{dict.reviews.title}</h2>
            </Reveal>
            <div className="mt-9">
              <ReviewsBlock reviews={productReviews} locale={locale} dict={dict} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Preguntas */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{dict.faq.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(26px,3.8vw,42px)]">{dict.faq.title}</h2>
          </Reveal>
          <div className="mt-8">
            <FaqList items={dict.faq.items} />
          </div>
        </div>
      </section>

      {/* Relacionados */}
      {related.length ? (
        <section className="section">
          <div className="shell">
            <h2 className="text-[clamp(22px,3vw,32px)]">{dict.products.all}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 70}>
                  <ProductCard product={item} locale={locale} dict={dict} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <StickyBuyBar product={product} name={copy.name} locale={locale} dict={dict} />
      {/* Colchon para que la barra fija no tape el final de la pagina en movil */}
      <div aria-hidden="true" className="h-20 md:hidden" />
    </article>
  );
}

function Check() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-teal"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
