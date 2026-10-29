import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SocialIcon, SocialLinks } from "@/components/social-icons";
import { getDict } from "@/lib/dict";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";
import { WhatsappLink } from "@/components/whatsapp-link";
import { distributorRegions, site } from "@/lib/site";

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
    <>
      {/* Formulario + canales directos */}
      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">{dict.contact.eyebrow}</p>
            <h1 className="mt-3 text-[clamp(30px,4.6vw,52px)]">{dict.contact.title}</h1>
            <p className="lede mt-5 max-w-md">{dict.contact.body}</p>

            {/* Canales reales del cliente, con acciones que funcionan */}
            <div className="card mt-9 p-6">
              <h2 className="font-display text-[17px] font-bold">{dict.contact.doubtsTitle}</h2>
              <p className="mt-1.5 text-[14px] text-ink-2">{dict.contact.doubtsBody}</p>

              <div className="mt-5 flex flex-col gap-3">
                <WhatsappLink
                  origin="contacto"
                  className="btn w-full bg-[#25d366] text-[#08381c] hover:brightness-105 sm:w-auto"
                >
                  <SocialIcon id="whatsapp" size={19} />
                  {dict.contact.whatsappCta} · {site.whatsappDisplay}
                </WhatsappLink>
                <p className="text-[14px] text-ink-2">
                  {dict.contact.emailCta}{" "}
                  <a href={`mailto:${site.email}`} className="font-semibold text-teal hover:underline">
                    {site.email}
                  </a>
                </p>
              </div>

              <div className="mt-5 border-t border-line pt-5">
                <h3 className="eyebrow">{dict.contact.followUs}</h3>
                <SocialLinks className="mt-3" />
              </div>

              <div className="mt-5 border-t border-line pt-5 text-[14px] text-ink-2">
                <h3 className="eyebrow">{dict.contact.hoursTitle}</h3>
                <p className="mt-2">{dict.contact.hours}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <ContactForm locale={locale} dict={dict} />
          </Reveal>
        </div>
      </section>

      {/* Distribuidores por region, como en el sitio actual pero ordenado */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{dict.distributors.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(26px,3.8vw,42px)]">
              {dict.distributors.title}
            </h2>
            <p className="lede mt-4 max-w-2xl">{dict.distributors.body}</p>
          </Reveal>

          <div className="mt-10 space-y-10">
            {distributorRegions.map((region, regionIndex) => (
              <Reveal key={region.region} delay={regionIndex * 40}>
                <div>
                  <h3 className="flex items-center gap-3 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-teal">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2.5a7 7 0 0 1 7 7c0 5-7 12-7 12s-7-7-7-12a7 7 0 0 1 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    </svg>
                    {region.region}
                    <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {region.items.map((distributor) => (
                      <article key={distributor.name + distributor.address} className="card flex h-full flex-col p-5">
                        <h4 className="font-display text-[16px] font-bold">{distributor.name}</h4>
                        <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-ink-2">
                          {distributor.address}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <a
                            href={`tel:+${distributor.phone.length > 10 ? distributor.phone : `52${distributor.phone}`}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-teal hover:text-teal"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a1.9 1.9 0 0 1-2 2A15.5 15.5 0 0 1 3 6a1.9 1.9 0 0 1 2-2Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {dict.distributors.call}
                          </a>
                          {distributor.url ? (
                            <a
                              href={distributor.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-teal hover:text-teal"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
                                <path d="M3.8 12h16.4M12 3.5c2.5 2.4 3.8 5.3 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.3-3.8-8.5s1.3-6.1 3.8-8.5Z" stroke="currentColor" strokeWidth="1.7" />
                              </svg>
                              {dict.distributors.website}
                            </a>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
