import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Counter } from "@/components/counter";
import { FaqList } from "@/components/faq-list";
import { Marquee } from "@/components/marquee";
import { ModelQuiz } from "@/components/model-quiz";
import { ProductCard } from "@/components/product-card";
import { PuraAgua } from "@/components/pura-agua";
import { Reveal } from "@/components/reveal";
import { ReviewsBlock } from "@/components/reviews-block";
import { Stars } from "@/components/stars";
import { VideoEmbed } from "@/components/video-embed";
import { SavingsCalculator } from "@/components/savings-calculator";
import { TrustBadges } from "@/components/trust-badges";
import { Bubbles } from "@/components/water/bubbles";
import { HowDiagram } from "@/components/water/how-diagram";
import { WaveBand } from "@/components/water/wave-band";
import { getDict } from "@/lib/dict";
import { fill, isLocale, localePath } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";
import { faqSchema, graph } from "@/lib/schema";
import { reviews, summarize } from "@/lib/reviews";
import { formatMoney } from "@/lib/commerce";
import { buyableProducts, coverage, products } from "@/lib/site";
import { loadStoreSettings } from "@/lib/store-settings-server";

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
  await loadStoreSettings();
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const bateria = products.find((product) => product.comingSoon);
  const manual = products.find((product) => product.slug === "hydroloop-manual");
  const proof = summarize(reviews);

  return (
    <>
      {/* FAQ estructurado: mismo contenido visible abajo, legible para
          buscadores y para los modelos que responden preguntas. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph([
              faqSchema(dict.faq.items),
              {
                "@type": "WebPage",
                "@id": `https://kosxhydroloop.vercel.app/${locale}#webpage`,
                speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "main p"] },
              },
            ]),
          ),
        }}
      />
      {/* ---------------------------------------------------------------
          Hero. La foto real del equipo cayendo al agua, a sangre completa:
          producto a la izquierda, copy a la derecha sobre agua oscurecida.
          En movil el copy va sobre gradiente y la foto cierra abajo.
          --------------------------------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-deep-2 text-white">
        {/* La foto va en un lienzo 12% mas ancho corrido a la izquierda: el
            producto se recorre y queda mas aire de agua antes del texto. */}
        <div aria-hidden="true" className="absolute inset-y-0 left-[-12%] hidden w-[112%] md:block">
          <Image
            src="/media/photos/hero-bg.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-left"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(1,26,37,0.06)_0%,rgba(1,26,37,0.16)_38%,rgba(1,30,42,0.87)_58%,rgba(1,32,45,0.96)_100%)] md:block"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(130%_100%_at_20%_0%,rgba(0,136,168,0.5)_0%,rgba(1,42,58,0.92)_55%,rgba(1,26,37,1)_100%)] md:hidden"
        />
        <div aria-hidden="true" className="caustics mix-blend-screen opacity-40" />
        <Bubbles />

        <div className="shell relative grid min-h-[560px] items-center gap-10 py-16 md:min-h-[640px] md:grid-cols-[0.85fr_1.15fr] md:py-20">
          <div aria-hidden="true" className="hidden md:block" />
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-aqua backdrop-blur-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5c5 5.2 7.8 9 7.8 12.4a7.8 7.8 0 1 1-15.6 0C4.2 11.5 7 7.7 12 2.5Z" />
              </svg>
              {dict.hero.eyebrow}
            </p>
            <h1 className="mt-6 text-[clamp(36px,5.6vw,64px)] text-white">
              {dict.hero.title}{" "}
              <span className="bg-[linear-gradient(96deg,#8fe3dd,#43c6c0_45%,#9fd9ea)] bg-clip-text text-transparent">
                {dict.hero.titleAccent}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-[clamp(16px,1.9vw,19px)] leading-relaxed text-white/85">
              {dict.hero.body}
            </p>

            <ul className="mt-6 space-y-2.5">
              {dict.hero.chips.map((chip) => (
                <li key={chip} className="flex items-center gap-2.5 text-[15px] text-white/90">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-aqua/20 text-aqua">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {chip}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={localePath(locale, "/products")}
                className="btn w-full bg-aqua text-[#04141b] shadow-[0_14px_44px_-10px_rgba(67,198,192,0.75)] hover:brightness-105 sm:w-auto"
              >
                {dict.hero.ctaPrimary}{" "}
                {manual ? formatMoney(manual.priceCents, locale, manual.currency) : null}
              </Link>
              <a
                href="#como-funciona"
                className="btn w-full border border-white/30 text-white hover:bg-white/10 sm:w-auto"
              >
                {dict.hero.ctaSecondary}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <Stars rating={proof.average} size={15} />
              <span className="text-[13.5px] font-medium text-white/85">
                {fill(dict.hero.proof, {
                  rating: proof.average.toLocaleString(locale === "en" ? "en-US" : "es-MX", {
                    minimumFractionDigits: 1,
                  }),
                  n: proof.count,
                })}
              </span>
              <span aria-hidden="true" className="h-4 w-px bg-white/25" />
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 py-1 pl-1 pr-3">
                <Image
                  src="/media/brand/hecho-en-mexico.png"
                  alt=""
                  width={110}
                  height={110}
                  className="h-7 w-7 rounded-full object-contain"
                />
                <span className="font-display text-[12px] font-bold uppercase tracking-[0.08em] text-[#0b2836]">
                  {dict.products.madeInMx}
                </span>
              </span>
            </div>
            <p className="mt-4 text-[12.5px] text-white/55">{dict.hero.note}</p>
          </Reveal>
        </div>

        {/* En movil la foto entra completa abajo, sin recortes raros */}
        <div className="relative -mt-2 md:hidden">
          <Image
            src="/media/photos/splash.webp"
            alt=""
            width={870}
            height={1072}
            sizes="100vw"
            className="h-64 w-full object-cover object-[center_38%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,32,45,0.85),transparent_45%)]" />
        </div>

        <WaveBand from="var(--bg)" to="transparent" height={90} className="relative" />
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

      {/* Video oficial */}
      <section className="section bg-mist pt-0">
        <WaveBand from="var(--bg)" to="var(--bg-2)" height={80} />
        <div className="shell grid gap-10 pt-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">Video</p>
            <h2 className="mt-3 text-[clamp(26px,3.8vw,42px)]">{dict.video.how.title}</h2>
            <p className="lede mt-4">{dict.video.how.body}</p>
            <Link href={localePath(locale, "/products")} className="btn btn-primary mt-7">
              {dict.hero.ctaPrimary}{" "}
              {manual ? formatMoney(manual.priceCents, locale, manual.currency) : null}
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <VideoEmbed
              videoId="V_5UqiCPm4Y"
              thumbnail="/media/video/como-funciona.webp"
              title={dict.video.how.title}
              playLabel={dict.video.how.cta}
              consent={dict.video.consent}
            />
          </Reveal>
        </div>
      </section>

      {/* Modelos */}
      <section className="section">
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

      {/* Recomendador: la respuesta a "cual me toca" en 30 segundos */}
      <section className="section bg-mist pt-0">
        <WaveBand from="var(--bg)" to="var(--bg-2)" height={80} />
        <div className="shell pt-14">
          <Reveal className="text-center">
            <p className="eyebrow">{dict.quiz.eyebrow}</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-[clamp(26px,3.8vw,42px)]">
              {dict.quiz.title}
            </h2>
            <p className="lede mx-auto mt-4 max-w-xl">{dict.quiz.body}</p>
          </Reveal>
          <Reveal delay={80} className="mt-9">
            <ModelQuiz locale={locale} dict={dict} />
          </Reveal>
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
      <section className="section bg-mist">
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

      {/* Newsletter PURA AGUA */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <PuraAgua locale={locale} dict={dict} wide />
          </Reveal>
        </div>
      </section>

      {/* Preguntas */}
      <section className="section">
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
