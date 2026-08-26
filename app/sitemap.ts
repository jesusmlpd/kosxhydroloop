import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { posts } from "@/lib/blog";
import { legalPages } from "@/lib/legal";
import { products, site } from "@/lib/site";

const routes = ["", "/products", "/blog", "/about", "/contact"];

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

  const postPages = locales.flatMap((locale) =>
    posts.map((post) => ({
      url: `${site.url}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  );

  const legal = locales.flatMap((locale) =>
    legalPages.map((page) => ({
      url: `${site.url}/${locale}/legal/${page.slug}`,
      lastModified: new Date(page.updated),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  );

  return [...pages, ...productPages, ...postPages, ...legal];
}
