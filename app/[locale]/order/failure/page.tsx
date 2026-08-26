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
    title: dict.order.failureTitle,
    description: dict.order.failureBody,
    robots: { index: false, follow: false },
  };
}

export default async function OrderFailurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);

  return (
    <section className="section">
      <div className="shell max-w-2xl py-12 text-center">
        <h1 className="text-[clamp(28px,4.4vw,46px)]">{dict.order.failureTitle}</h1>
        <p className="lede mt-4">{dict.order.failureBody}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={localePath(locale, "/checkout")} className="btn btn-primary">
            {dict.order.retry}
          </Link>
          <Link href={localePath(locale, "/products")} className="btn btn-ghost">
            {dict.order.backToStore}
          </Link>
        </div>
      </div>
    </section>
  );
}
