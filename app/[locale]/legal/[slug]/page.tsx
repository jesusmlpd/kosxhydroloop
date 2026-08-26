import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dict";
import { isLocale, locales } from "@/lib/i18n";
import { findLegalPage, legalPages } from "@/lib/legal";
import { pageMeta } from "@/lib/metadata";
import { site } from "@/lib/site";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => legalPages.map((page) => ({ locale, slug: page.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = findLegalPage(slug);
  if (!page) return {};
  return pageMeta({
    locale,
    path: `/legal/${slug}`,
    title: `${page.title[locale]} | ${site.name}`,
    description: page.intro[locale],
  });
}

export default async function LegalPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const page = findLegalPage(slug);
  if (!page) notFound();
  const dict = getDict(locale);

  const updated = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(page.updated));

  return (
    <article className="section">
      <div className="shell max-w-3xl">
        <p className="eyebrow">{dict.footer.legal}</p>
        <h1 className="mt-3 text-[clamp(28px,4.4vw,46px)]">{page.title[locale]}</h1>
        <p className="lede mt-4">{page.intro[locale]}</p>
        <p className="mt-3 text-[13px] text-ink-3">
          {dict.blog.updated} {updated}
        </p>

        <div className="mt-10 space-y-6">
          {page.body[locale].map((block, index) => {
            if (block.type === "h2") {
              return (
                <h2 key={index} className="pt-4 text-[clamp(20px,2.4vw,27px)]">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={index} className="space-y-2.5 text-[16px] text-ink-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua" />
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-[16px] leading-relaxed text-ink-2">
                {block.text}
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
}
