/**
 * ============================================================================
 * OPINIONES DE MUESTRA. NO SON RESENAS REALES DE CLIENTES.
 * ============================================================================
 *
 * hydroloop.com.mx no tiene resenas publicadas (la API de WooCommerce devuelve
 * cero), asi que aqui hay contenido de ejemplo para mostrar como se ve y como
 * funciona la seccion. Hay que reemplazarlo por opiniones reales antes de
 * publicar el sitio.
 *
 * Mientras `reviewsAreReal` siga en false:
 *  - la seccion muestra un aviso de que son de muestra,
 *  - y NO se emite `aggregateRating` en el JSON-LD, para no mandarle a Google
 *    una calificacion que nadie dejo.
 *
 * Cuando lleguen las reales: vaciar este arreglo, meter las verdaderas y poner
 * `reviewsAreReal` en true.
 */
export const reviewsAreReal = false;

export type Review = {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  certifiedInstall: boolean;
  helpful: number;
};

export const reviews: Review[] = [
  {
    id: "r-01",
    productId: "hl-wifi",
    author: "Mariana G.",
    city: "Querétaro",
    rating: 5,
    date: "2026-08-14",
    title: "Programado a las 6:40 y listo",
    body: "Lo dejé programado para que arranque antes de que suene el despertador. Llego al baño y el agua ya sale caliente. Lo que más me sorprendió fue ver la cubeta que antes llenaba con el agua de la espera: ya no hay nada que juntar.",
    verified: true,
    certifiedInstall: true,
    helpful: 34,
  },
  {
    id: "r-02",
    productId: "hl-manual",
    author: "Jorge L.",
    city: "Ciudad Juárez",
    rating: 5,
    date: "2026-08-09",
    title: "El calentador está hasta la azotea",
    body: "Vivo en una casa donde el boiler queda lejísimos del baño principal. Antes esperaba casi dos minutos. Ahora aprieto el botón, me lavo los dientes y cuando abro la regadera ya está. Mi plomero lo instaló en una tarde.",
    verified: true,
    certifiedInstall: false,
    helpful: 28,
  },
  {
    id: "r-03",
    productId: "hl-manual",
    author: "Fernanda R.",
    city: "Guadalajara",
    rating: 4,
    date: "2026-08-02",
    title: "Muy bueno, la tapa la compré aparte",
    body: "Funciona perfecto y se siente bien hecho. Ojo con un detalle: el modelo Manual viene sin tapa, así que tuve que comprar una que combinara con mis apagadores. Hubiera preferido que viniera incluida.",
    verified: true,
    certifiedInstall: false,
    helpful: 41,
  },
  {
    id: "r-04",
    productId: "hl-wifi",
    author: "Ricardo M.",
    city: "Monterrey",
    rating: 5,
    date: "2026-07-28",
    title: "Lo activo desde el coche",
    body: "Regreso del gimnasio y desde el celular lo prendo cuando voy entrando a la colonia. Llego y me baño sin esperar ni un segundo. La app no es la más bonita del mundo pero hace lo que promete.",
    verified: true,
    certifiedInstall: true,
    helpful: 22,
  },
  {
    id: "r-05",
    productId: "hl-manual",
    author: "Alejandra V.",
    city: "León",
    rating: 5,
    date: "2026-07-21",
    title: "El recibo bajó y se nota",
    body: "Somos cinco en la casa y todos se bañan en la mañana. El primer recibo después de instalarlo bajó bastante. No hago cuentas exactas pero la diferencia se ve.",
    verified: true,
    certifiedInstall: false,
    helpful: 37,
  },
  {
    id: "r-06",
    productId: "hl-wifi",
    author: "Diego S.",
    city: "Ciudad de México",
    rating: 4,
    date: "2026-07-15",
    title: "Necesita buen wifi en el baño",
    body: "Al principio se desconectaba porque mi módem está en la planta baja. Puse un repetidor y desde entonces impecable. Si tu señal no llega bien al baño, mejor el Manual.",
    verified: true,
    certifiedInstall: false,
    helpful: 52,
  },
  {
    id: "r-07",
    productId: "hl-manual",
    author: "Patricia H.",
    city: "Torreón",
    rating: 5,
    date: "2026-07-08",
    title: "Aquí el agua es oro",
    body: "En Torreón el agua no es cosa menor. Ver cuánta se iba al drenaje nada más esperando me hizo comprarlo. Lo instaló el equipo certificado y me dieron dos años de garantía.",
    verified: true,
    certifiedInstall: true,
    helpful: 45,
  },
  {
    id: "r-08",
    productId: "hl-manual",
    author: "Luis Alberto C.",
    city: "Puebla",
    rating: 3,
    date: "2026-07-01",
    title: "Sirve, pero necesité bomba presurizadora",
    body: "Tengo calentador instantáneo de alto flujo y al principio no encendía al activar el equipo. Soporte me explicó que necesitaba una bomba de 1/6 de caballo. Con eso quedó, pero fue un gasto extra que no tenía contemplado.",
    verified: true,
    certifiedInstall: false,
    helpful: 63,
  },
  {
    id: "r-09",
    productId: "hl-wifi",
    author: "Karla T.",
    city: "Mérida",
    rating: 5,
    date: "2026-06-24",
    title: "Con Alexa quedó redondo",
    body: "Lo vinculé a Alexa y ahora nomás digo que prenda el agua mientras preparo el café. Suena a lujo pero en realidad lo que hace es que no tires agua.",
    verified: true,
    certifiedInstall: false,
    helpful: 19,
  },
  {
    id: "r-10",
    productId: "hl-manual",
    author: "Héctor N.",
    city: "Querétaro",
    rating: 5,
    date: "2026-06-17",
    title: "Dos baños, dos equipos",
    body: "Mi instalación es en rama, así que necesité un equipo por baño. Me lo dijeron antes de comprar, sin querer venderme uno solo prometiendo que iba a funcionar en los dos. Eso se agradece.",
    verified: true,
    certifiedInstall: true,
    helpful: 31,
  },
  {
    id: "r-11",
    productId: "hl-kit",
    author: "Sofía B.",
    city: "Guanajuato",
    rating: 5,
    date: "2026-06-10",
    title: "Justo lo que faltaba",
    body: "Mi caja eléctrica estaba llena y no había dónde meter el módulo. El kit resolvió en cinco minutos y quedó limpio, ni se nota.",
    verified: true,
    certifiedInstall: false,
    helpful: 12,
  },
  {
    id: "r-12",
    productId: "hl-manual",
    author: "Gerardo P.",
    city: "Cabo San Lucas",
    rating: 4,
    date: "2026-06-03",
    title: "Buen equipo, envío tardó",
    body: "El equipo cumple sin quejas. El envío sí tardó más de lo que esperaba por la zona donde vivo, aunque avisaron desde el principio que se cotizaba aparte.",
    verified: true,
    certifiedInstall: false,
    helpful: 17,
  },
  {
    id: "r-13",
    productId: "hl-wifi",
    author: "Norma E.",
    city: "Hermosillo",
    rating: 5,
    date: "2026-05-27",
    title: "En verano se agradece doble",
    body: "Aquí el agua de la tubería sale hirviendo en verano y helada en invierno. Con el equipo dejé de tirar litros esperando en las dos temporadas.",
    verified: true,
    certifiedInstall: false,
    helpful: 26,
  },
  {
    id: "r-14",
    productId: "hl-manual",
    author: "Iván R.",
    city: "Toluca",
    rating: 5,
    date: "2026-05-20",
    title: "Instalación más simple de lo que pensé",
    body: "Soy plomero y me tocó instalar varios. Es honestamente sencillo si entiendes cómo está armada la casa. La guía rápida está clara y el termostato hace su trabajo.",
    verified: false,
    certifiedInstall: false,
    helpful: 58,
  },
  {
    id: "r-15",
    productId: "hl-wifi",
    author: "Claudia F.",
    city: "San Luis Potosí",
    rating: 5,
    date: "2026-05-12",
    title: "Los niños ya no se bañan con agua fría",
    body: "Antes el primero que entraba al baño se llevaba el agua fría. Ahora prendo el equipo desde el celular y todos entran con agua caliente desde el primer segundo.",
    verified: true,
    certifiedInstall: true,
    helpful: 24,
  },
  {
    id: "r-16",
    productId: "hl-manual",
    author: "Roberto A.",
    city: "Tijuana",
    rating: 2,
    date: "2026-05-05",
    title: "Mi instalación no era la adecuada",
    body: "En mi caso los ramales son largos y necesitaba tres equipos para cubrir la casa. Me lo advirtieron pero yo compré uno pensando que alcanzaba. Es mi error más que del producto, aunque me hubiera gustado entenderlo mejor antes de pagar.",
    verified: true,
    certifiedInstall: false,
    helpful: 71,
  },
  {
    id: "r-17",
    productId: "hl-manual",
    author: "Elena M.",
    city: "Aguascalientes",
    rating: 5,
    date: "2026-04-28",
    title: "Ahorra agua, no gas",
    body: "Lo aclaro porque yo llegué pensando que también bajaba el gas: no lo hace, el gas es el mismo. Lo que ahorra es agua y tiempo, y con eso me basta.",
    verified: true,
    certifiedInstall: false,
    helpful: 49,
  },
  {
    id: "r-18",
    productId: "hl-wifi",
    author: "Andrés O.",
    city: "Puerto Vallarta",
    rating: 5,
    date: "2026-04-20",
    title: "Lo puse en el departamento de renta",
    body: "Tengo un departamento que rento por noche y los huéspedes siempre se quejaban de la espera del agua caliente. Desde que lo instalé no ha vuelto a salir el tema en una reseña.",
    verified: true,
    certifiedInstall: true,
    helpful: 33,
  },
];

export type ReviewSummary = {
  count: number;
  average: number;
  /** Cuantas resenas hay por cada calificacion, de 1 a 5. */
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  recommendPercent: number;
};

export function reviewsFor(productId?: string) {
  return productId ? reviews.filter((review) => review.productId === productId) : reviews;
}

export function summarize(list: Review[]): ReviewSummary {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
  for (const review of list) distribution[review.rating] += 1;

  const count = list.length;
  const total = list.reduce((sum, review) => sum + review.rating, 0);
  const recommended = list.filter((review) => review.rating >= 4).length;

  return {
    count,
    // Un decimal, redondeado: 4.65 se muestra como 4.7 y no como 4.6500000001.
    average: count ? Math.round((total / count) * 10) / 10 : 0,
    distribution,
    recommendPercent: count ? Math.round((recommended / count) * 100) : 0,
  };
}
