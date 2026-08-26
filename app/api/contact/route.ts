import { NextResponse } from "next/server";
import { sendContact } from "@/lib/formsubmit";
import { site } from "@/lib/site";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, string> | null;
  if (!body) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  // Honeypot: los bots llenan todo, una persona nunca ve este campo.
  if (body.company) return NextResponse.json({ ok: true });

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  if (!name || !email.includes("@") || !message) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const origin = request.headers.get("origin") ?? site.url;

  try {
    const result = await sendContact(
      { name, email, phone: body.phone, type: body.type, message },
      origin,
    );
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.message || "rejected" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }
}
