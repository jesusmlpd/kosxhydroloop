import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminLogin, AdminShell } from "@/components/admin-shell";
import { DateRange } from "@/components/admin-date-range";
import { ADMIN_COOKIE, isAdmin } from "@/lib/admin";
import { computeStats, loadOrders } from "@/lib/admin-data";
import { formatMoney } from "@/lib/commerce";
import { PANEL_TZ, addDay, buildPresets, resolveRange, todayInPanel } from "@/lib/date-range";

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
    <AdminShell active="/admin" title="Dashboard">
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
          <Dashboard stats={computeStats(orders, { since, until })} />
        </>
      )}
    </AdminShell>
  );
}

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

function Dashboard({ stats }: { stats: ReturnType<typeof computeStats> }) {
  const maxDay = Math.max(...stats.byDay.map((day) => day.cents), 1);
  const maxState = Math.max(...stats.byState.map((entry) => entry.count), 1);

  const kpis = [
    { label: "Ingresos", value: formatMoney(stats.revenueCents, "es") },
    { label: "Pedidos", value: String(stats.orderCount) },
    { label: "Ticket promedio", value: formatMoney(stats.avgCents, "es") },
    { label: "Por enviar", value: String(stats.unshipped) },
  ];

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card p-5">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">
              {kpi.label}
            </p>
            <p className="mt-2 font-display text-[26px] font-bold tabular-nums">{kpi.value}</p>
          </div>
        ))}
      </div>

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

      <div className="card mt-4 p-6">
        <h2 className="font-display text-[16px] font-bold">Tráfico y demográficos de audiencia</h2>
        <p className="mt-2 max-w-2xl text-[14px] text-ink-2">
          Este sitio no guarda datos de visitantes (sin base de datos, sin cookies de
          rastreo propias). El tráfico, la edad, el género y las ciudades de la
          audiencia se ven en las herramientas que ya alimenta el sitio: el Pixel de
          Meta y Google Analytics. La configuración está en la pestaña de Marketing.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="https://business.facebook.com/events_manager2"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-sm"
          >
            Meta Events Manager
          </a>
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-sm"
          >
            Google Analytics
          </a>
        </div>
      </div>

      <p className="mt-8 text-center text-[12.5px] text-ink-3">
        Las cifras salen de los cobros de Stripe. Los pedidos de Mercado Pago y por
        transferencia no entran en estas métricas.
      </p>
    </>
  );
}
