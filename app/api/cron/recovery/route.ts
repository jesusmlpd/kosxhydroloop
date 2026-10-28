import { NextResponse } from "next/server";
import { runRecovery } from "@/lib/recovery";

/**
 * Cron de Vercel cada 15 minutos (vercel.json). Vercel manda
 * "Authorization: Bearer $CRON_SECRET"; sin la variable o con otra llave se
 * rechaza, para que nadie pueda disparar envios desde fuera.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const result = await runRecovery();
    console.log("[recuperacion] cron", JSON.stringify(result));
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[recuperacion] cron fallo", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
