/**
 * Single source of truth for every business fact on the site.
 *
 * PLACEHOLDER: everything marked TODO is invented scaffolding, not a real
 * Hydroloop fact. Replace it here and the whole site updates. See PLACEHOLDERS.md.
 */
export const site = {
  name: "Hydroloop",
  legalName: "Hydroloop", // TODO razon social real
  builtBy: "KOS",
  builtByUrl: "https://kickoffsocial.com",
  url: "https://kosxhydroloop.vercel.app", // TODO dominio final
  email: "hola@hydroloop.com", // TODO correo real
  phone: "", // TODO telefono real
  whatsapp: "", // TODO numero de WhatsApp
  founded: 2024, // TODO ano de fundacion
  city: "Ciudad Juárez, Chihuahua", // TODO ubicacion real
  country: "MX",
  address: "", // TODO direccion real
};

export const socials = [
  { name: "Instagram", href: "https://instagram.com/" }, // TODO
  { name: "LinkedIn", href: "https://linkedin.com/" }, // TODO
  { name: "Facebook", href: "https://facebook.com/" }, // TODO
];

/**
 * Catalogo de arranque. La forma ya es la que necesita un checkout:
 * id estable, precio en centavos y moneda, para conectar Claude Commerce
 * sin rehacer las tarjetas ni las paginas de producto.
 */
export type Product = {
  id: string;
  slug: string;
  priceCents: number;
  currency: "MXN" | "USD";
  image: string;
  available: boolean;
};

export const products: Product[] = [
  {
    id: "hl-001",
    slug: "producto-uno",
    priceCents: 249900,
    currency: "MXN",
    image: "/brand/product-placeholder.svg",
    available: true,
  },
  {
    id: "hl-002",
    slug: "producto-dos",
    priceCents: 389900,
    currency: "MXN",
    image: "/brand/product-placeholder.svg",
    available: true,
  },
  {
    id: "hl-003",
    slug: "producto-tres",
    priceCents: 129900,
    currency: "MXN",
    image: "/brand/product-placeholder.svg",
    available: false,
  },
];

export function findProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(product: Product, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    style: "currency",
    currency: product.currency,
    maximumFractionDigits: 0,
  }).format(product.priceCents / 100);
}
