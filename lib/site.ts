/**
 * Datos del negocio y catalogo.
 *
 * Casi todo lo de aqui viene de hydroloop.com.mx (WooCommerce + paginas de
 * WordPress), scrapeado el 2026-08-26: productos, SKUs, precios, contenido del
 * paquete, medidas, garantia, zonas de cobertura y distribuidores. Lo que sigue
 * siendo suposicion esta marcado con TODO.
 */
export const site = {
  name: "Hydroloop",
  legalName: "Hydroloop", // TODO razon social
  brandedName: "Hydroloop®",
  builtBy: "KOS",
  builtByUrl: "https://kickoffsocial.com",
  url: "https://kosxhydroloop.vercel.app", // TODO dominio final
  currentSite: "https://hydroloop.com.mx",
  email: "hola@hydroloop.com.mx", // TODO correo real de pedidos
  /**
   * Interruptor de seguridad: mientras siga en false, ningun formulario ni
   * pedido intenta enviar correo. Un correo placeholder no recibe nada, y un
   * pedido que se cree entregado y no llego es peor que un error visible.
   */
  emailConfirmed: false,
  phone: "", // TODO telefono de atencion
  whatsapp: "", // TODO numero de WhatsApp
  city: "México",
  country: "MX",

  /** Cifras publicadas por Hydroloop en su propio sitio. */
  claims: {
    litersPerPersonPerYear: 7300,
    hoursPerYear: 18,
    warrantyYears: 1,
    warrantyYearsInstalled: 2,
    madeIn: "México",
  },
};

export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/hydroloopmx/" }, // TODO confirmar
  { name: "Facebook", href: "https://www.facebook.com/hydroloopmx/" }, // TODO confirmar
];

/** Zonas donde Hydroloop instala con personal propio. */
export const coverage = [
  {
    zone: "norte",
    cities: [
      "Ciudad Juárez, Chihuahua",
      "Monterrey, Nuevo León",
      "Torreón, Coahuila",
      "Cabo San Lucas, Baja California Sur",
      "Loreto, Baja California Sur",
    ],
  },
  {
    zone: "centro",
    cities: [
      "Ciudad de México",
      "Estado de México",
      "Hidalgo",
      "Querétaro",
      "Guanajuato",
      "Guadalajara, Jalisco",
      "Puerto Vallarta, Nayarit",
    ],
  },
];

/** Puntos de venta tomados de la pagina de contacto del sitio actual. */
export const distributors = [
  { state: "Guanajuato", name: "Ferretería Azteca León", detail: "Blvd. Vicente Valtierra 4043, San Miguel de Rentería", phone: "4791356740" },
  { state: "Guanajuato", name: "Don Pedro", detail: "Carr. San Miguel de Allende a Celaya KM 2.4", phone: "4151245574" },
  { state: "Guanajuato", name: "HidroKinesis León", detail: "Muralla de Manzanares 606, Parque Manzanares", phone: "4777037560" },
  { state: "Guanajuato", name: "Cerámica León", detail: "Blvd. Miguel Hidalgo 1805, San Jerónimo I", phone: "4777794540" },
  { state: "Guanajuato", name: "Material Eléctrico Salvatierra", detail: "Vicente Guerrero 323", phone: "4666631330" },
  { state: "Coahuila", name: "Soflux Torreón", detail: "Blvd. Diagonal Reforma 2842, Centro", phone: "8717912691" },
  { state: "San Luis Potosí", name: "Ferreterías Javi", detail: "Coronel Romero 505, Independencia", phone: "4448158159" },
  { state: "Baja California Sur", name: "Molar Loreto", detail: "Calle Pargos local 8 y 9, Miramar", phone: "6131312125" },
  { state: "Estado de México", name: "Ferretería Panorámica", detail: "Calle Panorámica, La Capilla", phone: "" },
];

