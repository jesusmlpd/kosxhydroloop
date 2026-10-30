/** Roles y permisos del panel. Codigo puro (sin crypto ni base), para poder usarlo tambien en el navegador. */
export type Role = "owner" | "admin" | "operaciones" | "marketing";
export const MEMBER_ROLES: Exclude<Role, "owner">[] = ["admin", "operaciones", "marketing"];
export const ROLE_LABEL: Record<Role, string> = {
  owner: "Propietario",
  admin: "Administrador",
  operaciones: "Operaciones",
  marketing: "Marketing",
};
export const ROLE_HELP: Record<Exclude<Role, "owner">, string> = {
  admin: "Todo el panel menos el equipo.",
  operaciones: "Pedidos, clientes e informes. No cambia precios ni promos.",
  marketing: "Clientes, informes, descuentos, marketing y tienda. No ve pedidos.",
};

export type Section =
  | "inicio"
  | "pedidos"
  | "clientes"
  | "informes"
  | "descuentos"
  | "marketing"
  | "tienda"
  | "configuracion"
  | "historial"
  | "equipo";

const PERMISSIONS: Record<Role, readonly Section[] | "all"> = {
  owner: "all",
  admin: ["inicio", "pedidos", "clientes", "informes", "descuentos", "marketing", "tienda", "configuracion", "historial"],
  operaciones: ["inicio", "pedidos", "clientes", "informes"],
  marketing: ["inicio", "clientes", "informes", "descuentos", "marketing", "tienda"],
};

export const can = (role: Role, section: Section) => {
  const allowed = PERMISSIONS[role];
  return allowed === "all" || allowed.includes(section);
};
