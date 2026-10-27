import { NextResponse } from "next/server";
import { sendMetaEvent } from "@/lib/meta-capi";
import { site } from "@/lib/site";

/**
 * Respaldo en servidor del evento Contact (clic a WhatsApp). Sin datos
 * personales: solo las cookies de Meta, la IP y el navegador. El event_id es el
 * mismo del Pixel, asi que Meta cuenta un solo contacto.
 *
 * Es un endpoint publico, asi que solo acepta formatos estrictos; lo peor que
 * puede hacer un abuso es inflar el conteo de Contact, nunca tocar pedidos.
 */
const EVENT_ID = /^ct-[a-z0-9-]{8,40}$/;
const ORIGIN = /^[a-z0-9-]{1,30}$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    eventId?: string;
    origin?: string;
    url?: string;
    fbp?: string | null;
    fbc?: string | null;
  } | null;

  if (!body || !EVENT_ID.test(body.eventId ?? "") || !ORIGIN.test(body.origin ?? "")) {
    return new NextResponse(null, { status: 400 });
  }

  // La URL de origen tiene que ser de este sitio o de un preview; si no, se usa la oficial.
  let sourceUrl = site.url;
  try {
    const url = new URL(body.url ?? "");
    if (url.hostname === new URL(site.url).hostname || url.hostname.endsWith(".vercel.app")) {
      sourceUrl = `${url.origin}${url.pathname}`;
    }
  } catch {
    // URL invalida: se queda la oficial.
  }

  await sendMetaEvent({
    name: "Contact",
    eventId: body.eventId as string,
    sourceUrl,
    user: {
      fbp: (body.fbp ?? "").slice(0, 200),
      fbc: (body.fbc ?? "").slice(0, 300),
      ip: (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim(),
      userAgent: (request.headers.get("user-agent") ?? "").slice(0, 300),
    },
    custom: { content_name: body.origin, content_category: "whatsapp" },
  });

  return new NextResponse(null, { status: 204 });
}
