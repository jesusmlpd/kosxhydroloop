"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { captureAttribution } from "@/lib/track";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

/**
 * Pixel de Meta y GA4, ambos opcionales por variable de entorno. Sin IDs no se
 * inyecta ni un byte de script. Las navegaciones internas del app router no
 * recargan la pagina, asi que el PageView de cada ruta se dispara a mano.
 */
export function Analytics() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    // El PageView inicial lo disparan los propios snippets al cargar.
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
    window.gtag?.("event", "page_view", { page_path: pathname });
  }, [pathname]);

  if (!PIXEL_ID && !GA4_ID) return null;

  return (
    <>
      {PIXEL_ID ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
window.__hlQueue=(window.__hlQueue||[]).filter(function(e){if(e[0]==='fbq'){window.fbq.apply(null,e[1]);return false}return true});`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      ) : null}

      {GA4_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA4_ID}');
window.__hlQueue=(window.__hlQueue||[]).filter(function(e){if(e[0]==='gtag'){window.gtag.apply(null,e[1]);return false}return true});`}
          </Script>
        </>
      ) : null}
    </>
  );
}
