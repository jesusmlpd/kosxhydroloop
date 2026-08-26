import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/**
 * Canonical y hreflang por ruta. El path va sin locale: "/products", "/".
 */
export function pageMeta({
  locale,
  path = "/",
  title,
  description,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const url = `${site.url}/${locale}${path === "/" ? "" : path}`;
  const languages = Object.fromEntries(
    locales.map((code) => [code, `${site.url}/${code}${path === "/" ? "" : path}`]),
  );

  return {
    title,
    description,
    alternates: { canonical: url, languages: { ...languages, "x-default": languages.es } },
    openGraph: {
      type: "website",
      siteName: `${site.name}®`,
      locale: locale === "es" ? "es_MX" : "en_US",
      title,
      description,
      url,
      images: [{ url: `${site.url}/og.jpg`, width: 1200, height: 630, alt: `${site.name}®` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${site.url}/og.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}
