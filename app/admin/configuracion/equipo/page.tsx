import type { Metadata } from "next";
import { AdminLogin, AdminShell, NoAccess } from "@/components/admin-shell";
import { TeamEditor } from "@/components/admin-team";
import { adminAccess } from "@/lib/admin-access";
import { listMembers, publicMember } from "@/lib/admin-users";
import { kvAvailable } from "@/lib/kv";

export const metadata: Metadata = {
  title: "Equipo | Hydroloop®",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTeamPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const access = await adminAccess("equipo");
  if (access === "login") return <AdminLogin error={Boolean(error)} next="/admin/configuracion/equipo" />;
  if (access === "denied") return <NoAccess />;

  const members = (await listMembers()).map(publicMember);
  return (
    <AdminShell active="/admin/configuracion/equipo" title="Equipo">
      <p className="mt-3 max-w-2xl text-[14.5px] text-ink-2">
        Quién entra al panel y qué puede ver. Cada cambio queda en el Historial.
      </p>
      <TeamEditor initial={members} canSave={kvAvailable()} />
    </AdminShell>
  );
}
