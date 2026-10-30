import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin, AdminShell, NoAccess } from "@/components/admin-shell";
import { LeadDelete } from "@/components/admin-lead-delete";
import { adminAccess } from "@/lib/admin-access";
import { loadOrders } from "@/lib/admin-data";
import { buildCustomers, itemsText, leadStatus, marketable } from "@/lib/admin-customers";
import { formatMoney } from "@/lib/commerce";
import { PANEL_TZ } from "@/lib/date-range";
import { kvAvailable } from "@/lib/kv";
import { listLeads } from "@/lib/leads";

export const metadata: Metadata = {
  title: "Clientes | Hydroloop®",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const day = (ms: number) => new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeZone: PANEL_TZ }).format(new Date(ms));

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; tab?: string; q?: string }>;
}) {
  const { error, tab, q } = await searchParams;
  const access = await adminAccess("clientes");
  if (access === "login") return <AdminLogin error={Boolean(error)} next="/admin/clientes" />;
  if (access === "denied") return <NoAccess />;

  const view = tab === "leads" ? "leads" : "clientes";
  const query = (q ?? "").trim().toLowerCase().slice(0, 80);
  const [orders, leads] = await Promise.all([loadOrders(), listLeads(500).catch(() => [])]);
  const customers = buildCustomers(orders ?? []);
  const shownCustomers = customers.filter((c) => !query || `${c.email} ${c.name} ${c.phone}`.toLowerCase().includes(query)).slice(0, 200);
  const shownLeads = leads.filter((l) => !query || `${l.email} ${l.name} ${l.phone}`.toLowerCase().includes(query)).slice(0, 200);

  const stats = [
    { label: "Clientes", value: customers.length },
    { label: "Compraron más de una vez", value: customers.filter((c) => c.orders > 1).length },
    { label: "Leads guardados", value: leads.length },
    { label: "Leads para marketing", value: leads.filter(marketable).length },
  ];

  return (
    <AdminShell active="/admin/clientes" title="Clientes">
      <p className="mt-3 max-w-2xl text-[14.5px] text-ink-2">
        Quien ya compró y quien dejó su correo sin terminar. Para marketing solo se usan los leads que marcaron el
        consentimiento, no se dieron de baja y todavía no compran.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="text-[12.5px] font-semibold text-ink-2">{stat.label}</p>
            <p className="mt-1.5 font-display text-[26px] font-bold tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {(["clientes", "leads"] as const).map((value) => (
          <Link
            key={value}
            href={`/admin/clientes?tab=${value}`}
            className={`rounded-full px-4 py-2 text-[13.5px] font-semibold ${view === value ? "bg-invert text-invert-fg" : "bg-surface text-ink-2"}`}
          >
            {value === "clientes" ? "Clientes" : "Leads"}
          </Link>
        ))}
        <form className="ml-auto flex gap-2" action="/admin/clientes">
          <input type="hidden" name="tab" value={view} />
          <input name="q" defaultValue={q ?? ""} placeholder="Buscar correo, nombre o teléfono" className="field w-64 py-2" />
          <button className="btn btn-ghost btn-sm">Buscar</button>
        </form>
      </div>

      {view === "clientes" ? (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-ink-3">Compradores con pedido pagado en Stripe (los últimos 100 pedidos).</p>
            <Link prefetch={false} download href="/api/admin/clientes/export?tipo=clientes" className="btn btn-ghost btn-sm">
              Descargar CSV
            </Link>
          </div>
          <div className="card mt-3 overflow-x-auto">
            {shownCustomers.length === 0 ? (
              <p className="p-6 text-[14px] text-ink-2">Sin clientes que mostrar.</p>
            ) : (
              <table className="w-full text-left text-[14px]">
                <thead className="border-b border-line text-[12px] uppercase tracking-[0.06em] text-ink-3">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Ciudad</th>
                    <th className="px-4 py-3 text-right">Pedidos</th>
                    <th className="px-4 py-3 text-right">Gastado</th>
                    <th className="px-4 py-3">Última compra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {shownCustomers.map((c) => (
                    <tr key={c.email}>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{c.name || c.email}</p>
                        <p className="text-[12.5px] text-ink-3">
                          {c.email}
                          {c.phone ? ` · ${c.phone}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">{c.city || "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{c.orders}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatMoney(c.spentCents, "es")}</td>
                      <td className="px-4 py-3">{day(c.lastOrder * 1000)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-ink-3">
              {kvAvailable() ? "Se guardan en cuanto escriben su correo en el pago." : "Conecta la base de datos para guardar leads."}
            </p>
            <div className="flex gap-2">
              <Link prefetch={false} download href="/api/admin/clientes/export?tipo=leads" className="btn btn-ghost btn-sm">
                CSV para marketing
              </Link>
              <Link prefetch={false} download href="/api/admin/clientes/export?tipo=leads&alcance=todos" className="btn btn-ghost btn-sm">
                CSV de todos
              </Link>
            </div>
          </div>
          <div className="card mt-3 overflow-x-auto">
            {shownLeads.length === 0 ? (
              <p className="p-6 text-[14px] text-ink-2">Todavía no hay leads. Aparecen cuando alguien escribe su correo en el pago.</p>
            ) : (
              <table className="w-full text-left text-[14px]">
                <thead className="border-b border-line text-[12px] uppercase tracking-[0.06em] text-ink-3">
                  <tr>
                    <th className="px-4 py-3">Lead</th>
                    <th className="px-4 py-3">Carrito</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Última vez</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {shownLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{lead.name || lead.email}</p>
                        <p className="text-[12.5px] text-ink-3">
                          {lead.email}
                          {lead.phone ? ` · ${lead.phone}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-ink-2">{itemsText(lead.items)}</td>
                      <td className="px-4 py-3">
                        <span className={marketable(lead) ? "font-semibold text-[#0f7a5f]" : "text-ink-3"}>{leadStatus(lead)}</span>
                      </td>
                      <td className="px-4 py-3">{day(lead.lastSeen)}</td>
                      <td className="px-4 py-3 text-right">
                        <LeadDelete id={lead.id} email={lead.email} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
