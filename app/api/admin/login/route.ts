import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, checkLogin } from "@/lib/admin";

const ADMIN_PATHS = new Set(["/admin", "/admin/pedidos", "/admin/marketing"]);

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const next = String(form?.get("next") ?? "/admin");
  // Solo rutas conocidas del panel: nada de redirigir a donde diga el form.
  const target = ADMIN_PATHS.has(next) ? next : "/admin";
  const url = new URL(target, request.url);

  if (!checkLogin(form?.get("email"), form?.get("password"))) {
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(url, 303);
  response.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
