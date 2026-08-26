/**
 * PLACEHOLDER: wordmark tipografico con una gota/ciclo hasta que llegue el
 * logo real del cliente. Se reemplaza por un SVG en /public/brand.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 3.5c5.4 5.6 8.4 9.7 8.4 13.4a8.4 8.4 0 1 1-16.8 0C7.6 13.2 10.6 9.1 16 3.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9.2 18.6c1.8 0 1.8 2 3.6 2s1.8-2 3.6-2 1.8 2 3.6 2 1.8-2 3.6-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-[19px] font-bold tracking-[-0.03em]">Hydroloop</span>
    </span>
  );
}
