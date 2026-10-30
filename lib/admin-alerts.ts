/** Avisos del Inicio del panel: cosas que piden atencion hoy. */
import type { AdminOrder } from "@/lib/admin-data";
import { commerce } from "@/lib/commerce";
import { kvAvailable } from "@/lib/kv";
import { products } from "@/lib/site";
import type { StoreSettings } from "@/lib/store-settings";

export type Alert = { level: "warn" | "info"; text: string; href: string; cta: string };

const DAY = 24 * 3600 * 1000;

export function buildAlerts(input: { orders: AdminOrder[] | null; settings: StoreSettings; now?: number }): Alert[] {
  const now = input.now ?? Date.now();
  const alerts: Alert[] = [];

  if (!kvAvailable()) {
    alerts.push({
      level: "warn",
      text: "La base de datos no está conectada: el panel no puede guardar cambios ni medir visitas.",
      href: "/admin/configuracion/conexiones",
      cta: "Ver conexiones",
    });
  }

  const late = (input.orders ?? []).filter(
    (order) => order.paid && !order.shipped && order.refundState === "none" && now - order.created * 1000 > 2 * DAY,
  );
  if (late.length) {
    alerts.push({
      level: "warn",
      text: `${late.length} pedido${late.length === 1 ? "" : "s"} pagado${late.length === 1 ? "" : "s"} sin enviar desde hace más de 48 horas.`,
      href: "/admin/pedidos",
      cta: "Ver pedidos",
    });
  }

  const low = products.filter((product) => product.buyable && product.stock <= commerce.lowStockThreshold);
  if (low.length) {
    alerts.push({
      level: "warn",
      text: `Inventario bajo: ${low.map((product) => `${product.slug} (${product.stock})`).join(", ")}.`,
      href: "/admin/tienda/productos",
      cta: "Ajustar inventario",
    });
  }

  for (const coupon of input.settings.coupons.filter((c) => c.enabled && c.endsAt)) {
    const left = new Date(coupon.endsAt as string).getTime() - now;
    if (left > 0 && left <= 7 * DAY) {
      alerts.push({
        level: "info",
        text: `El cupón ${coupon.code} vence en ${Math.max(1, Math.ceil(left / DAY))} día(s).`,
        href: "/admin/descuentos",
        cta: "Ver descuentos",
      });
    }
  }

  const promoEnd = input.settings.promo.endsAt ? new Date(input.settings.promo.endsAt).getTime() : null;
  if (promoEnd && promoEnd > now && promoEnd - now <= 3 * DAY && input.settings.promo.bannerEnabled) {
    alerts.push({
      level: "info",
      text: "La barra de promoción se apaga en menos de 3 días. ¿La renuevas o preparas la siguiente?",
      href: "/admin/tienda/envio-promos",
      cta: "Editar promo",
    });
  }
  return alerts;
}
