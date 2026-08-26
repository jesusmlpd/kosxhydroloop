import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { getDict } from "@/lib/dict";
import { isLocale } from "@/lib/i18n";
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
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 70}>
              <ProductCard product={product} locale={locale} dict={dict} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
