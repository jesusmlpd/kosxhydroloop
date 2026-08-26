/**
 * ============================================================================
 * OPINIONES DE MUESTRA. NO SON RESENAS REALES DE CLIENTES.
 * ============================================================================
 *
 * hydroloop.com.mx no tiene resenas publicadas (la API de WooCommerce devuelve
 * cero), asi que esto es contenido de ejemplo para mostrar la seccion
 * funcionando. Hay que reemplazarlo por opiniones reales antes de publicar.
 *
 * Mientras `reviewsAreReal` siga en false:
 *  - la seccion muestra un aviso de que son de muestra,
 *  - y NO se emite `aggregateRating` en el JSON-LD, para no mandarle a Google
 *    una calificacion que nadie dejo.
 *
 * La mezcla esta calibrada a proposito: promedio global 4.8, con algunas de
 * 4 estrellas que cuentan fricciones reales (tapa aparte, senal wifi, bomba
 * presurizadora). Un muro de puros cincos no se lo cree nadie.
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
  // ---------------- Hydroloop Manual (12 x 5, 3 x 4 = 4.8) ----------------
  {
    id: "r-01",
    productId: "hl-manual",
    author: "Jorge L.",
    city: "Ciudad Juárez",
    rating: 5,
    date: "2026-08-20",
    title: "El calentador está hasta la azotea",
    body: "El boiler queda lejísimos del baño principal y antes esperaba casi dos minutos. Ahora aprieto el botón, me lavo los dientes y cuando abro la regadera ya está caliente. Mi plomero lo instaló en una tarde.",
    verified: true,
    certifiedInstall: false,
    helpful: 41,
  },
  {
    id: "r-02",
    productId: "hl-manual",
    author: "Alejandra V.",
    city: "León",
    rating: 5,
    date: "2026-08-12",
    title: "El recibo bajó y se nota",
    body: "Somos cinco en la casa y todos se bañan en la mañana. El primer recibo después de instalarlo bajó bastante. La cubeta que teníamos en la regadera para juntar el agua fría ya se jubiló.",
    verified: true,
    certifiedInstall: false,
    helpful: 37,
  },
  {
    id: "r-03",
    productId: "hl-manual",
    author: "Patricia H.",
    city: "Torreón",
    rating: 5,
    date: "2026-08-05",
    title: "Aquí el agua es oro",
    body: "En Torreón el agua no es cosa menor. Ver cuánta se iba al drenaje nada más esperando me decidió. Lo instaló el equipo certificado, quedó limpio y me dieron dos años de garantía.",
    verified: true,
    certifiedInstall: true,
    helpful: 45,
  },
  {
    id: "r-04",
    productId: "hl-manual",
    author: "Héctor N.",
    city: "Querétaro",
    rating: 5,
    date: "2026-07-30",
    title: "Dos baños, dos equipos, cero cuento",
    body: "Mi instalación es en rama, así que necesité un equipo por baño. Me lo dijeron ANTES de comprar, sin venderme uno solo prometiendo milagros. Los dos funcionan perfecto desde el primer día.",
    verified: true,
    certifiedInstall: true,
    helpful: 33,
  },
  {
    id: "r-05",
    productId: "hl-manual",
    author: "Iván R.",
    city: "Toluca",
    rating: 5,
    date: "2026-07-22",
    title: "Lo digo como plomero",
    body: "Me ha tocado instalar varios. La guía rápida está clara, el equipo se siente bien hecho y el termostato corta justo donde debe. De lo importado que he visto, nada se instala tan fácil como esto.",
    verified: false,
    certifiedInstall: false,
    helpful: 58,
  },
  {
    id: "r-06",
    productId: "hl-manual",
    author: "Elena M.",
    city: "Aguascalientes",
    rating: 5,
    date: "2026-07-15",
    title: "Ahorra agua, no gas, y lo dicen de frente",
    body: "Yo llegué pensando que también bajaba el gas: no, el gas es el mismo y la marca lo aclara sin rodeos. Lo que ahorra es agua y tiempo, y con eso me sobra para recomendarlo.",
    verified: true,
    certifiedInstall: false,
    helpful: 49,
  },
  {
    id: "r-07",
    productId: "hl-manual",
    author: "Gerardo P.",
    city: "Cabo San Lucas",
    rating: 4,
    date: "2026-07-08",
    title: "Buen equipo, el envío tardó",
    body: "El equipo cumple sin quejas y el ahorro se nota. El envío sí tardó más de lo esperado por la zona donde vivo, aunque avisaron desde el principio que se cotizaba aparte.",
    verified: true,
    certifiedInstall: false,
    helpful: 17,
  },
  {
    id: "r-08",
    productId: "hl-manual",
    author: "Fernanda R.",
    city: "Guadalajara",
    rating: 4,
    date: "2026-06-28",
    title: "Muy bueno, la tapa se compra aparte",
    body: "Funciona perfecto y se ve discreto. Solo un detalle: el Manual viene sin tapa para que combines con tus apagadores, así que hay que comprarla aparte. Sabiéndolo, cero problema.",
    verified: true,
    certifiedInstall: false,
    helpful: 44,
  },
  {
    id: "r-09",
    productId: "hl-manual",
    author: "Luis Alberto C.",
    city: "Puebla",
    rating: 4,
    date: "2026-06-20",
    title: "Con calentador instantáneo, pregunta antes",
    body: "Tengo calentador instantáneo de alto flujo y necesité una bomba presurizadora de 1/6 para que encendiera. Soporte me acompañó a distancia hasta que quedó. Funciona muy bien, solo contempla ese posible extra.",
    verified: true,
    certifiedInstall: false,
    helpful: 63,
  },
  {
    id: "r-10",
    productId: "hl-manual",
    author: "Rocío D.",
    city: "Chihuahua",
    rating: 5,
    date: "2026-06-12",
    title: "Mi papá de 78 años lo usa sin pensarlo",
    body: "Buscaba algo sin apps ni configuraciones para casa de mis papás. Un botón junto al apagador y ya. Mi papá lo aprieta antes de rasurarse y cuando entra a bañarse el agua está lista.",
    verified: true,
    certifiedInstall: true,
    helpful: 29,
  },
  {
    id: "r-11",
    productId: "hl-manual",
    author: "Marco T.",
    city: "Mexicali",
    rating: 5,
    date: "2026-06-03",
    title: "Verano de 45 grados y funciona igual",
    body: "Acá la tubería en verano quema y en invierno congela. El equipo trabaja parejo todo el año y dejamos de tirar litros en las dos temporadas. Ya encargué otro para el baño de visitas.",
    verified: true,
    certifiedInstall: false,
    helpful: 26,
  },
  {
    id: "r-12",
    productId: "hl-manual",
    author: "Susana G.",
    city: "Ciudad de México",
    rating: 5,
    date: "2026-05-27",
    title: "En tandeo, cada litro cuenta",
    body: "En mi colonia el agua llega por tandeo y la cisterna es sagrada. Desde que está el Hydroloop no se va ni un litro esperando la caliente. Es de esas compras que dan paz.",
    verified: true,
    certifiedInstall: true,
    helpful: 52,
  },
  {
    id: "r-13",
    productId: "hl-manual",
    author: "Raúl E.",
    city: "Hermosillo",
    rating: 5,
    date: "2026-05-18",
    title: "Se paga solo, literal",
    body: "Hice la cuenta con mi recibo: al ritmo de ahorro que llevo, el equipo se paga en menos de dos años y le calculan 20 de vida útil. Pocas cosas de la casa dan ese retorno.",
    verified: true,
    certifiedInstall: false,
    helpful: 38,
  },
  {
    id: "r-14",
    productId: "hl-manual",
    author: "Carmen J.",
    city: "Saltillo",
    rating: 5,
    date: "2026-05-09",
    title: "Regalo para mi mamá",
    body: "Se lo regalé a mi mamá que juntaba el agua fría en cubetas para las plantas. Ahora ya no junta nada porque no se tira nada. Dice que es el mejor regalo útil que le han dado.",
    verified: true,
    certifiedInstall: false,
    helpful: 21,
  },
  {
    id: "r-15",
    productId: "hl-manual",
    author: "Óscar M.",
    city: "Monterrey",
    rating: 5,
    date: "2026-04-30",
    title: "Después de la sequía del 22, obligado",
    body: "Quien vivió la crisis del agua en Monterrey entiende. Esto debería venir de fábrica en todas las casas nuevas. Instalación certificada impecable y el consumo eléctrico es una broma de tan bajo.",
    verified: true,
    certifiedInstall: true,
    helpful: 67,
  },

  // ---------------- Hydroloop WiFi (9 x 5, 2 x 4 = 4.8) ----------------
  {
    id: "r-16",
    productId: "hl-wifi",
    author: "Mariana G.",
    city: "Querétaro",
    rating: 5,
    date: "2026-08-14",
    title: "Programado a las 6:40 y listo",
    body: "Lo dejé programado para que arranque antes que el despertador. Llego al baño y el agua ya sale caliente. La cubeta que llenaba con el agua de la espera ya no existe en esta casa.",
    verified: true,
    certifiedInstall: true,
    helpful: 34,
  },
  {
    id: "r-17",
    productId: "hl-wifi",
    author: "Ricardo M.",
    city: "Monterrey",
    rating: 5,
    date: "2026-08-06",
    title: "Lo activo desde el coche",
    body: "Salgo del gimnasio y lo prendo desde el celular entrando a la colonia. Llego y me baño sin esperar un segundo. Con Alexa también responde a la primera.",
    verified: true,
    certifiedInstall: true,
    helpful: 28,
  },
  {
    id: "r-18",
    productId: "hl-wifi",
    author: "Karla T.",
    city: "Mérida",
    rating: 5,
    date: "2026-07-25",
    title: "Con Alexa quedó redondo",
    body: "Lo vinculé a Alexa y ahora pido el agua caliente mientras preparo el café. Suena a lujo, pero en realidad es no tirar agua. En Mérida con este calor nadie extraña esperar.",
    verified: true,
    certifiedInstall: false,
    helpful: 22,
  },
  {
    id: "r-19",
    productId: "hl-wifi",
    author: "Claudia F.",
    city: "San Luis Potosí",
    rating: 5,
    date: "2026-07-17",
    title: "Los niños ya no pelean por el primer turno",
    body: "Antes el primero que entraba al baño se llevaba el agua fría. Ahora lo programo y todos entran con agua caliente desde el primer segundo. La paz de las mañanas no tiene precio.",
    verified: true,
    certifiedInstall: true,
    helpful: 31,
  },
  {
    id: "r-20",
    productId: "hl-wifi",
    author: "Andrés O.",
    city: "Puerto Vallarta",
    rating: 5,
    date: "2026-07-09",
    title: "En mi Airbnb ya no se quejan",
    body: "Rento un departamento por noche y la queja eterna era la espera del agua caliente. Lo programé para las horas de baño y desde entonces el tema desapareció de las reseñas. Se pagó solo en reservas.",
    verified: true,
    certifiedInstall: true,
    helpful: 40,
  },
  {
    id: "r-21",
    productId: "hl-wifi",
    author: "Diego S.",
    city: "Ciudad de México",
    rating: 4,
    date: "2026-06-30",
    title: "Necesita buen wifi en el baño",
    body: "Al principio se desconectaba porque el módem está en la planta baja. Con un repetidor quedó impecable y no ha vuelto a fallar. Si tu señal no llega al baño, contémplalo o vete por el Manual.",
    verified: true,
    certifiedInstall: false,
    helpful: 55,
  },
  {
    id: "r-22",
    productId: "hl-wifi",
    author: "Norma E.",
    city: "Guadalajara",
    rating: 5,
    date: "2026-06-21",
    title: "SmartThings y a correr",
    body: "Lo integré a SmartThings con el resto de la casa y quedó en la rutina de las mañanas: se prende solo entre semana a las 6:30. Cero mantenimiento en meses y el recibo del agua bajó.",
    verified: true,
    certifiedInstall: false,
    helpful: 19,
  },
  {
    id: "r-23",
    productId: "hl-wifi",
    author: "Pablo A.",
    city: "Tijuana",
    rating: 5,
    date: "2026-06-13",
    title: "El agua aquí es carísima y se nota",
    body: "En Tijuana el metro cúbico duele. Entre la programación por horario y que ya nadie deja correr la llave, el ahorro fue visible desde el segundo recibo. Mis vecinos ya encargaron el suyo.",
    verified: true,
    certifiedInstall: false,
    helpful: 25,
  },
  {
    id: "r-24",
    productId: "hl-wifi",
    author: "Gabriela Z.",
    city: "Cancún",
    rating: 5,
    date: "2026-06-04",
    title: "App simple, hace lo que promete",
    body: "No es la app más bonita del mundo y no importa: prender, programar, apagar. Nunca falla y el temporizador de seguridad da confianza cuando no hay agua caliente en el boiler.",
    verified: true,
    certifiedInstall: false,
    helpful: 16,
  },
  {
    id: "r-25",
    productId: "hl-wifi",
    author: "Tomás B.",
    city: "Morelia",
    rating: 4,
    date: "2026-05-26",
    title: "Perfecto, solo revisa el INCHING",
    body: "Los primeros días se encendía solo y pensé que estaba fallando: era la configuración del tiempo de trabajo en la app, el famoso INCHING. Soporte me lo explicó en una llamada y desde entonces perfecto.",
    verified: true,
    certifiedInstall: false,
    helpful: 47,
  },
  {
    id: "r-26",
    productId: "hl-wifi",
    author: "Verónica L.",
    city: "Puebla",
    rating: 5,
    date: "2026-05-15",
    title: "De renta en renta, se viene conmigo",
    body: "Vivo de rentas y lo instalé pensando en llevármelo cuando me mude: se quita y se pone sin dejar cicatriz. Dos mudanzas después sigue funcionando como el primer día.",
    verified: true,
    certifiedInstall: false,
    helpful: 23,
  },

  // ---------------- Kit caja de instalacion (4 x 5 = 5.0) ----------------
  {
    id: "r-27",
    productId: "hl-kit",
    author: "Sofía B.",
    city: "Guanajuato",
    rating: 5,
    date: "2026-07-11",
    title: "Justo lo que faltaba",
    body: "Mi caja eléctrica estaba llena y no había dónde meter el módulo. El kit resolvió en cinco minutos y quedó tan limpio que ni se nota que es de sobreponer.",
    verified: true,
    certifiedInstall: false,
    helpful: 14,
  },
  {
    id: "r-28",
    productId: "hl-kit",
    author: "Rodrigo V.",
    city: "Ciudad de México",
    rating: 5,
    date: "2026-06-18",
    title: "Medidas exactas",
    body: "La chalupa viene a la medida exacta del módulo de control y la tapa ya trae la perforación del botón. Nada de andar taladrando tapas genéricas. Por el precio, ni lo pienses.",
    verified: true,
    certifiedInstall: false,
    helpful: 11,
  },
  {
    id: "r-29",
    productId: "hl-kit",
    author: "Laura Q.",
    city: "Querétaro",
    rating: 5,
    date: "2026-05-29",
    title: "Pídelo junto con el equipo",
    body: "Hice dos pedidos por no saber que mi caja estaba llena. Si tu casa tiene años y apagadores llenos, agrégalo de una vez al carrito y te ahorras la segunda espera.",
    verified: true,
    certifiedInstall: false,
    helpful: 18,
  },
  {
    id: "r-30",
    productId: "hl-kit",
    author: "Ernesto C.",
    city: "Torreón",
    rating: 5,
    date: "2026-05-08",
    title: "Blanco que sí combina",
    body: "El blanco es el mismo tono que las tapas comunes, así que no desentona en la pared. Instalación de minutos con un desarmador.",
    verified: true,
    certifiedInstall: false,
    helpful: 9,
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
    // Un decimal, redondeado: 4.83 se muestra como 4.8 y no como 4.8333333.
    average: count ? Math.round((total / count) * 10) / 10 : 0,
    distribution,
    recommendPercent: count ? Math.round((recommended / count) * 100) : 0,
  };
}
