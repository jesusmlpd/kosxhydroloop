import { loadRecord, optOut } from "@/lib/recovery";

/**
 * Enlace "dejar de recibir estos recordatorios". El id del registro es opaco,
 * asi que el correo nunca viaja en la URL. Se hace con GET a proposito: es lo
 * que abre un clic desde el correo (y la baja es inofensiva y reversible).
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("r") ?? "";
  const record = await loadRecord(id);
  if (record) await optOut(record.email).catch((error) => console.error("[recuperacion] baja", error));

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hydroloop®</title></head>
<body style="margin:0;background:#f2f7f9;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0b1f2a">
<div style="max-width:440px;margin:15vh auto;padding:32px;background:#fff;border-radius:16px;text-align:center">
<p style="font-weight:700;letter-spacing:.08em;color:#0a7f94;font-size:12px;margin:0">HYDROLOOP®</p>
<h1 style="font-size:22px;margin:10px 0">Listo, no te escribiremos más</h1>
<p style="font-size:15px;line-height:1.5;color:#4b6270">Dejaste de recibir recordatorios de carrito. Si fue por error, puedes volver a comprar cuando quieras.</p>
</div></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
