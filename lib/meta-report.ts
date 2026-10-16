/**
 * Lectura en vivo de Meta Ads para la pestaña Reportes del panel interno.
 *
 * Solo lectura. El token vive en el servidor (META_REPORT_TOKEN) y el navegador
 * nunca lo ve: la página recibe el reporte ya armado. Es un token distinto al
 * de la API de conversiones (META_CAPI_TOKEN): ese escribe eventos, este solo
 * debe poder leer (ads_read, read_insights y, para Instagram,
 * instagram_basic e instagram_manage_insights).
 *
 * Alcance: las campañas cuyo nombre contiene "Kick Off", que son las que
 * ejecuta la agencia. El resto de la cuenta no entra al reporte.
 */

const GRAPH = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION ?? "v25.0"}`;

/** Primer día de las campañas Kick Off. El rango pedido nunca baja de aquí. */
export const FIRST_DAY = "2026-09-21";
const SCOPE = "Kick Off";
/** Las conversaciones, el costo por conversación y los desgloses cuentan solo las campañas de mensajes. */
const MESSAGING = "WhatsApp";
const TIME_ZONE = "America/Mexico_City";
const ACCOUNT_DEFAULT = "act_766855317780035";

const CONVERSATION = "onsite_conversion.messaging_conversation_started_7d";
const DEEP_CONVERSATION = "onsite_conversion.messaging_user_depth_3_message_send";

export type Totals = {
  spend: number;
  reach: number;
  impressions: number;
  linkClicks: number;
  conversations: number;
  deepConversations: number;
  costPerConversation: number | null;
  costPerDeep: number | null;
};

export type CampaignStat = {
  id: string;
  name: string;
  spend: number;
  reach: number;
  conversations: number;
  deepConversations: number;
  costPerConversation: number | null;
  frequency: number;
};

export type DayStat = {
  day: string;
  spend: number;
  conversations: number;
  costPerConversation: number | null;
};

export type AdStat = {
  id: string;
  name: string;
  campaign: string;
  spend: number;
  conversations: number;
  deepConversations: number;
  costPerConversation: number | null;
  ctr: number;
};

export type BestAd = AdStat & {
  image: string | null;
  headline: string | null;
  text: string | null;
};

export type PlatformStat = { name: string; spend: number; conversations: number; costPerConversation: number | null };
export type RegionStat = { name: string; spend: number; deepConversations: number; costPerDeep: number | null };
export type AgeStat = { age: string; spend: number; conversations: number; costPerConversation: number | null };

export type Instagram = {
  username: string | null;
  followersNow: number | null;
  /** Ventana que realmente se muestra: Instagram solo mira 30 días hacia atrás. */
  since: string;
  until: string;
  gained: number | null;
  lost: number | null;
  perDay: { day: string; gained: number; spend: number }[];
};

export type Report = {
  since: string;
  until: string;
  totals: Totals;
  campaigns: CampaignStat[];
  days: DayStat[];
  ads: AdStat[];
  best: BestAd[];
  platforms: PlatformStat[];
  regions: RegionStat[];
  ages: AgeStat[];
  menShare: number | null;
  instagram: Instagram | null;
  instagramConfigured: boolean;
  lowQualitySpend: number;
};

export class MetaReportError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: number,
  ) {
    super(message);
  }
}

type Action = { action_type: string; value: string };
type Row = Record<string, string> & { actions?: Action[] };

const num = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};
const ratio = (spend: number, count: number) => (count > 0 ? spend / count : null);
const action = (row: Row, type: string) => num(row.actions?.find((a) => a.action_type === type)?.value);

const addDay = (day: string, n = 1) =>
  new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const daysBetween = (since: string, until: string) =>
  (Date.parse(`${until}T00:00:00Z`) - Date.parse(`${since}T00:00:00Z`)) / 86_400_000;

/** Hoy en la zona horaria de la cuenta publicitaria, como AAAA-MM-DD. */
export function accountToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
}

export function isConfigured() {
  return Boolean(process.env.META_REPORT_TOKEN);
}

function config() {
  const token = process.env.META_REPORT_TOKEN;
  if (!token) throw new MetaReportError("Meta no está configurado", 503);
  return {
    token,
    account: process.env.META_AD_ACCOUNT_ID || ACCOUNT_DEFAULT,
    instagram: process.env.META_IG_USER_ID || null,
  };
}

/** Una lectura de la Graph API que sigue la paginación, con tope para no ciclarse. */
async function graph<T = Row>(path: string, params: Record<string, string>): Promise<T[]> {
  const { token } = config();
  const url = new URL(`${GRAPH}/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set("access_token", token);

  const out: T[] = [];
  let next: string | null = url.toString();
  for (let page = 0; next && page < 12; page += 1) {
    const response: Response = await fetch(next, { cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.error) {
      const code = body.error?.code as number | undefined;
      // 4, 17, 32 y 613 son la familia del límite de llamadas de Meta.
      const limited = code === 4 || code === 17 || code === 32 || code === 613;
      throw new MetaReportError(body.error?.message ?? "Falló la lectura de Meta", limited ? 429 : 502, code);
    }
    // Un objeto suelto (un anuncio, un usuario) llega sin `data`.
    if (!Array.isArray(body.data)) return [body as T];
    out.push(...body.data);
    next = body.paging?.next ?? null;
  }
  return out;
}

