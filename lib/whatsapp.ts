/**
 * Mensaje precargado de WhatsApp segun la pagina donde esta el cliente. El
 * agente de IA que contesta en el numero lee la etiqueta final, por ejemplo
 * "(web-pdp-wifi · KOS_123)", para saber de que pagina y de que anuncio vino.
 *
 * Es codigo puro: solo trabaja con el pathname y el texto, sin importar el
 * catalogo, para no inflar el bundle del navegador.
 */
const TEXTS = {
  es: {
    home: "Hola, vi Hydroloop en la web y quiero más información",
    productos: "Hola, quiero ayuda para elegir mi Hydroloop",
    pdp: "Hola, quiero información de este producto",
    checkout: "Hola, tengo una duda con mi compra",
    pedido: (ref: string) => (ref ? `Hola, tengo una duda con mi pedido ${ref}` : "Hola, tengo una duda con mi pedido"),
    contacto: "Hola, quiero hablar con un asesor de Hydroloop",
    blog: "Hola, leí el blog de Hydroloop y tengo una duda",
    nosotros: "Hola, quiero conocer más de Hydroloop",
  },
  en: {
    home: "Hi, I saw Hydroloop on your website and I'd like more information",
    productos: "Hi, I need help choosing my Hydroloop",
    pdp: "Hi, I'd like information about this product",
    checkout: "Hi, I have a question about my purchase",
    pedido: (ref: string) => (ref ? `Hi, I have a question about my order ${ref}` : "Hi, I have a question about my order"),
    contacto: "Hi, I'd like to talk to a Hydroloop advisor",
    blog: "Hi, I read the Hydroloop blog and I have a question",
    nosotros: "Hi, I'd like to know more about Hydroloop",
  },
} as const;

/** Que tipo de pagina es, y una clave corta para la etiqueta. */
export function pageKind(pathname: string) {
  const path = pathname.replace(/^\/(es|en)(?=\/|$)/, "").replace(/\/+$/, "");
  if (path === "") return { kind: "home", tag: "home" } as const;
  const product = path.match(/^\/products\/([^/]+)$/);
  if (product) {
    const slug = product[1].replace(/^hydroloop-/, "").replace("kit-caja-de-instalacion", "kit");
    return { kind: "pdp", tag: `pdp-${slug}` } as const;
  }
  if (path.startsWith("/products")) return { kind: "productos", tag: "productos" } as const;
  if (path.startsWith("/checkout")) return { kind: "checkout", tag: "checkout" } as const;
  if (path.startsWith("/order")) return { kind: "pedido", tag: "pedido" } as const;
  if (path.startsWith("/contact")) return { kind: "contacto", tag: "contacto" } as const;
  if (path.startsWith("/blog")) return { kind: "blog", tag: "blog" } as const;
  if (path.startsWith("/about")) return { kind: "nosotros", tag: "nosotros" } as const;
  return { kind: "home", tag: "otro" } as const;
}

/** Nombres legibles de los productos; si llega uno nuevo cae al texto generico. */
const PRODUCT_NAMES: Record<string, string> = {
  "hydroloop-manual": "Hydroloop Manual",
  "hydroloop-wifi": "Hydroloop WiFi",
  "kit-caja-de-instalacion": "Kit caja de instalación",
  "hydroloop-bateria": "Hydroloop Batería",
};

function pathname_slug(pathname: string) {
  return pathname.match(/\/products\/([^/]+)\/?$/)?.[1] ?? "";
}

const cleanCampaign = (value?: string) => (value ?? "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 24);

export function whatsappMessage(input: {
  pathname: string;
  search?: string;
  campaign?: string;
  /** Texto fijo (por ejemplo "quiero comprar el X"); la etiqueta se le agrega igual. */
  text?: string;
}) {
  const locale = input.pathname.startsWith("/en") ? "en" : "es";
  const { kind, tag } = pageKind(input.pathname);
  const t = TEXTS[locale];
  const ref = new URLSearchParams(input.search ?? "").get("ref") ?? "";
  const product = PRODUCT_NAMES[pathname_slug(input.pathname)];
  const base =
    input.text ||
    (kind === "pedido"
      ? t.pedido(ref.slice(0, 20))
      : kind === "pdp" && product
        ? locale === "en"
          ? `Hi, I'd like information about the ${product}`
          : `Hola, quiero información del ${product}`
        : t[kind]);
  const campaign = cleanCampaign(input.campaign);
  return `${base} (web-${tag}${campaign ? ` · ${campaign}` : ""})`;
}
