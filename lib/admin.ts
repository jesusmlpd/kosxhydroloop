import { createHmac, timingSafeEqual } from "crypto";

/**
 * Autenticacion minima del panel de pedidos: una contrasena en variable de
 * entorno y una cookie firmada (HMAC de la propia contrasena). Sin usuarios,
 * sin base de datos: es un panel interno para una persona.
 */
export const ADMIN_COOKIE = "hl-admin";

export function adminToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("hydroloop-admin-v1").digest("hex");
}

export function isAdmin(cookieValue: string | undefined) {
  const token = adminToken();
  if (!token || !cookieValue || cookieValue.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(cookieValue), Buffer.from(token));
}
