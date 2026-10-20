/**
 * Correo transaccional por Resend (API REST, sin dependencia). Sin
 * RESEND_API_KEY es un no-op que avisa en el log: el cobro y el webhook nunca
 * dependen de que el correo salga.
 *
 * El remitente tiene que vivir en un dominio verificado en Resend. Se usa un
 * subdominio solo para envios (notificaciones.hydroloop.com.mx) para no tocar
 * el SPF ni el correo existente del dominio principal.
 */
const ENDPOINT = "https://api.resend.com/emails";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function emailFrom() {
  return process.env.EMAIL_FROM?.trim() || "Hydroloop <pedidos@notificaciones.hydroloop.com.mx>";
}

export async function sendEmail(input: {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  /** Resend ignora un segundo envio con la misma llave durante 24 h: Stripe reintenta webhooks. */
  idempotencyKey?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] sin RESEND_API_KEY, no se envia", input.subject);
    return false;
  }
  if (!input.to.length) return false;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(input.idempotencyKey ? { "Idempotency-Key": input.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: emailFrom(),
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("[email] rechazado", response.status, input.subject, body.slice(0, 200));
      return false;
    }
    console.log("[email] ok", input.subject, input.to.length);
    return true;
  } catch (error) {
    console.error("[email] fallo de red", error);
    return false;
  }
}
