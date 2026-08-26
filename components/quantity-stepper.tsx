"use client";

export function QuantityStepper({
  value,
  max,
  label,
  onChange,
}: {
  value: number;
  max: number;
  label: string;
  onChange: (next: number) => void;
}) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-line-strong"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label="-"
        className="grid h-9 w-9 place-items-center rounded-l-full text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
        disabled={value <= 1}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <span className="w-8 text-center font-display text-[15px] font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="+"
        className="grid h-9 w-9 place-items-center rounded-r-full text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
        disabled={value >= max}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
