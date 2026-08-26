import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
    title: `${dict.order.pendingTitle} | Hydroloop`,
    description: dict.order.pendingBody,
    robots: { index: false, follow: false },
  };
}

export default async function OrderPendingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const { ref } = await searchParams;

  return (
    <section className="section">
      <div className="shell max-w-2xl py-12 text-center">
        <h1 className="text-[clamp(28px,4.4vw,46px)]">{dict.order.pendingTitle}</h1>
        <p className="lede mt-4">{dict.order.pendingBody}</p>
        {ref ? (
          <p className="mt-6 font-display text-[15px] font-semibold">
            {dict.order.reference}: <span className="tabular-nums">{ref}</span>
          </p>
        ) : null}
        <Link href={localePath(locale, "/products")} className="btn btn-ghost mt-8">
          {dict.order.backToStore}
        </Link>
      </div>
    </section>
  );
}
