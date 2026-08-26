import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClearCart } from "@/components/clear-cart";
import { getDict } from "@/lib/dict";
import { isLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  return {
    title: dict.order.successTitle,
    description: dict.order.successBody,
    robots: { index: false, follow: false },
  };
}

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string; mock?: string; mode?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const { ref, mock, mode } = await searchParams;

  return (
    <section className="section">
      <ClearCart />
      <div className="shell max-w-2xl py-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-aqua text-[#04141b]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m5 12.8 4.2 4.2L19 7.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 text-[clamp(28px,4.4vw,46px)]">{dict.order.successTitle}</h1>
        <p className="lede mt-4">
          {mode === "manual" ? dict.checkout.methods.manualBody : dict.order.successBody}
        </p>
        {ref ? (
          <p className="mt-6 font-display text-[15px] font-semibold">
            {dict.order.reference}: <span className="tabular-nums">{ref}</span>
          </p>
        ) : null}
        {mock ? (
          <p className="mx-auto mt-6 max-w-md rounded-xl bg-mist px-4 py-3 text-[13px] text-ink-2">
            {locale === "en"
              ? `Simulated run: ${mock} has no API keys configured, so no real charge happened.`
              : `Corrida simulada: ${mock} no tiene llaves configuradas, así que no hubo ningún cargo real.`}
          </p>
        ) : null}
        <Link href={localePath(locale, "/products")} className="btn btn-primary mt-8">
          {dict.order.backToStore}
        </Link>
      </div>
    </section>
  );
}
