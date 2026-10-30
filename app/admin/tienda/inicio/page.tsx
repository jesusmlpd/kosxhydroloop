import type { Metadata } from "next";
import { renderStorePage } from "@/app/admin/tienda/store-page";

export const metadata: Metadata = {
  title: "Página de inicio | Hydroloop®",
  robots: { index: false, follow: false },
};

// Siempre fresco: el formulario parte de lo que hay guardado en este momento.
export const dynamic = "force-dynamic";

export default function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return renderStorePage({
    section: "inicio",
    path: "/admin/tienda/inicio",
    title: "Página de inicio",
    intro: "Los textos del hero, lo primero que ve el cliente. A la derecha ves cómo queda mientras escribes.",
    searchParams,
  });
}
