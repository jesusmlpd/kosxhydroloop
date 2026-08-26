/**
 * Banda de olas entre secciones. Dos capas con velocidades distintas para que
 * se lea como agua y no como un adorno pegado. Es puramente decorativa.
 */
export function WaveBand({
  flip = false,
  className = "",
  height = 90,
  from = "var(--bg)",
  to = "var(--bg-2)",
}: {
  flip?: boolean;
  className?: string;
  height?: number;
  from?: string;
  to?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`wave-band ${className}`}
      style={{ height, background: to, transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height }}>
        <path
          d="M0 64c120-26 240-40 360-14s240 66 360 40 240-66 360-40 240 40 360 14v56H0z"
          fill={from}
          opacity="0.55"
        />
      </svg>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="wave-slow absolute inset-x-0 top-0"
        style={{ height }}
      >
        <path
          d="M0 78c140-30 260 12 400 12s260-40 400-16 260 40 400 22 240-24 240-24v48H0z"
          fill={from}
        />
      </svg>
    </div>
  );
}
