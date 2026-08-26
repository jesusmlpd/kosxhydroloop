import Image from "next/image";
import { PaymentBadges } from "@/components/payment-badges";
import type { Dict } from "@/lib/dict";

const icons = [
  // Hecho en Mexico
  <path key="a" d="M12 3.5 4.5 7v5.2c0 4.3 3 8 7.5 9.3 4.5-1.3 7.5-5 7.5-9.3V7L12 3.5Z" />,
  // Garantia
  <path key="b" d="M12 3.5 4.5 7v5.2c0 4.3 3 8 7.5 9.3 4.5-1.3 7.5-5 7.5-9.3V7L12 3.5Zm-3.4 8.7 2.5 2.5 4.6-4.6" />,
  // Compra protegida
  <path key="c" d="M6 11V8.5a6 6 0 0 1 12 0V11M5 11h14v9H5z" />,
  // Soporte
  <path key="d" d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2M4.5 14h3v5h-3zm12 0h3v5h-3z" />,
  // Envio
  <path key="e" d="M3 7h11v9H3zm11 3h4l3 3v3h-7zM7 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 19Zm10 0a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z" />,
  // Instalacion certificada
  <path key="f" d="m13.5 4 6.5 6.5-3 3-6.5-6.5zM10.5 7 4 13.5V20h6.5L17 13.5" />,
];

export function TrustBadges({ dict }: { dict: Dict }) {
  return (
    <section className="section bg-mist" id="confianza">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{dict.trust.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(28px,4.2vw,44px)]">{dict.trust.title}</h2>
          </div>
          <Image
            src="/media/brand/hecho-en-mexico.png"
            alt="Hecho en México"
            width={110}
            height={110}
            className="h-[88px] w-auto"
          />
        </div>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {dict.trust.badges.map((badge, index) => (
            <li key={badge.title} className="bg-surface p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-foam text-deep dark:bg-[#0d3a45] dark:text-aqua">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {icons[index % icons.length]}
                </svg>
              </span>
              <h3 className="mt-4 text-[17px]">{badge.title}</h3>
              <p className="mt-1.5 text-[14px] text-ink-2">{badge.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
          <h3 className="eyebrow">{dict.trust.paymentsTitle}</h3>
          <PaymentBadges className="mt-4" />
          <p className="mt-4 max-w-2xl text-[13px] text-ink-3">{dict.trust.paymentsNote}</p>
        </div>
      </div>
    </section>
  );
}
