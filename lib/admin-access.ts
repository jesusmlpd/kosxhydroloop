import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminCredentials, can, getSession, type Section, type Session } from "@/lib/admin";
import { findActiveMember } from "@/lib/admin-users";

/** La sesion de la cookie, sin consultar la base. Sirve para pintar el menu. */
export async function currentSession(): Promise<Session | null> {
  const jar = await cookies();
  return getSession(jar.get(ADMIN_COOKIE)?.value);
}

/**
 * Acceso a una seccion: "login" si no hay sesion valida, "denied" si hay sesion
 * pero su rol no entra ahi, o la sesion. A un miembro se le vuelve a validar en
 * la base en cada visita: si lo desactivan o le cambian el rol, surte efecto al instante.
 */
export async function adminAccess(section: Section): Promise<"login" | "denied" | Session> {
  const session = await currentSession();
  if (!session) return "login";
  if (session.role === "owner") {
    return session.email === adminCredentials().email ? session : "login";
  }
  const member = await findActiveMember(session.email);
  if (!member || member.role !== session.role) return "login";
  return can(session.role, section) ? session : "denied";
}

/** Igual que adminAccess pero para rutas de API: devuelve la sesion o el codigo de error. */
export async function apiAccess(section: Section): Promise<{ session: Session } | { status: 401 | 403 }> {
  const access = await adminAccess(section);
  if (access === "login") return { status: 401 };
  if (access === "denied") return { status: 403 };
  return { session: access };
}
