import type { Metadata } from "next";
import { AdminLogin, AdminShell, NoAccess } from "@/components/admin-shell";
import { DateRange } from "@/components/admin-date-range";
import { KpiStrip, type Kpi } from "@/components/admin-kpis";
import { adminAccess } from "@/lib/admin-access";
import { loadOrders } from "@/lib/admin-data";
import { buildSalesReport, type SalesReport } from "@/lib/admin-report";
import { formatMoney } from "@/lib/commerce";
import { PANEL_TZ, addDay, buildPresets, formatDayShort, resolveRange, spanDays, todayInPanel } from "@/lib/date-range";
import { loadStats } from "@/lib/recovery";

/** Primer dia seleccionable: desde que existe el checkout. */
const FIRST_DAY = "2026-08-26";

export const metadata: Metadata = {
  title: "Informes | Hydroloop®",
  robots: { index: false, follow: false },
};

// Siempre fresco: se calcula en vivo desde Stripe.
export const dynamic = "force-dynamic";

const money = (cents: number) => formatMoney(cents, "es");
const change = (now: number, before: number) => (before > 0 ? ((now - before) / before) * 100 : null);

export default async function AdminInformesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; desde?: string; hasta?: string }>;
}) {
  const search = await searchParams;
  const access = await adminAccess("informes");
  if (access === "login") {
    return <AdminLogin error={Boolean(search.error)} next="/admin/informes" />;
  }
  if (access === "denied") return <NoAccess />;

  const today = todayInPanel();
  const { since, until } = resolveRange(search, {
    min: FIRST_DAY,
    max: today,
    defaultSince: addDay(today, -29),
    defaultUntil: today,
  });
  const presets = buildPresets({ today, min: FIRST_DAY, lastDaysEnd: "today" });
  const updatedLabel = new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: PANEL_TZ,
  }).format(new Date());

  const orders = await loadOrders();
  const recovery = await loadStats().catch(() => null);

  return (
    <AdminShell active="/admin/informes" title="Informes">
      {orders === null ? (
        <div className="card mt-8 p-8 text-center">
          <h2 className="text-[20px]">Stripe aún no está conectado</h2>
          <p className="mx-auto mt-3 max-w-md text-[14.5px] text-ink-2">
            Los informes se calculan en vivo desde Stripe. Con <code>STRIPE_SECRET_KEY</code> en las variables de
            entorno se llenan solos.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <DateRange
              action="/admin/informes"
              since={since}
              until={until}
              min={FIRST_DAY}
              max={today}
              presets={presets}
              updatedLabel={updatedLabel}
            />
          </div>
          <Report
            report={buildSalesReport(orders, since, until)}
            prev={(() => {
              const span = spanDays(since, until);
              const prevUntil = addDay(since, -1);
              return buildSalesReport(orders, addDay(prevUntil, -(span - 1)), prevUntil);
            })()}
            recovery={recovery}
          />
        </>
      )}
    </AdminShell>
  );
}

