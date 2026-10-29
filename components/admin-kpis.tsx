/**
 * Fila de metricas estilo Shopify: valor, minigrafica y cambio contra el
 * periodo anterior. Componente de servidor, sin dependencias.
 */
export type Kpi = {
  label: string;
  value: string;
  /** Un punto por dia del rango. */
  series: number[];
  /** Cambio porcentual contra el periodo anterior; null si no hay con que comparar. */
  delta: number | null;
  hint?: string;
};

function Spark({ series, up }: { series: number[]; up: boolean | null }) {
  const width = 72;
  const height = 22;
  if (series.length < 2 || Math.max(...series) === 0) {
    return <svg width={width} height={height} aria-hidden><line x1="0" x2={width} y1={height - 2} y2={height - 2} stroke="currentColor" className="text-line" strokeWidth="1.5" /></svg>;
  }
  const max = Math.max(...series);
  const points = series
    .map((value, i) => `${((i / (series.length - 1)) * width).toFixed(1)},${(height - 2 - (value / max) * (height - 4)).toFixed(1)}`)
    .join(" ");
  const color = up === null ? "#8aa0ab" : up ? "#0f7a5f" : "#a1332f";
  return (
    <svg width={width} height={height} aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function KpiStrip({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="card mt-8 grid overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const up = kpi.delta === null ? null : kpi.delta >= 0;
        return (
          <div key={kpi.label} className="border-t border-line p-5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0 lg:border-t-0 lg:border-l lg:first:border-l-0 lg:[&:nth-child(2)]:border-l">
            <p className="text-[12.5px] font-semibold text-ink-2">{kpi.label}</p>
            <p className="mt-1.5 font-display text-[26px] font-bold tabular-nums">{kpi.value}</p>
            <div className="mt-1.5 flex items-center gap-2 text-[13px] tabular-nums">
              <Spark series={kpi.series} up={up} />
              <span className={up === null ? "text-ink-3" : up ? "text-[#0f7a5f]" : "text-[#a1332f]"}>
                {kpi.delta === null ? "—" : `${up ? "+" : ""}${Math.round(kpi.delta)}%`}
              </span>
            </div>
            {kpi.hint ? <p className="mt-1 text-[12px] text-ink-3">{kpi.hint}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
