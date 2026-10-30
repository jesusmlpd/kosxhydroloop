import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { ROLE_LABEL, type Role } from "@/lib/admin-roles";

/**
 * Acceso al panel interno. Hay un propietario (ADMIN_EMAIL y ADMIN_PASSWORD de
 * las variables de entorno, siempre puede entrar) y miembros del equipo que el
 * propietario da de alta desde Configuracion > Equipo (se guardan en la base de
 * datos con la contrasena en hash). Cada miembro tiene un rol que decide a que
 * secciones entra.
 *
 * La sesion es una cookie firmada con los datos de quien entro. La firma sale de
 * las credenciales del propietario: cambiar su contrasena cierra todas las sesiones.
 *
 * Las credenciales por defecto existen para que el panel funcione desde el
 * primer deploy; hay que definir ADMIN_EMAIL y ADMIN_PASSWORD en el hosting.
 */
export const ADMIN_COOKIE = "hl-admin";
export const SESSION_SECONDS = 60 * 60 * 24 * 30;

const DEFAULT_EMAIL = "oscar@kickoffsocial.com";
const DEFAULT_PASSWORD = "admin";

export { MEMBER_ROLES, ROLE_HELP, ROLE_LABEL, can } from "@/lib/admin-roles";
export type { Role, Section } from "@/lib/admin-roles";

export function adminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || DEFAULT_EMAIL).trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD,
    usingDefaults: !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD,
  };
}

/** Llave de firma de las sesiones: sale de las credenciales del propietario. */
function signingKey() {
  const { email, password } = adminCredentials();
  return createHmac("sha256", `${email}\n${password}`).update("hydroloop-admin-v3").digest();
}

export type Session = { email: string; name: string; role: Role; exp: number };

export function signSession(session: Omit<Session, "exp">, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ ...session, exp: now + SESSION_SECONDS * 1000 })).toString("base64url");
  const sig = createHmac("sha256", signingKey()).update(payload).digest("base64url");
  return `v3.${payload}.${sig}`;
}

export function getSession(cookieValue: string | undefined, now = Date.now()): Session | null {
  if (!cookieValue) return null;
  const [version, payload, sig] = cookieValue.split(".");
  if (version !== "v3" || !payload || !sig) return null;
  const expected = createHmac("sha256", signingKey()).update(payload).digest("base64url");
  if (!safeEqual(sig, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    if (!session.email || !(session.role in ROLE_LABEL) || session.exp < now) return null;
    return session;
  } catch {
    return null;
  }
}

/** Hay una sesion valida (de cualquier rol). El acceso por seccion se decide en lib/admin-access. */
export const isAdmin = (cookieValue: string | undefined) => getSession(cookieValue) !== null;

export function checkOwner(email: unknown, password: unknown) {
  if (typeof email !== "string" || typeof password !== "string") return false;
  const expected = adminCredentials();
  const emailOk = safeEqual(email.trim().toLowerCase(), expected.email);
  const passwordOk = safeEqual(password, expected.password);
  return emailOk && passwordOk;
}

// --- contrasenas de miembros (scrypt con sal propia) ----------------------
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [kind, salt, hash] = stored.split("$");
  if (kind !== "scrypt" || !salt || !hash) return false;
  return safeEqual(scryptSync(password, salt, 64).toString("hex"), hash);
}

export function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
