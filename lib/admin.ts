import { createHmac, timingSafeEqual } from "crypto";

/**
 * Autenticacion minima del panel interno: un correo y una contrasena, con una
 * cookie firmada (HMAC derivado de ambos). Sin usuarios, sin base de datos:
 * es un panel interno para el equipo.
 *
 * Las credenciales por defecto existen para que el panel funcione desde el
 * primer deploy; ADMIN_EMAIL y ADMIN_PASSWORD en las variables de entorno las
 * reemplazan (y cambiar cualquiera de las dos invalida las sesiones abiertas).
 */
export const ADMIN_COOKIE = "hl-admin";

const DEFAULT_EMAIL = "oscar@kickoffsocial.com";
const DEFAULT_PASSWORD = "admin";

export function adminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || DEFAULT_EMAIL).trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD,
    usingDefaults: !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD,
  };
}

export function adminToken() {
  const { email, password } = adminCredentials();
  return createHmac("sha256", `${email}\n${password}`)
    .update("hydroloop-admin-v2")
    .digest("hex");
}

export function checkLogin(email: unknown, password: unknown) {
  if (typeof email !== "string" || typeof password !== "string") return false;
  const expected = adminCredentials();
  const emailOk = safeEqual(email.trim().toLowerCase(), expected.email);
  const passwordOk = safeEqual(password, expected.password);
  return emailOk && passwordOk;
}

export function isAdmin(cookieValue: string | undefined) {
  if (!cookieValue) return false;
  return safeEqual(cookieValue, adminToken());
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
