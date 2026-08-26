import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { products, site } from "@/lib/site";

const routes = ["", "/products", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-26");

  const pages = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${site.url}/${locale}${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((code) => [code, `${site.url}/${code}${route}`]),
        ),
      },
    })),
  );

  const productPages = locales.flatMap((locale) =>
    products.map((product) => ({
      url: `${site.url}/${locale}/products/${product.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...pages, ...productPages];
}
