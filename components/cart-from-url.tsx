"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { cart } from "@/lib/cart";
import { findCoupon } from "@/lib/commerce";
import { findProductById } from "@/lib/site";

/**
 * Carrito armado desde la URL: ?cart=hl-001:2,hl-002:1&coupon=AGUA10
 *
 * Es lo que hace que un correo de carrito abandonado o una campana con un
 * combo armado aterricen con el carrito ya puesto. Los ids que no existen y
 * los cupones invalidos se ignoran sin romper la pagina, y los parametros se
 * limpian de la barra para que nadie comparta un link que vuelve a sumar
 * piezas cada vez que se recarga.
 */
export function CartFromUrl() {
  const params = useSearchParams();
  const router = useRouter();
  const spec = params.get("cart");
  const coupon = params.get("coupon");

  useEffect(() => {
    // ?coupon=AGUA10 solo tambien aplica: sirve para campanas y anuncios.
    if (!spec && coupon && findCoupon(coupon, Date.now())) {
      cart.applyCoupon(coupon);
      const next = new URLSearchParams(params.toString());
      next.delete("coupon");
      const query = next.toString();
      router.replace(query ? `?${query}` : window.location.pathname, { scroll: false });
      return;
    }
    if (!spec) return;

    let added = false;
    for (const chunk of spec.split(",")) {
      const [id, rawQty] = chunk.split(":");
      const product = findProductById(id?.trim() ?? "");
      if (!product) continue;
      const qty = Math.max(1, Math.min(Number(rawQty) || 1, product.stock));
      if (qty > 0) {
        cart.add(product.id, qty, { open: false });
        added = true;
      }
    }

    if (added && coupon && findCoupon(coupon, Date.now())) {
      cart.applyCoupon(coupon);
    }

    const next = new URLSearchParams(params.toString());
    next.delete("cart");
    next.delete("coupon");
    const query = next.toString();
    router.replace(query ? `?${query}` : window.location.pathname, { scroll: false });
  }, [spec, coupon, params, router]);

  return null;
}
