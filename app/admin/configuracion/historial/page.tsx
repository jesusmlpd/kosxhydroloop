import type { Metadata } from "next";
import { AdminLogin, AdminShell, NoAccess } from "@/components/admin-shell";
import { adminAccess } from "@/lib/admin-access";
import { listAudit } from "@/lib/audit";
import { PANEL_TZ } from "@/lib/date-range";

export const metadata: Metadata = {
  title: "Historial | Hydroloop®",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const when = (ms: number) =>
  new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short", timeZone: PANEL_TZ }).format(new Date(ms));

export default async function AdminHistoryPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const access = await adminAccess("historial");
  if (access === "login") return <AdminLogin error={Boolean(error)} next="/admin/configuracion/historial" />;
  if (access === "denied") return <NoAccess />;

  const entries = await listAudit(150);
  return (
    <AdminShell active="/admin/configuracion/historial" title="Historial">
      <p className="mt-3 max-w-2xl text-[14.5px] text-ink-2">
        Quién cambió qué y cuándo: ajustes de la tienda, cupones, equipo, correos y envíos. Los últimos 150 movimientos.
      </p>
      <div className="card mt-6 overflow-hidden">
        {entries.length === 0 ? (
          <p className="p-6 text-[14px] text-ink-2">Todavía no hay movimientos registrados.</p>
        ) : (
          <ul className="divide-y divide-line">
            {entries.map((entry, i) => (
              <li key={`${entry.at}-${i}`} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3 text-[14px]">
                <span>
                  <strong>{entry.action}</strong>
                  {entry.detail ? <span className="text-ink-2"> · {entry.detail}</span> : null}
                </span>
                <span className="text-[12.5px] text-ink-3">
                  {entry.who} · {when(entry.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
