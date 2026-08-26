import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Counter } from "@/components/counter";
import { FaqList } from "@/components/faq-list";
import { Marquee } from "@/components/marquee";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { ReviewsBlock } from "@/components/reviews-block";
import { SavingsCalculator } from "@/components/savings-calculator";
import { TrustBadges } from "@/components/trust-badges";
import { Bubbles } from "@/components/water/bubbles";
import { HowDiagram } from "@/components/water/how-diagram";
import { WaveBand } from "@/components/water/wave-band";
import { getDict } from "@/lib/dict";
import { isLocale, localePath } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";
import { faqSchema, graph } from "@/lib/schema";
import { reviews } from "@/lib/reviews";
import { buyableProducts, coverage, products } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  return pageMeta({ locale, path: "/", ...dict.meta.home });
}

function Droplet() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-aqua">
      <path d="M12 3c4.2 4.4 6.5 7.6 6.5 10.4a6.5 6.5 0 1 1-13 0C5.5 10.6 7.8 7.4 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function Bolt() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-aqua">
      <path d="M13 2.5 5 13.5h5.4L10.6 21.5l8-11h-5.4L13 2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function Coin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5v9M9.4 9.8c0-1 1.1-1.7 2.6-1.7s2.6.7 2.6 1.7c0 2.6-5.2 1.7-5.2 4.3 0 1 1.1 1.8 2.6 1.8s2.6-.8 2.6-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const bateria = products.find((product) => product.comingSoon);

  return (
    <>
      {/* FAQ estructurado: mismo contenido visible abajo, legible para
          buscadores y para los modelos que responden preguntas. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph([faqSchema(dict.faq.items)])) }}
      />
      {/* ---------------------------------------------------------------
          Hero. Fondo de agua profunda con causticas y burbujas, y la foto
          real del producto cayendo al agua (de la libreria del cliente)
          como pieza central, con los claims publicados por Hydroloop.
          --------------------------------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-deep-2 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_10%,rgba(0,136,168,0.55)_0%,rgba(1,42,58,0.9)_48%,rgba(1,26,37,1)_100%)]"
        />
        <div aria-hidden="true" className="caustics mix-blend-screen opacity-55" />
        <Bubbles />

        <div className="shell relative grid gap-12 pb-24 pt-16 md:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-aqua backdrop-blur-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5c5 5.2 7.8 9 7.8 12.4a7.8 7.8 0 1 1-15.6 0C4.2 11.5 7 7.7 12 2.5Z" />
              </svg>
              {dict.hero.eyebrow}
            </p>
            <h1 className="mt-6 max-w-2xl text-[clamp(34px,5.4vw,62px)] text-white">
              {dict.hero.title}{" "}
              <span className="bg-[linear-gradient(96deg,#8fe3dd,#43c6c0_45%,#9fd9ea)] bg-clip-text text-transparent">
                {dict.hero.titleAccent}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[clamp(16px,1.9vw,19px)] leading-relaxed text-white/85">
              {dict.hero.body}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={localePath(locale, "/products")}
                className="btn bg-aqua text-[#04141b] shadow-[0_12px_40px_-10px_rgba(67,198,192,0.7)] hover:brightness-105"
              >
                {dict.hero.ctaPrimary}
              </Link>
              <a href="#como-funciona" className="btn border border-white/30 text-white hover:bg-white/10">
                {dict.hero.ctaSecondary}
              </a>
            </div>
            <p className="mt-5 text-[13px] text-white/65">{dict.hero.note}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-[440px]">
              <div aria-hidden="true" className="absolute -inset-8 rounded-[48px] bg-aqua/15 blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/15 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)]">
                <Image
                  src="/media/photos/splash.webp"
                  alt={dict.products.items["hydroloop-manual"].name}
                  width={870}
                  height={1072}
                  priority
                  sizes="(max-width: 1024px) 90vw, 440px"
                  className="w-full"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(1,26,37,0.55))]"
                />
              </div>
              {/* Claims publicados por Hydroloop, flotando sobre la foto */}
              <div className="absolute -left-3 top-6 hidden sm:block md:-left-8">
                <span className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-[#0b2836]/85 px-4 py-2.5 text-[13px] font-medium shadow-lg backdrop-blur-md">
                  <Droplet /> {dict.hero.chips[0]}
                </span>
              </div>
              <div className="absolute -right-2 top-[70%] hidden sm:block md:-right-9">
                <span className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-[#0b2836]/85 px-4 py-2.5 text-[13px] font-medium shadow-lg backdrop-blur-md">
                  <Bolt /> {dict.hero.chips[1]}
                </span>
              </div>
              <div className="absolute -bottom-4 left-1/2 w-max -translate-x-1/2">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-aqua px-4 py-2.5 text-[13px] font-semibold text-[#04141b] shadow-lg">
                  <Coin /> {dict.hero.chips[2]}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <WaveBand from="var(--bg)" to="transparent" height={100} className="relative" />
      </section>

      <Marquee items={dict.ticker} />

      {/* Numeros con contador */}
      <section className="section pb-0">
        <div className="shell grid gap-8 md:grid-cols-4">
          {dict.stats.map((stat, index) => {
            const numeric = Number(stat.value.replace(/[^\d.]/g, ""));
            const suffix = stat.value.replace(/[\d.,]/g, "").trim();
            return (
              <Reveal key={stat.label} delay={index * 70}>
                <p className="font-display text-[clamp(30px,4.4vw,46px)] font-bold leading-none text-ink">
                  {Number.isFinite(numeric) && numeric > 0 ? (
                    <>
                      <Counter value={numeric} locale={locale} />
                      <span className="ml-1 text-[0.6em] text-ink-2">{suffix}</span>
                    </>
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="mt-2 max-w-[22ch] text-[14px] text-ink-2">{stat.label}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* El problema */}
      <section className="section bg-mist pt-0">
        <WaveBand from="var(--bg)" to="var(--bg-2)" height={80} />
        <div className="shell pt-14">
          <Reveal>
            <p className="eyebrow">{dict.problem.eyebrow}</p>
            <h2 className="mt-3 max-w-3xl text-[clamp(28px,4.4vw,48px)]">{dict.problem.title}</h2>
            <p className="lede mt-5 max-w-2xl">{dict.problem.body}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {dict.problem.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <article className="card h-full p-7">
                  <span className="font-display text-[13px] font-semibold text-ink-3">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-[20px]">{item.title}</h3>
                  <p className="mt-2 text-[15px] text-ink-2">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona: replica animada del diagrama oficial */}
      <section className="section" id="como-funciona">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{dict.how.eyebrow}</p>
            <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
              <h2 className="text-[clamp(28px,4.4vw,48px)]">{dict.how.title}</h2>
              <p className="text-[15.5px] leading-relaxed text-ink-2">{dict.how.body}</p>
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-10">
            <HowDiagram dict={dict.how} />
          </Reveal>

          <Reveal delay={60}>
            <p className="mt-6 inline-flex items-start gap-2.5 rounded-xl border border-line bg-mist px-4 py-3 text-[14px] text-ink-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-teal">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 8v.5M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {dict.how.note}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Modelos */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{dict.models.eyebrow}</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-2xl text-[clamp(28px,4.4vw,48px)]">{dict.models.title}</h2>
              <Link href={localePath(locale, "/products")} className="btn btn-ghost">
                {dict.products.all}
              </Link>
            </div>
            <p className="lede mt-5 max-w-2xl">{dict.models.body}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {buyableProducts
              .filter((product) => !product.accessory)
              .map((product, index) => (
                <Reveal key={product.id} delay={index * 80}>
                  <ProductCard product={product} locale={locale} dict={dict} />
                </Reveal>
              ))}

            {bateria ? (
              <Reveal delay={160}>
                <article className="card flex h-full flex-col overflow-hidden opacity-90">
                  <div className="relative aspect-[4/3] w-full bg-white">
                    <Image
                      src={bateria.image}
                      alt={dict.products.items["hydroloop-bateria"].name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-6"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="inline-flex w-fit items-center rounded-full bg-mist px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      {dict.models.soonBadge}
                    </span>
                    <h3 className="mt-2 text-[20px]">
                      {dict.products.items["hydroloop-bateria"].name}
                    </h3>
                    <p className="mt-1 flex-1 text-[15px] text-ink-2">
                      {dict.products.items["hydroloop-bateria"].tagline}
                    </p>
                    <Link
                      href={localePath(locale, "/products/hydroloop-bateria")}
                      className="btn btn-ghost mt-4"
                    >
                      {dict.products.cta}
                    </Link>
                  </div>
                </article>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {/* Calculadora */}
      <section className="section relative overflow-hidden">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{dict.savings.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(28px,4.4vw,48px)]">{dict.savings.title}</h2>
            <p className="lede mt-5 max-w-2xl">{dict.savings.body}</p>
          </Reveal>
          <div className="mt-10">
            <SavingsCalculator locale={locale} dict={dict} />
          </div>
        </div>
      </section>

      {/* Opiniones */}
      <section className="section bg-mist pt-0">
        <WaveBand from="var(--bg)" to="var(--bg-2)" height={80} />
        <div className="shell pt-14">
          <Reveal>
            <p className="eyebrow">{dict.reviews.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(28px,4.4vw,48px)]">{dict.reviews.title}</h2>
          </Reveal>
          <div className="mt-10">
            <ReviewsBlock reviews={reviews} locale={locale} dict={dict} compact />
          </div>
        </div>
      </section>

      <TrustBadges dict={dict} />

      {/* Cobertura */}
      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">{dict.coverage.eyebrow}</p>
            <h2 className="mt-3 text-[clamp(26px,3.8vw,42px)]">{dict.coverage.title}</h2>
            <p className="lede mt-5">{dict.coverage.body}</p>
            <Link href={localePath(locale, "/contact")} className="btn btn-primary mt-7">
              {dict.coverage.cta}
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid gap-4 sm:grid-cols-2">
              {coverage.map((zone) => (
                <div key={zone.zone} className="card p-6">
                  <h3 className="eyebrow">
                    {dict.coverage.zones[zone.zone as keyof typeof dict.coverage.zones]}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-[14px] text-ink-2">
                    {zone.cities.map((city) => (
                      <li key={city} className="flex gap-2">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua" />
                        {city}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Preguntas */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{dict.faq.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(28px,4.2vw,44px)]">{dict.faq.title}</h2>
          </Reveal>
          <div className="mt-8">
            <FaqList items={dict.faq.items} />
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="relative overflow-hidden bg-deep-2 py-20 text-white">
        <div aria-hidden="true" className="caustics opacity-50 mix-blend-screen" />
        <Bubbles />
        <div className="shell relative text-center">
          <h2 className="mx-auto max-w-3xl text-[clamp(28px,4.6vw,52px)] text-white">
            {dict.blog.ctaBody}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={localePath(locale, "/products")}
              className="btn bg-aqua text-[#04141b] hover:brightness-105"
            >
              {dict.hero.ctaPrimary}
            </Link>
            <Link
              href={localePath(locale, "/blog")}
              className="btn border border-white/35 text-white hover:bg-white/10"
            >
              {dict.nav.blog}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
