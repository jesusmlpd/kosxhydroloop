import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminLogin, AdminShell } from "@/components/admin-shell";
import { ADMIN_COOKIE, adminCredentials, isAdmin } from "@/lib/admin";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Marketing | Hydroloop®",
  robots: { index: false, follow: false },
};

// Lee variables de entorno en cada request para reflejar el estado real.
export const dynamic = "force-dynamic";

export default async function AdminMarketingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const jar = await cookies();
  const { error } = await searchParams;
  if (!isAdmin(jar.get(ADMIN_COOKIE)?.value)) {
    return <AdminLogin error={Boolean(error)} next="/admin/marketing" />;
  }

  const { usingDefaults } = adminCredentials();

  const integrations = [
    {
      name: "Stripe",
      ready: Boolean(process.env.STRIPE_SECRET_KEY),
      detail:
        "Cobra tarjeta, Apple Pay, Google Pay, OXXO, SPEI y MSI. Los métodos se activan en el dashboard de Stripe, no en el código.",
      env: "STRIPE_SECRET_KEY",
      steps: [
        "Copiar la llave secreta desde dashboard.stripe.com (Developers, API keys) a STRIPE_SECRET_KEY.",
        `Crear el webhook a ${site.url}/api/webhooks/stripe (evento checkout.session.completed) y copiar su secreto a STRIPE_WEBHOOK_SECRET.`,
        "Activar los métodos de pago deseados en Settings, Payment methods (OXXO, SPEI y MSI incluidos).",
        "Para Apple Pay: verificar el dominio en Settings, Payment method domains.",
      ],
      link: { label: "Dashboard de Stripe", href: "https://dashboard.stripe.com" },
    },
    {
      name: "Mercado Pago",
      ready: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN),
      detail: "Segunda opción de pago: tarjetas con MSI, saldo en cuenta y efectivo.",
      env: "MERCADOPAGO_ACCESS_TOKEN",
      steps: [
        "Crear la aplicación en el panel de desarrolladores de Mercado Pago.",
        "Copiar el Access Token de producción a MERCADOPAGO_ACCESS_TOKEN.",
      ],
      link: { label: "Panel de Mercado Pago", href: "https://www.mercadopago.com.mx/developers/panel" },
    },
    {
      name: "Pixel de Meta",
      ready: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
      detail:
        "El sitio ya dispara PageView, ViewContent, AddToCart, InitiateCheckout y Purchase con monto. Solo falta el ID del Pixel. Con eso, Meta arma los demográficos de tráfico (edad, género, ciudad) y las audiencias para anuncios.",
      env: "NEXT_PUBLIC_META_PIXEL_ID",
      steps: [
        "En Meta Events Manager, crear (o reutilizar) el Pixel de Hydroloop.",
        "Copiar el ID numérico del Pixel a NEXT_PUBLIC_META_PIXEL_ID y redesplegar.",
        "Verificar los eventos con la extensión Meta Pixel Helper o el Test Events del Events Manager.",
        "Si el Pixel ya vivía en hydroloop.com.mx (WooCommerce), usar el mismo ID para conservar el histórico y las audiencias.",
      ],
      link: { label: "Meta Events Manager", href: "https://business.facebook.com/events_manager2" },
    },
    {
      name: "Google Analytics 4",
      ready: Boolean(process.env.NEXT_PUBLIC_GA4_ID),
      detail:
        "Tráfico, fuentes, ciudades y demográficos de audiencia. El sitio ya manda page_view, view_item, add_to_cart, begin_checkout y purchase.",
      env: "NEXT_PUBLIC_GA4_ID",
      steps: [
        "Crear la propiedad GA4 y copiar el ID de medición (G-XXXXXXX) a NEXT_PUBLIC_GA4_ID.",
        "En Admin, Data collection, activar Google signals para ver edad y género.",
      ],
      link: { label: "Google Analytics", href: "https://analytics.google.com" },
    },
    {
      name: "Correo de pedidos",
      ready: Boolean(process.env.FORMSUBMIT_TO),
      detail:
        "Cada pedido y mensaje de contacto llega también por correo, como respaldo del panel.",
      env: "FORMSUBMIT_TO",
      steps: [
        "Poner el buzón real en FORMSUBMIT_TO.",
        "Dar clic al correo de activación de FormSubmit en el primer envío.",
      ],
      link: null,
    },
  ];

  return (
    <AdminShell active="/admin/marketing" title="Marketing y cobros">
      {usingDefaults ? (
        <div className="card mt-8 border border-[#e8c86f] p-5">
          <p className="text-[14px]">
            <strong>Acceso con credenciales por defecto.</strong> Este panel está
            entrando con el correo y la contraseña de arranque. Antes de compartir el
            sitio, define <code>ADMIN_EMAIL</code> y <code>ADMIN_PASSWORD</code> en las
            variables de entorno del hosting.
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {integrations.map((item) => (
          <div key={item.name} className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[16px] font-bold">{item.name}</h2>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                  item.ready
                    ? "bg-foam text-deep dark:bg-[#0d3a45] dark:text-aqua"
                    : "bg-[#fff3d6] text-[#8a6116] dark:bg-[#3a2f12] dark:text-[#e8c86f]"
                }`}
              >
                {item.ready ? "Conectado" : "Pendiente"}
              </span>
            </div>
            <p className="mt-2 text-[14px] text-ink-2">{item.detail}</p>
            {!item.ready ? (
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[13.5px] text-ink-2">
                {item.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <code className="rounded-lg bg-mist px-2.5 py-1 text-[12px]">{item.env}</code>
              {item.link ? (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] font-semibold text-teal underline-offset-2 hover:underline"
                >
                  {item.link.label} ↗
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-4 p-6">
        <h2 className="font-display text-[16px] font-bold">
          Migración desde el sitio actual (WooCommerce)
        </h2>
        <p className="mt-2 max-w-3xl text-[14px] text-ink-2">
          El sitio vigente, hydroloop.com.mx, corre en WordPress con WooCommerce. Este
          sitio lo reemplaza con su propio checkout (Stripe y Mercado Pago), así que no
          hay nada de WooCommerce que instalar aquí. El día del cambio:
        </p>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[13.5px] text-ink-2">
          <li>Apuntar el dominio hydroloop.com.mx a este proyecto en el hosting.</li>
          <li>Actualizar la URL del sitio en lib/site.ts al dominio final.</li>
          <li>Re-verificar el dominio en Stripe (Apple Pay) y en el webhook.</li>
          <li>Conservar el mismo Pixel de Meta para no perder histórico ni audiencias.</li>
          <li>Congelar los pedidos en WooCommerce y surtir los pendientes desde allá.</li>
        </ol>
        <a
          href={site.currentSite}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-[13px] font-semibold text-teal underline-offset-2 hover:underline"
        >
          Ver sitio actual ↗
        </a>
      </div>
    </AdminShell>
  );
}
