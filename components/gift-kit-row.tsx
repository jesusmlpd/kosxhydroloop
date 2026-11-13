import Image from "next/image";
import type { Dict } from "@/lib/dict";
import { formatMoney } from "@/lib/commerce";
import type { Locale } from "@/lib/i18n";
import { findProduct } from "@/lib/site";

/**
 * Línea del kit de instalación de regalo (Buen Fin). No es parte del pedido:
 * se avisa en las notas para empacarlo. Aquí solo se le muestra al cliente que
 * ya viene incluido, uno por equipo.
 */
export function GiftKitRow({ qty, locale, dict, compact = false }: { qty: number; locale: Locale; dict: Dict; compact?: boolean }) {
  const kit = findProduct("kit-caja-de-instalacion");
  if (!kit || qty <= 0) return null;
  const name = dict.products.items["kit-caja-de-instalacion" as keyof Dict["products"]["items"]]?.name ?? "Kit";
  const size = compact ? 48 : 80;
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-dashed border-[#0f7a5f] bg-foam/40 p-3 dark:border-[#5fd6b0]">
      <div
        className="relative shrink-0 overflow-hidden rounded-xl border border-line bg-white"
        style={{ width: size, height: size }}
      >
        <Image src={kit.image} alt={name} fill sizes={`${size}px`} className="object-contain p-1" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[14px] font-semibold leading-tight">{name}</p>
        <p className="mt-0.5 text-[12.5px] font-semibold text-[#0f7a5f] dark:text-[#5fd6b0]">
          {dict.cart.giftKit.replace("{n}", String(qty))}
        </p>
      </div>
      <p className="text-right text-[13px] tabular-nums">
        <span className="block text-ink-3 line-through">{formatMoney(kit.priceCents * qty, locale, kit.currency)}</span>
        <span className="block font-display font-bold text-[#0f7a5f] dark:text-[#5fd6b0]">{dict.cart.shippingFree}</span>
      </p>
    </li>
  );
}