const isLowQuality = (row: Row) => row.publisher_platform === "audience_network";

const PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  messenger: "Messenger",
  audience_network: "Audience Network",
};

function totalsOf(row: Row | undefined): Totals {
  const spend = num(row?.spend);
  const conversations = row ? action(row, CONVERSATION) : 0;
  const deepConversations = row ? action(row, DEEP_CONVERSATION) : 0;
  return {
    spend,
    reach: num(row?.reach),
    impressions: num(row?.impressions),
    linkClicks: num(row?.inline_link_clicks),
    conversations,
    deepConversations,
    costPerConversation: ratio(spend, conversations),
    costPerDeep: ratio(spend, deepConversations),
  };
}

export async function buildReport(since: string, until: string): Promise<Report> {
  const { account, instagram } = config();
  const range = JSON.stringify({ since, until });
  const filtering = JSON.stringify([{ field: "campaign.name", operator: "CONTAIN", value: SCOPE }]);
  const messagingFiltering = JSON.stringify([
    { field: "campaign.name", operator: "CONTAIN", value: SCOPE },
    { field: "campaign.name", operator: "CONTAIN", value: MESSAGING },
  ]);
  const insights = (params: Record<string, string>, messagingOnly = false) =>
    graph(`${account}/insights`, {
      time_range: range,
      filtering: messagingOnly ? messagingFiltering : filtering,
      limit: "500",
      ...params,
    });
  const base = "spend,impressions,reach,frequency,inline_link_clicks,inline_link_click_ctr,actions";

  const [accountRows, campaignRows, dayRows, adRows, platformRows, regionRows, ageRows] = await Promise.all([
    insights({ level: "account", fields: base }),
    insights({ level: "campaign", fields: `campaign_id,campaign_name,${base}` }),
    insights({ level: "account", time_increment: "1", fields: "spend,actions" }, true),
    insights({ level: "ad", fields: `ad_id,ad_name,campaign_name,${base}` }),
    insights({ level: "account", breakdowns: "publisher_platform", fields: "spend,actions" }, true),
    insights({ level: "account", breakdowns: "region", fields: "spend,actions" }, true),
    insights({ level: "account", breakdowns: "age,gender", fields: "spend,actions" }, true),
  ]);

  const campaigns: CampaignStat[] = campaignRows
    .map((row) => {
      const spend = num(row.spend);
      const conversations = action(row, CONVERSATION);
      return {
        id: row.campaign_id,
        name: row.campaign_name,
        spend,
        reach: num(row.reach),
        conversations,
        deepConversations: action(row, DEEP_CONVERSATION),
        costPerConversation: ratio(spend, conversations),
        frequency: num(row.frequency),
      };
    })
    .sort((a, b) => b.spend - a.spend);

  // Gasto y alcance salen de todas las campañas Kick Off; las conversaciones y sus costos, de las de WhatsApp.
  const messaging = campaigns.filter((c) => c.name.includes(MESSAGING));
  const messagingSpend = messaging.reduce((sum, c) => sum + c.spend, 0);
  const conversations = messaging.reduce((sum, c) => sum + c.conversations, 0);
  const deepConversations = messaging.reduce((sum, c) => sum + c.deepConversations, 0);
  const totals: Totals = {
    ...totalsOf(accountRows[0]),
    conversations,
    deepConversations,
    costPerConversation: ratio(messagingSpend, conversations),
    costPerDeep: ratio(messagingSpend, deepConversations),
  };

  const byDay = new Map(dayRows.map((row) => [row.date_start, row]));
  const days: DayStat[] = [];
  for (let day = since; day <= until; day = addDay(day)) {
    const row = byDay.get(day);
    const spend = num(row?.spend);
    const conversations = row ? action(row, CONVERSATION) : 0;
    days.push({ day, spend, conversations, costPerConversation: ratio(spend, conversations) });
  }

  const ads: AdStat[] = adRows
    .map((row) => {
      const spend = num(row.spend);
      const conversations = action(row, CONVERSATION);
      return {
        id: row.ad_id,
        name: row.ad_name,
        campaign: row.campaign_name,
        spend,
        conversations,
        deepConversations: action(row, DEEP_CONVERSATION),
        costPerConversation: ratio(spend, conversations),
        ctr: num(row.inline_link_click_ctr),
      };
    })
    .filter((ad) => ad.spend > 0)
    .sort((a, b) => b.spend - a.spend);

  // Mejores anuncios: con muestra mínima y un costo razonable frente al promedio.
  const average = totals.costPerConversation ?? Infinity;
  const winners = ads
    .filter(
      (ad) =>
        ad.conversations >= 5 &&
        ad.spend >= 30 &&
        ad.costPerConversation !== null &&
        ad.costPerConversation <= average * 1.5,
    )
    .sort((a, b) => b.conversations - a.conversations)
    .slice(0, 6);
  const best = await creativesFor(winners);

  // Plataformas: Audience Network se separa porque suele dar clics baratos y poco útiles.
  const platformMap = new Map<string, { spend: number; conversations: number }>();
  let lowQualitySpend = 0;
  for (const row of platformRows) {
    const spend = num(row.spend);
    if (isLowQuality(row)) lowQualitySpend += spend;
    const name = PLATFORM_LABELS[row.publisher_platform] ?? row.publisher_platform;
    const entry = platformMap.get(name) ?? { spend: 0, conversations: 0 };
    entry.spend += spend;
    entry.conversations += action(row, CONVERSATION);
    platformMap.set(name, entry);
  }
  const platforms: PlatformStat[] = [...platformMap]
    .map(([name, v]) => ({ name, ...v, costPerConversation: ratio(v.spend, v.conversations) }))
    .sort((a, b) => b.spend - a.spend);

  // Regiones: Meta no reparte las conversaciones por región, solo las de 3 mensajes.
  const regionMap = new Map<string, { spend: number; deep: number }>();
  for (const row of regionRows) {
    const entry = regionMap.get(row.region) ?? { spend: 0, deep: 0 };
    entry.spend += num(row.spend);
    entry.deep += action(row, DEEP_CONVERSATION);
    regionMap.set(row.region, entry);
  }
  const regions: RegionStat[] = [...regionMap]
    .map(([name, v]) => ({
      name: name === "Distrito Federal" ? "Ciudad de México" : name === "State of Mexico" ? "Estado de México" : name,
      spend: v.spend,
      deepConversations: v.deep,
      costPerDeep: ratio(v.spend, v.deep),
    }))
    .sort((a, b) => b.spend - a.spend);

  const ageMap = new Map<string, { spend: number; conversations: number }>();
  let menSpend = 0;
  let knownSpend = 0;
  for (const row of ageRows) {
    const spend = num(row.spend);
    const entry = ageMap.get(row.age) ?? { spend: 0, conversations: 0 };
    entry.spend += spend;
    entry.conversations += action(row, CONVERSATION);
    ageMap.set(row.age, entry);
    if (row.gender === "male" || row.gender === "female") {
      knownSpend += spend;
      if (row.gender === "male") menSpend += spend;
    }
  }
  const ages: AgeStat[] = [...ageMap]
    .map(([age, v]) => ({ age, ...v, costPerConversation: ratio(v.spend, v.conversations) }))
    .sort((a, b) => a.age.localeCompare(b.age));

  const report: Report = {
    since,
    until,
    totals,
    campaigns,
    days,
    ads,
    best,
    platforms,
    regions,
    ages,
    menShare: knownSpend > 0 ? menSpend / knownSpend : null,
    instagram: null,
    instagramConfigured: Boolean(instagram),
    lowQualitySpend,
  };

  if (instagram) report.instagram = await buildInstagram(instagram, since, until, days).catch(() => null);
  return report;
}

