import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter, Sora } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/analytics";
import { CartDrawer } from "@/components/cart-drawer";
import { CartFromUrl } from "@/components/cart-from-url";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AnnouncementBar } from "@/components/announcement-bar";
import { PromoPopup } from "@/components/promo-popup";
import { StoreHydrator } from "@/components/store-hydrator";
import { PurchaseToasts } from "@/components/social-proof";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { ThemeScript } from "@/components/theme-script";
import { getDict } from "@/lib/dict";
import { isLocale, locales } from "@/lib/i18n";
import { organizationSchema, graph, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { loadStoreSettings } from "@/lib/store-settings-server";
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
    title: {
      default: dict.meta.home.title,
      template: `%s | Hydroloop®`,
    },
    description: dict.meta.home.description,
    metadataBase: new URL(site.url),
    applicationName: "Hydroloop®",
    category: "home improvement",
    keywords:
      locale === "es"
        ? [
            "hidro-retorno",
            "ahorrar agua regadera",
            "agua caliente instantánea sin desperdicio",
            "recirculador de agua caliente México",
            "bomba recirculadora regadera",
            "Hydroloop precio",
            "ahorro de agua en casa",
            "dispositivo para no desperdiciar agua",
          ]
        : [
            "hydro-return",
            "hot water recirculation Mexico",
            "save shower water device",
            "instant hot water no waste",
            "Hydroloop price",
            "water saving device home",
          ],
    authors: [{ name: "Hydroloop®", url: site.url }],
    creator: "Hydroloop®",
    publisher: "Hydroloop®",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
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
  const settings = await loadStoreSettings();

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
        <StoreHydrator settings={settings} />
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
          <AnnouncementBar locale={locale} dict={dict} settings={settings} />
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
        <CartDrawer locale={locale} dict={dict} />
        <PromoPopup locale={locale} settings={settings} />
        <WhatsappFab label={dict.contact.whatsappCta} />
        <PurchaseToasts
          dict={dict.socialProof}
          productNames={[
            dict.products.items["hydroloop-manual"].name,
            dict.products.items["hydroloop-wifi"].name,
            dict.products.items["kit-caja-de-instalacion"].name,
          ]}
        />
        {/* useSearchParams necesita Suspense para no volver dinamica cada pagina. */}
        <Suspense fallback={null}>
          <CartFromUrl />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
