import type { Metadata } from "next";
import { renderStorePage } from "@/app/admin/tienda/store-page";

export const metadata: Metadata = {
  title: "Descuentos | Hydroloop®",
  robots: { index: false, follow: false },
};

// Siempre fresco: el formulario parte de lo que hay guardado en este momento.
export const dynamic = "force-dynamic";

export default function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return renderStorePage({
    section: "descuentos",
    path: "/admin/descuentos",
    title: "Descuentos",
    intro: "Cupones del carrito: código, porcentaje y vencimiento. Un cupón apagado o vencido deja de funcionar al instante.",
    searchParams,
  });
}
