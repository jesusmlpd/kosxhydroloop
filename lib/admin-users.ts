/** Miembros del equipo del panel: viven en la base de datos (Upstash), la contrasena en hash. */
import { randomUUID } from "crypto";
import { MEMBER_ROLES, adminCredentials, hashPassword, verifyPassword, type Role } from "@/lib/admin";
import { kv, kvAvailable } from "@/lib/kv";

const KEY = "adm:users";

export type Member = {
  id: string;
  email: string;
  name: string;
  role: Exclude<Role, "owner">;
  active: boolean;
  pass: string;
  createdAt: number;
};
export type PublicMember = Omit<Member, "pass">;

export const publicMember = (member: Member): PublicMember => ({
  id: member.id,
  email: member.email,
  name: member.name,
  role: member.role,
  active: member.active,
  createdAt: member.createdAt,
});

export async function listMembers(): Promise<Member[]> {
  if (!kvAvailable()) return [];
  try {
    const raw = await kv.get(KEY);
    return raw ? (JSON.parse(raw) as Member[]) : [];
  } catch {
    return [];
  }
}

const saveMembers = (members: Member[]) => kv.set(KEY, JSON.stringify(members));

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type TeamResult = { ok: true; member: PublicMember } | { ok: false; error: string };

export async function addMember(input: { email: string; name: string; role: string; password: string }): Promise<TeamResult> {
  const email = input.email.trim().toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, error: "Correo no válido." };
  if (email === adminCredentials().email) return { ok: false, error: "Ese correo es el del propietario." };
  if (!(MEMBER_ROLES as string[]).includes(input.role)) return { ok: false, error: "Rol no válido." };
  if (input.password.length < 10) return { ok: false, error: "La contraseña debe tener al menos 10 caracteres." };
  const members = await listMembers();
  if (members.some((member) => member.email === email)) return { ok: false, error: "Ese correo ya está en el equipo." };
  const member: Member = {
    id: randomUUID().replace(/-/g, "").slice(0, 12),
    email,
    name: input.name.trim().slice(0, 60) || email,
    role: input.role as Member["role"],
    active: true,
    pass: hashPassword(input.password),
    createdAt: Date.now(),
  };
  await saveMembers([...members, member]);
  return { ok: true, member: publicMember(member) };
}

export async function updateMember(
  id: string,
  patch: { role?: string; active?: boolean; password?: string; name?: string },
): Promise<TeamResult> {
  const members = await listMembers();
  const member = members.find((item) => item.id === id);
  if (!member) return { ok: false, error: "No se encontró al miembro." };
  if (patch.role !== undefined) {
    if (!(MEMBER_ROLES as string[]).includes(patch.role)) return { ok: false, error: "Rol no válido." };
    member.role = patch.role as Member["role"];
  }
  if (patch.active !== undefined) member.active = patch.active;
  if (patch.name !== undefined) member.name = patch.name.trim().slice(0, 60) || member.name;
  if (patch.password !== undefined) {
    if (patch.password.length < 10) return { ok: false, error: "La contraseña debe tener al menos 10 caracteres." };
    member.pass = hashPassword(patch.password);
  }
  await saveMembers(members);
  return { ok: true, member: publicMember(member) };
}

export async function removeMember(id: string): Promise<boolean> {
  const members = await listMembers();
  const next = members.filter((member) => member.id !== id);
  if (next.length === members.length) return false;
  await saveMembers(next);
  return true;
}

/** Valida correo y contrasena de un miembro activo. Siempre hace el hash para no delatar si el correo existe. */
export async function authenticateMember(email: string, password: string): Promise<Member | null> {
  const members = await listMembers();
  const member = members.find((item) => item.email === email.trim().toLowerCase());
  const ok = verifyPassword(password, member?.pass ?? "scrypt$00$00");
  return member && member.active && ok ? member : null;
}

export async function findActiveMember(email: string): Promise<Member | null> {
  const members = await listMembers();
  return members.find((member) => member.email === email && member.active) ?? null;
}
