import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminLogin, AdminShell } from "@/components/admin-shell";
import { DateRange } from "@/components/admin-date-range";
import { ADMIN_COOKIE, isAdmin } from "@/lib/admin";
import { computeStats, loadOrders } from "@/lib/admin-data";
import { formatMoney } from "@/lib/commerce";
import { KpiStrip, type Kpi } from "@/components/admin-kpis";
import { PANEL_TZ, addDay, buildPresets, resolveRange, spanDays, todayInPanel } from "@/lib/date-range";
import { SOURCE_LABEL, loadDailyStats, loadSources } from "@/lib/stats";
import { buildAlerts } from "@/lib/admin-alerts";
import { loadStoreSettings } from "@/lib/store-settings-server";

/** Primer dia seleccionable: desde que existe el checkout. */
const SALES_FIRST_DAY = "2026-08-26";

export const metadata: Metadata = {
  title: "Dashboard | Hydroloop®",
  robots: { index: false, follow: false },
};

// Siempre fresco: las metricas se calculan en vivo desde Stripe.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; desde?: string; hasta?: string }>;
}) {
  const jar = await cookies();
  const search = await searchParams;
  const { error } = search;
  if (!isAdmin(jar.get(ADMIN_COOKIE)?.value)) {
    return <AdminLogin error={Boolean(error)} next="/admin" />;
  }

  const orders = await loadOrders();
  // Carga los ajustes en vivo (inventario, cupones, promo) para los avisos.
  const settings = await loadStoreSettings();
  const alerts = buildAlerts({ orders, settings });
  const today = todayInPanel();
  const { since, until } = resolveRange(search, {
    min: SALES_FIRST_DAY,
    max: today,
    defaultSince: addDay(today, -29),
    defaultUntil: today,
  });
  const presets = buildPresets({ today, min: SALES_FIRST_DAY, lastDaysEnd: "today" });
  const updatedLabel = new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: PANEL_TZ,
  }).format(new Date());

  return (
    <AdminShell active="/admin" title="Inicio">
      {alerts.length ? (
        <ul className="mt-6 space-y-2">
          {alerts.map((alert) => (
            <li
              key={alert.text}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-[14px] ${
                alert.level === "warn" ? "border-[#e8c86f] bg-[#fff8e6]" : "border-line bg-surface"
              }`}
            >
              <span>{alert.text}</span>
              <a href={alert.href} className="shrink-0 font-semibold text-deep underline">
                {alert.cta}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {orders === null ? (
        <NotConnected />
      ) : (
        <>
          <div className="mt-6">
            <DateRange
              action="/admin"
              since={since}
              until={until}
              min={SALES_FIRST_DAY}
              max={today}
              presets={presets}
              updatedLabel={updatedLabel}
            />
          </div>
          <Dashboard
            stats={computeStats(orders, { since, until })}
            traffic={await loadTraffic(orders, since, until)}
          />
        </>
      )}
    </AdminShell>
  );
}

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const change = (now: number, before: number) => (before > 0 ? ((now - before) / before) * 100 : null);
const rate = (orders: number, sessions: number) => (sessions > 0 ? (orders / sessions) * 100 : 0);

/** Embudo propio (lib/stats) del rango y del periodo anterior de la misma duracion. */
async function loadTraffic(orders: NonNullable<Awaited<ReturnType<typeof loadOrders>>>, since: string, until: string) {
  const span = spanDays(since, until);
  const prevUntil = addDay(since, -1);
  const prevSince = addDay(prevUntil, -(span - 1));
  const dayList = (from: string, to: string) => Array.from({ length: spanDays(from, to) }, (_, i) => addDay(from, i));
  const days = dayList(since, until);
  const [now, before, sources] = await Promise.all([
    loadDailyStats(days),
    loadDailyStats(dayList(prevSince, prevUntil)),
    loadSources(days),
  ]);
  return { now, before, sources, prev: computeStats(orders, { since: prevSince, until: prevUntil }) };
}

type Traffic = Awaited<ReturnType<typeof loadTraffic>>;

function NotConnected() {
  return (
    <div className="card mt-8 p-8 text-center">
      <h2 className="text-[20px]">Stripe aún no está conectado</h2>
      <p className="mx-auto mt-3 max-w-md text-[14.5px] text-ink-2">
        Las métricas de ventas se calculan en vivo desde Stripe, sin base de datos.
        En cuanto <code>STRIPE_SECRET_KEY</code> esté en las variables de entorno,
        este dashboard se llena solo con cada compra. Los pasos están en la pestaña
        de Marketing.
      </p>
    </div>
  );
}

function Dashboard({ stats, traffic }: { stats: ReturnType<typeof computeStats>; traffic: Traffic }) {
  const maxDay = Math.max(...stats.byDay.map((day) => day.cents), 1);
  const maxState = Math.max(...stats.byState.map((entry) => entry.count), 1);

  const sessions = sum(traffic.now.map((day) => day.session));
  const prevSessions = sum(traffic.before.map((day) => day.session));
  const conv = rate(stats.orderCount, sessions);
  const prevConv = rate(traffic.prev.orderCount, prevSessions);
  const kpis: Kpi[] = [
    {
      label: "Sesiones",
      value: sessions.toLocaleString("es-MX"),
      series: traffic.now.map((day) => day.session),
      delta: change(sessions, prevSessions),
      hint: sessions === 0 ? "Se cuentan desde que se activó la medición" : undefined,
    },
    {
      label: "Ventas totales",
      value: formatMoney(stats.revenueCents, "es"),
      series: stats.byDay.map((day) => day.cents),
      delta: change(stats.revenueCents, traffic.prev.revenueCents),
    },
    {
      label: "Pedidos",
      value: String(stats.orderCount),
      series: stats.byDay.map((day) => day.count),
      delta: change(stats.orderCount, traffic.prev.orderCount),
      hint: `Ticket promedio ${formatMoney(stats.avgCents, "es")} · Por enviar ${stats.unshipped}`,
    },
    {
      label: "Tasa de conversión",
      value: `${conv.toFixed(1)}%`,
      series: traffic.now.map((day, i) => (day.session ? ((stats.byDay[i]?.count ?? 0) / day.session) * 100 : 0)),
      delta: change(conv, prevConv),
    },
  ];
  const funnel = [
    { label: "Sesiones", value: sessions },
    { label: "Vieron un producto", value: sum(traffic.now.map((day) => day.view_product)) },
    { label: "Agregaron al carrito", value: sum(traffic.now.map((day) => day.add_to_cart)) },
    { label: "Iniciaron el pago", value: sum(traffic.now.map((day) => day.checkout)) },
    { label: "Compraron", value: stats.orderCount },
  ];
  const funnelTop = Math.max(funnel[0].value, 1);
  const sourceTotal = Math.max(sum(traffic.sources.map((entry) => entry.sessions)), 1);

  return (
    <>
      <KpiStrip kpis={kpis} />

      <div className="card mt-4 p-6">
        <h2 className="font-display text-[16px] font-bold">Ventas por día</h2>
        {stats.orderCount === 0 ? (
          <p className="mt-3 text-[14px] text-ink-2">
            Sin ventas todavía. Cuando entre la primera compra pagada, la gráfica se
            dibuja sola.
          </p>
        ) : (
          <div className="mt-5 flex h-36 items-end gap-[3px]">
            {stats.byDay.map((day) => (
              <div
                key={day.label}
                title={`${day.label}: ${formatMoney(day.cents, "es")} (${day.count} pedido${day.count === 1 ? "" : "s"})`}
                className="group relative flex-1 rounded-t-[3px] bg-foam transition-colors hover:bg-aqua"
                style={{ height: `${Math.max((day.cents / maxDay) * 100, day.cents > 0 ? 6 : 2)}%` }}
              />
            ))}
          </div>
        )}
        <div className="mt-2 flex justify-between text-[11.5px] text-ink-3">
          <span>{stats.byDay[0]?.label}</span>
          <span>{stats.byDay[stats.byDay.length - 1]?.label}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-[16px] font-bold">Por producto</h2>
          {stats.byProduct.length === 0 ? (
            <p className="mt-3 text-[14px] text-ink-2">Sin datos todavía.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.byProduct.map((product) => (
                <li key={product.name} className="flex items-center justify-between gap-3 text-[14px]">
                  <span className="min-w-0 truncate">{product.name}</span>
                  <span className="shrink-0 text-ink-2 tabular-nums">
                    {product.units} u · {formatMoney(product.cents, "es")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display text-[16px] font-bold">Pedidos por estado</h2>
          {stats.byState.length === 0 ? (
            <p className="mt-3 text-[14px] text-ink-2">Sin datos todavía.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.byState.map((entry) => (
                <li key={entry.state} className="text-[14px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate">{entry.state}</span>
                    <span className="shrink-0 text-ink-2 tabular-nums">
                      {entry.count} · {formatMoney(entry.cents, "es")}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-mist">
                    <div
                      className="h-full rounded-full bg-teal"
                      style={{ width: `${(entry.count / maxState) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-[16px] font-bold">Embudo de compra</h2>
          <ul className="mt-4 space-y-3">
            {funnel.map((step, i) => (
              <li key={step.label} className="text-[14px]">
                <div className="flex items-center justify-between gap-3">
                  <span>{step.label}</span>
                  <span className="text-ink-2 tabular-nums">
                    {step.value.toLocaleString("es-MX")}
                    {i > 0 && funnel[i - 1].value > 0 ? ` · ${Math.round((step.value / funnel[i - 1].value) * 100)}%` : ""}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-mist">
                  <div className="h-full rounded-full bg-teal" style={{ width: `${Math.min((step.value / funnelTop) * 100, 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12.5px] text-ink-3">El porcentaje es contra el paso anterior.</p>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-[16px] font-bold">Sesiones por fuente</h2>
          {sessions === 0 ? (
            <p className="mt-3 text-[14px] text-ink-2">Sin visitas medidas en este rango todavía.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {traffic.sources
                .filter((entry) => entry.sessions > 0)
                .map((entry) => (
                  <li key={entry.source} className="text-[14px]">
                    <div className="flex items-center justify-between gap-3">
                      <span>{SOURCE_LABEL[entry.source]}</span>
                      <span className="text-ink-2 tabular-nums">
                        {entry.sessions.toLocaleString("es-MX")} · {Math.round((entry.sessions / sourceTotal) * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-mist">
                      <div className="h-full rounded-full bg-teal" style={{ width: `${(entry.sessions / sourceTotal) * 100}%` }} />
                    </div>
                  </li>
                ))}
            </ul>
          )}
          <p className="mt-3 text-[12.5px] text-ink-3">
            Edad, género y ciudades de la audiencia están en{" "}
            <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="underline">Google Analytics</a> y el{" "}
            <a href="https://business.facebook.com/events_manager2" target="_blank" rel="noreferrer" className="underline">Pixel de Meta</a>.
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-[12.5px] text-ink-3">
        Las cifras salen de los cobros de Stripe. Los pedidos de Mercado Pago y por
        transferencia no entran en estas métricas.
      </p>
    </>
  );
}
