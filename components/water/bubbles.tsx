/**
 * Burbujas subiendo. Las posiciones y los tiempos son fijos y no aleatorios a
 * proposito: con Math.random el servidor y el navegador dibujan distinto y
 * React marca error de hidratacion.
 */
const bubbles = [
  { left: "6%", size: 10, delay: 0, duration: 13, drift: 18 },
  { left: "14%", size: 6, delay: 2.4, duration: 11, drift: -14 },
  { left: "23%", size: 14, delay: 1.1, duration: 16, drift: 22 },
  { left: "31%", size: 8, delay: 4.2, duration: 12, drift: -10 },
  { left: "44%", size: 5, delay: 0.6, duration: 10, drift: 16 },
  { left: "52%", size: 12, delay: 3.1, duration: 15, drift: -20 },
  { left: "61%", size: 7, delay: 5.4, duration: 12, drift: 12 },
  { left: "70%", size: 16, delay: 1.8, duration: 18, drift: -24 },
  { left: "78%", size: 6, delay: 3.7, duration: 11, drift: 14 },
  { left: "86%", size: 11, delay: 0.9, duration: 14, drift: -16 },
  { left: "93%", size: 8, delay: 4.8, duration: 13, drift: 10 },
];

export function Bubbles({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {bubbles.map((bubble, index) => (
        <span
          key={index}
          className="bubble"
          style={{
            left: bubble.left,
            bottom: "-24px",
            width: bubble.size,
            height: bubble.size,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
            ["--drift" as string]: `${bubble.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
