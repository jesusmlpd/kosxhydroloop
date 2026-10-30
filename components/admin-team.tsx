"use client";

import { useState } from "react";
import { MEMBER_ROLES, ROLE_HELP, ROLE_LABEL } from "@/lib/admin-roles";
import type { PublicMember } from "@/lib/admin-users";

type Notice = { ok: boolean; text: string } | null;

async function call(method: string, body?: unknown) {
  const response = await fetch("/api/admin/team", {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return (await response.json().catch(() => ({ ok: false, error: "Sin respuesta." }))) as { ok: boolean; error?: string; member?: PublicMember };
}

/** Alta y administracion de los miembros del panel. Las contrasenas las define el propietario y se guardan en hash. */
export function TeamEditor({ initial, canSave }: { initial: PublicMember[]; canSave: boolean }) {
  const [members, setMembers] = useState(initial);
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "operaciones", password: "" });

  async function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string, apply: () => void) {
    setBusy(true);
    setNotice(null);
    const result = await action();
    setBusy(false);
    if (result.ok) {
      apply();
      setNotice({ ok: true, text: success });
    } else {
      setNotice({ ok: false, text: result.error ?? "No se pudo completar." });
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {!canSave ? (
        <div className="card border-[#e7c9a8] bg-[#fff8ee] p-5 text-[14px]">
          Conecta la base de datos (Upstash) para poder dar de alta al equipo.
        </div>
      ) : null}

      <section className="card p-6">
        <h2 className="text-[18px]">Miembros</h2>
        <p className="mt-1 text-[14px] text-ink-2">
          El propietario (tú) siempre entra con el correo y la contraseña del hosting. Los demás entran con la que les
          pongas aquí; cámbiala cuando quieras.
        </p>
        {members.length === 0 ? (
          <p className="mt-4 text-[14px] text-ink-3">Todavía no hay miembros.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {members.map((member) => (
              <li key={member.id} className="flex flex-wrap items-center gap-3 py-3 text-[14px]">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {member.name} {!member.active ? <span className="ml-1 text-[12px] font-normal text-[#a1332f]">(desactivado)</span> : null}
                  </p>
                  <p className="truncate text-[13px] text-ink-3">{member.email}</p>
                </div>
                <select
                  value={member.role}
                  disabled={busy}
                  onChange={(event) =>
                    run(() => call("PATCH", { id: member.id, role: event.target.value }), "Rol actualizado.", () =>
                      setMembers((cur) => cur.map((m) => (m.id === member.id ? { ...m, role: event.target.value as PublicMember["role"] } : m))),
                    )
                  }
                  className="field w-auto py-1.5"
                >
                  {MEMBER_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABEL[role]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={busy}
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    const password = window.prompt(`Nueva contraseña para ${member.email} (mínimo 10 caracteres):`);
                    if (password) run(() => call("PATCH", { id: member.id, password }), "Contraseña cambiada.", () => undefined);
                  }}
                >
                  Cambiar contraseña
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    run(() => call("PATCH", { id: member.id, active: !member.active }), member.active ? "Desactivado." : "Reactivado.", () =>
                      setMembers((cur) => cur.map((m) => (m.id === member.id ? { ...m, active: !m.active } : m))),
                    )
                  }
                >
                  {member.active ? "Desactivar" : "Reactivar"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="text-[13px] font-medium text-[#a1332f]"
                  onClick={() => {
                    if (window.confirm(`¿Quitar a ${member.email} del equipo?`))
                      run(() => call("DELETE", { id: member.id }), "Quitado del equipo.", () =>
                        setMembers((cur) => cur.filter((m) => m.id !== member.id)),
                      );
                  }}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-6">
        <h2 className="text-[18px]">Agregar un miembro</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[13px] font-medium text-ink-2">Nombre</span>
            <input className="field mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-[13px] font-medium text-ink-2">Correo</span>
            <input type="email" autoComplete="off" className="field mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-[13px] font-medium text-ink-2">Rol</span>
            <select className="field mt-1.5" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {MEMBER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABEL[role]}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-[12px] text-ink-3">{ROLE_HELP[form.role as keyof typeof ROLE_HELP]}</span>
          </label>
          <label className="block">
            <span className="text-[13px] font-medium text-ink-2">Contraseña inicial (mínimo 10 caracteres)</span>
            <input type="text" autoComplete="off" className="field mt-1.5" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <span className="mt-1 block text-[12px] text-ink-3">Compártela por un canal privado. Se guarda cifrada y no se puede volver a ver.</span>
          </label>
        </div>
        <button
          type="button"
          disabled={busy || !canSave}
          className="btn btn-primary mt-5 disabled:opacity-60"
          onClick={() =>
            run(
              async () => {
                const result = await call("POST", form);
                if (result.ok && result.member) setMembers((cur) => [...cur, result.member as PublicMember]);
                return result;
              },
              "Miembro agregado.",
              () => setForm({ name: "", email: "", role: "operaciones", password: "" }),
            )
          }
        >
          Agregar
        </button>
      </section>

      <section className="card p-6">
        <h2 className="text-[18px]">Qué puede hacer cada rol</h2>
        <ul className="mt-3 space-y-1.5 text-[14px] text-ink-2">
          <li>
            <strong>{ROLE_LABEL.owner}:</strong> todo, incluido el equipo y el historial.
          </li>
          {MEMBER_ROLES.map((role) => (
            <li key={role}>
              <strong>{ROLE_LABEL[role]}:</strong> {ROLE_HELP[role]}
            </li>
          ))}
        </ul>
      </section>

      {notice ? (
        <p role="status" className={`text-[14px] ${notice.ok ? "text-[#0f7a5f]" : "text-[#a1332f]"}`}>
          {notice.text}
        </p>
      ) : null}
    </div>
  );
}
