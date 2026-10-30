import { NextResponse } from "next/server";
import { apiAccess } from "@/lib/admin-access";
import { logAudit } from "@/lib/audit";
import { deleteLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

/** Borra un lead (solicitud de cancelacion de datos). */
export async function DELETE(request: Request) {
  const access = await apiAccess("clientes");
  if (!("session" in access)) return NextResponse.json({ ok: false }, { status: access.status });
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  const ok = await deleteLead(String(body?.id ?? ""));
  if (ok) await logAudit(access.session.email, "Borró un lead", String(body?.id).slice(0, 8));
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}
