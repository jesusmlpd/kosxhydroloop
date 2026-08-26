import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { getDict } from "@/lib/dict";
import { isLocale, localePath } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";
import { products } from "@/lib/site";

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

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] plate-fade"
        />
        <div className="shell relative pb-16 pt-20 md:pb-24 md:pt-28">
          <Reveal>
            <p className="eyebrow">{dict.hero.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-[clamp(38px,6.4vw,74px)]">
              {dict.hero.title} <span className="grad-text">{dict.hero.titleAccent}</span>
            </h1>
            <p className="lede mt-6 max-w-2xl">{dict.hero.body}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={localePath(locale, "/contact")} className="btn btn-primary">
                {dict.hero.ctaPrimary}
              </Link>
              <Link href={localePath(locale, "/products")} className="btn btn-ghost">
                {dict.hero.ctaSecondary}
              </Link>
            </div>
            <p className="mt-4 text-[14px] text-ink-3">{dict.hero.note}</p>
          </Reveal>
        </div>
      </section>

      {/* Numeros */}
      <section className="border-y border-line bg-surface-2">
        <div className="shell grid grid-cols-2 gap-y-8 py-12 md:grid-cols-4">
          {dict.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 60}>
              <p className="font-display text-[clamp(28px,4vw,42px)] font-bold text-ink">
                {stat.value}
              </p>
              <p className="mt-1 max-w-[16ch] text-[14px] text-ink-2">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Propuesta de valor */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{dict.value.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(28px,4.2vw,46px)]">{dict.value.title}</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {dict.value.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <article className="card card-hover h-full p-7">
                  <span className="font-display text-[13px] font-semibold text-ink-3">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-[21px]">{item.title}</h3>
                  <p className="mt-2 text-[15px] text-ink-2">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogo */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{dict.products.eyebrow}</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-2xl text-[clamp(28px,4.2vw,46px)]">{dict.products.title}</h2>
              <Link href={localePath(locale, "/products")} className="btn btn-ghost">
                {dict.products.all}
              </Link>
            </div>
            <p className="lede mt-4 max-w-2xl">{dict.products.body}</p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={index * 70}>
                <ProductCard product={product} locale={locale} dict={dict} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{dict.process.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(28px,4.2vw,46px)]">{dict.process.title}</h2>
          </Reveal>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
            {dict.process.steps.map((step, index) => (
              <li key={step.title} className="bg-surface p-7">
                <Reveal delay={index * 60}>
                  <span className="font-display text-[13px] font-semibold text-ink-3">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-[19px]">{step.title}</h3>
                  <p className="mt-2 text-[15px] text-ink-2">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="section pt-0">
        <div className="shell">
          <Reveal>
            <div className="rounded-3xl bg-invert px-8 py-14 text-invert-fg md:px-14">
              <h2 className="max-w-2xl text-[clamp(28px,4vw,44px)] text-invert-fg">
                {dict.cta.title}
              </h2>
              <p className="mt-4 max-w-xl text-[17px] opacity-80">{dict.cta.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={localePath(locale, "/contact")}
                  className="btn bg-aqua text-[#04141b] hover:brightness-105"
                >
                  {dict.cta.button}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
