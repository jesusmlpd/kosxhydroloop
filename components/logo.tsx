import Image from "next/image";

/**
 * Isologo real de Hydroloop (gota con el ciclo de retorno), tomado del sitio
 * actual, mas la palabra en la tipografia del sitio. La gota funciona igual en
 * claro y en oscuro porque el teal tiene contraste en los dos fondos.
 */
export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
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
      <span
        className={`font-display text-[19px] font-bold tracking-[-0.03em] ${
          light ? "text-white" : ""
        }`}
      >
        Hydroloop
      </span>
    </span>
  );
}
