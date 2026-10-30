import { redirect } from "next/navigation";

/** La tienda se dividio en secciones: Productos, Envío y promos, Página de inicio. */
export default function AdminStoreIndex() {
  redirect("/admin/tienda/productos");
}
