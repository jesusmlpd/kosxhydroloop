import type { Metadata } from "next";
import { renderStorePage } from "@/app/admin/tienda/store-page";

export const metadata: Metadata = {
  title: "Envío y promos | Hydroloop®",
  robots: { index: false, follow: false },
};

// Siempre fresco: el formulario parte de lo que hay guardado en este momento.
export const dynamic = "force-dynamic";

export default function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return renderStorePage({
    section: "envio-promos",
    path: "/admin/tienda/envio-promos",
    title: "Envío y promos",
    intro: "Costo de envío, barra de promoción y ventana emergente. La barra y la ventana se apagan solas al pasar su fecha.",
    searchParams,
  });
}
