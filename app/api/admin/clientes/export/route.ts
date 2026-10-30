import { NextResponse } from "next/server";
import { apiAccess } from "@/lib/admin-access";
import { loadOrders } from "@/lib/admin-data";
import { buildCustomers, itemsText, leadStatus, marketable, toCsv } from "@/lib/admin-customers";
import { logAudit } from "@/lib/audit";
import { listLeads } from "@/lib/leads";
import { dayFromMs } from "@/lib/date-range";

export const dynamic = "force-dynamic";

/** CSV de clientes o de leads. Los leads salen solo con consentimiento, salvo que se pida "todos". */
export async function GET(request: Request) {
  const access = await apiAccess("clientes");
  if (!("session" in access)) return NextResponse.json({ ok: false }, { status: access.status });

  const params = new URL(request.url).searchParams;
  const tipo = params.get("tipo") === "leads" ? "leads" : "clientes";
  let csv: string;
  if (tipo === "clientes") {
    const customers = buildCustomers((await loadOrders()) ?? []);
    csv = toCsv(
      ["Correo", "Nombre", "Teléfono", "Ciudad", "Pedidos", "Total gastado (MXN)", "Última compra"],
      customers.map((c) => [c.email, c.name, c.phone, c.city, c.orders, (c.spentCents / 100).toFixed(2), dayFromMs(c.lastOrder * 1000)]),
    );
  } else {
    const all = params.get("alcance") === "todos";
    const leads = (await listLeads(5000)).filter((lead) => (all ? true : marketable(lead)));
    csv = toCsv(
      ["Correo", "Nombre", "Teléfono", "Estado", "Carrito", "Cupón", "Primera vez", "Última vez"],
      leads.map((l) => [l.email, l.name, l.phone, leadStatus(l), itemsText(l.items), l.coupon, dayFromMs(l.firstSeen), dayFromMs(l.lastSeen)]),
    );
  }
  await logAudit(access.session.email, "Exportó CSV", tipo === "leads" ? `leads (${params.get("alcance") === "todos" ? "todos" : "solo con consentimiento"})` : "clientes");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hydroloop-${tipo}-${dayFromMs(Date.now())}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
