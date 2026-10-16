import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminLogin, AdminShell } from "@/components/admin-shell";
import { ADMIN_COOKIE, isAdmin } from "@/lib/admin";
import {
  FIRST_DAY,
  MetaReportError,
  accountToday,
  addDay,
  getReport,
  isConfigured,
  type BestAd,
  type DayStat,
  type Instagram,
  type Report,
} from "@/lib/meta-report";

export const metadata: Metadata = {
  title: "Reportes | Hydroloop®",
  robots: { index: false, follow: false },
};

// Las cifras salen de Meta en vivo; el caché de 15 minutos vive en lib/meta-report.
export const dynamic = "force-dynamic";

const MAX_DAYS = 120;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

type Search = { error?: string; desde?: string; hasta?: string };

const mxn = (value: number, digits = 0) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
const int = (value: number) => new Intl.NumberFormat("es-MX").format(Math.round(value));
const cost = (value: number | null) => (value === null ? "sin datos" : mxn(value, 2));
const costCell = (value: number | null) => (value === null ? "—" : mxn(value, 2));
const dayLabel = (day: string) =>
  new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));

function resolveRange(search: Search) {
  const today = accountToday();
  const days = (a: string, b: string) => (Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000 + 1;
  let since = DAY.test(search.desde ?? "") ? (search.desde as string) : FIRST_DAY;
  let until = DAY.test(search.hasta ?? "") ? (search.hasta as string) : today;
  if (since < FIRST_DAY) since = FIRST_DAY;
  if (until > today) until = today;
  if (since > until || days(since, until) > MAX_DAYS) {
    since = FIRST_DAY;
    until = today;
    if (days(since, until) > MAX_DAYS) since = addDay(until, -(MAX_DAYS - 1));
  }
  return { since, until, today };
}

export default async function AdminReportesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const jar = await cookies();
  const search = await searchParams;
  if (!isAdmin(jar.get(ADMIN_COOKIE)?.value)) {
    return <AdminLogin error={Boolean(search.error)} next="/admin/reportes" />;
  }

  const { since, until, today } = resolveRange(search);
  const yesterday = addDay(today, -1);
  const presets = [
    { label: "Últimos 7 días", since: addDay(yesterday, -6), until: yesterday },
    { label: "Últimos 14 días", since: addDay(yesterday, -13), until: yesterday },
    { label: "Últimos 30 días", since: addDay(yesterday, -29), until: yesterday },
    { label: "Desde el inicio", since: FIRST_DAY, until: today },
  ];

  let report: Report | null = null;
  let problem: string | null = null;
  if (isConfigured()) {
    try {
      report = await getReport(since, until);
    } catch (error) {
      problem =
        error instanceof MetaReportError && error.status === 429
          ? "Meta limitó las consultas por un momento. Espera unos minutos y vuelve a abrir esta página."
          : "No se pudo leer Meta en este momento. Intenta de nuevo en unos minutos.";
      console.error("[reportes]", error);
    }
  }

  return (
    <AdminShell active="/admin/reportes" title="Reportes">
      <p className="mt-4 max-w-2xl text-[14.5px] text-ink-2">
        Resultados de las campañas Kick Off en Meta, leídos en vivo. Solo cuenta lo que pasa en los anuncios: las ventas
        se ven en Pedidos y en el área comercial.
      </p>

      <div className="card mt-6 flex flex-wrap items-end gap-4 p-5">
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => {
            const active = preset.since === since && preset.until === until;
            return (
              <a
                key={preset.label}
                href={`/admin/reportes?desde=${preset.since}&hasta=${preset.until}`}
                className={`rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                  active ? "bg-invert text-invert-fg" : "bg-surface text-ink-2 hover:text-ink"
                }`}
              >
                {preset.label}
              </a>
            );
          })}
        </div>
        <form method="GET" action="/admin/reportes" className="ml-auto flex flex-wrap items-end gap-2">
          <label className="text-[12.5px] text-ink-3">
            Desde
            <input type="date" name="desde" defaultValue={since} min={FIRST_DAY} max={today} className="field mt-1" />
          </label>
          <label className="text-[12.5px] text-ink-3">
            Hasta
            <input type="date" name="hasta" defaultValue={until} min={FIRST_DAY} max={today} className="field mt-1" />
          </label>
          <button type="submit" className="btn btn-primary btn-sm">
            Ver
          </button>
        </form>
      </div>
      <p className="mt-2 text-[12.5px] text-ink-3">
        {dayLabel(since)} al {dayLabel(until)}. Los rangos de &ldquo;últimos días&rdquo; terminan ayer, como en Ads Manager.
      </p>

      {!isConfigured() ? <NotConfigured /> : problem ? <Notice text={problem} /> : report ? <Body report={report} /> : null}
    </AdminShell>
  );
}

