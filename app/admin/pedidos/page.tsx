import type { Metadata } from "next";
import { ShipForm } from "@/components/admin-ship";
import { AdminLogin, AdminShell, NoAccess } from "@/components/admin-shell";
import { adminAccess } from "@/lib/admin-access";
import { loadOrders } from "@/lib/admin-data";
import { formatMoney } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Pedidos | Hydroloop®",
  robots: { index: false, follow: false },
};

// Siempre fresco: este panel lee pedidos en vivo desde Stripe.
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const access = await adminAccess("pedidos");
  if (access === "login") {
    return <AdminLogin error={Boolean(error)} next="/admin/pedidos" />;
  }
  if (access === "denied") return <NoAccess />;

  const orders = await loadOrders();
  const dateFormat = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AdminShell active="/admin/pedidos" title="Pedidos">
      {orders === null ? (
        <div className="card mt-8 p-8 text-center">
          <h2 className="text-[20px]">Stripe aún no está conectado</h2>
          <p className="mx-auto mt-3 max-w-md text-[14.5px] text-ink-2">
            Este panel lee los pedidos directamente de Stripe, sin base de datos. En
            cuanto <code>STRIPE_SECRET_KEY</code> esté en las variables de entorno, cada
            compra aparece aquí sola, con dirección, artículos y botón para marcarla
            como enviada con su guía.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <h2 className="text-[20px]">Sin pedidos todavía</h2>
          <p className="mt-2 text-[14.5px] text-ink-2">
            Cuando entre la primera compra, aparece aquí en tiempo real.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-display text-[16px] font-bold tabular-nums">
                    {order.ref}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                      order.refundState === "pending"
                        ? "bg-[#ffe3e0] text-[#9b2c20] dark:bg-[#3d1a16] dark:text-[#f0a79f]"
                        : order.refundState === "full"
                          ? "bg-mist text-ink-2"
                          : order.shipped
                        ? "bg-foam text-deep dark:bg-[#0d3a45] dark:text-aqua"
                        : order.paid
                          ? "bg-[#fff3d6] text-[#8a6116] dark:bg-[#3a2f12] dark:text-[#e8c86f]"
                          : "bg-mist text-ink-3"
                    }`}
                  >
                    {order.refundState === "pending"
                      ? "Reembolso en proceso"
                      : order.refundState === "full"
                        ? "Reembolsado"
                        : order.shipped
                          ? order.refundState === "partial"
                            ? "Enviado · reembolso parcial"
                            : "Enviado"
                          : order.paid
                            ? order.refundState === "partial"
                              ? "Por enviar · reembolso parcial"
                              : "Por enviar"
                            : "Pendiente de pago"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-display text-[17px] font-bold tabular-nums">
                    {formatMoney(order.totalCents, "es")}
                  </p>
                  {order.refundedCents > 0 ? (
                    <p className="text-[12.5px] font-semibold text-[#9b2c20] dark:text-[#f0a79f]">
                      Reembolsado: {formatMoney(order.refundedCents, "es")}
                    </p>
                  ) : null}
                  <p className="text-[12px] text-ink-3">
                    {dateFormat.format(new Date(order.created * 1000))}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 text-[14px] sm:grid-cols-2">
                <div>
                  <p className="font-semibold">{order.name}</p>
                  <p className="text-ink-2">{order.email}</p>
                  {order.phone ? <p className="text-ink-2">{order.phone}</p> : null}
                  {order.address ? (
                    <p className="mt-1.5 text-ink-2">{order.address}</p>
                  ) : null}
                  {order.notes ? (
                    <p className="mt-1.5 text-[13px] italic text-ink-3">“{order.notes}”</p>
                  ) : null}
                </div>
                <div>
                  <ul className="space-y-1 text-ink-2">
                    {order.items.map((item) => (
                      <li key={item.name}>
                        {item.qty} x {item.name}
                      </li>
                    ))}
                  </ul>
                  {order.tracking ? (
                    <p className="mt-2 text-[13px]">
                      Guía: <span className="font-semibold tabular-nums">{order.tracking}</span>
                    </p>
                  ) : null}
                </div>
              </div>

              {order.paid && !order.shipped && order.paymentIntent && order.refundState !== "full" && order.refundState !== "pending" ? (
                <ShipForm paymentIntent={order.paymentIntent} />
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-center text-[12.5px] text-ink-3">
        Los pedidos por transferencia (sin cobro en línea) llegan al correo de ventas y
        no aparecen aquí. Los de Mercado Pago se administran en su propio panel.
      </p>
    </AdminShell>
  );
}
