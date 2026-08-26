"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, switchLocalePath, type Locale } from "@/lib/i18n";

/**
 * Cambiar idioma tambien deja cookie: si no, el middleware vuelve a mandar al
 * visitante a su idioma detectado en la siguiente visita a la raiz.
 */
export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || `/${locale}`;

  return (
    <div className="flex items-center gap-1" aria-label={label}>
      {locales.map((code) => (
        <Link
          key={code}
          href={switchLocalePath(pathname, code)}
          onClick={() => {
            document.cookie = `hydroloop_locale=${code};path=/;max-age=31536000;samesite=lax`;
          }}
          aria-current={code === locale ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 font-display text-[12px] font-semibold uppercase transition-colors ${
            code === locale ? "bg-mist text-ink" : "text-ink-3 hover:text-ink"
          }`}
        >
          {code}
        </Link>
      ))}
    </div>
  );
}
