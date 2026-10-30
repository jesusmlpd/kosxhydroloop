"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Borra un lead tras confirmar. Es definitivo: el correo y el carrito desaparecen de la base. */
export function LeadDelete({ id, email }: { id: string; email: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      className="text-[12.5px] font-medium text-[#a1332f] disabled:opacity-50"
      onClick={async () => {
        if (!window.confirm(`¿Borrar a ${email}? Se elimina de la base y no se puede deshacer.`)) return;
        setBusy(true);
        await fetch("/api/admin/clientes", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        router.refresh();
      }}
    >
      Borrar
    </button>
  );
}
