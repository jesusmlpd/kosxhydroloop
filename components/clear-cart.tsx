"use client";

import { useEffect } from "react";
import { cart } from "@/lib/cart";

/** Vacia el carrito al aterrizar en la pantalla de exito, no antes. */
export function ClearCart() {
  useEffect(() => {
    cart.clear();
  }, []);
  return null;
}
