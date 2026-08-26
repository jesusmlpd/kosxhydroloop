import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BundleCards } from "@/components/bundle-cards";
import { ModelQuiz } from "@/components/model-quiz";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { getDict } from "@/lib/dict";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";
import { products } from "@/lib/site";
import { PaymentBadges } from "@/components/payment-badges";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  return pageMeta({ locale, path: "/products", ...dict.meta.products });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);

  return (
    <section className="section">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{dict.products.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(32px,5vw,56px)]">{dict.products.title}</h1>
          <p className="lede mt-5 max-w-2xl">{dict.products.body}</p>
        </Reveal>
        <div className="mt-6">
          <PaymentBadges />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 70}>
              <ProductCard product={product} locale={locale} dict={dict} />
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Reveal>
            <p className="eyebrow">{dict.bundles.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(24px,3.4vw,36px)]">{dict.bundles.title}</h2>
            <p className="lede mt-3 max-w-xl">{dict.bundles.body}</p>
          </Reveal>
          <Reveal delay={70} className="mt-8">
            <BundleCards locale={locale} dict={dict} />
          </Reveal>
        </div>

        <div className="mt-16">
          <Reveal className="text-center">
            <p className="eyebrow">{dict.quiz.eyebrow}</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-[clamp(24px,3.4vw,36px)]">
              {dict.quiz.title}
            </h2>
          </Reveal>
          <Reveal delay={80} className="mt-8">
            <ModelQuiz locale={locale} dict={dict} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
