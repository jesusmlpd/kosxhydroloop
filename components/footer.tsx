import Link from "next/link";
import { Logo } from "@/components/logo";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";
import { site, socials } from "@/lib/site";

export function Footer({ locale, dict }: { locale: Locale; dict: Dict }) {
  const year = 2026;

  return (
    <footer className="border-t border-line bg-mist">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href={localePath(locale)} className="text-ink">
            <Logo />
          </Link>
          <p className="mt-3 max-w-xs text-[15px] text-ink-2">{dict.footer.tagline}</p>
        </div>

        <nav aria-label={dict.footer.nav}>
          <h2 className="eyebrow">{dict.footer.nav}</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            {[
              { href: localePath(locale, "/products"), label: dict.nav.products },
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
          <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
            <li>
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">
                {site.email}
              </a>
            </li>
            {site.phone ? (
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-ink">
                  {site.phone}
                </a>
              </li>
            ) : null}
            <li>{site.city}</li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow">{dict.footer.social}</h2>
          <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-ink"
                >
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rule" />
      <div className="shell flex flex-col gap-2 py-6 text-[13px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {year} {site.name}. {dict.footer.rights}
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
