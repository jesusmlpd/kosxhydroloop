import type { Dict } from "@/lib/dict";

/**
 * Acordeon con details y summary nativos: funciona sin JavaScript, es
 * accesible de fabrica y el buscador ve todas las respuestas.
 */
export function FaqList({ items }: { items: Dict["faq"]["items"] }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {items.map((item) => (
        <li key={item.q}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 md:p-6">
              <span className="font-display text-[16px] font-semibold md:text-[17px]">{item.q}</span>
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-ink-3 transition-transform group-open:rotate-45">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-6 pr-14 text-[15px] text-ink-2 md:px-6">{item.a}</div>
          </details>
        </li>
      ))}
    </ul>
  );
}