function Report({
  report,
  prev,
  recovery,
}: {
  report: SalesReport;
  prev: SalesReport;
  recovery: Awaited<ReturnType<typeof loadStats>>;
}) {
  const kpis: Kpi[] = [
    {
      label: "Ventas totales",
      value: money(report.totalCents),
      series: report.byDay.map((d) => d.totalCents),
      delta: change(report.totalCents, prev.totalCents),
    },
    {
      label: "Pedidos",
      value: String(report.orderCount),
      series: report.byDay.map((d) => d.orders),
      delta: change(report.orderCount, prev.orderCount),
    },
    {
      label: "Ticket promedio",
      value: money(report.avgCents),
      series: report.byDay.map((d) => (d.orders ? d.totalCents / d.orders : 0)),
      delta: change(report.avgCents, prev.avgCents),
    },
    {
      label: "Clientes habituales",
      value: `${report.returningRate.toFixed(1)}%`,
      series: [],
      delta: change(report.returningRate, prev.returningRate),
      hint: `${report.returningOrders} de ${report.orderCount} pedidos`,
    },
  ];
  const rows: Array<[string, number, boolean?]> = [
    ["Ventas brutas", report.grossCents],
    ["Descuentos", -report.discountCents],
    ["Reembolsos", -report.refundCents],
    ["Ventas netas", report.netCents, true],
    ["Cargos de envío", report.shippingCents],
    ["Ventas totales", report.totalCents, true],
  ];
  const maxDay = Math.max(...report.byDay.map((d) => d.totalCents), 1);

  return (
    <>
      <KpiStrip kpis={kpis} />

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="card p-6">
          <h2 className="font-display text-[16px] font-bold">Ventas totales a lo largo del tiempo</h2>
          <p className="mt-1 font-display text-[24px] font-bold tabular-nums">{money(report.totalCents)}</p>
          {report.orderCount === 0 ? (
            <p className="mt-3 text-[14px] text-ink-2">Sin ventas en este rango.</p>
          ) : (
            <div className="mt-4 flex h-40 items-end gap-[3px]">
              {report.byDay.map((d) => (
                <div
                  key={d.day}
                  title={`${formatDayShort(d.day)}: ${money(d.totalCents)} (${d.orders} pedido${d.orders === 1 ? "" : "s"})`}
                  className="flex-1 rounded-t-[3px] bg-foam transition-colors hover:bg-aqua"
                  style={{ height: `${Math.max((d.totalCents / maxDay) * 100, d.totalCents > 0 ? 6 : 2)}%` }}
                />
              ))}
            </div>
          )}
          <div className="mt-2 flex justify-between text-[11.5px] text-ink-3">
            <span>{formatDayShort(report.since)}</span>
            <span>{formatDayShort(report.until)}</span>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-[16px] font-bold">Desglose de ventas totales</h2>
          <dl className="mt-4 divide-y divide-line text-[14px]">
            {rows.map(([label, cents, strong]) => (
              <div key={label} className={`flex justify-between gap-3 py-2.5 ${strong ? "font-semibold" : "text-ink-2"}`}>
                <dt>{label}</dt>
                <dd className="tabular-nums">{money(cents)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Ventas por producto" empty={report.byProduct.length === 0}>
          <Bars
            rows={report.byProduct.map((p) => ({ label: p.name, value: p.cents, text: `${p.units} u · ${money(p.cents)}` }))}
          />
        </Card>
        <Card title="Ventas por estado" empty={report.byState.length === 0}>
          <Bars rows={report.byState.map((s) => ({ label: s.label, value: s.cents, text: `${s.orders} · ${money(s.cents)}` }))} />
        </Card>
        <Card title="Ventas por ciudad" empty={report.byCity.length === 0}>
          <Bars rows={report.byCity.map((c) => ({ label: c.label, value: c.cents, text: `${c.orders} · ${money(c.cents)}` }))} />
        </Card>
        <Card title="Cupones usados" empty={report.byCoupon.length === 0} emptyText="Ningún pedido usó cupón en este rango.">
          <Bars
            rows={report.byCoupon.map((c) => ({
              label: c.code,
              value: c.orders,
              text: `${c.orders} pedido${c.orders === 1 ? "" : "s"} · −${money(c.discountCents)}`,
            }))}
          />
        </Card>
      </div>

      <div className="card mt-4 p-6">
        <h2 className="font-display text-[16px] font-bold">Carritos abandonados</h2>
        {recovery === null ? (
          <p className="mt-3 text-[14px] text-ink-2">La base de datos no está conectada.</p>
        ) : (
          <>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="En cola (pendientes)" value={String(recovery.pending)} />
              <Stat
                label="Correos enviados"
                value={String(Object.values(recovery.sentByStep).reduce((a, b) => a + b, 0))}
              />
              <Stat label="Recuperados" value={String(recovery.recoveredCount)} />
              <Stat label="Ventas recuperadas" value={money(recovery.recoveredCents)} />
            </div>
            <p className="mt-3 text-[12.5px] text-ink-3">
              Acumulado de la secuencia, sin filtro de fechas. Las reglas y las pruebas están en la pestaña Recuperación.
            </p>
          </>
        )}
      </div>

      <p className="mt-8 text-center text-[12.5px] text-ink-3">
        Las cifras salen de los cobros de Stripe (los últimos 100 pedidos). Los pedidos de Mercado Pago y por
        transferencia no entran. Un pedido reembolsado por completo no cuenta como venta.
      </p>
    </>
  );
}

function Card({ title, empty, emptyText, children }: { title: string; empty: boolean; emptyText?: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-[16px] font-bold">{title}</h2>
      {empty ? <p className="mt-3 text-[14px] text-ink-2">{emptyText ?? "Sin datos en este rango."}</p> : children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12.5px] font-semibold text-ink-2">{label}</p>
      <p className="mt-1 font-display text-[22px] font-bold tabular-nums">{value}</p>
    </div>
  );
}

function Bars({ rows }: { rows: Array<{ label: string; value: number; text: string }> }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <ul className="mt-4 space-y-3">
      {rows.map((row) => (
        <li key={row.label} className="text-[14px]">
          <div className="flex items-center justify-between gap-3">
            <span className="min-w-0 truncate">{row.label}</span>
            <span className="shrink-0 text-ink-2 tabular-nums">{row.text}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-mist">
            <div className="h-full rounded-full bg-teal" style={{ width: `${(row.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
