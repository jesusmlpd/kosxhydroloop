import { NextResponse } from "next/server";
import { ccField, resolveInbox } from "@/lib/formsubmit";
import { site } from "@/lib/site";

/**
 * Suscripcion a PURA AGUA. Sin base de datos, cada alta llega como correo al
 * buzon del negocio via FormSubmit (mismo transporte y mismas guardas que el
 * resto de los formularios). Cuando exista una lista real (Mailchimp, Resend,
 * Brevo), este endpoint es el unico lugar a recablear.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, string> | null;
  if (!body) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  // Honeypot: las personas no ven este campo.
  if (body.company) return NextResponse.json({ ok: true });

  const email = (body.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  const to = resolveInbox();
  if (!to) {
    // Sin buzon configurado no se finge un alta: error honesto.
    return NextResponse.json({ ok: false, error: "inbox_not_configured" }, { status: 503 });
  }

  const origin = request.headers.get("origin") ?? site.url;
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Origin: origin },
      body: JSON.stringify({
        ...ccField(),
        _subject: "PURA AGUA: nueva suscripción",
        _template: "table",
        Lista: "PURA AGUA",
        Correo: email,
        Nombre: (body.name ?? "").trim(),
        Idioma: body.locale === "en" ? "en" : "es",
      }),
    });
    const data = (await response.json().catch(() => null)) as { success?: string | boolean } | null;
    const ok =
      response.ok && (data?.success === true || String(data?.success).toLowerCase() === "true");
    if (!ok) return NextResponse.json({ ok: false, error: "rejected" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }
}
