import { NextResponse } from "next/server";
import { adminCredentials } from "@/lib/admin";
import { apiAccess } from "@/lib/admin-access";
import { logAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import { kvAvailable } from "@/lib/kv";
import {
  buildRecoveryEmail,
  loadSettings,
  sanitizeSettings,
  saveSettings,
  type RecoveryRecord,
} from "@/lib/recovery";

/** Guarda las reglas del panel y manda correos de prueba al administrador o al correo que se indique. */
export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const access = await apiAccess("marketing");
  if (!("session" in access)) return NextResponse.json({ ok: false }, { status: access.status });
  if (!kvAvailable()) return NextResponse.json({ ok: false, error: "no_database" }, { status: 503 });
  const body = await request.json().catch(() => null);
  const settings = sanitizeSettings(body);
  await saveSettings(settings);
  await logAudit(access.session.email, "Cambió la secuencia de correos", settings.enabled ? "encendida" : "apagada");
  return NextResponse.json({ ok: true, settings });
}

export async function POST(request: Request) {
  const access = await apiAccess("marketing");
  if (!("session" in access)) return NextResponse.json({ ok: false }, { status: access.status });
  const body = (await request.json().catch(() => null)) as { stepId?: string; settings?: unknown; to?: string } | null;
  // Se prueba con lo que hay en pantalla (aunque no este guardado todavia).
  const settings = body?.settings ? sanitizeSettings(body.settings) : await loadSettings();
  const step = settings.steps.find((s) => s.id === body?.stepId);
  if (!step) return NextResponse.json({ ok: false, error: "step" }, { status: 400 });

  // Por omision la prueba llega al correo del administrador; el panel puede indicar otro.
  const wanted = body?.to?.trim().toLowerCase() ?? "";
  if (wanted && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(wanted)) {
    return NextResponse.json({ ok: false, error: "email" }, { status: 400 });
  }
  const to = wanted || adminCredentials().email;
  const sample: RecoveryRecord = {
    id: "0".repeat(32),
    ref: "HL-PRUEBA",
    createdAt: Date.now(),
    email: to,
    name: "Oscar Prueba",
    phone: "",
    locale: "es",
    items: [{ id: "hl-wifi", qty: 1 }],
    coupon: "",
    consent: true,
    sent: [],
  };
  const mail = buildRecoveryEmail(sample, step);
  const ok = await sendEmail({ to: [to], subject: `[Prueba] ${mail.subject}`, html: mail.html, text: mail.text });
  return NextResponse.json({ ok, to });
}
