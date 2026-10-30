import { NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_SECONDS, adminCredentials, checkOwner, signSession } from "@/lib/admin";
import { authenticateMember } from "@/lib/admin-users";
import { logAudit } from "@/lib/audit";
import { kv, kvAvailable } from "@/lib/kv";

// Cualquier pagina del panel (solo letras, numeros y guiones): nunca una URL externa.
const ADMIN_PATH = /^\/admin(\/[a-z0-9-]+){0,3}$/;
const MAX_FAILS = 10;

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const next = String(form?.get("next") ?? "/admin");
  const target = ADMIN_PATH.test(next) ? next : "/admin";
  const url = new URL(target, request.url);
  const fail = () => {
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  };

  const email = String(form?.get("email") ?? "").trim().toLowerCase();
  const password = String(form?.get("password") ?? "");

  // Freno a la fuerza bruta: 10 intentos fallidos por correo y por hora.
  const bucket = `adm:fail:${Math.floor(Date.now() / 3_600_000)}:${email.slice(0, 80)}`;
  if (kvAvailable()) {
    const fails = Number((await kv.get(bucket).catch(() => null)) ?? 0);
    if (fails >= MAX_FAILS) return fail();
  }

  let session: { email: string; name: string; role: "owner" | "admin" | "operaciones" | "marketing" } | null = null;
  if (checkOwner(email, password)) {
    session = { email: adminCredentials().email, name: "Propietario", role: "owner" };
  } else {
    const member = await authenticateMember(email, password).catch(() => null);
    if (member) session = { email: member.email, name: member.name, role: member.role };
  }

  if (!session) {
    if (kvAvailable()) await kv.incr(bucket).catch(() => null);
    return fail();
  }

  await logAudit(session.email, "Inicio de sesión");
  const response = NextResponse.redirect(url, 303);
  response.cookies.set(ADMIN_COOKIE, signSession(session), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return response;
}
