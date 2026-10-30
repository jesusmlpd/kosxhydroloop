import type { Metadata } from "next";
import { renderStorePage } from "@/app/admin/tienda/store-page";

export const metadata: Metadata = {
  title: "Productos | Hydroloop®",
  robots: { index: false, follow: false },
};

// Siempre fresco: el formulario parte de lo que hay guardado en este momento.
export const dynamic = "force-dynamic";

export default function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return renderStorePage({
    section: "productos",
    path: "/admin/tienda/productos",
    title: "Productos",
    intro: "Precio, precio tachado e inventario de cada modelo. Lo guardado se ve de inmediato en la tienda.",
    searchParams,
  });
}
