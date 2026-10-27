"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { readAttribution, trackContact } from "@/lib/track";
import { whatsappMessage } from "@/lib/whatsapp";
import { whatsappUrl } from "@/lib/site";

/**
 * Enlace a WhatsApp con mensaje segun la pagina y evento Contact. El href que
 * llega del servidor ya funciona sin JavaScript; en cuanto el cliente apunta,
 * enfoca o toca, se reemplaza por el mensaje contextual (asi tambien sirve el
 * clic derecho y abrir en otra pestana).
 */
export function WhatsappLink({
  origin,
  text,
  className,
  children,
  ...aria
}: {
  /** De que boton salio el contacto: fab, footer, contacto, pdp, redes. */
  origin: string;
  /** Texto fijo, por ejemplo "Hola, quiero comprar el Hydroloop WiFi". */
  text?: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  title?: string;
}) {
  const pathname = usePathname() ?? "";

  function prepare(element: HTMLAnchorElement) {
    const message = whatsappMessage({
      pathname,
      search: window.location.search,
      campaign: readAttribution().campaign,
      text,
    });
    element.href = whatsappUrl(message);
  }

  return (
    <a
      href={whatsappUrl(text ?? "Hola")}
      target="_blank"
      rel="noreferrer"
      className={className}
      onPointerEnter={(event) => prepare(event.currentTarget)}
      onFocus={(event) => prepare(event.currentTarget)}
      onTouchStart={(event) => prepare(event.currentTarget)}
      onClick={(event) => {
        prepare(event.currentTarget);
        trackContact(origin);
      }}
      onAuxClick={(event) => {
        if (event.button !== 1) return;
        prepare(event.currentTarget);
        trackContact(origin);
      }}
      {...aria}
    >
      {children}
    </a>
  );
}
