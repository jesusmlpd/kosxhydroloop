import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
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
  return pageMeta({ locale, path: "/about", ...dict.meta.about });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);

  return (
    <>
      <section className="section pb-0">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{dict.about.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-[clamp(32px,5.2vw,60px)]">{dict.about.title}</h1>
            <p className="lede mt-6 max-w-2xl">{dict.about.lead}</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="space-y-4 text-[16px] text-ink-2">
              {dict.about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <h2 className="eyebrow">{dict.about.valuesTitle}</h2>
              <ul className="mt-4 space-y-4">
                {dict.about.values.map((value) => (
                  <li key={value.title} className="card p-6">
                    <h3 className="text-[18px]">{value.title}</h3>
                    <p className="mt-1.5 text-[15px] text-ink-2">{value.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