export type Product = {
  id: string;
  slug: string;
  sku: string;
  /** Precio en centavos. 379900 = $3,799.00 MXN, IVA incluido. */
  priceCents: number;
  compareAtCents: number | null;
  currency: "MXN";
  stock: number;
  /** false = no se puede comprar en linea (proximamente o solo cotizacion). */
  buyable: boolean;
  comingSoon: boolean;
  /** Accesorio: no es un equipo, se vende como complemento. */
  accessory: boolean;
  image: string;
  gallery: string[];
  weightKg: number | null;
  dimensions: string | null;
};

/**
 * Catalogo real de hydroloop.com.mx. Los precios ya incluyen IVA, como en el
 * sitio actual. El inventario es un numero de arranque: WooCommerce no publica
 * existencias, solo si hay o no. TODO pedir inventario real al cliente.
 */
export const products: Product[] = [
  {
    id: "hl-manual",
    slug: "hydroloop-manual",
    sku: "HL-HYDROLOOP-MANU-11",
    priceCents: 379900,
    compareAtCents: null,
    currency: "MXN",
    stock: 40,
    buyable: true,
    comingSoon: false,
    accessory: false,
    image: "/media/products/manual.webp",
    gallery: [
      "/media/products/manual.webp",
      "/media/gallery/equipo-1.webp",
      "/media/gallery/equipo-2.webp",
      "/media/gallery/equipo-3.webp",
      "/media/gallery/equipo-4.webp",
      "/media/gallery/equipo-5.webp",
      "/media/gallery/equipo-6.webp",
      "/media/gallery/equipo-7.webp",
      "/media/gallery/laminador.webp",
      "/media/gallery/medidas-equipo.webp",
      "/media/gallery/garantia.webp",
    ],
    weightKg: 1.4,
    dimensions: "11 x 7.5 x 13 cm",
  },
  {
    id: "hl-wifi",
    slug: "hydroloop-wifi",
    sku: "HL-HYDROLOOP-WIFI-12",
    priceCents: 399900,
    compareAtCents: null,
    currency: "MXN",
    stock: 40,
    buyable: true,
    comingSoon: false,
    accessory: false,
    image: "/media/products/wifi.webp",
    gallery: [
      "/media/products/wifi.webp",
      "/media/gallery/app-wifi.webp",
      "/media/gallery/equipo-1.webp",
      "/media/gallery/equipo-2.webp",
      "/media/gallery/equipo-3.webp",
      "/media/gallery/equipo-4.webp",
      "/media/gallery/equipo-5.webp",
      "/media/gallery/equipo-6.webp",
      "/media/gallery/equipo-7.webp",
      "/media/gallery/laminador.webp",
      "/media/gallery/medidas-equipo.webp",
      "/media/gallery/garantia.webp",
    ],
    weightKg: 1.4,
    dimensions: "11 x 7.5 x 13 cm",
  },
  {
    id: "hl-kit",
    slug: "kit-caja-de-instalacion",
    sku: "HL-ACCESORIOS-KIT-11",
    priceCents: 13920,
    compareAtCents: null,
    currency: "MXN",
    stock: 60,
    buyable: true,
    comingSoon: false,
    accessory: true,
    image: "/media/products/kit-caja.webp",
    gallery: [
      "/media/products/kit-caja.webp",
      "/media/gallery/kit-1.webp",
      "/media/gallery/kit-2.webp",
      "/media/gallery/kit-3.webp",
      "/media/gallery/kit-4.webp",
      "/media/gallery/kit-5.webp",
    ],
    weightKg: null,
    dimensions: null,
  },
  {
    id: "hl-bateria",
    slug: "hydroloop-bateria",
    sku: "HL-HYDROLOOP-BAT",
    // Sin precio publicado: el sitio actual dice "proximamente".
    priceCents: 0,
    compareAtCents: null,
    currency: "MXN",
    stock: 0,
    buyable: false,
    comingSoon: true,
    accessory: false,
    image: "/media/products/bateria.webp",
    gallery: ["/media/products/bateria.webp"],
    weightKg: null,
    dimensions: null,
  },
];

/** Solo lo que se puede comprar hoy, en el orden en que se muestra. */
export const buyableProducts = products.filter((product) => product.buyable);

export function findProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function findProductById(id: string) {
  return products.find((product) => product.id === id);
}
