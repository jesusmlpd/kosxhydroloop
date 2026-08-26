import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter, Sora } from "next/font/google";
import { notFound } from "next/navigation";
import { CartDrawer } from "@/components/cart-drawer";
import { CartFromUrl } from "@/components/cart-from-url";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { OfferCountdown } from "@/components/offer-countdown";
import { ThemeScript } from "@/components/theme-script";
import { getDict } from "@/lib/dict";
import { isLocale, locales } from "@/lib/i18n";
import { organizationSchema, graph, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import "../globals.css";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  // Fijo en blanco: el sitio siempre abre en light mode.
  themeColor: "#ffffff",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);

  // Solo lo que de verdad es comun. Canonical, hreflang y OG salen por ruta
  // desde lib/metadata, si no cada subpagina hereda el canonical del home.
  return {
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    metadataBase: new URL(site.url),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDict(locale);

  return (
    <html
      lang={locale}
      data-theme="light"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${inter.variable}`}
    >
      <head>
        <ThemeScript />
        {/* Sin JS el reveal nunca se prende, asi que se fuerza visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(graph([organizationSchema(), websiteSchema(locale)])),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-invert focus:px-5 focus:py-3 focus:text-invert-fg"
        >
          {dict.nav.skip}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="main" className="flex-1 pt-[68px]">
          <OfferCountdown dict={dict.urgency} />
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
        <CartDrawer locale={locale} dict={dict} />
        {/* useSearchParams necesita Suspense para no volver dinamica cada pagina. */}
        <Suspense fallback={null}>
          <CartFromUrl />
        </Suspense>
      </body>
    </html>
  );
}
