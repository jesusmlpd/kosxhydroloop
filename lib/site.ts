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
  /**
   * Interruptor de seguridad: mientras siga en false, ningun formulario ni
   * pedido intenta enviar correo. Un correo placeholder no recibe nada, y un
   * pedido que se cree entregado y no llego es peor que un error visible.
   * Se pone en true cuando el correo de arriba (o FORMSUBMIT_TO) sea real y
   * este activado en FormSubmit.
   */
  emailConfirmed: false,
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
 * Catalogo de arranque. La forma ya es la que necesita un checkout de verdad:
 * id estable, precio en centavos, moneda e inventario. El inventario es lo que
 * tope las cantidades y lo que dispara el aviso de "quedan pocas".
 *
 * PLACEHOLDER: precios, inventario y fotos son inventados.
 */
export type Product = {
  id: string;
  slug: string;
  priceCents: number;
  /** Precio anterior tachado. null si no hay descuento. */
  compareAtCents: number | null;
  currency: "MXN" | "USD";
  stock: number;
  image: string;
  /** false = no se puede comprar en linea, solo cotizar. */
  buyable: boolean;
};

export const products: Product[] = [
  {
    id: "hl-001",
    slug: "producto-uno",
    priceCents: 249900,
    compareAtCents: 289900,
    currency: "MXN",
    stock: 12,
    image: "/brand/product-placeholder.svg",
    buyable: true,
  },
  {
    id: "hl-002",
    slug: "producto-dos",
    priceCents: 389900,
    compareAtCents: null,
    currency: "MXN",
    stock: 3,
    image: "/brand/product-placeholder.svg",
    buyable: true,
  },
  {
    id: "hl-003",
    slug: "producto-tres",
    priceCents: 129900,
    compareAtCents: 149900,
    currency: "MXN",
    stock: 0,
    image: "/brand/product-placeholder.svg",
    buyable: true,
  },
];

export function findProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function findProductById(id: string) {
  return products.find((product) => product.id === id);
}
