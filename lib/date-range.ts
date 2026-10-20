/**
 * Fechas del panel interno. Todo son dias "YYYY-MM-DD" en la zona del Centro de
 * Mexico (la misma que usa la cuenta de anuncios), sin horas: asi un rango no
 * cambia segun el reloj del navegador de quien lo mire.
 *
 * Es codigo puro, sin dependencias de servidor, porque lo usan tanto las
 * paginas (servidor) como el selector (cliente).
 */
export const PANEL_TZ = "America/Mexico_City";
export const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

const MS_DAY = 86_400_000;
const parse = (day: string) => Date.parse(`${day}T00:00:00Z`);
const format = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export const addDay = (day: string, n = 1) => format(parse(day) + n * MS_DAY);

/** Dias que abarca el rango, contando ambos extremos. */
export const spanDays = (since: string, until: string) => (parse(until) - parse(since)) / MS_DAY + 1;

export const todayInPanel = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: PANEL_TZ }).format(now);

export const dayFromMs = (ms: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: PANEL_TZ }).format(new Date(ms));

/** 0 = lunes ... 6 = domingo. */
const weekday = (day: string) => (new Date(parse(day)).getUTCDay() + 6) % 7;
const monthStart = (day: string) => `${day.slice(0, 7)}-01`;

export type Preset = {
  id: string;
  label: string;
  since: string;
  until: string;
  /** Cae por completo antes del primer dia con datos. */
  disabled?: boolean;
};

/**
 * Los presets de siempre de un selector de fechas. `lastDaysEnd` decide si
 * "Ultimos N dias" termina hoy (ventas) o ayer (Ads Manager, que no cuenta el
 * dia en curso porque Meta todavia lo esta completando).
 */
export function buildPresets(options: {
  today: string;
  min: string;
  lastDaysEnd: "today" | "yesterday";
  maxSpan?: number;
}): Preset[] {
  const { today, min, lastDaysEnd, maxSpan } = options;
  const yesterday = addDay(today, -1);
  const end = lastDaysEnd === "today" ? today : yesterday;
  const monday = addDay(today, -weekday(today));
  const lastMonday = addDay(monday, -7);
  const thisMonth = monthStart(today);
  const lastMonthEnd = addDay(thisMonth, -1);
  const lastMonth = monthStart(lastMonthEnd);
  const earliest = maxSpan ? [min, addDay(today, -(maxSpan - 1))].sort().pop()! : min;

  const raw: Array<Omit<Preset, "disabled">> = [
    { id: "hoy", label: "Hoy", since: today, until: today },
    { id: "ayer", label: "Ayer", since: yesterday, until: yesterday },
    { id: "7", label: "Últimos 7 días", since: addDay(end, -6), until: end },
    { id: "14", label: "Últimos 14 días", since: addDay(end, -13), until: end },
    { id: "28", label: "Últimos 28 días", since: addDay(end, -27), until: end },
    { id: "30", label: "Últimos 30 días", since: addDay(end, -29), until: end },
    { id: "semana", label: "Esta semana", since: monday, until: today },
    { id: "semana-pasada", label: "La semana pasada", since: lastMonday, until: addDay(lastMonday, 6) },
    { id: "mes", label: "Este mes", since: thisMonth, until: today },
    { id: "mes-pasado", label: "El mes pasado", since: lastMonth, until: lastMonthEnd },
    { id: "maximo", label: "Máximo", since: earliest, until: today },
  ];

  return raw.map((preset) => ({
    ...preset,
    // Un preset que empieza antes del primer dia con datos se recorta; si cae
    // entero antes de ese dia no hay nada que mostrar y se apaga.
    since: preset.since < min ? min : preset.since,
    disabled: preset.until < min,
  }));
}

/**
 * Valida ?desde=&hasta= contra los limites. Si algo no cuadra (formato, orden o
 * demasiados dias) cae al rango por omision en vez de romper la pagina.
 */
export function resolveRange(
  search: { desde?: string; hasta?: string },
  limits: { min: string; max: string; defaultSince: string; defaultUntil: string; maxSpan?: number },
) {
  const { min, max, maxSpan } = limits;
  let since = DAY_RE.test(search.desde ?? "") ? (search.desde as string) : limits.defaultSince;
  let until = DAY_RE.test(search.hasta ?? "") ? (search.hasta as string) : limits.defaultUntil;
  if (since < min) since = min;
  if (until > max) until = max;
  if (since > until || (maxSpan && spanDays(since, until) > maxSpan)) {
    since = limits.defaultSince;
    until = limits.defaultUntil;
  }
  return { since, until };
}

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MONTHS_LONG = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/** "1 oct 2026" */
export const formatDay = (day: string) => {
  const [y, m, d] = day.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/** "1 oct" (sin año, para etiquetas de graficas) */
export const formatDayShort = (day: string) => {
  const [, m, d] = day.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
};

export const formatMonth = (monthDay: string) => {
  const [y, m] = monthDay.split("-").map(Number);
  return `${MONTHS_LONG[m - 1]} de ${y}`;
};

export const addMonths = (monthDay: string, n: number) => {
  const [y, m] = monthDay.split("-").map(Number);
  const index = y * 12 + (m - 1) + n;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}-01`;
};

/** Semanas (lunes a domingo) de un mes; los huecos del borde son null. */
export function monthGrid(monthDay: string): Array<Array<string | null>> {
  const first = monthStart(monthDay);
  const lead = weekday(first);
  const nextMonth = addMonths(first, 1);
  const length = spanDays(first, addDay(nextMonth, -1));
  const cells: Array<string | null> = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length }, (_, i) => addDay(first, i)),
  ];
  while (cells.length % 7) cells.push(null);
  const weeks: Array<Array<string | null>> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export const monthOf = monthStart;
