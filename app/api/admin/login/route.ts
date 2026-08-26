import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const password = form?.get("password");
  const expected = process.env.ADMIN_PASSWORD;

  const url = new URL("/admin", request.url);
  if (!expected || typeof password !== "string" || password !== expected) {
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(url, 303);
  response.cookies.set(ADMIN_COOKIE, adminToken() ?? "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