function NotConfigured() {
  return (
    <div className="card mt-8 p-8 text-center">
      <h2 className="text-[20px]">Meta aún no está conectado</h2>
      <p className="mx-auto mt-3 max-w-lg text-[14.5px] text-ink-2">
        Este reporte se llena solo cuando <code>META_REPORT_TOKEN</code> está en las variables de entorno. Debe ser el
        token de un usuario del sistema con permisos de solo lectura (<code>ads_read</code> y <code>read_insights</code>,
        más <code>instagram_basic</code> e <code>instagram_manage_insights</code> para Instagram). Los pasos están en el
        README.
      </p>
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className="card mt-8 p-6 text-[14.5px] text-ink-2" role="alert">
      {text}
    </div>
  );
}

function Body({ report }: { report: Report }) {
  const t = report.totals;
  const kpis = [
    { label: "Gasto", value: mxn(t.spend) },
    { label: "Personas alcanzadas", value: int(t.reach) },
    { label: "Conversaciones iniciadas", value: int(t.conversations), note: "campañas de WhatsApp" },
    { label: "Costo por conversación", value: cost(t.costPerConversation), note: "solo campañas de WhatsApp" },
    { label: "Con 3 mensajes o más", value: int(t.deepConversations), note: `${cost(t.costPerDeep)} cada una` },
  ];

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card p-5">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{kpi.label}</p>
            <p className="mt-2 font-display text-[24px] font-bold tabular-nums">{kpi.value}</p>
            {"note" in kpi && kpi.note ? <p className="mt-1 text-[12.5px] text-ink-3">{kpi.note}</p> : null}
          </div>
        ))}
      </div>

      <div className="card mt-4 overflow-x-auto p-6">
        <h2 className="font-display text-[16px] font-bold">Por campaña</h2>
        {report.campaigns.length === 0 ? (
          <p className="mt-3 text-[14px] text-ink-2">Sin gasto en este rango.</p>
        ) : (
          <table className="mt-4 w-full min-w-[560px] text-left text-[14px]">
            <thead>
              <tr className="text-[12.5px] uppercase tracking-[0.06em] text-ink-3">
                <th className="pb-2 font-semibold">Campaña</th>
                <th className="pb-2 text-right font-semibold">Gasto</th>
                <th className="pb-2 text-right font-semibold">Conversaciones</th>
                <th className="pb-2 text-right font-semibold">Costo</th>
                <th className="pb-2 text-right font-semibold">Con 3 mensajes</th>
              </tr>
            </thead>
            <tbody>
              {report.campaigns.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="py-2.5 pr-3">{c.name}</td>
                  <td className="py-2.5 text-right tabular-nums">{mxn(c.spend)}</td>
                  <td className="py-2.5 text-right tabular-nums">{int(c.conversations)}</td>
                  <td className="py-2.5 text-right tabular-nums">{costCell(c.costPerConversation)}</td>
                  <td className="py-2.5 text-right tabular-nums">{int(c.deepConversations)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card mt-4 p-6">
        <h2 className="font-display text-[16px] font-bold">Gasto y costo por conversación, por día (campañas de WhatsApp)</h2>
        <DayChart days={report.days} />
        <p className="mt-2 text-[12.5px] text-ink-3">
          Las barras son el gasto del día; la línea es el costo por conversación. Los días sin conversaciones no tienen
          punto en la línea.
        </p>
      </div>

      <div className="mt-4">
        <h2 className="font-display text-[16px] font-bold">Mejores anuncios</h2>
        {report.best.length === 0 ? (
          <div className="card mt-3 p-6 text-[14px] text-ink-2">
            Todavía no hay anuncios con muestra suficiente (al menos 5 conversaciones y $30 de gasto, con un costo no
            mayor a 1.5 veces el promedio).
          </div>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {report.best.map((ad, index) => (
              <BestCard key={ad.id} ad={ad} rank={index + 1} />
            ))}
          </div>
        )}
      </div>

      <div className="card mt-4 overflow-x-auto p-6">
        <h2 className="font-display text-[16px] font-bold">Todos los anuncios con gasto</h2>
        <table className="mt-4 w-full min-w-[620px] text-left text-[14px]">
          <thead>
            <tr className="text-[12.5px] uppercase tracking-[0.06em] text-ink-3">
              <th className="pb-2 font-semibold">Anuncio</th>
              <th className="pb-2 text-right font-semibold">Gasto</th>
              <th className="pb-2 text-right font-semibold">Conversaciones</th>
              <th className="pb-2 text-right font-semibold">Costo</th>
              <th className="pb-2 text-right font-semibold">Con 3 mensajes</th>
            </tr>
          </thead>
          <tbody>
            {report.ads.slice(0, 20).map((ad) => (
              <tr key={ad.id} className="border-t border-line">
                <td className="py-2.5 pr-3">
                  {ad.name}
                  <span className="block text-[12px] text-ink-3">{ad.campaign}</span>
                </td>
                <td className="py-2.5 text-right tabular-nums">{mxn(ad.spend)}</td>
                <td className="py-2.5 text-right tabular-nums">{int(ad.conversations)}</td>
                <td className="py-2.5 text-right tabular-nums">{costCell(ad.costPerConversation)}</td>
                <td className="py-2.5 text-right tabular-nums">{int(ad.deepConversations)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-[12.5px] text-ink-3">
          Un anuncio con poco gasto todavía no tiene muestra: no es lo mismo que un anuncio malo. Los de Compras Web no buscan conversaciones: se miden por visitas al sitio y compras, que se ven en el Pixel y en Pedidos.
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card p-6">
          <h2 className="font-display text-[16px] font-bold">Dónde se ven los anuncios (WhatsApp)</h2>
          <Bars
            rows={report.platforms.map((p) => ({ label: p.name, value: p.spend, text: `${mxn(p.spend)} · ${cost(p.costPerConversation)}` }))}
          />
          {report.lowQualitySpend > 0 ? (
            <p className="mt-3 text-[12.5px] text-ink-3">
              Incluye {mxn(report.lowQualitySpend)} en Audience Network, que suele dar clics poco útiles.
            </p>
          ) : null}
        </div>
        <div className="card p-6">
          <h2 className="font-display text-[16px] font-bold">Por estado (WhatsApp)</h2>
          <Bars
            rows={report.regions.slice(0, 8).map((r) => ({
              label: r.name,
              value: r.spend,
              text: `${mxn(r.spend)} · ${r.deepConversations} con 3 msj.`,
            }))}
          />
          <p className="mt-3 text-[12.5px] text-ink-3">
            Meta no reparte las conversaciones por estado: se muestran las que llegaron a 3 mensajes.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="font-display text-[16px] font-bold">A quién llegan (WhatsApp)</h2>
          <Bars
            rows={report.ages.map((a) => ({ label: a.age, value: a.spend, text: `${mxn(a.spend)} · ${cost(a.costPerConversation)}` }))}
          />
          {report.menShare !== null ? (
            <p className="mt-3 text-[12.5px] text-ink-3">
              {Math.round(report.menShare * 100)} % del gasto llega a hombres. Meta decide esto de forma automática.
            </p>
          ) : null}
        </div>
      </div>

      {report.instagram ? (
        <InstagramBlock data={report.instagram} />
      ) : report.instagramConfigured ? (
        <div className="card mt-4 p-6 text-[14px] text-ink-2">
          No se pudieron leer los seguidores de Instagram. Revisa que el token tenga <code>instagram_basic</code> e{" "}
          <code>instagram_manage_insights</code> y que la cuenta esté asignada al usuario del sistema.
        </div>
      ) : null}

      <p className="mt-8 text-center text-[12.5px] text-ink-3">
        Cifras de Meta con atribución de 7 días tras el clic. Conversación es un mensaje nuevo a Hydroloop; &ldquo;con 3
        mensajes&rdquo; es que la persona respondió al menos tres veces. Estas cifras no son ventas.
      </p>
    </>
  );
}

function BestCard({ ad, rank }: { ad: BestAd; rank: number }) {
  return (
    <div className="card overflow-hidden">
      {ad.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ad.image} alt={ad.headline ?? ad.name} loading="lazy" className="h-48 w-full bg-mist object-cover" />
      ) : (
        <div className="grid h-48 place-items-center bg-mist text-[13px] text-ink-3">Sin imagen</div>
      )}
      <div className="p-5">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">Lugar {rank}</p>
        <p className="text-[12px] text-ink-3">{ad.name}</p>
        <p className="mt-1 font-display text-[15px] font-bold">{ad.headline ?? ad.name}</p>
        {ad.text ? <p className="mt-1 line-clamp-2 text-[13px] text-ink-2">{ad.text}</p> : null}
        <p className="mt-3 text-[13.5px] tabular-nums text-ink-2">
          {int(ad.conversations)} conversaciones · {cost(ad.costPerConversation)} cada una · {mxn(ad.spend)}
        </p>
      </div>
    </div>
  );
}

function Bars({ rows }: { rows: { label: string; value: number; text: string }[] }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  if (rows.length === 0) return <p className="mt-3 text-[14px] text-ink-2">Sin datos en este rango.</p>;
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

/** Barras de gasto y línea de costo por conversación, dibujadas en el servidor. */
function DayChart({ days }: { days: DayStat[] }) {
  const W = 760;
  const H = 220;
  const L = 44;
  const R = 44;
  const T = 12;
  const B = 28;
  const innerW = W - L - R;
  const innerH = H - T - B;
  const maxSpend = Math.max(...days.map((d) => d.spend), 1);
  const costs = days.map((d) => d.costPerConversation).filter((c): c is number => c !== null);
  const maxCost = Math.max(...costs, 1);
  const slot = innerW / Math.max(days.length, 1);
  const x = (i: number) => L + slot * i + slot / 2;
  const yCost = (c: number) => T + innerH - (c / maxCost) * innerH;
  const line = days
    .map((d, i) => (d.costPerConversation === null ? null : `${x(i)},${yCost(d.costPerConversation)}`))
    .filter((p): p is string => p !== null)
    .join(" ");
  const every = Math.max(1, Math.ceil(days.length / 8));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Gasto y costo por conversación por día">
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={L} x2={W - R} y1={T + innerH * (1 - f)} y2={T + innerH * (1 - f)} stroke="var(--color-line)" strokeWidth={1} />
          <text x={L - 6} y={T + innerH * (1 - f) + 4} textAnchor="end" fontSize={11} fill="var(--color-ink-3)">
            {mxn(maxSpend * f)}
          </text>
          <text x={W - R + 6} y={T + innerH * (1 - f) + 4} fontSize={11} fill="var(--color-teal)">
            {mxn(maxCost * f)}
          </text>
        </g>
      ))}
      {days.map((d, i) => {
        const h = (d.spend / maxSpend) * innerH;
        return (
          <rect key={d.day} x={x(i) - slot * 0.35} y={T + innerH - h} width={slot * 0.7} height={Math.max(h, d.spend > 0 ? 1 : 0)} rx={2} fill="var(--color-foam)">
            <title>{`${dayLabel(d.day)}: ${mxn(d.spend)} gastados, ${d.conversations} conversaciones`}</title>
          </rect>
        );
      })}
      {line ? <polyline points={line} fill="none" stroke="var(--color-teal)" strokeWidth={2.5} strokeLinejoin="round" /> : null}
      {days.map((d, i) =>
        d.costPerConversation === null ? null : <circle key={d.day} cx={x(i)} cy={yCost(d.costPerConversation)} r={3} fill="var(--color-teal)" />,
      )}
      {days.map((d, i) =>
        i % every === 0 ? (
          <text key={d.day} x={x(i)} y={H - 8} textAnchor="middle" fontSize={11} fill="var(--color-ink-3)">
            {dayLabel(d.day)}
          </text>
        ) : null,
      )}
    </svg>
  );
}

function InstagramBlock({ data }: { data: Instagram }) {
  const net = data.gained !== null && data.lost !== null ? data.gained - data.lost : null;
  const maxGain = Math.max(...data.perDay.map((d) => d.gained), 1);
  const maxSpend = Math.max(...data.perDay.map((d) => d.spend), 1);
  return (
    <div className="card mt-4 p-6">
      <h2 className="font-display text-[16px] font-bold">
        Seguidores de Instagram{data.username ? ` (@${data.username})` : ""}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-4">
        <Fact label="Seguidores hoy" value={data.followersNow === null ? "sin datos" : int(data.followersNow)} />
        <Fact label="Nuevos" value={data.gained === null ? "sin datos" : int(data.gained)} />
        <Fact label="Dejaron de seguir" value={data.lost === null ? "sin datos" : int(data.lost)} />
        <Fact label="Neto" value={net === null ? "sin datos" : `${net > 0 ? "+" : ""}${int(net)}`} />
      </div>
      <div className="mt-5 flex h-28 items-end gap-[3px]" aria-label="Seguidores nuevos por día">
        {data.perDay.map((d) => (
          <div key={d.day} className="relative flex h-full flex-1 flex-col justify-end" title={`${dayLabel(d.day)}: ${d.gained} nuevos, ${mxn(d.spend)} de gasto`}>
            <div className="rounded-t-[3px] bg-teal" style={{ height: `${Math.max((d.gained / maxGain) * 100, d.gained > 0 ? 6 : 1)}%` }} />
            <div className="mt-[2px] h-[3px] rounded-full bg-foam" style={{ width: `${Math.max((d.spend / maxSpend) * 100, d.spend > 0 ? 8 : 0)}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11.5px] text-ink-3">
        <span>{dayLabel(data.since)}</span>
        <span>{dayLabel(data.until)}</span>
      </div>
      <p className="mt-3 text-[12.5px] text-ink-3">
        Barras: seguidores nuevos por día. Raya clara debajo: gasto del día en las campañas. Se muestran juntos pero no
        se atribuyen: Instagram no dice de dónde viene cada seguidor. Instagram solo da los últimos 30 días.
      </p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{label}</p>
      <p className="mt-1 font-display text-[22px] font-bold tabular-nums">{value}</p>
    </div>
  );
}
