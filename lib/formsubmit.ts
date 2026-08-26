import { site } from "@/lib/site";

/**
 * FormSubmit.co como transporte del formulario: no pide cuenta ni API key,
 * es el mismo servicio que usan KOS, fin x malo y balam.
 *
 * Dos trampas ya conocidas y ya cubiertas aqui:
 *  1. Rechaza cualquier request sin cabecera Origin, porque lo lee como si
 *     viniera de un archivo HTML local.
 *  2. Contesta HTTP 200 aunque haya rechazado el envio. El veredicto real
 *     viene en el JSON, asi que hay que leerlo.
 *
 * PENDIENTE: el correo destino se activa una sola vez. FormSubmit manda un
 * mail de "Activate Form" al primer envio, y hasta que alguien le da clic no
 * entrega nada. La activacion es por origen, asi que produccion y localhost
 * se activan por separado.
 */
const ENDPOINT = "https://formsubmit.co/ajax";

/**
 * Buzon destino, o null si todavia no hay uno de verdad. FORMSUBMIT_TO manda
 * sobre todo; si no existe, solo se usa el correo de lib/site cuando el
 * interruptor emailConfirmed esta prendido.
 */
export function resolveInbox() {
  const fromEnv = process.env.FORMSUBMIT_TO?.trim();
  if (fromEnv) return fromEnv;
  return site.emailConfirmed ? site.email : null;
}

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  type?: string;
  message: string;
};

export async function sendContact(payload: ContactPayload, origin: string) {
  const to = resolveInbox();
  if (!to) return { ok: false, message: "inbox_not_configured" };

  const response = await fetch(`${ENDPOINT}/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: origin,
    },
    body: JSON.stringify({
      _subject: `${site.name}: nuevo contacto de ${payload.name}`,
      _template: "table",
      Nombre: payload.name,
      Correo: payload.email,
      Telefono: payload.phone || "",
      Tipo: payload.type || "",
      Mensaje: payload.message,
    }),
  });

  const data = (await response.json().catch(() => null)) as
    | { success?: string | boolean; message?: string }
    | null;

  const ok =
    response.ok && (data?.success === true || String(data?.success).toLowerCase() === "true");

  return { ok, message: data?.message ?? "" };
}
