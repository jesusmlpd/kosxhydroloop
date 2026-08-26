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
  image,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  /** Ruta local de la imagen para compartir; sin ella se usa la general. */
  image?: string;
}): Metadata {
  const ogImage = `${site.url}${image ?? "/og.jpg"}`;
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}
