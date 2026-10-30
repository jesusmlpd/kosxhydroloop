import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { getDict } from "@/lib/dict";
import { isLocale } from "@/lib/i18n";
import { loadRecord } from "@/lib/recovery";
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
      title: dict.checkout.title,
      description: dict.checkout.summaryTitle,
    }),
    // Un checkout indexado no sirve de nada y ensucia el crawl.
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ r?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  // Quien regresa desde un correo de recuperacion llega con sus datos puestos.
  // El id es opaco (128 bits): los datos nunca viajan en la URL.
  const { r } = await searchParams;
  const record = r ? await loadRecord(r) : null;
  const prefill = record ? { name: record.name, email: record.email, phone: record.phone } : undefined;

  return (
    <section className="section">
      <div className="shell">
        <h1 className="text-[clamp(28px,4vw,44px)]">{dict.checkout.title}</h1>
        <div className="mt-8">
          <CheckoutForm locale={locale} dict={dict} prefill={prefill} />
        </div>
      </div>
    </section>
  );
}
