import Image from "next/image";
import type { Dict } from "@/lib/dict";

/** Tarjeta chica al tutorial de instalación (YouTube). Resuelve la duda "¿cómo se instala?" justo antes de pagar. */
export function InstallTutorialLink({ dict }: { dict: Dict }) {
  return (
    <a
      href="https://youtu.be/QsvtjfhKRAs"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-2xl border border-line bg-mist p-3 transition-colors hover:border-line-strong"
    >
      <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-line">
        <Image src="/media/video/instalacion.webp" alt="" fill sizes="96px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold leading-tight">{dict.video.install.title}</p>
        <p className="mt-0.5 text-[12.5px] text-ink-3">{dict.video.install.cta} →</p>
      </div>
    </a>
  );
}
