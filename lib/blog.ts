import type { Locale } from "@/lib/i18n";

/**
 * Blog en codigo, sin CMS.
 *
 * El contenido esta escrito a partir del material del propio Hydroloop: la
 * pagina de como funciona, las preguntas frecuentes, la garantia y las zonas de
 * cobertura de hydroloop.com.mx. Nada de cifras inventadas: cuando un numero es
 * una estimacion, el texto lo dice.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "note"; text: string };

export type Post = {
  slug: string;
  date: string;
  readingMinutes: number;
  image: string;
  imageAlt: Record<Locale, string>;
  tag: Record<Locale, string>;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  body: Record<Locale, Block[]>;
};

export const posts: Post[] = [
  {
    slug: "cuanta-agua-se-va-esperando-el-agua-caliente",
    date: "2026-08-18",
    readingMinutes: 5,
    image: "/media/photos/lavabo.webp",
    imageAlt: {
      es: "Lavabo con dispositivo Hydroloop instalado",
      en: "Sink with a Hydroloop unit installed",
    },
    tag: { es: "Ahorro", en: "Savings" },
    title: {
      es: "Cuánta agua se va al drenaje esperando la caliente",
      en: "How much water goes down the drain while you wait for hot",
    },
    excerpt: {
      es: "Son entre 5 y 20 litros cada vez que abres la llave, y nadie los cuenta porque el agua se va limpia. Aquí está la cuenta completa, con la fórmula a la vista.",
      en: "It is between 5 and 20 liters every time you open the tap, and nobody counts them because the water leaves clean. Here is the full math, formula included.",
    },
    body: {
      es: [
        { type: "p", text: "El agua caliente vive en el calentador. La tubería que va del calentador a tu regadera está llena de agua que se enfrió desde la última vez que la usaste. Cuando abres la llave, esa agua fría sale primero y se va entera al drenaje. No es un desperdicio visible: es agua limpia, potable, que ya pagaste y que nunca alcanzó a servir para nada." },
        { type: "h2", text: "La cuenta, sin adornos" },
        { type: "p", text: "Multiplica cuatro cosas: personas en la casa, veces al día que cada una abre agua caliente, litros que se van en la espera, y 365 días. Con una casa de cuatro personas, dos usos al día por persona y diez litros por espera, salen 29,200 litros al año. Por persona son los 7,300 litros que Hydroloop publica." },
        { type: "p", text: "Los diez litros por espera no son un número mágico: dependen del diámetro de la tubería y de la distancia al calentador. Un baño pegado al boiler puede perder tres o cuatro litros. Un baño en el otro extremo de la casa, con calentador en la azotea, pasa fácil de veinte." },
        { type: "h2", text: "Y el tiempo, que también se paga" },
        { type: "p", text: "Si esperas noventa segundos por uso, esa misma casa de cuatro personas suma 73 horas al año paradas frente a la regadera. Repartido por persona son las 18 horas que aparecen en el sitio de Hydroloop." },
        { type: "h2", text: "Qué pasa cuando el agua regresa" },
        { type: "p", text: "Un hidro-retorno no calienta más rápido: manda el agua fría de vuelta al calentador en lugar de tirarla. La misma agua da vueltas hasta que llega caliente al punto de uso. Lo que antes se iba al drenaje se queda en la casa." },
        { type: "note", text: "Ojo con una confusión común: esto ahorra agua, tiempo y dinero, no gas. El calentador trabaja lo mismo." },
      ],
      en: [
        { type: "p", text: "Hot water lives in the heater. The pipe that runs from the heater to your shower is full of water that cooled down since the last time you used it. Open the tap and all of that cold water comes out first and goes straight down the drain. It is not visible waste: it is clean, drinkable water you already paid for that never got used for anything." },
        { type: "h2", text: "The math, plainly" },
        { type: "p", text: "Multiply four things: people in the house, times a day each one opens hot water, liters lost while waiting, and 365 days. For a house of four, two uses a day per person and ten liters per wait, that is 29,200 liters a year. Per person it is the 7,300 liters Hydroloop publishes." },
        { type: "p", text: "Those ten liters are not a magic number: they depend on pipe diameter and distance to the heater. A bathroom next to the heater might lose three or four liters. A bathroom at the other end of the house, heater on the roof, easily passes twenty." },
        { type: "h2", text: "And the time, which you also pay for" },
        { type: "p", text: "If you wait ninety seconds per use, that same house of four adds up to 73 hours a year standing in front of the shower. Split per person it is the 18 hours listed on the Hydroloop site." },
        { type: "h2", text: "What changes when the water goes back" },
        { type: "p", text: "A hydro-return does not heat faster: it sends the cold water back to the heater instead of throwing it away. The same water loops until hot arrives at the fixture. What used to go down the drain stays in the house." },
        { type: "note", text: "One common mix-up: this saves water, time and money, not gas. The heater works exactly the same." },
      ],
    },
  },
  {
    slug: "que-es-un-hidro-retorno",
    date: "2026-08-11",
    readingMinutes: 4,
    image: "/media/diagrams/funcionamiento.webp",
    imageAlt: {
      es: "Diagrama de funcionamiento de un hidro-retorno",
      en: "Diagram of how a hydro-return works",
    },
    tag: { es: "Cómo funciona", en: "How it works" },
    title: {
      es: "Qué es un hidro-retorno y por qué no es una bomba más",
      en: "What a hydro-return is, and why it is not just another pump",
    },
    excerpt: {
      es: "La diferencia entre mover agua y no tirarla. Cómo trabaja la bomba de 12 V, qué hace el termostato y por qué el equipo se apaga solo.",
      en: "The difference between moving water and not wasting it. How the 12 V pump works, what the thermostat does and why the unit shuts itself off.",
    },
    body: {
      es: [
        { type: "p", text: "Un hidro-retorno convierte tu instalación en un circuito cerrado por unos segundos. En lugar de que el agua fría atrapada en el tubo caliente salga por la llave, una bomba la empuja de regreso al calentador usando el tubo de agua fría." },
        { type: "h2", text: "La secuencia completa" },
        { type: "ul", items: [
          "Oprimes el botón, o lo activas desde la app si tienes el modelo WiFi.",
          "La bomba interna de 12 V empieza a mover el agua fría de regreso al calentador.",
          "Cuando el agua caliente llega al termostato de 40 grados del equipo, la bomba se apaga sola.",
          "Abres la llave y sale caliente en unos instantes.",
        ] },
        { type: "p", text: "Si no hay agua caliente en el calentador, o si hay aire en la tubería, un temporizador de seguridad corta la bomba a los quince minutos. En el modelo WiFi ese tiempo también se controla desde la programación de la app." },
        { type: "h2", text: "Por qué el termostato es la pieza clave" },
        { type: "p", text: "Sin termostato, cualquier bomba mueve agua a ciegas y hay que apagarla a ojo. El corte automático a temperatura es lo que hace que el equipo no gaste energía de más ni te obligue a estar pendiente." },
        { type: "note", text: "Existen equipos parecidos, casi siempre importados, más caros y más complejos de instalar. El propósito es el mismo, la manera de lograrlo cambia." },
      ],
      en: [
        { type: "p", text: "A hydro-return turns your plumbing into a closed loop for a few seconds. Instead of letting the cold water trapped in the hot line run out of the tap, a pump pushes it back to the heater using the cold line." },
        { type: "h2", text: "The full sequence" },
        { type: "ul", items: [
          "You press the button, or trigger it from the app on the WiFi model.",
          "The internal 12 V pump starts moving the cold water back to the heater.",
          "When hot water reaches the unit's 40 degree thermostat, the pump shuts itself off.",
          "You open the tap and it runs hot within moments.",
        ] },
        { type: "p", text: "If there is no hot water in the heater, or if there is air in the line, a safety timer cuts the pump after fifteen minutes. On the WiFi model that window is also managed from the app schedule." },
        { type: "h2", text: "Why the thermostat is the key part" },
        { type: "p", text: "Without a thermostat, any pump moves water blindly and somebody has to guess when to stop it. The automatic cutoff at temperature is what keeps the unit from wasting energy or asking you to babysit it." },
        { type: "note", text: "Similar products exist, almost always imported, pricier and harder to install. The goal is the same, the path there is different." },
      ],
    },
  },
  {
    slug: "necesito-un-equipo-por-bano",
    date: "2026-08-04",
    readingMinutes: 5,
    image: "/media/diagrams/instalacion-1.webp",
    imageAlt: {
      es: "Diagrama de instalación de Hydroloop",
      en: "Hydroloop installation diagram",
    },
    tag: { es: "Instalación", en: "Installation" },
    title: {
      es: "¿Necesito un Hydroloop por cada baño?",
      en: "Do I need one Hydroloop per bathroom?",
    },
    excerpt: {
      es: "Depende de si tu instalación es en línea o en rama. Cómo saberlo antes de comprar, para no acabar con un equipo que no alcanza.",
      en: "It depends on whether your plumbing runs in line or in branches. How to know before buying, so you do not end up with a unit that cannot cover the house.",
    },
    body: {
      es: [
        { type: "p", text: "Es la pregunta más común y la respuesta honesta es: depende de tu instalación. Vale la pena resolverla antes de pagar, no después." },
        { type: "h2", text: "Instalación en línea" },
        { type: "p", text: "Los servicios están conectados uno tras otro sobre la misma tubería. Aquí puede bastar un equipo colocado en el último punto, siempre y cuando los ramales secundarios sean cortos. Si esos ramales son largos, cada uno vuelve a acumular agua fría y hará falta equipo adicional." },
        { type: "h2", text: "Instalación en rama" },
        { type: "p", text: "Cada servicio recibe agua por un ramal independiente que sale del mismo tronco. En este caso cada punto donde quieras agua caliente instantánea necesita su propio equipo, porque el agua de un ramal no pasa por el otro." },
        { type: "h2", text: "Cómo saber cuál tienes" },
        { type: "ul", items: [
          "Un plomero profesional lo determina revisando la instalación y haciendo pruebas de flujo.",
          "El soporte técnico de Hydroloop te puede asesorar de forma remota con fotos y datos de la instalación.",
          "Si la casa es de obra nueva, los planos hidráulicos lo dicen directo.",
        ] },
        { type: "note", text: "Preferimos decirte que necesitas dos equipos antes de la compra que venderte uno prometiendo algo que no va a pasar." },
      ],
      en: [
        { type: "p", text: "This is the most common question and the honest answer is: it depends on your plumbing. Worth settling before you pay, not after." },
        { type: "h2", text: "In-line plumbing" },
        { type: "p", text: "Fixtures are connected one after another along the same pipe. Here one unit at the last point can be enough, as long as the secondary branches are short. If those branches are long, each one builds up cold water again and extra units are needed." },
        { type: "h2", text: "Branched plumbing" },
        { type: "p", text: "Each fixture gets water through its own branch off the same trunk. In that case every point where you want instant hot water needs its own unit, because water from one branch never passes through the other." },
        { type: "h2", text: "How to know which one you have" },
        { type: "ul", items: [
          "A professional plumber can determine it by inspecting the install and running flow tests.",
          "Hydroloop technical support can assess it remotely with photos and details of the installation.",
          "If the house is new construction, the plumbing plans say it outright.",
        ] },
        { type: "note", text: "We would rather tell you that you need two units before the sale than sell you one on a promise that will not hold." },
      ],
    },
  },
  {
    slug: "compatibilidad-con-calentadores",
    date: "2026-07-28",
    readingMinutes: 4,
    image: "/media/photos/dispositivo.webp",
    imageAlt: {
      es: "Equipo Hydroloop instalado junto a la tubería",
      en: "Hydroloop unit installed next to the pipework",
    },
    tag: { es: "Compatibilidad", en: "Compatibility" },
    title: {
      es: "¿Con qué calentadores funciona Hydroloop?",
      en: "Which water heaters does Hydroloop work with?",
    },
    excerpt: {
      es: "Con todos, y hay un caso que conviene revisar antes: los instantáneos de alto flujo. Qué esperar y cuándo hace falta una bomba presurizadora.",
      en: "With all of them, and there is one case worth checking first: high flow tankless heaters. What to expect and when a booster pump is needed.",
    },
    body: {
      es: [
        { type: "p", text: "Hydroloop es compatible con cualquier tipo de calentador: de depósito, de paso, instantáneo, solar. No sustituye al calentador ni cambia su funcionamiento, solo evita que el agua fría se vaya al drenaje mientras esperas." },
        { type: "h2", text: "El caso de los instantáneos de alto flujo" },
        { type: "p", text: "Algunos calentadores instantáneos de alto flujo necesitan cierto caudal para encender. Al activar el hidro-retorno puede que ese caudal no sea suficiente. La solución conocida es apoyar la instalación con una bomba presurizadora de 1/6 de caballo." },
        { type: "p", text: "No aplica en todos los casos, así que el orden razonable es instalar primero y probar. Si el calentador no enciende al activar el equipo, entonces se agrega la presurizadora." },
        { type: "h2", text: "¿Y si tengo hidroneumático?" },
        { type: "p", text: "No hay presión que vencer. En un circuito cerrado la presión es la fuerza que el agua ejerce en todas direcciones, no un flujo. Hydroloop es justo el elemento que le da flujo al circuito, convirtiendo en circuito cerrado la instalación del baño con el calentador." },
        { type: "note", text: "Si tienes dudas sobre tu instalación, un plomero puede hacer las pruebas, o escríbenos y lo revisamos a distancia." },
      ],
      en: [
        { type: "p", text: "Hydroloop is compatible with any type of heater: tank, tankless, on demand, solar. It does not replace the heater or change how it works, it only keeps the cold water from going down the drain while you wait." },
        { type: "h2", text: "The high flow tankless case" },
        { type: "p", text: "Some high flow tankless heaters need a certain flow rate to ignite. When the hydro-return runs, that flow may not be enough. The known fix is to support the install with a 1/6 hp booster pump." },
        { type: "p", text: "It does not apply in every case, so the sensible order is install first and test. If the heater does not ignite when the unit runs, then add the booster." },
        { type: "h2", text: "What about a pressure tank?" },
        { type: "p", text: "There is no pressure to overcome. In a closed loop, pressure is the force water exerts in every direction, not a flow. Hydroloop is precisely the element that gives the loop its flow, turning the bathroom and the heater into a closed circuit." },
        { type: "note", text: "If you are unsure about your installation, a plumber can run the tests, or write to us and we will review it remotely." },
      ],
    },
  },
  {
    slug: "que-trae-la-caja-y-como-se-instala",
    date: "2026-07-21",
    readingMinutes: 6,
    image: "/media/photos/instalacion.webp",
    imageAlt: {
      es: "Instalación profesional de Hydroloop",
      en: "Professional Hydroloop installation",
    },
    tag: { es: "Instalación", en: "Installation" },
    title: {
      es: "Qué trae la caja y qué esperar el día de la instalación",
      en: "What is in the box and what to expect on install day",
    },
    excerpt: {
      es: "El paquete completo, el papel del laminador de flujo, dónde va el módulo de control y por qué a veces hace falta el kit de caja.",
      en: "The full package, what the flow laminator does, where the control module goes and why the box kit is sometimes needed.",
    },
    body: {
      es: [
        { type: "h2", text: "Lo que viene en el paquete" },
        { type: "ul", items: [
          "Equipo Hydroloop de hidro-retorno",
          "Dos mangueras flexibles",
          "Transformador y cable de señal",
          "Módulo de control con botón",
          "Módulo de termostato de 40 grados",
          "Laminador de flujo",
          "Guía rápida y manual",
        ] },
        { type: "p", text: "El equipo pesa 1.4 kg y mide 11 por 7.5 por 13 centímetros, así que cabe en el espacio que ya existe debajo del lavabo o dentro del mueble del baño. No hay tinaco extra ni obra." },
        { type: "h2", text: "Para qué sirve el laminador de flujo" },
        { type: "p", text: "Se instala en el brazo de la regadera y ayuda a maximizar el ahorro durante la ducha. Si en tu caso el flujo se reduce demasiado, se puede omitir su instalación sin afectar el funcionamiento del equipo." },
        { type: "h2", text: "Dónde va el módulo de control" },
        { type: "p", text: "Lo normal es que quepa dentro de la caja eléctrica del baño, junto a los apagadores. Si esa caja ya viene llena, el kit de caja de instalación resuelve: trae la chalupa de sobreponer con las medidas exactas y la tapa ciega perforada para el botón." },
        { type: "p", text: "El modelo Manual se entrega sin tapa y con botón sencillo, para que elijas una tapa que combine con los apagadores que ya tienes." },
        { type: "h2", text: "Instalación por tu cuenta o certificada" },
        { type: "p", text: "Un plomero con experiencia lo instala sin problema siguiendo la guía. Si estás en nuestras zonas de cobertura, nuestro personal certificado lo instala y la garantía sube de uno a dos años, cubriendo también la instalación." },
        { type: "note", text: "Guarda tu comprobante de compra: es indispensable para cualquier trámite de garantía." },
      ],
      en: [
        { type: "h2", text: "What ships in the box" },
        { type: "ul", items: [
          "Hydroloop hydro-return unit",
          "Two flexible hoses",
          "Transformer and signal cable",
          "Control module with button",
          "40 degree thermostat module",
          "Flow laminator",
          "Quick guide and manual",
        ] },
        { type: "p", text: "The unit weighs 1.4 kg and measures 11 by 7.5 by 13 centimeters, so it fits in the space that already exists under the sink or inside the vanity. No extra tank, no construction." },
        { type: "h2", text: "What the flow laminator is for" },
        { type: "p", text: "It installs on the shower arm and helps maximize savings during the shower. If in your case the flow drops too much, you can skip it without affecting how the unit works." },
        { type: "h2", text: "Where the control module goes" },
        { type: "p", text: "Usually it fits inside the bathroom electrical box, next to the switches. If that box is already full, the installation box kit solves it: a surface mount box cut to size and a blank faceplate drilled for the button." },
        { type: "p", text: "The Manual model ships without a faceplate and with a plain button, so you can pick one that matches the switches you already have." },
        { type: "h2", text: "Your own plumber or certified installation" },
        { type: "p", text: "An experienced plumber can install it following the guide. If you are inside our coverage areas, our certified crew installs it and the warranty goes from one to two years, covering the installation too." },
        { type: "note", text: "Keep your proof of purchase: it is required for any warranty process." },
      ],
    },
  },
];

export function sortedPosts() {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function findPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function relatedPosts(slug: string, limit = 2) {
  return sortedPosts()
    .filter((post) => post.slug !== slug)
    .slice(0, limit);
}
