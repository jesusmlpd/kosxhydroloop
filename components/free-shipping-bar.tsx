import { commerce, formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { fill, type Locale } from "@/lib/i18n";

export function FreeShippingBar({
  missingCents,
  locale,
  dict,
}: {
  missingCents: number;
  locale: Locale;
  dict: Dict["cart"];
}) {
  if (!commerce.urgency.freeShippingBar) return null;

  const goal = commerce.shipping.freeFromCents;
  const done = missingCents === 0;
  const progress = goal > 0 ? Math.min(100, Math.round(((goal - missingCents) / goal) * 100)) : 100;

  return (
    <div>
      <p className="text-[13px] text-ink-2">
        {done ? dict.freeShippingGot : fill(dict.freeShippingMissing, { amount: formatMoney(missingCents, locale) })}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-aqua transition-[width] duration-500"
          style={{ width: `${done ? 100 : progress}%` }}
        />
      </div>
    </div>
  );
}
