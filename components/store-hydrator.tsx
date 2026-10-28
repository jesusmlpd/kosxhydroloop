"use client";

import { applySettings, type StoreSettings } from "@/lib/store-settings";

/**
 * Lleva los ajustes del panel al navegador. Los precios, el inventario y el
 * envio se leen de modulos (lib/site, lib/commerce) que en el navegador
 * arrancan con los valores del codigo; esto los pone al dia antes de que
 * cualquier componente de abajo los lea. Va primero en el body.
 */
export function StoreHydrator({ settings }: { settings: StoreSettings }) {
  applySettings(settings);
  return null;
}
