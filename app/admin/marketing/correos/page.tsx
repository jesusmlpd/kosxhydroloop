import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminLogin, AdminShell } from "@/components/admin-shell";
import { RecoveryEditor } from "@/components/admin-recovery";
import { ADMIN_COOKIE, isAdmin } from "@/lib/admin";
import { commerce, formatMoney } from "@/lib/commerce";
import { emailConfigured } from "@/lib/email";
import { kvAvailable, kvConfigured } from "@/lib/kv";
import { loadSettings, loadStats } from "@/lib/recovery";

export const metadata: Metadata = {
  title: "Recuperación | Hydroloop®",
  robots: { index: false, follow: false },
};

// Siempre fresco: las cifras salen de la base en cada visita.
export const dynamic = "force-dynamic";

export default async function AdminRecoveryPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const jar = await cookies();
  const { error } = await searchParams;
  if (!isAdmin(jar.get(ADMIN_COOKIE)?.value)) {
    return <AdminLogin error={Boolean(error)} next="/admin/marketing/correos" />;
  }

  const [settings, stats] = await Promise.all([loadSettings(), loadStats().catch(() => null)]);
  const coupons = [
    ...(commerce.promo.code ? [{ code: commerce.promo.code, percentOff: commerce.promo.percentOff }] : []),
    ...commerce.coupons,
  ].map((coupon) => ({ code: coupon.code, label: `${coupon.code} (${coupon.percentOff}% de descuento)` }));

  const cards = stats
    ? [
        { label: "En espera de pagar", value: String(stats.pending) },
        { label: "Correos enviados", value: String(Object.values(stats.sentByStep).reduce((a, b) => a + b, 0)) },
        { label: "Recuperados", value: String(stats.recoveredCount) },
        { label: "Ventas recuperadas", value: formatMoney(stats.recoveredCents, "es") },
      ]
    : [];

  return (
    <AdminShell active="/admin/marketing/correos" title="Correos: recuperación de carritos">
      {!kvConfigured() ? (
        <div className="card mt-6 border-[#e8c86f] p-5 text-[14px]">
          <p className="font-semibold">
            {kvAvailable() ? "Modo de prueba local (memoria)" : "Falta conectar la base de datos"}
          </p>
          <p className="mt-1 text-ink-2">
            {kvAvailable()
              ? "Sin Redis conectado los datos se pierden al reiniciar."
              : "Instala Upstash Redis desde Vercel (Storage > Marketplace) para guardar las reglas y el registro de recordatorios. Mientras no esté, esta función permanece apagada."}
          </p>
        </div>
      ) : null}
      {!emailConfigured() ? (
        <div className="card mt-4 border-[#e8c86f] p-5 text-[14px]">
          <p className="font-semibold">Falta el servicio de correo</p>
          <p className="mt-1 text-ink-2">Sin RESEND_API_KEY no sale ningún recordatorio.</p>
        </div>
      ) : null}
      {!process.env.CRON_SECRET ? (
        <div className="card mt-4 border-[#e8c86f] p-5 text-[14px]">
          <p className="font-semibold">Falta CRON_SECRET</p>
          <p className="mt-1 text-ink-2">
            Sin esa variable en Vercel el cron no corre y los recordatorios no salen aunque la función esté encendida.
          </p>
        </div>
      ) : null}

      {cards.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="card p-5">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{card.label}</p>
              <p className="mt-2 font-display text-[26px] font-bold tabular-nums">{card.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <RecoveryEditor initial={settings} coupons={coupons} canSave={kvAvailable()} canSend={emailConfigured()} />
    </AdminShell>
  );
}
