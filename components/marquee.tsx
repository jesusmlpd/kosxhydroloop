/**
 * Cinta de datos que se desliza. El contenido va duplicado porque la animacion
 * mueve el 50% del ancho: sin la copia se ve el corte al reiniciar.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  const line = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-line bg-deep py-3 text-white">
      <div className="marquee">
        {line.map((item, index) => (
          <span
            key={index}
            className="flex shrink-0 items-center gap-3 whitespace-nowrap px-6 font-display text-[14px] font-semibold uppercase tracking-[0.08em]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="opacity-60">
              <path d="M12 2.5c5 5.2 7.8 9 7.8 12.4a7.8 7.8 0 1 1-15.6 0C4.2 11.5 7 7.7 12 2.5Z" />
            </svg>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
