import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { getDict } from "@/lib/dict";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  return pageMeta({ locale, path: "/contact", ...dict.meta.contact });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);

  return (
    <section className="section">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="eyebrow">{dict.contact.eyebrow}</p>
          <h1 className="mt-3 text-[clamp(32px,5vw,54px)]">{dict.contact.title}</h1>
          <p className="lede mt-5 max-w-md">{dict.contact.body}</p>

          <div className="mt-10 space-y-6 text-[15px]">
            <div>
              <h2 className="eyebrow">{dict.contact.directTitle}</h2>
              <p className="mt-2">
                <a href={`mailto:${site.email}`} className="text-ink-2 transition-colors hover:text-ink">
                  {site.email}
                </a>
              </p>
              {site.phone ? (
                <p>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="text-ink-2 transition-colors hover:text-ink"
                  >
                    {site.phone}
                  </a>
                </p>
              ) : null}
              <p className="text-ink-2">{site.city}</p>
            </div>
            <div>
              <h2 className="eyebrow">{dict.contact.hoursTitle}</h2>
              <p className="mt-2 text-ink-2">{dict.contact.hours}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <ContactForm locale={locale} dict={dict} />
        </Reveal>
      </div>
    </section>
  );
}
