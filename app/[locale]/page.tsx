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
import { LoopDiagram } from "@/components/water/loop-diagram";
import { WaveBand } from "@/components/water/wave-band";
import { getDict } from "@/lib/dict";
import { isLocale, localePath } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";
import { reviews } from "@/lib/reviews";
import { buyableProducts, coverage, products, site } from "@/lib/site";

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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const bateria = products.find((product) => product.comingSoon);

  return (
    <>
      {/* ---------------------------------------------------------------
          Hero. La foto va al fondo, arriba las causticas y las burbujas,
          y el texto siempre encima con contraste propio.
          --------------------------------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-deep-2 text-white">
        <Image
          src="/media/photos/ducha.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center] opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(104deg,rgba(1,32,45,0.94)_8%,rgba(0,103,129,0.72)_52%,rgba(0,136,168,0.35)_100%)]"
        />
        <div aria-hidden="true" className="caustics mix-blend-screen opacity-60" />
        <Bubbles />

        <div className="shell relative grid gap-10 pb-28 pt-20 md:pb-36 md:pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <Reveal>
            <p className="font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-aqua">
              {dict.hero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl text-[clamp(34px,5.8vw,68px)] text-white">
              {dict.hero.title}{" "}
              <span className="bg-[linear-gradient(96deg,#7fdcd6,#43c6c0_45%,#a8e4f0)] bg-clip-text text-transparent">
                {dict.hero.titleAccent}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[clamp(16px,1.9vw,19px)] leading-relaxed text-white/85">
              {dict.hero.body}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={localePath(locale, "/products")}
                className="btn bg-aqua text-[#04141b] hover:brightness-105"
              >
                {dict.hero.ctaPrimary}
              </Link>
              <a href="#como-funciona" className="btn border border-white/35 text-white hover:bg-white/10">
                {dict.hero.ctaSecondary}
              </a>
            </div>
            <p className="mt-5 text-[13px] text-white/70">{dict.hero.note}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mx-auto max-w-[420px]">
              <div
                aria-hidden="true"
                className="absolute inset-6 rounded-full bg-aqua/25 blur-3xl"
              />
              <Image
                src="/media/products/manual.webp"
                alt={dict.products.items["hydroloop-manual"].name}
                width={840}
                height={840}
                className="relative w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
                priority
              />
              <div className="relative -mt-4 flex items-center justify-center gap-2 text-[13px] text-white/75">
                <span className="h-px w-8 bg-white/30" />
                {site.claims.madeIn ? `Hecho en ${site.claims.madeIn}` : null}
                <span className="h-px w-8 bg-white/30" />
              </div>
            </div>
          </Reveal>
        </div>

        <WaveBand from="var(--bg)" to="transparent" height={110} className="relative" />
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

      {/* Como funciona, con el diagrama interactivo */}
      <section className="section" id="como-funciona">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Reveal>
              <p className="eyebrow">{dict.how.eyebrow}</p>
              <h2 className="mt-3 text-[clamp(28px,4.4vw,48px)]">{dict.how.title}</h2>
              <p className="lede mt-5">{dict.how.body}</p>
              <p className="mt-5 rounded-xl border border-line bg-mist px-4 py-3 text-[14px] text-ink-2">
                {dict.how.note}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <LoopDiagram dict={dict.how} />
            </Reveal>
          </div>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
            {dict.how.steps.map((step, index) => (
              <li key={step.title} className="bg-surface p-6">
                <Reveal delay={index * 60}>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-foam font-display text-[14px] font-bold text-deep dark:bg-[#0d3a45] dark:text-aqua">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-[18px]">{step.title}</h3>
                  <p className="mt-2 text-[14px] text-ink-2">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
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
