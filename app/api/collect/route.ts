import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/stats";

export const dynamic = "force-dynamic";

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit/i;

/** Recibe los eventos del embudo desde el navegador. Nunca falla de cara al cliente. */
export async function POST(request: Request) {
  if (BOT.test(request.headers.get("user-agent") ?? "")) return NextResponse.json({ ok: true });
  const body = (await request.json().catch(() => null)) as { e?: string; p?: string; s?: string } | null;
  try {
    if (body) await recordEvent({ event: String(body.e), product: body.p, source: body.s });
  } catch (error) {
    console.error("[collect]", error);
  }
  return NextResponse.json({ ok: true });
}
