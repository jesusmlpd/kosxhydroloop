import { socials, whatsappUrl } from "@/lib/site";

/**
 * Iconos reales de las redes publicadas por Hydroloop, como enlaces que
 * abren en pestana nueva. El de WhatsApp es opcional porque no en todos los
 * contextos queremos abrir conversacion.
 */
const paths: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" />
    </>
  ),
  facebook: (
    <path
      d="M14 8.5h2.5V5.5H14a3.5 3.5 0 0 0-3.5 3.5v2H8v3h2.5v6.5h3V14H16l.5-3h-3V9a.9.9 0 0 1 .5-.5Z"
      fill="currentColor"
    />
  ),
  youtube: (
    <>
      <rect x="2.5" y="6" width="19" height="12.5" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.2 9.6v5.3l4.6-2.65-4.6-2.65Z" fill="currentColor" />
    </>
  ),
  whatsapp: (
    <path
      d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Zm4.2 11.7c-.2.6-1.2 1.1-1.7 1.1-.4.1-1 .1-1.6-.1a13 13 0 0 1-1.5-.6c-2.6-1.1-4.2-3.7-4.4-3.9-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2 .2-.3.5-.3.7-.3h.5c.2 0 .4-.1.6.4l.8 2c.1.2.1.4 0 .6l-.3.5-.4.5c-.1.1-.3.3-.1.6.1.3.6 1 1.3 1.7.9.8 1.7 1.1 2 1.2.3.1.4.1.6-.1l.9-1c.2-.3.4-.2.7-.1l1.8.8c.3.2.5.2.5.4.1 0 .1.5-.3 1Z"
      fill="currentColor"
    />
  ),
};

export function SocialIcon({ id, size = 18 }: { id: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {paths[id]}
    </svg>
  );
}

export function SocialLinks({
  withWhatsapp = false,
  className = "",
}: {
  withWhatsapp?: boolean;
  className?: string;
}) {
  const items: Array<{ name: string; id: string; href: string }> = [
    ...socials.map((social) => ({ ...social })),
    ...(withWhatsapp ? [{ name: "WhatsApp", id: "whatsapp", href: whatsappUrl() }] : []),
  ];

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.name}
            title={item.name}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-teal hover:text-teal"
          >
            <SocialIcon id={item.id} />
          </a>
        </li>
      ))}
    </ul>
  );
}
