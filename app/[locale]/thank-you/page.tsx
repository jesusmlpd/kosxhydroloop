import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dict";
import { isLocale, localePath } from "@/lib/i18n";
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
    ...pageMeta({ locale, path: "/thank-you", ...dict.meta.thankYou }),
    robots: { index: false, follow: true },
  };
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);

  return (
    <section className="section">
      <div className="shell max-w-2xl py-16 text-center">
        <h1 className="text-[clamp(30px,4.6vw,50px)]">{dict.thankYou.title}</h1>
        <p className="lede mt-5">{dict.thankYou.body}</p>
        <Link href={localePath(locale, "/products")} className="btn btn-primary mt-8">
          {dict.thankYou.cta}
        </Link>
      </div>
    </section>
  );
}
