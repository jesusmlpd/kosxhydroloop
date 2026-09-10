"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/track";

/** Evento ViewContent / view_item al abrir una pagina de producto. */
export function ViewContent({
  id,
  name,
  priceCents,
}: {
  id: string;
  name: string;
  priceCents: number;
}) {
  useEffect(() => {
    trackViewContent({ id, name, qty: 1, priceCents });
  }, [id, name, priceCents]);
  return null;
}
