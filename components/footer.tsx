import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { PaymentBadges } from "@/components/payment-badges";
import { SocialIcon, SocialLinks } from "@/components/social-icons";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";
import { WhatsappLink } from "@/components/whatsapp-link";
import { site } from "@/lib/site";

export function Footer({ locale, dict }: { locale: Locale; dict: Dict }) {
  const year = 2026;

  return (
    <footer className="border-t border-line bg-mist">
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.1fr_1fr]">
        <div>
          <Link href={localePath(locale)} className="text-ink">
            <Logo />
          </Link>
          <p className="mt-3 max-w-xs text-[15px] text-ink-2">{dict.footer.tagline}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3">
            <Image
              src="/media/brand/hecho-en-mexico.png"
              alt=""
              width={110}
              height={110}
              className="h-7 w-7 object-contain dark:brightness-0 dark:invert"
            />
            <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.08em] text-ink-2">
              {dict.products.madeInMx}
            </span>
          </p>
        </div>

        <nav aria-label={dict.footer.nav}>
          <h2 className="eyebrow">{dict.footer.nav}</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            {[
              { href: localePath(locale, "/products"), label: dict.nav.products },
              { href: `${localePath(locale)}#como-funciona`, label: dict.nav.how },
              { href: localePath(locale, "/blog"), label: dict.nav.blog },
              { href: localePath(locale, "/about"), label: dict.nav.about },
              { href: localePath(locale, "/contact"), label: dict.nav.contact },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-2 transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow">{dict.footer.contact}</h2>
          <ul className="mt-3 space-y-2.5 text-[15px] text-ink-2">
            <li>
              <WhatsappLink
                origin="footer"
                className="inline-flex items-center gap-2 transition-colors hover:text-ink"
              >
                <span className="text-[#1da851]">
                  <SocialIcon id="whatsapp" size={16} />
                </span>
                {site.whatsappDisplay}
              </WhatsappLink>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-ink"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-teal">
                  <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m4.5 7.5 7.5 5.5 7.5-5.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                </svg>
                {site.email}
              </a>
            </li>
            <li className="pt-1">
              <SocialLinks />
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow">{dict.footer.legal}</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            {[
              { href: localePath(locale, "/legal/terminos"), label: dict.footer.terms },
              { href: localePath(locale, "/legal/privacidad"), label: dict.footer.privacy },
              { href: localePath(locale, "/legal/envios"), label: dict.footer.shippingPolicy },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-2 transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="eyebrow mt-7">{dict.trust.paymentsTitle}</h2>
          <PaymentBadges className="mt-3 max-w-[240px]" />
        </div>
      </div>

      <div className="rule" />
      <div className="shell flex flex-col gap-2 py-6 text-[13px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.brandedName}. {dict.footer.rights}
        </p>
        <p>
          {dict.footer.builtBy}{" "}
          <a
            href={site.builtByUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-ink-2 transition-colors hover:text-ink"
          >
            {site.builtBy}
          </a>
        </p>
      </div>
    </footer>
  );
}