/** Imagen completa y titular de los mejores anuncios. Una lectura por anuncio: `ids=` está obsoleto. */
async function creativesFor(ranked: AdStat[]): Promise<BestAd[]> {
  if (ranked.length === 0) return [];
  const { account } = config();

  type Spec = { image_hash?: string; image_url?: string; name?: string; title?: string; message?: string };
  type Node = {
    creative?: {
      thumbnail_url?: string;
      object_story_spec?: { link_data?: Spec; video_data?: Spec };
    };
  };

  const nodes = new Map<string, Node>();
  await Promise.all(
    ranked.map(async (ad) => {
      const [node] = await graph<Node>(ad.id, { fields: "creative{object_story_spec,thumbnail_url}" }).catch(() => []);
      if (node) nodes.set(ad.id, node);
    }),
  );

  const specOf = (id: string) => {
    const spec = nodes.get(id)?.creative?.object_story_spec;
    return spec?.link_data ?? spec?.video_data;
  };

  const hashes = ranked.map((ad) => specOf(ad.id)?.image_hash).filter((h): h is string => Boolean(h));
  const images = new Map<string, string>();
  if (hashes.length > 0) {
    const rows = await graph<{ hash: string; url: string }>(`${account}/adimages`, {
      hashes: JSON.stringify(hashes),
      fields: "hash,url",
    }).catch(() => []);
    for (const row of rows) images.set(row.hash, row.url);
  }

  return ranked.map((ad) => {
    const spec = specOf(ad.id);
    const fromHash = spec?.image_hash ? images.get(spec.image_hash) : undefined;
    return {
      ...ad,
      image: fromHash ?? spec?.image_url ?? nodes.get(ad.id)?.creative?.thumbnail_url ?? null,
      headline: spec?.name ?? spec?.title ?? null,
      text: spec?.message ?? null,
    };
  });
}

