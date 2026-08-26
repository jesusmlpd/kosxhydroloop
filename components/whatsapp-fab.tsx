"use client";

import { usePathname } from "next/navigation";
import { SocialIcon } from "@/components/social-icons";
import { whatsappUrl } from "@/lib/site";

/**
 * Boton flotante de WhatsApp, el canal que mas cierra en Mexico. Se esconde
 * en checkout y en las pantallas de pedido para no competir con el pago.
 */
export function WhatsappFab({ label }: { label: string }) {
  const pathname = usePathname() ?? "";
  if (/\/(checkout|order)(\/|$)/.test(pathname)) return null;

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_14px_40px_-8px_rgba(37,211,102,0.7)] transition-transform hover:scale-105 active:scale-95 max-md:bottom-24"
    >
      <SocialIcon id="whatsapp" size={27} />
    </a>
  );
}
