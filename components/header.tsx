"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartButton } from "@/components/cart-button";
import { Logo } from "@/components/logo";
import { LocaleSwitch } from "@/components/locale-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";

export function Header({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: localePath(locale, "/products"), label: dict.nav.products },
    { href: `${localePath(locale)}#como-funciona`, label: dict.nav.how },
    { href: localePath(locale, "/blog"), label: dict.nav.blog },
    { href: localePath(locale, "/about"), label: dict.nav.about },
    { href: localePath(locale, "/contact"), label: dict.nav.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
        scrolled || open
          ? "border-line bg-paper/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-[68px] items-center justify-between gap-4">
        <Link href={localePath(locale)} className="text-ink" aria-label={dict.nav.home}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label={dict.nav.menu}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-[14px] font-medium text-ink-2 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LocaleSwitch locale={locale} label={dict.nav.language} />
          </div>
          <ThemeToggle label={dict.nav.theme} />
          <CartButton dict={dict.cart} />
          <Link
            href={localePath(locale, "/contact")}
            className="btn btn-primary hidden lg:inline-flex"
          >
            {dict.nav.cta}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? dict.nav.close : dict.nav.menu}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-paper lg:hidden">
          <div className="shell flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-2 py-3 font-display text-[16px] font-semibold text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={localePath(locale, "/contact")}
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-2"
            >
              {dict.nav.cta}
            </Link>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <LocaleSwitch locale={locale} label={dict.nav.language} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
