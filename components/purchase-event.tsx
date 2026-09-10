"use client";

import { useEffect } from "react";
import { firePendingPurchase } from "@/lib/track";

/**
 * Dispara el evento Purchase (Pixel y GA4) en la pantalla de exito, con los
 * datos que el checkout dejo en sessionStorage antes de redirigir al cobro.
 * Se dispara una sola vez: el propio helper borra la llave al leerla.
 */
export function PurchaseEvent() {
  useEffect(() => {
    firePendingPurchase();
  }, []);
  return null;
}
