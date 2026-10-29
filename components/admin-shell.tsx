import Link from "next/link";

/**
 * Piezas compartidas del panel interno: la pantalla de login y el marco con
 * navegacion. Son componentes de servidor; el estado de sesion lo decide cada
 * pagina leyendo la cookie.
 */

export function AdminLogin({ error, next = "/admin" }: { error?: boolean; next?: string }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-mist px-5">
      <form
        method="POST"
        action="/api/admin/login"
        className="card w-full max-w-sm p-8 text-center"
      >
        <p className="eyebrow">Hydroloop® · Interno</p>
        <h1 className="mt-2 text-[26px]">Panel Hydroloop</h1>
        <p className="mt-2 text-[13.5px] text-ink-2">
          Pedidos, ventas y marketing en un solo lugar.
        </p>
        <input type="hidden" name="next" value={next} />
        <input
          type="email"
          name="email"
          required
          autoFocus
          placeholder="Correo"
          autoComplete="username"
          className="field mt-6"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Contraseña"
          autoComplete="current-password"
          className="field mt-3"
        />
        {error ? (
          <p role="alert" className="mt-3 text-[13px] text-[#a1332f]">
            Correo o contraseña incorrectos.
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary mt-4 w-full">
          Entrar
        </button>
      </form>
    </main>
  );
}

const tabs = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/marketing", label: "Marketing" },
  { href: "/admin/reportes", label: "Reportes" },
  { href: "/admin/recuperacion", label: "Recuperación" },
  { href: "/admin/tienda", label: "Tienda" },
] as const;

export function AdminShell({
  active,
  title,
  children,
}: {
  active: (typeof tabs)[number]["href"];
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-mist px-5 pb-20 pt-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Hydroloop® · Interno</p>
            <h1 className="mt-1 text-[clamp(26px,4vw,36px)]">{title}</h1>
          </div>
          <form method="POST" action="/api/admin/logout" className="no-print">
            <button type="submit" className="btn btn-ghost btn-sm">
              Salir
            </button>
          </form>
        </div>

        <nav className="no-print mt-6 flex flex-wrap gap-2 border-b border-line pb-3">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                tab.href === active
                  ? "bg-invert text-invert-fg"
                  : "bg-surface text-ink-2 hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          ))}
          <span className="flex-1" />
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
        </nav>

        {children}
      </div>
    </main>
  );
}
