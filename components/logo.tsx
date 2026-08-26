import Image from "next/image";

/**
 * Isologo real de Hydroloop (gota con el ciclo de retorno) tomado del sitio
 * actual, con el wordmark y la R de marca registrada en superindice, que es
 * como la marca se escribe a si misma en todo su material.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/media/brand/logo.png"
        alt=""
        width={900}
        height={1293}
        priority
        className="h-[30px] w-auto"
      />
      <span className="font-display text-[19px] font-bold tracking-[-0.03em]">
        Hydroloop
        <sup className="ml-px align-super text-[9px] font-semibold opacity-70">®</sup>
      </span>
    </span>
  );
}
