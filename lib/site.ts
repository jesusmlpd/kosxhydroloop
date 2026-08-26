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
  /** Correo publicado en hydroloop.com.mx/contacto. */
  email: "ventas@hydroloop.com.mx",
  /**
   * Interruptor de seguridad: mientras siga en false, ningun formulario ni
   * pedido intenta enviar correo. Un correo placeholder no recibe nada, y un
   * pedido que se cree entregado y no llego es peor que un error visible.
   */
  emailConfirmed: false,
  phone: "",
  /** WhatsApp publicado en el sitio actual: 442 334 4455. */
  whatsapp: "5214423344455",
  whatsappDisplay: "442 334 4455",
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

/** Redes publicadas en hydroloop.com.mx (verificadas en su footer y contacto). */
export const socials = [
  { name: "Instagram", id: "instagram", href: "https://www.instagram.com/hydroloopmexico/" },
  { name: "Facebook", id: "facebook", href: "https://www.facebook.com/HydroloopMx" },
  { name: "YouTube", id: "youtube", href: "https://www.youtube.com/@hydroloopmexico" },
] as const;

export function whatsappUrl(text = "Hola") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

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

/**
 * Puntos de venta completos de hydroloop.com.mx/contacto, agrupados por
 * region tal como los publica la marca, Guatemala incluida.
 */
export type Distributor = {
  name: string;
  address: string;
  phone: string;
  url?: string;
};

export const distributorRegions: Array<{ region: string; items: Distributor[] }> = [
  {
    region: "Guanajuato",
    items: [
      { name: "Ferretería Azteca León", address: "Blvd. Vicente Valtierra 4043, Col. San Miguel de Rentería, CP 37256", phone: "4791356740", url: "https://ferreteriazteca.com.mx" },
      { name: "Ferretería Azteca", address: "Blvd. J.J. Torres Landa Ote. 2705, CP 37520", phone: "4771612630", url: "https://ferreteriazteca.com.mx" },
      { name: "Don Pedro", address: "Carr. San Miguel de Allende a Celaya KM 2.4", phone: "4151245574", url: "http://www.grupodonpedro.com" },
      { name: "HidroKinesis León", address: "Muralla de Manzanares 606, Parque Manzanares, CP 37510", phone: "4777037560", url: "http://www.hidrokinesis.com" },
      { name: "Cerámica León", address: "Blvd. Miguel Hidalgo 1805, Col. San Jerónimo I, CP 37148", phone: "4777794540" },
      { name: "Material Eléctrico Salvatierra", address: "Vicente Guerrero 323, CP 38900", phone: "4666631330" },
    ],
  },
  {
    region: "Querétaro",
    items: [
      { name: "Motobombas y Reductores Jordán", address: "Plaza de las Naciones, Prol. Av. México 5-1 Local 11, San Juan del Río, CP 76806", phone: "2071011168", url: "http://www.motobombasyreductoresjordan.com" },
    ],
  },
  {
    region: "Coahuila",
    items: [
      { name: "Soflux Torreón", address: "Blvd. Diagonal Reforma 2842, Col. Centro, CP 27000", phone: "8717912691", url: "http://www.soflux.mx" },
    ],
  },
  {
    region: "San Luis Potosí",
    items: [
      { name: "Ferreterías Javi", address: "Coronel Romero 505, Col. Independencia", phone: "4448158159", url: "https://www.facebook.com/javiferretevias/" },
    ],
  },
  {
    region: "Baja California Sur",
    items: [
      { name: "Molmar Loreto", address: "Calle Pargos local 8 y 9, Col. Miramar, CP 23880", phone: "6131312125" },
    ],
  },
  {
    region: "Estado de México",
    items: [
      { name: "Ferretería Panorámica", address: "Calle Panorámica, Col. La Capilla, Valle de Bravo, CP 51200", phone: "7224575239" },
    ],
  },
  {
    region: "Ciudad de Guatemala",
    items: [
      { name: "Duratto", address: "Guatemala 25, Av. 1-89 zona 15, Col. Vista Hermosa II, Oficina 809", phone: "50241263381" },
    ],
  },
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
  /** Vendidos en los ultimos 30 dias. SIMULADO hasta conectar datos reales. */
  soldMonthly: number;
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
    soldMonthly: 76,
    priceCents: 379900,
    compareAtCents: null,
    currency: "MXN",
    stock: 14,
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
    soldMonthly: 58,
    priceCents: 399900,
    compareAtCents: null,
    currency: "MXN",
    stock: 9,
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
    soldMonthly: 41,
    priceCents: 13920,
    compareAtCents: null,
    currency: "MXN",
    stock: 26,
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
    soldMonthly: 0,
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
