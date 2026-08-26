import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ShipForm } from "@/components/admin-ship";
import { ADMIN_COOKIE, isAdmin } from "@/lib/admin";
import { formatMoney } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Pedidos | Hydroloop®",
  robots: { index: false, follow: false },
};

// Siempre fresco: este panel lee pedidos en vivo desde Stripe.
export const dynamic = "force-dynamic";

type Order = {
  id: string;
  paymentIntent: string | null;
  ref: string;
  created: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  totalCents: number;
  paid: boolean;
  shipped: boolean;
  tracking: string;
  items: string[];
};

async function loadOrders(): Promise<Order[] | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(key);

  const sessions = await stripe.checkout.sessions.list({
    limit: 50,
    expand: ["data.payment_intent"],
  });

  const orders: Order[] = [];
  for (const session of sessions.data) {
    if (session.status !== "complete") continue;
    const intent =
      typeof session.payment_intent === "object" ? session.payment_intent : null;
    const lineItems = await stripe.checkout.sessions
      .listLineItems(session.id, { limit: 10 })
      .catch(() => null);

    orders.push({
      id: session.id,
      paymentIntent: intent?.id ?? null,
      ref: session.client_reference_id ?? session.metadata?.ref ?? session.id.slice(-8),
      created: session.created,
      name: session.customer_details?.name ?? "",
      email: session.customer_details?.email ?? session.customer_email ?? "",
      phone: session.metadata?.phone ?? session.customer_details?.phone ?? "",
      address: session.metadata?.address ?? "",
      notes: session.metadata?.notes ?? "",
      totalCents: session.amount_total ?? 0,
      paid: session.payment_status === "paid",
      shipped: intent?.metadata?.shipped === "1",
      tracking: intent?.metadata?.tracking ?? "",
      items: lineItems?.data.map((item) => `${item.quantity} x ${item.description}`) ?? [],
    });
  }
  return orders;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const jar = await cookies();
  const authed = isAdmin(jar.get(ADMIN_COOKIE)?.value);
  const { error } = await searchParams;

  // ---------- Login ----------
  if (!authed) {
    return (
      <main className="grid min-h-dvh place-items-center bg-mist px-5">
        <form
          method="POST"
          action="/api/admin/login"
          className="card w-full max-w-sm p-8 text-center"
        >
          <p className="eyebrow">Hydroloop® · Interno</p>
          <h1 className="mt-2 text-[26px]">Panel de pedidos</h1>
          {!process.env.ADMIN_PASSWORD ? (
            <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-[13px] text-ink-2">
              Falta definir <code>ADMIN_PASSWORD</code> en las variables de entorno para
              activar este panel.
            </p>
          ) : (
            <>
              <input
                type="password"
                name="password"
                required
                autoFocus
                placeholder="Contraseña"
                className="field mt-6"
              />
              {error ? (
                <p role="alert" className="mt-3 text-[13px] text-[#a1332f]">
                  Contraseña incorrecta.
                </p>
              ) : null}
              <button type="submit" className="btn btn-primary mt-4 w-full">
                Entrar
              </button>
            </>
          )}
        </form>
      </main>
    );
  }

  // ---------- Pedidos ----------
  const orders = await loadOrders();
  const dateFormat = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="min-h-dvh bg-mist px-5 pb-20 pt-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Hydroloop® · Interno</p>
            <h1 className="mt-1 text-[clamp(26px,4vw,36px)]">Pedidos</h1>
          </div>
          <div className="flex gap-2">
            <a
              href="https://dashboard.stripe.com/payments"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm"
            >
              Stripe
            </a>
            <a
              href="https://www.mercadopago.com.mx/activities"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm"
            >
              Mercado Pago
            </a>
          </div>
        </div>

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
                        order.shipped
                          ? "bg-foam text-deep dark:bg-[#0d3a45] dark:text-aqua"
                          : order.paid
                            ? "bg-[#fff3d6] text-[#8a6116] dark:bg-[#3a2f12] dark:text-[#e8c86f]"
                            : "bg-mist text-ink-3"
                      }`}
                    >
                      {order.shipped ? "Enviado" : order.paid ? "Por enviar" : "Pendiente de pago"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-[17px] font-bold tabular-nums">
                      {formatMoney(order.totalCents, "es")}
                    </p>
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
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {order.tracking ? (
                      <p className="mt-2 text-[13px]">
                        Guía: <span className="font-semibold tabular-nums">{order.tracking}</span>
                      </p>
                    ) : null}
                  </div>
                </div>

                {order.paid && !order.shipped && order.paymentIntent ? (
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
      </div>
    </main>
  );
}
