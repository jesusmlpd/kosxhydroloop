"use client";

import { useState } from "react";
import type { Settings, Step } from "@/lib/recovery";

type Coupon = { code: string; label: string };

const DELAY_OPTIONS = [
  { minutes: 15, label: "15 minutos" },
  { minutes: 30, label: "30 minutos" },
  { minutes: 60, label: "1 hora" },
  { minutes: 120, label: "2 horas" },
  { minutes: 360, label: "6 horas" },
  { minutes: 720, label: "12 horas" },
  { minutes: 1440, label: "1 día" },
  { minutes: 2880, label: "2 días" },
  { minutes: 4320, label: "3 días" },
  { minutes: 7200, label: "5 días" },
  { minutes: 10080, label: "7 días" },
];

const STEP_NAMES: Record<string, string> = { uno: "Recordatorio 1", dos: "Recordatorio 2", tres: "Recordatorio 3" };

/**
 * Editor de las reglas de recuperacion. Todo lo que cambia aqui se guarda con
 * un solo boton y se aplica en la siguiente corrida del cron (cada 15 min).
 */
export function RecoveryEditor({
  initial,
  coupons,
  canSave,
  canSend,
}: {
  initial: Settings;
  coupons: Coupon[];
  /** Hay base de datos conectada. */
  canSave: boolean;
  /** Resend esta configurado, para poder mandar pruebas. */
  canSend: boolean;
}) {
  const [settings, setSettings] = useState<Settings>(initial);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [testing, setTesting] = useState<string | null>(null);

  function patchStep(id: string, patch: Partial<Step>) {
    setSettings((current) => ({
      ...current,
      steps: current.steps.map((step) => (step.id === id ? { ...step, ...patch } : step)),
    }));
  }

  async function save() {
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/recovery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await response.json()) as { ok?: boolean; settings?: Settings; error?: string };
      if (!response.ok || !data.ok) {
        setNotice({
          ok: false,
          text: data.error === "no_database" ? "Conecta la base de datos para guardar." : "No se pudo guardar. Intenta de nuevo.",
        });
      } else {
        if (data.settings) setSettings(data.settings);
        setNotice({ ok: true, text: "Guardado. Aplica en la siguiente corrida (máximo 15 minutos)." });
      }
    } catch {
      setNotice({ ok: false, text: "No se pudo guardar. Revisa tu conexión." });
    } finally {
      setSaving(false);
    }
  }

  async function sendTest(stepId: string) {
    setTesting(stepId);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId, settings }),
      });
      const data = (await response.json()) as { ok?: boolean; to?: string };
      setNotice(
        data.ok
          ? { ok: true, text: `Prueba enviada a ${data.to}. Revisa también spam.` }
          : { ok: false, text: "No se pudo enviar la prueba. ¿Resend está configurado y verificado?" },
      );
    } catch {
      setNotice({ ok: false, text: "No se pudo enviar la prueba." });
    } finally {
      setTesting(null);
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h2 className="font-display text-[17px] font-bold">Recuperación automática</h2>
          <p className="mt-1 max-w-xl text-[14px] text-ink-2">
            Cuando alguien llena sus datos y no paga, se le escribe solo con los recordatorios de abajo. Se detiene si
            compra, si pide la baja o si ya recibió los tres.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-3">
          <span className="text-[14px] font-semibold">{settings.enabled ? "Encendida" : "Apagada"}</span>
          <input
            type="checkbox"
            role="switch"
            checked={settings.enabled}
            onChange={(event) => setSettings({ ...settings, enabled: event.target.checked })}
            className="h-6 w-11 cursor-pointer appearance-none rounded-full bg-line-strong transition-colors checked:bg-deep relative before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-5"
          />
        </label>
      </div>

      <div className="card grid gap-5 p-6 sm:grid-cols-3">
        <label className="block text-[13px] font-medium text-ink-2">
          Enviar desde (hora del Centro)
          <select
            className="field mt-1.5"
            value={settings.sendFromHour}
            onChange={(event) => setSettings({ ...settings, sendFromHour: Number(event.target.value) })}
          >
            {Array.from({ length: 24 }, (_, hour) => (
              <option key={hour} value={hour}>
                {String(hour).padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[13px] font-medium text-ink-2">
          Enviar hasta
          <select
            className="field mt-1.5"
            value={settings.sendToHour}
            onChange={(event) => setSettings({ ...settings, sendToHour: Number(event.target.value) })}
          >
            {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
              <option key={hour} value={hour}>
                {String(hour % 24).padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-start gap-2.5 text-[13px] font-medium text-ink-2">
          <input
            type="checkbox"
            checked={settings.requireConsent}
            onChange={(event) => setSettings({ ...settings, requireConsent: event.target.checked })}
            className="mt-0.5 h-4 w-4 accent-[#0a7f94]"
          />
          <span>
            Solo a quien dejó marcada la casilla de recordatorios del checkout
            <span className="mt-0.5 block text-[12px] font-normal text-ink-3">Recomendado.</span>
          </span>
        </label>
      </div>

      {settings.steps.map((step) => (
        <div key={step.id} className={`card p-6 ${step.enabled ? "" : "opacity-70"}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-[16px] font-bold">{STEP_NAMES[step.id] ?? step.id}</h3>
            <label className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold">
              <input
                type="checkbox"
                checked={step.enabled}
                onChange={(event) => patchStep(step.id, { enabled: event.target.checked })}
                className="h-4 w-4 accent-[#0a7f94]"
              />
              Activo
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-[13px] font-medium text-ink-2">
              Se envía después de
              <select
                className="field mt-1.5"
                value={step.delayMinutes}
                onChange={(event) => patchStep(step.id, { delayMinutes: Number(event.target.value) })}
              >
                {DELAY_OPTIONS.some((o) => o.minutes === step.delayMinutes) ? null : (
                  <option value={step.delayMinutes}>{step.delayMinutes} minutos</option>
                )}
                {DELAY_OPTIONS.map((option) => (
                  <option key={option.minutes} value={option.minutes}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-[12px] font-normal text-ink-3">desde que el cliente inició el pago</span>
            </label>
            <label className="block text-[13px] font-medium text-ink-2">
              Incentivo
              <select
                className="field mt-1.5"
                value={step.couponCode}
                onChange={(event) => patchStep(step.id, { couponCode: event.target.value })}
              >
                <option value="">Sin incentivo</option>
                {coupons.map((coupon) => (
                  <option key={coupon.code} value={coupon.code}>
                    {coupon.label}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-[12px] font-normal text-ink-3">
                Se aplica solo al abrir el enlace del correo.
              </span>
            </label>
          </div>

          <label className="mt-4 block text-[13px] font-medium text-ink-2">
            Asunto
            <input
              className="field mt-1.5"
              value={step.subject}
              maxLength={140}
              onChange={(event) => patchStep(step.id, { subject: event.target.value })}
            />
          </label>
          <label className="mt-4 block text-[13px] font-medium text-ink-2">
            Título del correo
            <input
              className="field mt-1.5"
              value={step.headline}
              maxLength={140}
              onChange={(event) => patchStep(step.id, { headline: event.target.value })}
            />
          </label>
          <label className="mt-4 block text-[13px] font-medium text-ink-2">
            Mensaje
            <textarea
              className="field mt-1.5 resize-y"
              rows={6}
              value={step.body}
              maxLength={2000}
              onChange={(event) => patchStep(step.id, { body: event.target.value })}
            />
            <span className="mt-1 block text-[12px] font-normal text-ink-3">
              Deja una línea en blanco entre párrafos. Variables: <code>{"{nombre}"}</code> <code>{"{articulos}"}</code>{" "}
              <code>{"{total}"}</code>
            </span>
          </label>
          <label className="mt-4 block text-[13px] font-medium text-ink-2 sm:max-w-xs">
            Texto del botón
            <input
              className="field mt-1.5"
              value={step.button}
              maxLength={60}
              onChange={(event) => patchStep(step.id, { button: event.target.value })}
            />
          </label>

          <button
            type="button"
            onClick={() => sendTest(step.id)}
            disabled={testing !== null || !canSend}
            className="btn btn-ghost btn-sm mt-5 disabled:opacity-50"
          >
            {testing === step.id ? "Enviando…" : "Enviarme una prueba"}
          </button>
        </div>
      ))}

      <p className="text-[12.5px] text-ink-3">
        Quien compra desde la versión en inglés recibe el correo en inglés con texto fijo (no editable aquí).
      </p>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-lg">
        <button type="button" onClick={save} disabled={saving || !canSave} className="btn btn-primary btn-sm disabled:opacity-50">
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {notice ? (
          <span role="status" className={`text-[13.5px] ${notice.ok ? "text-deep" : "text-[#a1332f]"}`}>
            {notice.text}
          </span>
        ) : !canSave ? (
          <span className="text-[13.5px] text-[#a1332f]">Conecta la base de datos para poder guardar.</span>
        ) : null}
      </div>
    </div>
  );
}