/*
 * Instagram entrega los datos diarios en cubos que terminan a medianoche del
 * Pacífico (07:00 u 08:00 UTC). Un cubo que termina el día D contiene el día
 * D-1, y `until` es exclusivo. Por eso los días S..U son los cubos que
 * terminan S+1..U+1, pedidos como since S+1 y until U+2. El último día no
 * tiene cubo hasta que termina.
 */
const bucketSince = (since: string) => addDay(since, 1);
const bucketUntil = (until: string) => addDay(until, 2);
const bucketDay = (endTime: string) => addDay(endTime.slice(0, 10), -1);

type FollowTotals = { total_value?: { breakdowns?: { results?: { dimension_values: string[]; value: number }[] }[] } };

async function followerChange(instagram: string, since: string, until: string) {
  const read = async (end: string) => {
    const [row] = await graph<FollowTotals>(`${instagram}/insights`, {
      metric: "follows_and_unfollows",
      period: "day",
      metric_type: "total_value",
      breakdown: "follow_type",
      since: bucketSince(since),
      until: end,
    });
    const results = row?.total_value?.breakdowns?.[0]?.results ?? [];
    const value = (type: string) => num(results.find((r) => r.dimension_values[0] === type)?.value);
    return { gained: value("FOLLOWER"), lost: value("NON_FOLLOWER") };
  };
  return read(bucketUntil(until)).catch(() => read(addDay(until, 1)));
}

async function followersPerDay(instagram: string, since: string, until: string) {
  const read = async (end: string) => {
    const [row] = await graph<{ values?: { value: number; end_time: string }[] }>(`${instagram}/insights`, {
      metric: "follower_count",
      period: "day",
      since: bucketSince(since),
      until: end,
    });
    const found = new Map((row?.values ?? []).map((v) => [bucketDay(v.end_time), num(v.value)]));
    const out: { day: string; gained: number }[] = [];
    for (let day = since; day <= until; day = addDay(day)) out.push({ day, gained: found.get(day) ?? 0 });
    return out;
  };
  return read(bucketUntil(until)).catch(() => read(addDay(until, 1)));
}

/**
 * Seguidores de Instagram junto al gasto diario de las campañas. Muestra las
 * dos series y no afirma que los anuncios causaron los seguidores: Instagram
 * no dice de dónde viene cada uno.
 */
async function buildInstagram(instagram: string, since: string, until: string, days: DayStat[]): Promise<Instagram | null> {
  // Instagram solo mira 30 días hacia atrás y pide menos de 30 días de rango.
  const windowSince = daysBetween(since, until) > 28 ? addDay(until, -28) : since;
  const [profile] = await graph<{ username?: string; followers_count?: number }>(instagram, {
    fields: "username,followers_count",
  }).catch(() => []);
  const [perDay, change] = await Promise.all([
    followersPerDay(instagram, windowSince, until).catch(() => null),
    followerChange(instagram, windowSince, until).catch(() => null),
  ]);
  if (!perDay) return null;

  const spendByDay = new Map(days.map((d) => [d.day, d.spend]));
  return {
    username: profile?.username ?? null,
    followersNow: typeof profile?.followers_count === "number" ? profile.followers_count : null,
    since: windowSince,
    until,
    gained: change?.gained ?? null,
    lost: change?.lost ?? null,
    perDay: perDay.map((d) => ({ ...d, spend: spendByDay.get(d.day) ?? 0 })),
  };
}

/* ---- caché: el límite de llamadas de Meta es la restricción real ---- */

const TTL_LIVE = 15 * 60 * 1000;
const TTL_PAST = 6 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; ttl: number; value: Promise<Report> }>();

export function getReport(since: string, until: string) {
  const key = `${since}|${until}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < hit.ttl) return hit.value;

  const value = buildReport(since, until);
  const ttl = until >= accountToday() ? TTL_LIVE : TTL_PAST;
  cache.set(key, { at: Date.now(), ttl, value });
  // Una lectura fallida no se recuerda.
  value.catch(() => cache.delete(key));
  if (cache.size > 40) cache.delete(cache.keys().next().value as string);
  return value;
}

export { addDay };
