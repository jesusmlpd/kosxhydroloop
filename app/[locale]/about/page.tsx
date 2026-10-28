import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { Bubbles } from "@/components/water/bubbles";
import { WaveBand } from "@/components/water/wave-band";
import { getDict } from "@/lib/dict";
import { isLocale, localePath } from "@/lib/i18n";
import { formatMoney } from "@/lib/commerce";
import { pageMeta } from "@/lib/metadata";
import { findProduct } from "@/lib/site";
import { loadStoreSettings } from "@/lib/store-settings-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  return pageMeta({ locale, path: "/about", ...dict.meta.about });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await loadStoreSettings();
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const manual = findProduct("hydroloop-manual");

  return (
    <>
      {/* Apertura con el proposito de la marca sobre agua profunda */}
      <section className="relative isolate overflow-hidden bg-deep-2 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_0%,rgba(0,136,168,0.5)_0%,rgba(1,42,58,0.92)_52%,rgba(1,26,37,1)_100%)]"
        />
        <div aria-hidden="true" className="caustics mix-blend-screen opacity-45" />
        <Bubbles />
        <div className="shell relative py-20 md:py-28">
          <Reveal>
            <p className="font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-aqua">
              {dict.about.eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl text-[clamp(34px,5.2vw,60px)] text-white">
              {dict.about.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[clamp(16px,1.9vw,19px)] leading-relaxed text-white/85">
              {dict.about.lead}
            </p>
          </Reveal>
        </div>
        <WaveBand from="var(--bg)" to="transparent" height={90} className="relative" />
      </section>

      {/* Historia + sello */}
      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <Reveal>
            <div className="space-y-5 text-[17px] leading-relaxed text-ink-2">
              {dict.about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="card p-6">
                <h2 className="eyebrow">{dict.about.missionTitle}</h2>
                <p className="mt-3 text-[15px] text-ink-2">{dict.about.mission}</p>
              </div>
              <div className="card p-6">
                <h2 className="eyebrow">{dict.about.visionTitle}</h2>
                <p className="mt-3 text-[15px] text-ink-2">{dict.about.vision}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="card overflow-hidden">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/media/photos/instalacion.webp"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-4 p-6">
                <Image
                  src="/media/brand/hecho-en-mexico.png"
                  alt="Hecho en México"
                  width={110}
                  height={110}
                  className="h-16 w-16 shrink-0 object-contain dark:brightness-0 dark:invert"
                />
                <div>
                  <p className="font-display text-[16px] font-bold">{dict.products.madeInMx}</p>
                  <p className="mt-0.5 text-[13.5px] text-ink-2">{dict.trust.badges[0].body}</p>
                </div>
              </div>
            </div>

            <div className="card mt-4 p-6">
              <h2 className="eyebrow">{dict.about.valuesTitle}</h2>
              <ul className="mt-4 space-y-4">
                {dict.about.values.map((value) => (
                  <li key={value.title}>
                    <h3 className="text-[16px]">{value.title}</h3>
                    <p className="mt-1 text-[14px] text-ink-2">{value.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cifras de la marca */}
      <section className="section bg-mist pt-0">
        <WaveBand from="var(--bg)" to="var(--bg-2)" height={80} />
        <div className="shell grid gap-8 pt-14 md:grid-cols-4">
          {dict.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 60}>
              <p className="font-display text-[clamp(28px,4vw,42px)] font-bold leading-none text-ink">
                {stat.value}
              </p>
              <p className="mt-2 max-w-[22ch] text-[14px] text-ink-2">{stat.label}</p>
            </Reveal>
          ))}
          <div className="md:col-span-4 mt-4">
            <Link href={localePath(locale, "/products")} className="btn btn-primary">
            {dict.hero.ctaPrimary}{" "}
            {manual ? formatMoney(manual.priceCents, locale, manual.currency) : null}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
