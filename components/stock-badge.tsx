import { commerce } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { fill } from "@/lib/i18n";

/**
 * El aviso sale del inventario real en lib/site.ts. Si el numero no es cierto,
 * no se muestra nada.
 */
export function StockBadge({ stock, dict }: { stock: number; dict: Dict["urgency"] }) {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-mist px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">
        {dict.outOfStock}
      </span>
    );
  }

  if (!commerce.urgency.lowStock || stock > commerce.lowStockThreshold) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fdeeee] px-2.5 py-1 text-[12px] font-semibold text-[#a1332f] dark:bg-[#3a1a1a] dark:text-[#ff9c96]">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {stock === 1 ? dict.lastOne : fill(dict.lowStock, { n: stock })}
    </span>
  );
}
