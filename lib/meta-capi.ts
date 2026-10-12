import { createHash } from "crypto";
import { site } from "@/lib/site";

/**
 * API de conversiones de Meta (servidor). Es el respaldo del Pixel: si el
 * cliente cierra la pestana, usa OXXO o SPEI, o un bloqueador mata el script,
 * el Purchase sale igual desde el webhook. El `event_id` es el mismo que usa el
 * navegador (la referencia del pedido), asi Meta deduplica y cuenta uno solo.
 *
 * Sin META_CAPI_TOKEN o sin pixel es un no-op: nunca rompe el webhook.
 */
const GRAPH_VERSION = "v22.0";

export type MetaUser = {
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  ip?: string | null;
  userAgent?: string | null;
};

export type MetaEvent = {
  name: "Purchase" | "Lead" | "Contact";
  eventId: string;
  sourceUrl?: string;
  user: MetaUser;
  custom?: Record<string, unknown>;
};

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** Meta exige minusculas y sin espacios antes de aplicar el hash. */
function hashed(value?: string | null) {
  const clean = (value ?? "").trim().toLowerCase();
  return clean ? sha256(clean) : undefined;
}

/** Telefono solo con digitos y lada de pais: 10 digitos de Mexico llevan 52. */
function hashedPhone(value?: string | null) {
  let digits = (value ?? "").replace(/\D/g, "");
  if (digits.length === 10) digits = `52${digits}`;
  return digits ? sha256(digits) : undefined;
}

function hashedZip(value?: string | null) {
  const clean = (value ?? "").replace(/\s/g, "").toLowerCase();
  return clean ? sha256(clean) : undefined;
}

function userData(user: MetaUser) {
  const [first, ...rest] = (user.name ?? "").trim().split(/\s+/);
  const data: Record<string, unknown> = {
    em: hashed(user.email) && [hashed(user.email)],
    ph: hashedPhone(user.phone) && [hashedPhone(user.phone)],
    fn: hashed(first) && [hashed(first)],
    ln: hashed(rest.join(" ")) && [hashed(rest.join(" "))],
    ct: hashed(user.city?.replace(/\s/g, "")) && [hashed(user.city?.replace(/\s/g, ""))],
    st: hashed(user.state?.replace(/\s/g, "")) && [hashed(user.state?.replace(/\s/g, ""))],
    zp: hashedZip(user.zip) && [hashedZip(user.zip)],
    country: [sha256("mx")],
    // Estos cuatro NO se hashean.
    fbp: user.fbp || undefined,
    fbc: user.fbc || undefined,
    client_ip_address: user.ip || undefined,
    client_user_agent: user.userAgent || undefined,
  };
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v));
}

export async function sendMetaEvent(event: MetaEvent) {
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) {
    console.warn("[meta-capi] sin pixel o token, no se envia", event.name, event.eventId);
    return false;
  }

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: event.name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        action_source: "website",
        event_source_url: event.sourceUrl ?? site.url,
        user_data: userData(event.user),
        custom_data: event.custom,
      },
    ],
  };
  // Para validar en Administrador de eventos > Eventos de prueba.
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixel}/events?access_token=${encodeURIComponent(token)}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
    );
    const result = (await response.json().catch(() => null)) as { events_received?: number; error?: { message?: string } } | null;
    if (!response.ok || result?.error) {
      console.error("[meta-capi] rechazado", event.name, event.eventId, result?.error?.message);
      return false;
    }
    console.log("[meta-capi] ok", event.name, event.eventId, result?.events_received);
    return true;
  } catch (error) {
    console.error("[meta-capi] fallo de red", error);
    return false;
  }
}
