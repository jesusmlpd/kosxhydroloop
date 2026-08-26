import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { getDict } from "@/lib/dict";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  return {
    ...pageMeta({
      locale,
      path: "/checkout",
      title: `${dict.checkout.title} | Hydroloop`,
      description: dict.checkout.summaryTitle,
    }),
    // Un checkout indexado no sirve de nada y ensucia el crawl.
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({
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
        <h1 className="text-[clamp(28px,4vw,44px)]">{dict.checkout.title}</h1>
        <div className="mt-8">
          <CheckoutForm locale={locale} dict={dict} />
        </div>
      </div>
    </section>
  );
}
