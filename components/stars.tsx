export function Stars({
  rating,
  size = 16,
  label,
}: {
  rating: number;
  size?: number;
  label?: string;
}) {
  // Media estrella incluida: 4.7 se ve como 4.7, no como 5.
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <span
      className="relative inline-block leading-none"
      role="img"
      aria-label={label ?? `${rating} / 5`}
      style={{ width: size * 5 + 4 * 2, height: size }}
    >
      <span className="absolute inset-0 flex gap-[2px] text-line-strong">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={size} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-[2px] overflow-hidden text-[#f0a92b]"
        style={{ width: `calc(${percent}% )` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={size} />
        ))}
      </span>
    </span>
  );
}

function Star({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className="shrink-0" aria-hidden="true">
      <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6Z" />
    </svg>
  );
}
