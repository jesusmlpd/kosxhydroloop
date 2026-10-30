import { NextResponse } from "next/server";
import { apiAccess } from "@/lib/admin-access";
import { addMember, listMembers, publicMember, removeMember, updateMember } from "@/lib/admin-users";
import { logAudit } from "@/lib/audit";
import { kvAvailable } from "@/lib/kv";

/** Alta, cambios y baja de miembros del equipo. Solo el propietario. */
export const dynamic = "force-dynamic";

async function guard() {
  const access = await apiAccess("equipo");
  if (!("session" in access)) return { error: NextResponse.json({ ok: false, error: "Sin permiso." }, { status: access.status }) };
  if (!kvAvailable()) return { error: NextResponse.json({ ok: false, error: "Conecta la base de datos primero." }, { status: 503 }) };
  return { session: access.session };
}

export async function GET() {
  const auth = await guard();
  if ("error" in auth) return auth.error;
  return NextResponse.json({ ok: true, members: (await listMembers()).map(publicMember) });
}

export async function POST(request: Request) {
  const auth = await guard();
  if ("error" in auth) return auth.error;
  const body = (await request.json().catch(() => null)) as Record<string, string> | null;
  const result = await addMember({
    email: String(body?.email ?? ""),
    name: String(body?.name ?? ""),
    role: String(body?.role ?? ""),
    password: String(body?.password ?? ""),
  });
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  await logAudit(auth.session.email, "Agregó un miembro al equipo", `${result.member.email} (${result.member.role})`);
  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  const auth = await guard();
  if ("error" in auth) return auth.error;
  const body = (await request.json().catch(() => null)) as { id?: string; role?: string; active?: boolean; password?: string } | null;
  if (!body?.id) return NextResponse.json({ ok: false, error: "Falta el miembro." }, { status: 400 });
  const result = await updateMember(body.id, { role: body.role, active: body.active, password: body.password });
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  const what = [
    body.role !== undefined ? `rol ${body.role}` : "",
    body.active !== undefined ? (body.active ? "reactivado" : "desactivado") : "",
    body.password !== undefined ? "nueva contraseña" : "",
  ]
    .filter(Boolean)
    .join(", ");
  await logAudit(auth.session.email, "Cambió a un miembro del equipo", `${result.member.email}: ${what}`);
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const auth = await guard();
  if ("error" in auth) return auth.error;
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  const members = await listMembers();
  const member = members.find((item) => item.id === body?.id);
  if (!member || !(await removeMember(member.id))) return NextResponse.json({ ok: false, error: "No se encontró al miembro." }, { status: 404 });
  await logAudit(auth.session.email, "Quitó a un miembro del equipo", member.email);
  return NextResponse.json({ ok: true });
}
