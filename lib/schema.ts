import type { Locale } from "@/lib/i18n";
import { site, socials } from "@/lib/site";

export function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    email: site.email,
    areaServed: site.country,
    slogan: "Agua caliente en el momento justo, sin desperdicio",
    sameAs: socials.map((social) => social.href),
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: locale,
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function productSchema(input: {
  name: string;
  description: string;
  sku: string;
  priceCents: number;
  currency: string;
  available: boolean;
  url: string;
  image?: string;
  /** null mientras las resenas no sean reales: nada de estrellas inventadas. */
  rating?: { value: number; count: number } | null;
}) {
  return {
    "@type": "Product",
    name: input.name,
    description: input.description,
    sku: input.sku,
    image: input.image,
    brand: { "@id": `${site.url}/#organization` },
    ...(input.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: input.rating.value,
            reviewCount: input.rating.count,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: input.url,
      price: (input.priceCents / 100).toFixed(2),
      priceCurrency: input.currency,
      availability: input.available
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
  };
}
