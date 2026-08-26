import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";

const LOCALE_COOKIE = "hydroloop_locale";

/**
 * Cookie primero (eleccion explicita), luego el idioma del navegador, luego
 * la region: Vercel manda el pais en x-vercel-ip-country, asi que un visitante
 * de EUA sin espanol en su navegador aterriza en /en y uno de LatAm en /es.
 */
const SPANISH_COUNTRIES = new Set([
  "MX", "GT", "SV", "HN", "NI", "CR", "PA", "CO", "VE", "EC", "PE", "BO",
  "PY", "UY", "AR", "CL", "CU", "DO", "PR", "ES",
]);

function detectLocale(request: NextRequest) {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase())
    .find((code) => isLocale(code));
  if (preferred && isLocale(preferred)) return preferred;

  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country) return SPANISH_COUNTRIES.has(country) ? "es" : "en";

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // www servia una copia completa del sitio en vez de redirigir, y eso duplica
  // la superficie de crawl sin ganar nada.
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    return NextResponse.redirect(url, 308);
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  // 308 y no 307: el temporal no consolida senal de ranking.
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Fuera API, internos de Next y cualquier cosa con extension de archivo.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
