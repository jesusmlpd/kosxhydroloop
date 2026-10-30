import Link from "next/link";
import { ROLE_LABEL, can, type Section } from "@/lib/admin";
import { currentSession } from "@/lib/admin-access";

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

type NavLeaf = { href: string; label: string; section: Section };
type NavItem = { label: string; icon: string; section: Section; href?: string; children?: NavLeaf[] };

/** Menu lateral del panel. Los grupos se abren solos cuando estas dentro de ellos. */
export const NAV: NavItem[] = [
  { label: "Inicio", icon: "home", section: "inicio", href: "/admin" },
  { label: "Pedidos", icon: "box", section: "pedidos", href: "/admin/pedidos" },
  { label: "Clientes", icon: "users", section: "clientes", href: "/admin/clientes" },
  { label: "Informes", icon: "chart", section: "informes", href: "/admin/informes" },
  { label: "Descuentos", icon: "tag", section: "descuentos", href: "/admin/descuentos" },
  {
    label: "Marketing",
    icon: "megaphone",
    section: "marketing",
    children: [
      { href: "/admin/marketing/meta", label: "Meta Ads", section: "marketing" },
      { href: "/admin/marketing/correos", label: "Correos", section: "marketing" },
    ],
  },
  {
    label: "Tienda",
    icon: "store",
    section: "tienda",
    children: [
      { href: "/admin/tienda/productos", label: "Productos", section: "tienda" },
      { href: "/admin/tienda/envio-promos", label: "Envío y promos", section: "tienda" },
      { href: "/admin/tienda/inicio", label: "Página de inicio", section: "tienda" },
    ],
  },
  {
    label: "Configuración",
    icon: "gear",
    section: "configuracion",
    children: [
      { href: "/admin/configuracion/conexiones", label: "Conexiones", section: "configuracion" },
      { href: "/admin/configuracion/equipo", label: "Equipo", section: "equipo" },
      { href: "/admin/configuracion/historial", label: "Historial", section: "historial" },
    ],
  },
];

const ICONS: Record<string, string> = {
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  box: "M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8",
  chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  tag: "M3 12V3h9l9 9-9 9-9-9zM8 8h.01",
  megaphone: "M3 11v2a1 1 0 001 1h3l8 4V6L7 10H4a1 1 0 00-1 1zM19 9a4 4 0 010 6",
  store: "M3 9l2-5h14l2 5M3 9v11h18V9M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M9 20v-6h6v6",
  gear: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8",
};

function Icon({ name }: { name: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICONS[name]} />
    </svg>
  );
}

const isActive = (href: string, active: string) => (href === "/admin" ? active === "/admin" : active === href || active.startsWith(`${href}/`));

function Menu({ active, items }: { active: string; items: NavItem[] }) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const open = item.children?.some((child) => isActive(child.href, active)) ?? false;
        const row = "flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-semibold transition-colors";
        if (!item.children) {
          const on = isActive(item.href as string, active);
          return (
            <li key={item.label}>
              <Link href={item.href as string} className={`${row} ${on ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/8 hover:text-white"}`}>
                <Icon name={item.icon} />
                {item.label}
              </Link>
            </li>
          );
        }
        return (
          <li key={item.label}>
            <details open={open} className="group">
              <summary className={`${row} cursor-pointer list-none ${open ? "text-white" : "text-white/70 hover:bg-white/8 hover:text-white"}`}>
                <Icon name={item.icon} />
                <span className="flex-1">{item.label}</span>
                <span className="text-[10px] opacity-60 transition-transform group-open:rotate-90" aria-hidden>▶</span>
              </summary>
              <ul className="mb-1 ml-[26px] mt-0.5 space-y-0.5 border-l border-white/15 pl-3">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className={`block rounded-md px-3 py-1.5 text-[13.5px] transition-colors ${
                        isActive(child.href, active) ? "bg-white/12 font-semibold text-white" : "text-white/65 hover:text-white"
                      }`}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        );
      })}
    </ul>
  );
}

export async function AdminShell({
  active,
  title,
  children,
}: {
  /** Ruta de la pagina actual; marca el menu. */
  active: string;
  title: string;
  children: React.ReactNode;
}) {
  // El menu solo muestra lo que el rol de quien entro puede abrir.
  const session = await currentSession();
  const nav = NAV.map((item) => ({
    ...item,
    children: item.children?.filter((child) => !session || can(session.role, child.section)),
  })).filter((item) => (session ? (item.children ? item.children.length > 0 : can(session.role, item.section)) : true));
  const brand = (
    <Link href="/admin" className="block px-3 py-1">
      <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">Hydroloop® · Interno</span>
      <span className="mt-0.5 block font-display text-[18px] font-bold text-white">Panel</span>
    </Link>
  );
  const footer = (
    <div className="no-print space-y-1 border-t border-white/12 pt-3">
      {session ? (
        <p className="px-3 pb-1 text-[12.5px] text-white/60">
          {session.name}
          <span className="block text-[11px] uppercase tracking-[0.08em]">{ROLE_LABEL[session.role]}</span>
        </p>
      ) : null}
      <a href="https://tienda.hydroloop.com.mx" target="_blank" rel="noreferrer" className="block rounded-lg px-3 py-2 text-[13.5px] text-white/70 hover:text-white">
        Ver la tienda ↗
      </a>
      <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noreferrer" className="block rounded-lg px-3 py-2 text-[13.5px] text-white/70 hover:text-white">
        Stripe ↗
      </a>
      <form method="POST" action="/api/admin/logout">
        <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-[13.5px] text-white/70 hover:text-white">
          Salir
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-dvh bg-mist lg:grid lg:grid-cols-[236px_1fr]">
      {/* Escritorio: menu fijo a la izquierda */}
      <aside className="no-print sticky top-0 hidden h-dvh flex-col justify-between overflow-y-auto bg-invert p-4 lg:flex">
        <div className="space-y-5">
          {brand}
          <Menu active={active} items={nav} />
        </div>
        {footer}
      </aside>

      {/* Celular: barra superior con el menu desplegable */}
      <header className="no-print bg-invert px-4 py-3 lg:hidden">
        <details>
          <summary className="flex cursor-pointer list-none items-center justify-between">
            <span className="font-display text-[16px] font-bold text-white">Panel Hydroloop®</span>
            <span className="rounded-lg border border-white/25 px-3 py-1 text-[13px] font-semibold text-white">Menú</span>
          </summary>
          <div className="mt-3 space-y-4 pb-2">
            <Menu active={active} items={nav} />
            {footer}
          </div>
        </details>
      </header>

      <main className="min-w-0 px-5 pb-20 pt-8 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">Hydroloop® · Interno</p>
          <h1 className="mt-1 text-[clamp(26px,4vw,36px)]">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}

/** Hay sesion pero el rol no entra a esta seccion. */
export async function NoAccess() {
  return (
    <AdminShell active="" title="Sin acceso">
      <div className="card mt-8 p-8 text-center">
        <h2 className="text-[20px]">Tu rol no entra a esta sección</h2>
        <p className="mx-auto mt-3 max-w-md text-[14.5px] text-ink-2">
          Si la necesitas, pídele al propietario que te cambie el rol en Configuración, Equipo.
        </p>
        <Link href="/admin" className="btn btn-primary mt-5">
          Ir al inicio
        </Link>
      </div>
    </AdminShell>
  );
}
