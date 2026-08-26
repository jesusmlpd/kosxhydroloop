import type { Locale } from "@/lib/i18n";

/**
 * Blog en codigo, sin CMS.
 *
 * El contenido esta escrito a partir del material del propio Hydroloop: la
 * pagina de como funciona, las preguntas frecuentes, la garantia y las zonas de
 * cobertura de hydroloop.com.mx. Nada de cifras inventadas: cuando un numero es
 * una estimacion, el texto lo dice.
 */
/** Autor editorial del blog. */
export const author = {
  name: "Manolo",
  role: { es: "Equipo Hydroloop®", en: "Hydroloop® team" },
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "note"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

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
  {
    slug: "20-formas-de-ahorrar-agua-en-casa",
    date: "2026-08-25",
    readingMinutes: 11,
    image: "/media/photos/bano.webp",
    imageAlt: {
      es: "Baño con equipo Hydroloop instalado",
      en: "Bathroom with a Hydroloop unit installed",
    },
    tag: { es: "Ahorro", en: "Savings" },
    title: {
      es: "20 formas de ahorrar agua en casa, ordenadas por impacto real",
      en: "20 ways to save water at home, ranked by real impact",
    },
    excerpt: {
      es: "No todas las recomendaciones valen lo mismo. Aquí están las 20 clásicas, pero ordenadas por litros reales ahorrados al año, con números y sin sermones.",
      en: "Not every tip is worth the same. Here are the classic 20, ranked by actual liters saved per year, with numbers and no lectures.",
    },
    body: {
      es: [
        { type: "p", text: "Todas las listas de ahorro de agua mezclan lo que ahorra miles de litros con lo que ahorra un vaso. Esta no. Ordenamos las 20 recomendaciones clásicas por impacto anual estimado en una casa mexicana de cuatro personas, para que empieces por donde duele." },
        { type: "h2", text: "Zona de alto impacto: miles de litros al año" },
        { type: "ul", items: [
          "1. Deja de tirar el agua fría de la espera. Es la fuga más grande y más ignorada de la casa: hasta [7,300 litros al año por persona](/blog/cuanta-agua-se-va-esperando-el-agua-caliente). Un [hidro-retorno](/products/hydroloop-manual) la regresa al calentador.",
          "2. Repara fugas de inodoro. Un flotador vencido tira de 100 a 400 litros AL DÍA. Es la segunda fuga silenciosa más cara; te enseñamos a [encontrarla en 10 minutos](/blog/fugas-invisibles-como-encontrarlas).",
          "3. Cambia la regadera por una de bajo flujo (6-8 L/min contra 15-20 de las viejas). De 15,000 a 30,000 litros al año en una familia.",
          "4. Duchas de 5 a 8 minutos. Cada minuto menos son unos 9 litros; dos minutos menos por persona son más de 26,000 litros al año en familia.",
          "5. Lavadora solo con carga completa: de 8 a 15 cargas menos al mes son hasta 18,000 litros al año.",
        ] },
        { type: "h2", text: "Zona media: cientos a miles" },
        { type: "ul", items: [
          "6. Inodoro de doble descarga o botella en el tanque de los viejos: 2 a 4 litros menos por descarga.",
          "7. Cierra la llave al enjabonarte, lavarte los dientes o rasurarte: 6 a 12 litros por minuto de llave abierta.",
          "8. Lava el coche con cubeta, no con manguera: 300 litros contra 40.",
          "9. Riega de noche o al amanecer: hasta la mitad del agua de riego se evapora al mediodía.",
          "10. Reutiliza el agua de la lavadora para el patio y el inodoro: son 60 a 100 litros por carga, ya explicamos [cómo hacerlo sin drama](/blog/agua-gris-explicada).",
          "11. Aireadores en los grifos: cuestan menos de 100 pesos y bajan el flujo a la mitad sin que se sienta.",
          "12. Barre la banqueta, no la mangueres. Cada manguereada son 100 a 200 litros.",
        ] },
        { type: "h2", text: "Zona de detalle: todo suma" },
        { type: "ul", items: [
          "13. Tapa la olla al hervir: menos evaporación, menos rellenos.",
          "14. Descongela en el refri, no bajo el chorro.",
          "15. Un vaso para enjuagarte los dientes.",
          "16. Lava frutas en un recipiente y riega las plantas con esa agua.",
          "17. Acumula ropa y trastes: media carga gasta casi lo mismo que una completa.",
          "18. Plantas nativas o de clima seco en el jardín; el pasto inglés es un pozo sin fondo, aquí hay [alternativas que no dan sed](/blog/jardin-que-no-da-sed).",
          "19. Revisa tu recibo cada bimestre: un salto de consumo es una fuga hablándote, aprende a [leerlo aquí](/blog/como-leer-tu-recibo-de-agua).",
          "20. Mide antes de creer: nuestra [calculadora de desperdicio](/#como-funciona) te dice cuántos litros se van en tu caso, con tu tarifa.",
        ] },
        { type: "h2", text: "El orden importa" },
        { type: "p", text: "Si solo haces tres cosas de esta lista, que sean las tres primeras: espera del agua caliente, fugas de inodoro y regadera de bajo flujo. Entre esas tres, una familia típica recorta entre 40,000 y 70,000 litros al año, más de lo que logran las otras 17 juntas." },
        { type: "note", text: "Contexto: según [CONAGUA](https://www.gob.mx/conagua), el consumo urbano promedio en México ronda los 150 a 200 litros por persona al día. La ONU considera 100 litros un consumo razonable. El margen para ahorrar es enorme y casi todo está en el baño." },
      ],
      en: [
        { type: "p", text: "Every water-saving list mixes tips that save thousands of liters with tips that save a glass. Not this one. We ranked the classic 20 by estimated annual impact for a four-person Mexican household, so you start where it hurts." },
        { type: "h2", text: "High impact: thousands of liters a year" },
        { type: "ul", items: [
          "1. Stop wasting the cold-water wait. It is the biggest ignored leak in the house: up to [7,300 liters a year per person](/blog/cuanta-agua-se-va-esperando-el-agua-caliente). A [hydro-return](/products/hydroloop-manual) sends it back to the heater.",
          "2. Fix toilet leaks. A worn flapper wastes 100 to 400 liters A DAY. We show you how to [find it in 10 minutes](/blog/fugas-invisibles-como-encontrarlas).",
          "3. Swap the showerhead for a low-flow one (6-8 L/min vs 15-20 on old ones). 15,000 to 30,000 liters a year for a family.",
          "4. Showers from 8 minutes down to 5. Each minute is about 9 liters; two minutes less per person is over 26,000 liters a year.",
          "5. Full loads only in the washer: 8 to 15 fewer loads a month is up to 18,000 liters a year.",
        ] },
        { type: "h2", text: "Middle ground: hundreds to thousands" },
        { type: "ul", items: [
          "6. Dual-flush toilet, or a bottle in the tank of old ones: 2 to 4 liters less per flush.",
          "7. Tap off while soaping, brushing or shaving: 6 to 12 liters per minute of open tap.",
          "8. Wash the car with a bucket, not a hose: 300 liters vs 40.",
          "9. Water plants at night or dawn: up to half of midday irrigation evaporates.",
          "10. Reuse washer water for the yard and toilet: 60 to 100 liters per load, we explain [how to do it simply](/blog/agua-gris-explicada).",
          "11. Faucet aerators: under 100 pesos and they halve the flow without you noticing.",
          "12. Sweep the sidewalk, never hose it. Each hosing is 100 to 200 liters.",
        ] },
        { type: "h2", text: "Small stuff: it all adds up" },
        { type: "ul", items: [
          "13. Lid on the pot when boiling: less evaporation, fewer refills.",
          "14. Defrost in the fridge, not under running water.",
          "15. One glass to rinse when brushing.",
          "16. Wash fruit in a bowl and water plants with it.",
          "17. Batch laundry and dishes: half loads cost almost the same as full ones.",
          "18. Native or dry-climate plants in the garden; lawn is a bottomless pit, here are [alternatives that do not get thirsty](/blog/jardin-que-no-da-sed).",
          "19. Check your bill every cycle: a consumption jump is a leak talking to you, [learn to read it here](/blog/como-leer-tu-recibo-de-agua).",
          "20. Measure before believing: our [waste calculator](/#como-funciona) tells you how many liters leave in your case, at your rate.",
        ] },
        { type: "h2", text: "Order matters" },
        { type: "p", text: "If you only do three things on this list, make them the first three: the hot-water wait, toilet leaks and a low-flow showerhead. Those three cut 40,000 to 70,000 liters a year for a typical family, more than the other 17 combined." },
        { type: "note", text: "Context: according to [CONAGUA](https://www.gob.mx/conagua), average urban consumption in Mexico is around 150 to 200 liters per person per day. The UN considers 100 liters reasonable. The room to save is enormous and almost all of it is in the bathroom." },
      ],
    },
  },
  {
    slug: "fugas-invisibles-como-encontrarlas",
    date: "2026-08-22",
    readingMinutes: 9,
    image: "/media/photos/lavabo.webp",
    imageAlt: {
      es: "Lavabo y tubería donde suelen esconderse las fugas",
      en: "Sink and pipework where leaks usually hide",
    },
    tag: { es: "Ahorro", en: "Savings" },
    title: {
      es: "Fugas invisibles: cómo encontrar la que está inflando tu recibo",
      en: "Invisible leaks: how to find the one inflating your bill",
    },
    excerpt: {
      es: "El 20% del agua de una casa se puede ir en fugas que nadie ve. Tres pruebas caseras de 10 minutos para encontrarlas: el medidor, el colorante y la prueba nocturna.",
      en: "Up to 20% of a home's water can leave through leaks nobody sees. Three 10-minute home tests to find them: the meter, the dye and the overnight test.",
    },
    body: {
      es: [
        { type: "p", text: "Una fuga visible se repara sola: alguien la ve, alguien se queja, alguien llama al plomero. Las que arruinan recibos son las invisibles: el flotador del inodoro que ya no sella, la unión que gotea dentro del muro, la válvula del tinaco que nunca cierra del todo. Aquí van las tres pruebas caseras que usan los plomeros, en orden." },
        { type: "h2", text: "Prueba 1: el medidor quieto (10 minutos)" },
        { type: "ul", items: [
          "Cierra TODAS las llaves y aparatos que usen agua. Lavadora y filtros incluidos.",
          "Ve al medidor y toma foto de la lectura, con los decimales rojos.",
          "No uses agua durante 30 minutos. Ni el inodoro.",
          "Vuelve a mirar: si los números se movieron, hay una fuga activa en algún punto de la instalación.",
        ] },
        { type: "p", text: "Si tu medidor tiene una estrella o rueda pequeña de flujo, es aún más fácil: con todo cerrado, esa rueda debe estar completamente inmóvil. Si gira despacio, algo está pasando agua." },
        { type: "h2", text: "Prueba 2: el colorante en el tanque (15 minutos)" },
        { type: "p", text: "El inodoro es el sospechoso número uno: un sello de flotador vencido deja pasar un hilo de agua continuo del tanque a la taza que no se ve ni se oye. Echa colorante vegetal (o un sobre de agua de sabor) al tanque, NO a la taza, y espera 15 minutos sin descargar. Si la taza se pinta, el sello está vencido. La refacción cuesta menos de 150 pesos y la fuga estaba tirando de 100 a 400 litros diarios." },
        { type: "h2", text: "Prueba 3: la nocturna (una noche)" },
        { type: "p", text: "Para fugas chicas que la prueba de 30 minutos no alcanza a mostrar: lectura del medidor antes de dormir, cero consumo en la noche, lectura al despertar. Cualquier diferencia es fuga. Un solo decímetro cúbico (10 litros) por noche son 3,650 litros al año." },
        { type: "h2", text: "¿Y la espera del agua caliente cuenta como fuga?" },
        { type: "p", text: "Técnicamente no: el agua pasa por el medidor y sale por la regadera. Pero se comporta exactamente igual: litros que pagas y nunca usas, todos los días. La diferencia es que esta \"fuga\" no se repara con plomería tradicional sino [regresando el agua al calentador](/products/hydroloop-manual) antes de abrir la llave. Puedes dimensionarla con nuestra [calculadora](/#como-funciona): en la casa promedio es más grande que cualquier fuga de inodoro." },
        { type: "note", text: "Si las tres pruebas salen limpias pero el recibo sigue alto, el problema no es una fuga: es consumo. Ahí conviene empezar por [las 20 formas de ahorrar, ordenadas por impacto](/blog/20-formas-de-ahorrar-agua-en-casa)." },
      ],
      en: [
        { type: "p", text: "A visible leak fixes itself: someone sees it, someone complains, someone calls the plumber. The ones that ruin bills are invisible: the toilet flapper that no longer seals, the joint dripping inside a wall, the tank valve that never fully closes. Here are the three home tests plumbers use, in order." },
        { type: "h2", text: "Test 1: the still meter (10 minutes)" },
        { type: "ul", items: [
          "Close EVERY tap and appliance that uses water. Washer and filters included.",
          "Photograph the meter reading, red decimals included.",
          "Use no water for 30 minutes. Not even the toilet.",
          "Look again: if the numbers moved, there is an active leak somewhere.",
        ] },
        { type: "p", text: "If your meter has a small flow star or wheel, it is even easier: with everything closed that wheel must be completely still. If it creeps, something is passing water." },
        { type: "h2", text: "Test 2: dye in the tank (15 minutes)" },
        { type: "p", text: "The toilet is suspect number one: a worn flapper passes a continuous silent thread of water from tank to bowl. Drop food coloring into the TANK, not the bowl, and wait 15 minutes without flushing. If the bowl shows color, the flapper is done. The part costs under 150 pesos and the leak was wasting 100 to 400 liters a day." },
        { type: "h2", text: "Test 3: overnight (one night)" },
        { type: "p", text: "For small leaks the 30-minute test misses: meter reading before bed, zero consumption overnight, reading on waking. Any difference is a leak. A single 10 liters per night is 3,650 liters a year." },
        { type: "h2", text: "Does the hot-water wait count as a leak?" },
        { type: "p", text: "Technically no: the water passes the meter and leaves through the shower. But it behaves exactly the same: liters you pay for and never use, every day. The difference is this \"leak\" is not fixed with traditional plumbing but by [returning the water to the heater](/products/hydroloop-manual) before opening the tap. Size it with our [calculator](/#como-funciona): in the average home it is bigger than any toilet leak." },
        { type: "note", text: "If all three tests come back clean and the bill is still high, the problem is not a leak: it is consumption. Start with [the 20 ways to save, ranked by impact](/blog/20-formas-de-ahorrar-agua-en-casa)." },
      ],
    },
  },
  {
    slug: "como-leer-tu-recibo-de-agua",
    date: "2026-08-19",
    readingMinutes: 10,
    image: "/media/photos/dudas.webp",
    imageAlt: {
      es: "Persona revisando dudas sobre su consumo de agua",
      en: "Person reviewing questions about their water use",
    },
    tag: { es: "Dinero", en: "Money" },
    title: {
      es: "Cómo leer tu recibo de agua y detectar cuando algo anda mal",
      en: "How to read your water bill and catch when something is off",
    },
    excerpt: {
      es: "El recibo de agua es el examen médico de tu casa y casi nadie lo lee. Qué significa cada renglón, cómo funcionan las tarifas escalonadas y las tres señales de alarma.",
      en: "The water bill is your home's medical checkup and almost nobody reads it. What each line means, how tiered rates work and the three alarm signals.",
    },
    body: {
      es: [
        { type: "p", text: "En México el agua se cobra distinto en cada ciudad: cada organismo operador (SACMEX en CDMX, SIAPA en Guadalajara, Agua y Drenaje en Monterrey, las JMAS en Chihuahua y Juárez) tiene sus propias tarifas. Pero todos los recibos comparten la misma anatomía, y saber leerla es la diferencia entre pagar lo justo y financiar una fuga seis meses." },
        { type: "h2", text: "Los renglones que importan" },
        { type: "ul", items: [
          "Lectura anterior y lectura actual: la resta es tu consumo del periodo en metros cúbicos. Un metro cúbico son 1,000 litros.",
          "Consumo en m³: el número que manda. Una familia de cuatro razonable consume 15 a 25 m³ al bimestre. Arriba de 35, algo pasa.",
          "Tarifa por bloque: casi todas las ciudades cobran escalonado. Los primeros metros cúbicos son baratos y los siguientes suben fuerte: pasarte de bloque encarece TODOS tus litros extra.",
          "Drenaje y saneamiento: normalmente un porcentaje fijo del consumo de agua. Si el agua sube, esto sube solo.",
          "Adeudos y recargos: el renglón que confirma si el problema es de este periodo o viene arrastrándose.",
        ] },
        { type: "h2", text: "Por qué el bloque te cambia el juego" },
        { type: "p", text: "Con tarifa escalonada, ahorrar no es lineal: los litros más caros son los últimos. Si tu consumo te tiene en el tercer bloque, recortar 5 m³ no te ahorra el precio promedio, te ahorra el precio del bloque más caro. Por eso las medidas de alto impacto, como dejar de tirar [el agua de la espera](/blog/cuanta-agua-se-va-esperando-el-agua-caliente), muchas veces pagan más de lo que la [calculadora](/#como-funciona) estima con precio promedio." },
        { type: "h2", text: "Tres señales de alarma" },
        { type: "ul", items: [
          "Un salto de más del 30% contra el mismo bimestre del año pasado, sin cambio de hábitos ni visitas: sospecha fuga y corre las [tres pruebas caseras](/blog/fugas-invisibles-como-encontrarlas).",
          "Consumo estable pero importe disparado: revisa si cambió la tarifa o si te reclasificaron (doméstico a mixto o comercial pasa más de lo que crees).",
          "Recibo 'promedio' varios periodos seguidos: significa que nadie está leyendo tu medidor y te están estimando. Cuando llegue la lectura real, llega el ajustazo.",
        ] },
        { type: "h2", text: "El truco del bimestre de control" },
        { type: "p", text: "Anota tu lectura el día 1 de cada mes, con foto. Cinco minutos que te dan tu propia serie de consumo, independiente del organismo. Con dos meses de datos ya sabes tu línea base; con tres detectas cualquier desviación antes que el recibo. Y si además instalaste un [hidro-retorno](/products/hydroloop-wifi), ahí es donde vas a ver el antes y el después con tus propios números." },
        { type: "note", text: "Las tarifas oficiales se publican por ciudad; consulta la de la tuya en el sitio de tu organismo operador o en [gob.mx/conagua](https://www.gob.mx/conagua). Si el agua te llega por pipa, tu 'tarifa' real por metro cúbico suele ser 5 a 10 veces la de la red: ahí el ahorro pega todavía más fuerte." },
      ],
      en: [
        { type: "p", text: "In Mexico water is billed differently in every city: each utility (SACMEX in CDMX, SIAPA in Guadalajara, Agua y Drenaje in Monterrey, the JMAS in Chihuahua and Juárez) sets its own rates. But all bills share the same anatomy, and reading it is the difference between paying fair and financing a leak for six months." },
        { type: "h2", text: "The lines that matter" },
        { type: "ul", items: [
          "Previous and current reading: the subtraction is your period consumption in cubic meters. One cubic meter is 1,000 liters.",
          "Consumption in m³: the number that rules. A reasonable family of four uses 15 to 25 m³ per two-month period. Above 35, something is going on.",
          "Tiered rate: almost every city bills in blocks. The first cubic meters are cheap and the next ones climb steeply: crossing a block makes ALL your extra liters expensive.",
          "Sewage and sanitation: usually a fixed percentage of the water charge. If water goes up, this rides along.",
          "Arrears and surcharges: the line that tells you whether the problem is this period's or has been dragging.",
        ] },
        { type: "h2", text: "Why the block changes the game" },
        { type: "p", text: "With tiered rates, saving is not linear: the most expensive liters are the last ones. If your consumption sits in the third block, cutting 5 m³ does not save you the average price, it saves you the top-block price. That is why high-impact moves, like ending [the hot-water wait](/blog/cuanta-agua-se-va-esperando-el-agua-caliente), often pay back more than the [calculator](/#como-funciona) estimates at average price." },
        { type: "h2", text: "Three alarm signals" },
        { type: "ul", items: [
          "A jump over 30% against the same period last year, with no habit changes or guests: suspect a leak and run the [three home tests](/blog/fugas-invisibles-como-encontrarlas).",
          "Stable consumption but a spiked amount: check whether the rate changed or you got reclassified (domestic to mixed or commercial happens more than you think).",
          "An 'estimated' bill several periods in a row: nobody is reading your meter. When the real reading lands, so does the adjustment.",
        ] },
        { type: "h2", text: "The control-reading trick" },
        { type: "p", text: "Write down your meter reading on the 1st of every month, with a photo. Five minutes that give you your own consumption series, independent from the utility. Two months in you know your baseline; three months in you catch any deviation before the bill does. And if you installed a [hydro-return](/products/hydroloop-wifi), that is where you will see the before and after in your own numbers." },
        { type: "note", text: "Official rates are published per city; check yours at your utility or at [gob.mx/conagua](https://www.gob.mx/conagua). If your water arrives by truck, your real per-cubic-meter 'rate' is usually 5 to 10 times the grid's: savings hit even harder there." },
      ],
    },
  },
  {
    slug: "agua-gris-explicada",
    date: "2026-08-15",
    readingMinutes: 10,
    image: "/media/photos/como-funciona.webp",
    imageAlt: {
      es: "Instalación de agua en casa",
      en: "Home water installation",
    },
    tag: { es: "Reúso", en: "Reuse" },
    title: {
      es: "El agua gris explicada: qué es, qué no es y cómo reusarla sin drama",
      en: "Greywater explained: what it is, what it is not, and how to reuse it simply",
    },
    excerpt: {
      es: "La lavadora de tu casa produce 60 a 100 litros de agua reusable por carga y hoy se van al drenaje. Guía práctica de agua gris: la escalera del reúso, del balde a la instalación dedicada.",
      en: "Your washer produces 60 to 100 reusable liters per load that go down the drain today. A practical greywater guide: the reuse ladder, from bucket to dedicated plumbing.",
    },
    body: {
      es: [
        { type: "p", text: "Agua gris es la que ya se usó una vez en regadera, lavabos y lavadora. No es agua negra (la del inodoro y la cocina, que lleva materia orgánica y va al drenaje sin discusión) y tampoco es agua limpia: es la de en medio, y es muchísima. En una casa típica, entre el 50 y el 70% del agua que entra sale como gris." },
        { type: "h2", text: "La regla de oro: usar rápido y sin almacenar" },
        { type: "p", text: "El agua gris no se guarda más de 24 horas: con jabón y calor se vuelve caldo de cultivo. Todo reúso sensato la usa el mismo día, en aplicaciones que no toquen personas: inodoro, riego de ornamentales por goteo al suelo (no por aspersión), limpieza de patios." },
        { type: "h2", text: "La escalera del reúso, de cero pesos a instalación" },
        { type: "ul", items: [
          "Nivel 0, cero pesos: cubeta en la regadera... aunque si estás juntando el agua fría de la espera, el problema real se resuelve mejor con un [hidro-retorno](/products/hydroloop-manual) que la regresa limpia al calentador en vez de degradarla a gris.",
          "Nivel 1, ~200 pesos: manguera en la descarga de la lavadora hacia el patio o hacia una cubeta para el inodoro. 60 a 100 litros por carga. Usa jabones biodegradables bajos en sodio si va a plantas.",
          "Nivel 2, ~1,500 pesos: desvío con válvula de tres vías en la descarga de lavadora: palanca a 'jardín' o 'drenaje' según la carga. Es el mejor costo-beneficio del reúso doméstico.",
          "Nivel 3, proyecto: red dual con trampa de sólidos y filtro que alimenta inodoros y riego. Se justifica en obra nueva o remodelación; en casa hecha, el nivel 2 da el 80% del beneficio con el 10% del costo.",
        ] },
        { type: "h2", text: "Errores que arruinan el experimento" },
        { type: "ul", items: [
          "Regar hortalizas de hoja con agua gris: no. Ornamentales y árboles, sí.",
          "Aspersión: convierte el agua gris en aerosol que respiras. Siempre riego al pie.",
          "Cloro y suavizantes en el agua que va a plantas: las quema. Cambia de jabón o manda esa carga al drenaje.",
          "Almacenarla 'para la sequía': a las 48 horas huele a por qué no se hace.",
        ] },
        { type: "h2", text: "El orden correcto de las inversiones" },
        { type: "p", text: "Primero deja de generar desperdicio (espera del agua caliente, [fugas](/blog/fugas-invisibles-como-encontrarlas), regadera eficiente), luego reusa lo que quede. Es más barato no ensuciar un litro que tratarlo: por eso el reúso es el segundo paso del [plan de 20 medidas](/blog/20-formas-de-ahorrar-agua-en-casa), no el primero." },
        { type: "note", text: "Si estás pensando en capturar lluvia además de reusar gris, son sistemas complementarios y la [guía de captación](/blog/captacion-de-lluvia-guia-honesta) explica cuándo conviene cada uno." },
      ],
      en: [
        { type: "p", text: "Greywater is water already used once in showers, sinks and the washer. It is not blackwater (toilet and kitchen water, which carries organic matter and goes to the drain, no debate) and it is not clean water either: it is the one in between, and there is a lot of it. In a typical home, 50 to 70% of the water that enters leaves as grey." },
        { type: "h2", text: "The golden rule: use it fast, never store it" },
        { type: "p", text: "Greywater does not keep beyond 24 hours: soap plus warmth turns it into a culture broth. Every sensible reuse spends it the same day, on applications that do not touch people: toilets, drip irrigation of ornamentals at soil level (never sprinklers), patio cleaning." },
        { type: "h2", text: "The reuse ladder, from zero pesos to real plumbing" },
        { type: "ul", items: [
          "Level 0, free: bucket in the shower... though if you are collecting the cold-water wait, the real problem is better solved by a [hydro-return](/products/hydroloop-manual) that sends it back to the heater clean instead of degrading it to grey.",
          "Level 1, ~200 pesos: washer discharge hose to the yard or to a bucket for the toilet. 60 to 100 liters per load. Use low-sodium biodegradable soap if it goes to plants.",
          "Level 2, ~1,500 pesos: a three-way valve on the washer discharge: lever to 'garden' or 'drain' per load. The best cost-benefit in home reuse.",
          "Level 3, a project: dual piping with a solids trap and filter feeding toilets and irrigation. Justified in new builds or remodels; in an existing house, level 2 gives 80% of the benefit at 10% of the cost.",
        ] },
        { type: "h2", text: "Mistakes that ruin the experiment" },
        { type: "ul", items: [
          "Watering leafy vegetables with greywater: no. Ornamentals and trees: yes.",
          "Sprinklers: they turn greywater into aerosol you breathe. Always water at the base.",
          "Chlorine and fabric softener in plant-bound water: it burns them. Switch soap or send that load to the drain.",
          "Storing it 'for the drought': at 48 hours it smells like the reason you should not.",
        ] },
        { type: "h2", text: "The right order of investment" },
        { type: "p", text: "First stop generating waste (the hot-water wait, [leaks](/blog/fugas-invisibles-como-encontrarlas), an efficient showerhead), then reuse what remains. Not dirtying a liter is cheaper than treating it: that is why reuse is step two of the [20-measure plan](/blog/20-formas-de-ahorrar-agua-en-casa), not step one." },
        { type: "note", text: "If you are also considering rain harvesting, the systems complement each other and the [harvesting guide](/blog/captacion-de-lluvia-guia-honesta) explains when each one makes sense." },
      ],
    },
  },
  {
    slug: "captacion-de-lluvia-guia-honesta",
    date: "2026-08-12",
    readingMinutes: 11,
    image: "/media/photos/instalacion.webp",
    imageAlt: {
      es: "Instalación hidráulica profesional",
      en: "Professional plumbing installation",
    },
    tag: { es: "Reúso", en: "Reuse" },
    title: {
      es: "Captación de lluvia en casa: la guía honesta para decidir si te conviene",
      en: "Home rain harvesting: the honest guide to deciding if it is for you",
    },
    excerpt: {
      es: "Un techo de 80 m² en una ciudad con 800 mm de lluvia puede captar 64,000 litros al año. La cuenta completa: cuánto cae en tu ciudad, qué necesitas y cuándo NO conviene.",
      en: "An 80 m² roof in a city with 800 mm of rain can catch 64,000 liters a year. The full math: how much falls in your city, what you need and when it is NOT worth it.",
    },
    body: {
      es: [
        { type: "p", text: "La captación pluvial es de las pocas medidas de agua que producen en lugar de solo ahorrar. La fórmula es simple: metros cuadrados de techo x milímetros de lluvia anual x 0.8 de eficiencia = litros al año. Un techo de 80 m² en Guadalajara (unos 1,000 mm anuales) puede captar 64,000 litros; el mismo techo en Ciudad Juárez (250 mm) apenas 16,000. Por eso esta guía empieza por tu ciudad, no por el sistema." },
        { type: "h2", text: "Paso 1: cuánta lluvia te toca" },
        { type: "ul", items: [
          "Húmedas (1,000+ mm): CDMX sur, Guadalajara, Puebla, Xalapa, Villahermosa, Mérida. Captar es casi obligatorio.",
          "Medias (500-900 mm): Querétaro, León, Aguascalientes, Morelia, Monterrey. Conviene con techo mediano en adelante.",
          "Secas (200-450 mm): Chihuahua, Juárez, Torreón, Hermosillo, Mexicali. El sistema se justifica menos por volumen y más porque cada litro ahí vale oro. Los datos por ciudad están en el [Servicio Meteorológico Nacional](https://smn.conagua.gob.mx).",
        ] },
        { type: "h2", text: "El sistema mínimo que sí funciona" },
        { type: "ul", items: [
          "Canaletas y bajadas limpias: el 80% del trabajo.",
          "Separador de primeras lluvias: los primeros 1-2 mm lavan el polvo del techo y se descartan solos con un tubo desviador de 300 pesos.",
          "Filtro de hojas antes del tinaco: malla, nada exótico.",
          "Almacenamiento: la pieza cara. Cada 1,000 litros de tinaco extra ronda los 2,500-4,000 pesos. Dimensiona para 2-3 semanas de uso, no para el año.",
          "Uso: riego, limpieza e inodoros directo; para regadera y lavabo ya hablas de filtración y desinfección seria.",
        ] },
        { type: "h2", text: "Cuándo NO conviene" },
        { type: "ul", items: [
          "Techo de lámina oxidada o con asfalto suelto: esa agua no la quieres ni para el pasto.",
          "Sin espacio para almacenar: captar 60,000 litros con un tinaco de 450 no tiene caso, se desborda a la tercera tormenta.",
          "Si todavía no arreglas las fugas ni el desperdicio de la casa: producir agua nueva para tirarla en [la espera de la regadera](/blog/cuanta-agua-se-va-esperando-el-agua-caliente) o en un flotador vencido es llenar una cubeta agujerada. Primero [lo barato](/blog/20-formas-de-ahorrar-agua-en-casa), luego lo bonito.",
        ] },
        { type: "h2", text: "La cuenta de retorno" },
        { type: "p", text: "Con tarifa de red urbana ($15-30 por m³), un sistema básico de 8-12 mil pesos que capta 40 m³ al año se paga en 8-15 años: no es negocio, es resiliencia. Con agua de pipa ($120-250 por m³) el mismo sistema se paga en 2-3 años y es de las mejores inversiones de la casa. La moraleja se repite en todo el blog: primero mide lo que pagas, con [tu recibo](/blog/como-leer-tu-recibo-de-agua) enfrente." },
        { type: "note", text: "Combo ganador en zonas secas: captación para riego y limpieza + [hidro-retorno](/products/hydroloop-manual) para no tirar el agua caliente + [reúso de gris](/blog/agua-gris-explicada) para el inodoro. Tres sistemas chicos le pegan más que uno grande." },
      ],
      en: [
        { type: "p", text: "Rain harvesting is one of the few water measures that produce instead of just saving. The formula is simple: roof square meters x annual rainfall millimeters x 0.8 efficiency = liters per year. An 80 m² roof in Guadalajara (about 1,000 mm a year) can catch 64,000 liters; the same roof in Ciudad Juárez (250 mm) barely 16,000. That is why this guide starts with your city, not with the hardware." },
        { type: "h2", text: "Step 1: how much rain you get" },
        { type: "ul", items: [
          "Wet (1,000+ mm): southern CDMX, Guadalajara, Puebla, Xalapa, Villahermosa, Mérida. Harvesting is almost mandatory.",
          "Medium (500-900 mm): Querétaro, León, Aguascalientes, Morelia, Monterrey. Worth it from a mid-size roof up.",
          "Dry (200-450 mm): Chihuahua, Juárez, Torreón, Hermosillo, Mexicali. The system is justified less by volume and more because every liter there is gold. City data lives at the [national weather service](https://smn.conagua.gob.mx).",
        ] },
        { type: "h2", text: "The minimum system that actually works" },
        { type: "ul", items: [
          "Clean gutters and downspouts: 80% of the job.",
          "First-flush diverter: the first 1-2 mm wash the roof dust and discard themselves with a 300-peso diverter pipe.",
          "Leaf filter before the tank: mesh, nothing exotic.",
          "Storage: the expensive part. Every extra 1,000 liters of tank runs 2,500-4,000 pesos. Size for 2-3 weeks of use, not for the year.",
          "Use: irrigation, cleaning and toilets directly; for showers and sinks you are into serious filtration and disinfection.",
        ] },
        { type: "h2", text: "When NOT to bother" },
        { type: "ul", items: [
          "Rusty metal or loose-asphalt roof: you do not want that water even for the lawn.",
          "No room to store: catching 60,000 liters with a 450-liter tank is pointless, it overflows by the third storm.",
          "If you have not fixed leaks and household waste yet: producing new water to throw it away in [the shower wait](/blog/cuanta-agua-se-va-esperando-el-agua-caliente) or a worn flapper is filling a holed bucket. First [the cheap stuff](/blog/20-formas-de-ahorrar-agua-en-casa), then the pretty stuff.",
        ] },
        { type: "h2", text: "The payback math" },
        { type: "p", text: "At urban grid rates ($15-30 per m³), a basic 8-12k peso system catching 40 m³ a year pays back in 8-15 years: not a business, resilience. On trucked water ($120-250 per m³) the same system pays back in 2-3 years and becomes one of the best investments in the house. The moral repeats across this blog: first measure what you pay, with [your bill](/blog/como-leer-tu-recibo-de-agua) in front of you." },
        { type: "note", text: "Winning combo in dry zones: harvesting for irrigation and cleaning + a [hydro-return](/products/hydroloop-manual) so hot water is never wasted + [greywater reuse](/blog/agua-gris-explicada) for the toilet. Three small systems beat one big one." },
      ],
    },
  },
  {
    slug: "boiler-paso-deposito-solar",
    date: "2026-08-08",
    readingMinutes: 10,
    image: "/media/diagrams/instalacion-2.webp",
    imageAlt: {
      es: "Diagrama de instalación con calentador",
      en: "Installation diagram with water heater",
    },
    tag: { es: "Cómo funciona", en: "How it works" },
    title: {
      es: "Boiler de paso, de depósito o solar: cuál desperdicia menos agua",
      en: "Tankless, tank or solar heater: which one wastes less water",
    },
    excerpt: {
      es: "Todos comparan calentadores por gas y casi nadie por agua. Spoiler: los tres tiran los mismos litros esperando, y el de paso a veces más. La comparación completa.",
      en: "Everyone compares heaters on gas and almost nobody on water. Spoiler: all three waste the same liters waiting, and tankless sometimes more. The full comparison.",
    },
    body: {
      es: [
        { type: "p", text: "Cuando alguien cambia de calentador compara precio, consumo de gas y si alcanza para dos regaderas. Lo que nadie compara es el agua, y hay sorpresa: el tipo de calentador cambia poco los litros que tiras esperando, porque esa agua no está en el calentador sino atrapada en la tubería." },
        { type: "h2", text: "Depósito: el clásico" },
        { type: "p", text: "Mantiene 40-80 litros calientes siempre. Gasta más gas en mantener la temperatura, pero al abrir la llave el agua caliente sale del tanque de inmediato... y aun así esperas, porque los 10-20 metros de tubo entre el boiler y tu regadera están llenos de agua fría. Esa espera es idéntica con cualquier calentador." },
        { type: "h2", text: "De paso: el eficiente en gas con letra chiquita en agua" },
        { type: "ul", items: [
          "No almacena: calienta mientras el agua pasa. En gas es más eficiente.",
          "En agua tiene DOS esperas: la de la tubería (igual que todos) más el arranque propio, porque necesita cierto flujo mínimo y unos segundos para encender y estabilizar temperatura.",
          "Los instantáneos de alto flujo pueden requerir bomba presurizadora para encender con el flujo de un hidro-retorno; [lo explicamos aquí](/blog/compatibilidad-con-calentadores).",
        ] },
        { type: "h2", text: "Solar: gratis en energía, igual en espera" },
        { type: "p", text: "El termotanque solar calienta con el sol y el respaldo de gas entra en días nublados. En agua se comporta como un depósito: la espera de la tubería no cambia, y como suele instalarse en la azotea, la distancia al baño a veces CRECE, y con ella los litros tirados." },
        { type: "h2", text: "La tabla honesta" },
        { type: "ul", items: [
          "Gas: gana el de paso, luego el solar (casi cero), el depósito paga la vela piloto y las pérdidas de mantener temperatura.",
          "Agua desperdiciada esperando: empate técnico entre los tres, con ligera desventaja del de paso por su arranque. La variable real es la DISTANCIA del calentador al punto de uso.",
          "Solución al desperdicio: en los tres casos es la misma, un [hidro-retorno](/products/hydroloop-manual) que regresa el agua fría de la tubería al calentador. Es compatible con cualquiera de los tres tipos.",
        ] },
        { type: "h2", text: "Si estás por comprar calentador" },
        { type: "p", text: "Elige por gas, capacidad y presupuesto, como siempre. Pero decide la POSICIÓN pensando en agua: cada metro de tubería entre calentador y baño son ~0.15 a 0.5 litros tirados por uso, todos los usos, todos los días. Un calentador bien ubicado más un hidro-retorno deja la espera en segundos y el desperdicio en cero; [la calculadora](/#como-funciona) te dice cuánto vale eso en tu casa al año." },
        { type: "note", text: "Regla del plomero que nos gusta repetir: el mejor calentador mal ubicado desperdicia más agua que el peor calentador bien ubicado." },
      ],
      en: [
        { type: "p", text: "When people change heaters they compare price, gas use and whether it handles two showers. What nobody compares is water, and there is a surprise: heater type barely changes the liters you waste waiting, because that water is not in the heater but trapped in the pipe." },
        { type: "h2", text: "Tank: the classic" },
        { type: "p", text: "Keeps 40-80 liters hot at all times. Spends more gas holding temperature, but hot water leaves the tank immediately when you open the tap... and you still wait, because the 10-20 meters of pipe between heater and shower are full of cold water. That wait is identical with any heater." },
        { type: "h2", text: "Tankless: gas-efficient with water fine print" },
        { type: "ul", items: [
          "No storage: heats as water flows. More efficient on gas.",
          "On water it has TWO waits: the pipe's (same as everyone) plus its own startup, since it needs a minimum flow and a few seconds to ignite and stabilize.",
          "High-flow tankless units may need a booster pump to ignite with a hydro-return's flow; [we explain it here](/blog/compatibilidad-con-calentadores).",
        ] },
        { type: "h2", text: "Solar: free energy, same wait" },
        { type: "p", text: "The solar tank heats with the sun and gas backup covers cloudy days. On water it behaves like a tank heater: the pipe wait does not change, and since it usually sits on the roof, the distance to the bathroom sometimes GROWS, and wasted liters with it." },
        { type: "h2", text: "The honest table" },
        { type: "ul", items: [
          "Gas: tankless wins, then solar (near zero), tank pays for the pilot and standby losses.",
          "Water wasted waiting: technical tie across all three, slight disadvantage for tankless due to startup. The real variable is heater-to-fixture DISTANCE.",
          "Fix for the waste: identical in all three cases, a [hydro-return](/products/hydroloop-manual) that sends the pipe's cold water back to the heater. Compatible with all three types.",
        ] },
        { type: "h2", text: "If you are about to buy a heater" },
        { type: "p", text: "Choose by gas, capacity and budget, as always. But decide PLACEMENT thinking about water: every meter of pipe between heater and bathroom is ~0.15 to 0.5 liters wasted per use, every use, every day. A well-placed heater plus a hydro-return leaves the wait in seconds and the waste at zero; [the calculator](/#como-funciona) tells you what that is worth in your house per year." },
        { type: "note", text: "A plumber's rule we like to repeat: the best heater badly placed wastes more water than the worst heater well placed." },
      ],
    },
  },
  {
    slug: "jardin-que-no-da-sed",
    date: "2026-08-05",
    readingMinutes: 9,
    image: "/media/photos/ducha.webp",
    imageAlt: {
      es: "Agua cayendo, el recurso que el jardín debe respetar",
      en: "Falling water, the resource a garden must respect",
    },
    tag: { es: "Jardín", en: "Garden" },
    title: {
      es: "Un jardín que no da sed: riego inteligente y plantas para clima seco",
      en: "A garden that does not get thirsty: smart watering and dry-climate plants",
    },
    excerpt: {
      es: "El jardín puede ser el 30% del consumo de una casa con patio. Cómo bajarlo a la mitad sin sacrificar verde: especies, horarios, goteo y la mulch que nadie usa.",
      en: "The garden can be 30% of a house-with-yard's consumption. How to halve it without sacrificing green: species, schedules, drip and the mulch nobody uses.",
    },
    body: {
      es: [
        { type: "p", text: "El pasto inglés es una alberca disfrazada: necesita 25-40 litros por metro cuadrado por semana para verse decente en clima seco. Un patio de 50 m² de puro pasto puede beberse 6,000 litros semanales en mayo. La buena noticia: un jardín precioso puede vivir con la mitad o menos, sin volverse un lote de grava triste." },
        { type: "h2", text: "Las plantas hacen el 60% del trabajo" },
        { type: "ul", items: [
          "Sustituye pasto donde no se pisa: nadie camina detrás de los arbustos. Cubresuelos como dichondra, lantana rastrera o wedelia piden una fracción del agua.",
          "Especies para clima seco que se ven espectaculares: lavanda, romero, salvias, agaves, bugambilia, plumbago, lantana, hierba de la pradera. Florean, huelen y aguantan.",
          "Árboles nativos de tu región: mezquite y palo verde en el norte, jacaranda y fresno en el centro. Un árbol adulto sombrea, baja la evaporación del suelo y se riega solo casi todo el año.",
          "Agrupa por sed: las sedientas juntas en una zona chica de riego, las sobrias en el resto. Se llama hidrozonificación y es gratis.",
        ] },
        { type: "h2", text: "El riego hace el otro 40%" },
        { type: "ul", items: [
          "Goteo en lugar de aspersión: el agua llega a la raíz, no al aire. Ahorra 30-60% contra manguera y aspersor.",
          "Riega al amanecer o de noche: al mediodía, hasta la mitad se evapora antes de servir.",
          "Riego profundo y espaciado, no chapoteo diario: raíces profundas aguantan mejor la sequía.",
          "Mulch (acolchado): 5-8 cm de corteza, hoja seca o piedra sobre la tierra bajan la evaporación hasta 70%. Es la medida más barata e ignorada del jardín mexicano.",
        ] },
        { type: "h2", text: "Agua que ya pagaste, dos veces útil" },
        { type: "p", text: "El jardín es el destino perfecto para el [agua gris de la lavadora](/blog/agua-gris-explicada) y para la [lluvia captada](/blog/captacion-de-lluvia-guia-honesta): ninguna necesita ser potable para regar ornamentales. Entre ambas, un jardín mediano puede vivir casi todo el año sin tocar la red." },
        { type: "h2", text: "El plan de 30 días" },
        { type: "ul", items: [
          "Semana 1: mulch en todas las camas. Impacto inmediato.",
          "Semana 2: cambia horario de riego y pasa a riego profundo dos veces por semana.",
          "Semana 3: manguera de la lavadora al jardín (nivel 1 de reúso).",
          "Semana 4: sustituye el primer tramo de pasto que nadie pisa. Y de paso, ya que andas en modo ahorro, corre las [tres pruebas de fugas](/blog/fugas-invisibles-como-encontrarlas) de la casa: el jardín no es el único que bebe de más.",
        ] },
        { type: "note", text: "El riego se mide igual que todo: con el recibo. Anota tu consumo antes y después del plan; si aprendiste a [leer el recibo](/blog/como-leer-tu-recibo-de-agua), el jardín es donde más rápido se ve la diferencia en verano." },
      ],
      en: [
        { type: "p", text: "English lawn is a pool in disguise: it needs 25-40 liters per square meter per week to look decent in a dry climate. A 50 m² yard of pure lawn can drink 6,000 liters a week in May. The good news: a beautiful garden can live on half or less without becoming a sad gravel lot." },
        { type: "h2", text: "Plants do 60% of the work" },
        { type: "ul", items: [
          "Replace lawn where nobody steps: no one walks behind the shrubs. Groundcovers like dichondra, trailing lantana or wedelia ask for a fraction of the water.",
          "Dry-climate species that look spectacular: lavender, rosemary, salvias, agaves, bougainvillea, plumbago, lantana, prairie grasses. They bloom, they smell, they endure.",
          "Native trees for your region: mesquite and palo verde in the north, jacaranda and ash in the center. A grown tree shades, cuts soil evaporation and waters itself most of the year.",
          "Group by thirst: thirsty plants together in one small watering zone, sober ones everywhere else. It is called hydrozoning and it is free.",
        ] },
        { type: "h2", text: "Watering does the other 40%" },
        { type: "ul", items: [
          "Drip instead of sprinklers: water reaches the root, not the air. Saves 30-60% versus hose and sprinkler.",
          "Water at dawn or night: at noon, up to half evaporates before it helps.",
          "Deep, spaced watering, not a daily splash: deep roots ride out drought better.",
          "Mulch: 5-8 cm of bark, dry leaves or stone over the soil cuts evaporation up to 70%. The cheapest, most ignored measure in Mexican gardens.",
        ] },
        { type: "h2", text: "Water you already paid for, useful twice" },
        { type: "p", text: "The garden is the perfect destination for [washer greywater](/blog/agua-gris-explicada) and for [harvested rain](/blog/captacion-de-lluvia-guia-honesta): neither needs to be drinkable to water ornamentals. Between the two, a mid-size garden can live nearly all year without touching the grid." },
        { type: "h2", text: "The 30-day plan" },
        { type: "ul", items: [
          "Week 1: mulch every bed. Immediate impact.",
          "Week 2: change watering schedule and switch to deep watering twice a week.",
          "Week 3: washer hose to the garden (reuse level 1).",
          "Week 4: replace the first stretch of lawn nobody steps on. And while you are in saving mode, run the house's [three leak tests](/blog/fugas-invisibles-como-encontrarlas): the garden is not the only over-drinker.",
        ] },
        { type: "note", text: "Watering is measured like everything else: with the bill. Note your consumption before and after the plan; if you learned to [read the bill](/blog/como-leer-tu-recibo-de-agua), the garden is where summer differences show fastest." },
      ],
    },
  },
  {
    slug: "el-dia-cero-lecciones",
    date: "2026-08-01",
    readingMinutes: 12,
    image: "/media/photos/hero-bg.webp",
    imageAlt: {
      es: "Superficie de agua en calma",
      en: "Calm water surface",
    },
    tag: { es: "Contexto", en: "Context" },
    title: {
      es: "El día cero: qué pasó en las ciudades que casi se quedan sin agua",
      en: "Day zero: what happened in the cities that almost ran dry",
    },
    excerpt: {
      es: "Ciudad del Cabo 2018, Monterrey 2022, CDMX 2024. Tres sustos, un patrón que se repite y las lecciones que cualquier casa puede aplicar antes del siguiente.",
      en: "Cape Town 2018, Monterrey 2022, Mexico City 2024. Three scares, one repeating pattern and the lessons any home can apply before the next one.",
    },
    body: {
      es: [
        { type: "p", text: "El 'día cero' es la fecha en que una ciudad cierra las llaves porque las presas ya no dan. Ciudad del Cabo le puso nombre en 2018 y lo esquivó por semanas. Monterrey vivió su versión en 2022 con meses de tandeo. La zona metropolitana de la CDMX rozó la suya en 2024 con el Cutzamala en mínimos históricos. El patrón de las tres crisis es el mismo, y las lecciones también." },
        { type: "h2", text: "El patrón: la crisis siempre avisa" },
        { type: "ul", items: [
          "Años de presas a la baja que todos ven y nadie siente, porque la llave sigue dando.",
          "Un año seco que rompe el margen. De 'nivel bajo' a 'quedan 90 días' en una temporada.",
          "Tandeo: el agua llega unas horas al día o unos días a la semana. La cisterna pasa de comodidad a órgano vital.",
          "Precio real del agua disparado: pipas de 10,000 litros que costaban 800 pesos a 3,000 o más.",
          "Y cuando llueve, amnesia colectiva hasta la siguiente.",
        ] },
        { type: "h2", text: "Lo que hizo la diferencia en Ciudad del Cabo" },
        { type: "p", text: "La ciudad bajó su consumo de 1,200 a 500 millones de litros diarios en meses. No fue una medida mágica: fue medir casa por casa, publicar el consumo, y una meta clara de 50 litros por persona al día. Las duchas de 2 minutos, los inodoros con agua gris y el 'if it's yellow, let it mellow' hicieron el resto. La lección incómoda: el consumo podía bajar 60% y la vida siguió." },
        { type: "h2", text: "Lo que aprendimos en Monterrey y CDMX" },
        { type: "ul", items: [
          "La casa con cisterna, tinaco y hábitos medidos pasó el tandeo con incomodidad; la casa sin margen vivió en crisis.",
          "Los barrios que ya reusaban y captaban ni se enteraron los primeros meses.",
          "El agua de pipa multiplicó por 10 el valor de cada litro ahorrado: las medidas 'que no valían la pena' de pronto se pagaban en semanas.",
        ] },
        { type: "h2", text: "Tu plan personal de día cero, en orden" },
        { type: "ul", items: [
          "1. Conoce tu número: [lee tu recibo](/blog/como-leer-tu-recibo-de-agua) y sabe cuántos litros por persona por día consume tu casa. Sin línea base no hay plan.",
          "2. Mata el desperdicio estructural: [fugas](/blog/fugas-invisibles-como-encontrarlas) y [la espera del agua caliente](/blog/cuanta-agua-se-va-esperando-el-agua-caliente), que un [hidro-retorno](/products/hydroloop-manual) elimina de raíz.",
          "3. Haz margen: cisterna o tinaco extra dimensionado para 1-2 semanas.",
          "4. Diversifica fuentes: [gris al inodoro y al jardín](/blog/agua-gris-explicada), [lluvia al almacén](/blog/captacion-de-lluvia-guia-honesta).",
          "5. Practica un fin de semana de 50 litros por persona. En serio: el simulacro enseña más que cualquier artículo, este incluido.",
        ] },
        { type: "note", text: "Contexto global en [UN-Water](https://www.unwater.org): 2 de cada 4 personas en el mundo ya viven al menos un mes al año con escasez severa. El día cero no es una profecía, es un calendario que se mueve. Las casas preparadas no le tienen miedo." },
      ],
      en: [
        { type: "p", text: "'Day zero' is the date a city closes its taps because the dams no longer supply. Cape Town named it in 2018 and dodged it by weeks. Monterrey lived its version in 2022 with months of rationing. Mexico City's metro area grazed its own in 2024 with the Cutzamala system at historic lows. The pattern across all three crises is the same, and so are the lessons." },
        { type: "h2", text: "The pattern: the crisis always announces itself" },
        { type: "ul", items: [
          "Years of falling dams everyone sees and nobody feels, because the tap keeps giving.",
          "One dry year that breaks the margin. From 'low level' to '90 days left' in a season.",
          "Rationing: water a few hours a day or a few days a week. The cistern goes from convenience to vital organ.",
          "The real price of water explodes: 10,000-liter trucks that cost 800 pesos jump to 3,000 or more.",
          "And when it rains, collective amnesia until the next one.",
        ] },
        { type: "h2", text: "What made the difference in Cape Town" },
        { type: "p", text: "The city cut consumption from 1,200 to 500 million liters a day in months. No magic measure: metering house by house, publishing usage, and a clear target of 50 liters per person per day. Two-minute showers, greywater toilets and 'if it's yellow, let it mellow' did the rest. The uncomfortable lesson: consumption could drop 60% and life went on." },
        { type: "h2", text: "What Monterrey and CDMX taught us" },
        { type: "ul", items: [
          "The house with a cistern, rooftop tank and measured habits crossed the rationing with discomfort; the house without margin lived in crisis.",
          "Neighborhoods already reusing and harvesting barely noticed the first months.",
          "Trucked water multiplied the value of every saved liter by 10: measures that 'were not worth it' suddenly paid back in weeks.",
        ] },
        { type: "h2", text: "Your personal day-zero plan, in order" },
        { type: "ul", items: [
          "1. Know your number: [read your bill](/blog/como-leer-tu-recibo-de-agua) and learn your home's liters per person per day. No baseline, no plan.",
          "2. Kill structural waste: [leaks](/blog/fugas-invisibles-como-encontrarlas) and [the hot-water wait](/blog/cuanta-agua-se-va-esperando-el-agua-caliente), which a [hydro-return](/products/hydroloop-manual) eliminates at the root.",
          "3. Build margin: a cistern or extra tank sized for 1-2 weeks.",
          "4. Diversify sources: [grey to the toilet and garden](/blog/agua-gris-explicada), [rain to storage](/blog/captacion-de-lluvia-guia-honesta).",
          "5. Practice a 50-liters-per-person weekend. Seriously: the drill teaches more than any article, this one included.",
        ] },
        { type: "note", text: "Global context at [UN-Water](https://www.unwater.org): 2 in 4 people worldwide already live with severe scarcity at least one month a year. Day zero is not a prophecy, it is a calendar that moves. Prepared homes do not fear it." },
      ],
    },
  },
  {
    slug: "regaderas-ahorradoras-mitos",
    date: "2026-07-25",
    readingMinutes: 9,
    image: "/media/gallery/laminador.webp",
    imageAlt: {
      es: "Laminador de flujo para regadera",
      en: "Shower flow laminator",
    },
    tag: { es: "Ahorro", en: "Savings" },
    title: {
      es: "Regaderas ahorradoras: qué funciona, qué es mito y qué arruina el baño",
      en: "Water-saving showerheads: what works, what is myth and what ruins the shower",
    },
    excerpt: {
      es: "Entre la regadera de 20 litros por minuto y la telera triste de hotel hay un punto dulce. Litros por minuto reales, aireadores, laminadores y la prueba de la cubeta.",
      en: "Between the 20-liter-a-minute showerhead and the sad hotel trickle there is a sweet spot. Real liters per minute, aerators, laminators and the bucket test.",
    },
    body: {
      es: [
        { type: "p", text: "La regadera es el electrodoméstico de agua más usado de la casa: 4 a 8 sesiones diarias en una familia. Cambiarla es la segunda medida más rentable después de [dejar de tirar la espera](/blog/cuanta-agua-se-va-esperando-el-agua-caliente), pero el mercado está lleno de promesas raras. Vamos por partes." },
        { type: "h2", text: "Primero mide la tuya: la prueba de la cubeta" },
        { type: "p", text: "Cubeta de 10 litros bajo la regadera, llave a tope, cronómetro. ¿Se llenó en 30 segundos? Tu regadera tira 20 L/min: es de las viejas. ¿Un minuto? 10 L/min, razonable. ¿Minuto y medio o más? Ya estás en zona eficiente. Sin esta medición, cualquier compra es a ciegas." },
        { type: "h2", text: "Lo que sí funciona" },
        { type: "ul", items: [
          "Regaderas de 6-8 L/min con aireador: mezclan aire al chorro y la presión SE SIENTE igual. El estándar moderno decente.",
          "Laminadores de flujo: ordenan el chorro en láminas para maximizar sensación con menos agua; es la pieza que [Hydroloop incluye en su paquete](/products/hydroloop-manual) para el brazo de la regadera.",
          "Restrictores de caudal (arandela): 30 pesos, bajan una regadera vieja a 8-10 L/min. La solución del rentero.",
          "Válvula de pausa: corta el flujo mientras te enjabonas sin perder la mezcla de temperatura. Combina perfecto con el hábito de la ducha corta.",
        ] },
        { type: "h2", text: "Los mitos" },
        { type: "ul", items: [
          "'Menos litros = bañarse mal': falso con aireador; el chorro de 8 L/min bien diseñado moja más que uno de 15 mal distribuido.",
          "'Las de lluvia gigantes son eficientes porque caen suave': al revés, muchas superan los 15 L/min. Suave no es poco.",
          "'El calentador trabaja menos con regadera ahorradora, ahorro doble en gas': cierto pero chiquito; el gas se va en calentar, no en mover litros. El ahorro grande es el agua.",
          "'Con presión baja no sirven': depende; los modelos con cámara de compresión están hechos justo para eso. Y si tu problema es OTRO (que tarde en llegar caliente), la regadera no lo arregla: eso es [tubería y espera](/blog/boiler-paso-deposito-solar), no salida.",
        ] },
        { type: "h2", text: "La cuenta" },
        { type: "p", text: "Familia de cuatro, duchas de 8 minutos: pasar de 15 a 8 L/min son 224 litros menos AL DÍA, unos 80,000 al año. Con [tarifa escalonada](/blog/como-leer-tu-recibo-de-agua), eso suele ser recortar el bloque caro completo. La regadera se paga en el primer bimestre; pocas cosas en la casa tienen ese retorno." },
        { type: "note", text: "Combo de baño perfecto: regadera de 8 L/min + válvula de pausa + [hidro-retorno](/products/hydroloop-wifi) para que el primer litro ya salga caliente. Cero espera, cero desperdicio, misma experiencia." },
      ],
      en: [
        { type: "p", text: "The shower is the most used water appliance in the house: 4 to 8 sessions a day for a family. Changing it is the second most profitable measure after [ending the wait](/blog/cuanta-agua-se-va-esperando-el-agua-caliente), but the market is full of odd promises. Step by step." },
        { type: "h2", text: "Measure yours first: the bucket test" },
        { type: "p", text: "A 10-liter bucket under the shower, tap fully open, stopwatch. Filled in 30 seconds? Your head pushes 20 L/min: an old one. One minute? 10 L/min, reasonable. Ninety seconds or more? You are already efficient. Without this measurement, any purchase is blind." },
        { type: "h2", text: "What actually works" },
        { type: "ul", items: [
          "6-8 L/min heads with an aerator: they mix air into the stream and pressure FEELS the same. The decent modern standard.",
          "Flow laminators: they order the stream into sheets to maximize sensation with less water; it is the part [Hydroloop includes in its package](/products/hydroloop-manual) for the shower arm.",
          "Flow restrictors (washer disc): 30 pesos, they bring an old head down to 8-10 L/min. The renter's solution.",
          "Pause valve: cuts flow while you soap without losing the temperature mix. Pairs perfectly with the short-shower habit.",
        ] },
        { type: "h2", text: "The myths" },
        { type: "ul", items: [
          "'Fewer liters = a bad shower': false with an aerator; a well-designed 8 L/min stream wets more than a badly distributed 15.",
          "'Giant rain heads are efficient because they fall softly': the opposite, many exceed 15 L/min. Soft is not little.",
          "'The heater works less with a saving head, double gas savings': true but tiny; gas goes into heating, not moving liters. The big saving is water.",
          "'They are useless with low pressure': depends; compression-chamber models are built exactly for that. And if your problem is ANOTHER one (hot water taking forever to arrive), the head will not fix it: that is [pipe and wait](/blog/boiler-paso-deposito-solar), not the outlet.",
        ] },
        { type: "h2", text: "The math" },
        { type: "p", text: "Family of four, 8-minute showers: going from 15 to 8 L/min is 224 fewer liters A DAY, about 80,000 a year. With [tiered rates](/blog/como-leer-tu-recibo-de-agua), that usually means deleting the expensive block entirely. The head pays for itself within the first billing cycle; few things in a house return like that." },
        { type: "note", text: "The perfect bathroom combo: an 8 L/min head + pause valve + a [hydro-return](/products/hydroloop-wifi) so the first liter already comes out hot. Zero wait, zero waste, same experience." },
      ],
    },
  },
  {
    slug: "cuanto-cuesta-el-agua-en-mexico",
    date: "2026-07-18",
    readingMinutes: 10,
    image: "/media/photos/dispositivo.webp",
    imageAlt: {
      es: "Dispositivo de ahorro instalado en la tubería",
      en: "Saving device installed on the pipe",
    },
    tag: { es: "Dinero", en: "Money" },
    title: {
      es: "Cuánto cuesta el agua en México y por qué va a costar más",
      en: "What water costs in Mexico and why it will cost more",
    },
    excerpt: {
      es: "El metro cúbico va de 5 a 120 pesos según tu ciudad y tu fuente. El mapa de precios, el subsidio invisible que se está acabando y qué significa para tu recibo.",
      en: "A cubic meter runs from 5 to 120 pesos depending on your city and source. The price map, the invisible subsidy running out, and what it means for your bill.",
    },
    body: {
      es: [
        { type: "p", text: "Pregunta en una cena cuánto cuesta un litro de agua y nadie sabe: es de los pocos productos que consumimos a diario sin conocer el precio. Respuesta corta: de la red urbana, entre 1 y 5 centavos el litro según la ciudad y tu bloque de consumo. De pipa, entre 12 y 25 centavos. Embotellada, de 5 a 15 PESOS. La brecha explica casi todo lo que está mal con cómo la usamos." },
        { type: "h2", text: "El mapa de tarifas urbanas (uso doméstico, aproximado)" },
        { type: "ul", items: [
          "Baratas ($5-12 por m³ en bloques bajos): CDMX subsidiada, Guadalajara, buena parte del sureste.",
          "Medias ($13-25): Querétaro, León, Aguascalientes, Monterrey después de la crisis.",
          "Caras ($25-45 en bloques altos): Tijuana, Cancún, los bloques de castigo de casi todas las ciudades.",
          "Fuera de red: la pipa manda. $800-3,000 por 10,000 litros según temporada y colonia. Consulta tu tarifa exacta con tu organismo o vía [CONAGUA](https://www.gob.mx/conagua).",
        ] },
        { type: "h2", text: "El subsidio invisible" },
        { type: "p", text: "En la mayoría de las ciudades, la tarifa doméstica no cubre ni el costo de operación del sistema: la diferencia la pone el presupuesto público. CDMX bombea el 30% de su agua desde el Cutzamala a 1,000 metros de subida: cada litro que tiras esperando la caliente ya quemó electricidad pública antes de llegar a tu regadera. Cuando las finanzas aprietan (y están apretando), las tarifas se sinceran: Monterrey y varios organismos ya ajustaron por encima de inflación después de 2022." },
        { type: "h2", text: "Qué significa para tu casa" },
        { type: "ul", items: [
          "El ahorro de agua es de las pocas inversiones cuyo retorno MEJORA solo: cada ajuste de tarifa acorta el payback de todo lo que ya instalaste.",
          "Las medidas se evalúan al precio del bloque alto, no al promedio: si tu consumo toca el bloque caro, ahí es donde recortas primero. [Tu recibo](/blog/como-leer-tu-recibo-de-agua) te dice en cuál estás.",
          "Con pipa, TODO cambia: a 20 centavos el litro, los [7,300 litros anuales de la espera](/blog/cuanta-agua-se-va-esperando-el-agua-caliente) por persona son ~1,500 pesos por cabeza. Un [hidro-retorno](/products/hydroloop-manual) se paga en meses, no años.",
        ] },
        { type: "h2", text: "La cuenta que nadie hace: el agua caliente vale doble" },
        { type: "p", text: "Un litro de agua caliente cuesta el litro MÁS el gas que lo calentó (aprox. 6-10 centavos por litro elevado 25°C). Tirar agua caliente por mala mezcla o por tubería mal aislada duele el doble que tirar fría. Por eso el [tipo y la posición del calentador](/blog/boiler-paso-deposito-solar) importan tanto, y por eso la espera es el desperdicio más caro de la casa: es agua pagada, bombeada y a medio calentar." },
        { type: "note", text: "Nuestra [calculadora](/#como-funciona) trae $25 por m³ por default: cámbialo por tu tarifa real y el número de pesos al año se vuelve tuyo. Es el primer paso del [plan de día cero](/blog/el-dia-cero-lecciones)." },
      ],
      en: [
        { type: "p", text: "Ask at a dinner what a liter of water costs and nobody knows: it is one of the few products we consume daily without knowing the price. Short answer: from the urban grid, 1 to 5 cents per liter depending on city and consumption block. Trucked, 12 to 25 cents. Bottled, 5 to 15 PESOS. That gap explains most of what is wrong with how we use it." },
        { type: "h2", text: "The urban rate map (domestic, approximate)" },
        { type: "ul", items: [
          "Cheap ($5-12 per m³ in low blocks): subsidized CDMX, Guadalajara, much of the southeast.",
          "Middle ($13-25): Querétaro, León, Aguascalientes, post-crisis Monterrey.",
          "Expensive ($25-45 in high blocks): Tijuana, Cancún, and the punishment blocks of nearly every city.",
          "Off-grid: the truck rules. $800-3,000 per 10,000 liters by season and neighborhood. Check your exact rate with your utility or via [CONAGUA](https://www.gob.mx/conagua).",
        ] },
        { type: "h2", text: "The invisible subsidy" },
        { type: "p", text: "In most cities the domestic rate does not even cover system operating costs: public budgets make up the difference. CDMX pumps 30% of its water up 1,000 meters from the Cutzamala: every liter you waste waiting for hot already burned public electricity before reaching your shower. When finances tighten (and they are tightening), rates get honest: Monterrey and several utilities adjusted above inflation after 2022." },
        { type: "h2", text: "What it means for your home" },
        { type: "ul", items: [
          "Water saving is one of the few investments whose return IMPROVES on its own: every rate adjustment shortens the payback of everything you already installed.",
          "Measures should be valued at the top-block price, not the average: if your consumption touches the expensive block, cut there first. [Your bill](/blog/como-leer-tu-recibo-de-agua) tells you where you stand.",
          "On trucked water EVERYTHING changes: at 20 cents a liter, the [7,300 yearly liters of the wait](/blog/cuanta-agua-se-va-esperando-el-agua-caliente) per person are ~1,500 pesos a head. A [hydro-return](/products/hydroloop-manual) pays back in months, not years.",
        ] },
        { type: "h2", text: "The math nobody does: hot water costs double" },
        { type: "p", text: "A liter of hot water costs the liter PLUS the gas that heated it (roughly 6-10 cents per liter raised 25°C). Wasting hot water through bad mixing or uninsulated pipe hurts twice as much as wasting cold. That is why [heater type and placement](/blog/boiler-paso-deposito-solar) matter so much, and why the wait is the most expensive waste in the house: paid, pumped, half-heated water." },
        { type: "note", text: "Our [calculator](/#como-funciona) defaults to $25 per m³: swap in your real rate and the yearly peso figure becomes yours. It is step one of the [day-zero plan](/blog/el-dia-cero-lecciones)." },
      ],
    },
  },
  {
    slug: "rutina-manana-sin-desperdicio",
    date: "2026-07-10",
    readingMinutes: 8,
    image: "/media/gallery/app-wifi.webp",
    imageAlt: {
      es: "App de Hydroloop WiFi en un celular",
      en: "Hydroloop WiFi app on a phone",
    },
    tag: { es: "Hogar", en: "Home" },
    title: {
      es: "La rutina de la mañana sin desperdicio: cómo automatizar el agua de tu casa",
      en: "The zero-waste morning routine: automating your home's water",
    },
    excerpt: {
      es: "La mañana concentra el 60% del agua caliente del día y todo el caos. Cómo dejarla en piloto automático con horarios, asistentes de voz y dos hábitos que no cuestan.",
      en: "Mornings concentrate 60% of the day's hot water and all of the chaos. How to put them on autopilot with schedules, voice assistants and two free habits.",
    },
    body: {
      es: [
        { type: "p", text: "Las mañanas son el pico de agua de cualquier casa: todos se bañan, todos abren llaves, todos tienen prisa. También es cuando más se desperdicia, porque nadie con prisa espera junto a la regadera: abre la llave, se va a hacer otra cosa y regresa cuando 'ya debe estar'. Esos minutos de nadie son litros de todos." },
        { type: "h2", text: "El piloto automático del agua caliente" },
        { type: "ul", items: [
          "Programa el hidro-retorno 10 minutos antes del primer despertador: cuando la primera persona entra al baño, el agua sale caliente desde el primer segundo. Con el [Hydroloop WiFi](/products/hydroloop-wifi) es un horario en la app, por día y hora.",
          "Rutinas de voz: 'Alexa, buenos días' puede prender cafetera, luces y el agua caliente al mismo tiempo. Funciona con Alexa, Google Assistant y SmartThings.",
          "En días de horario raro, actívalo desde la cama o llegando del gimnasio: para eso existe el control a distancia.",
          "¿Casa sin buena señal de WiFi en el baño? El [modelo Manual](/products/hydroloop-manual) hace lo mismo con un botón junto al apagador: apriétalo al levantarte y para cuando terminas de lavarte los dientes, el agua está lista.",
        ] },
        { type: "h2", text: "Los dos hábitos que no cuestan un peso" },
        { type: "ul", items: [
          "El orden de la fila: duchas consecutivas, no espaciadas. La tubería ya está caliente para el segundo y el tercero; dejar enfriar entre turnos regenera la espera y sus litros.",
          "La válvula mental de los 5 minutos: el agua de la ducha corre 9 litros por minuto. Una canción son ~4 minutos. Dos canciones es una ducha completa; tres es un lujo.",
        ] },
        { type: "h2", text: "El resto de la mañana" },
        { type: "ul", items: [
          "Aireadores en el lavabo: lavarse los dientes y las manos con 3 L/min en vez de 8 se siente igual.",
          "La lavadora, mejor de noche: tarifas eléctricas más bajas y cero competencia por presión con las duchas.",
          "Si juntas agua mientras 'sale la caliente', que sea el plan B, no el sistema: la cubeta rescata litros pero te sigue costando tiempo. El plan A es que [no haya nada que juntar](/blog/cuanta-agua-se-va-esperando-el-agua-caliente).",
        ] },
        { type: "note", text: "Una mañana automatizada le ahorra a una familia de cuatro entre 40 y 80 litros diarios contra la misma mañana en modo caos. Al año, con [tu tarifa](/blog/cuanto-cuesta-el-agua-en-mexico), ya sabes hacer la cuenta... o la hace [la calculadora](/#como-funciona)." },
      ],
      en: [
        { type: "p", text: "Mornings are any home's water peak: everyone showers, everyone opens taps, everyone is rushing. It is also when the most is wasted, because nobody in a hurry waits next to the shower: they open the tap, go do something else and come back when it 'should be ready'. Those nobody-minutes are everybody's liters." },
        { type: "h2", text: "Hot water on autopilot" },
        { type: "ul", items: [
          "Schedule the hydro-return 10 minutes before the first alarm: when the first person walks into the bathroom, water runs hot from the first second. With the [Hydroloop WiFi](/products/hydroloop-wifi) it is an in-app schedule, by day and time.",
          "Voice routines: 'Alexa, good morning' can start the coffee maker, the lights and the hot water at once. Works with Alexa, Google Assistant and SmartThings.",
          "On odd-schedule days, trigger it from bed or on the way back from the gym: that is what remote control is for.",
          "House with weak bathroom WiFi? The [Manual model](/products/hydroloop-manual) does the same with a button by the light switch: press it when you get up and by the time you finish brushing, the water is ready.",
        ] },
        { type: "h2", text: "The two habits that cost nothing" },
        { type: "ul", items: [
          "Queue order: consecutive showers, not spaced ones. The pipe is already hot for the second and third; letting it cool between turns regenerates the wait and its liters.",
          "The 5-minute mental valve: shower water runs 9 liters a minute. One song is ~4 minutes. Two songs is a full shower; three is a luxury.",
        ] },
        { type: "h2", text: "The rest of the morning" },
        { type: "ul", items: [
          "Sink aerators: brushing and washing hands at 3 L/min instead of 8 feels identical.",
          "Laundry at night: cheaper electricity and zero pressure competition with showers.",
          "If you collect water while 'the hot arrives', make it plan B, not the system: the bucket rescues liters but still costs you time. Plan A is having [nothing to collect](/blog/cuanta-agua-se-va-esperando-el-agua-caliente).",
        ] },
        { type: "note", text: "An automated morning saves a family of four 40 to 80 liters a day versus the same morning in chaos mode. Per year, at [your rate](/blog/cuanto-cuesta-el-agua-en-mexico), you know the math by now... or [the calculator](/#como-funciona) does it." },
      ],
    },
  },
  {
    slug: "negocios-que-ahorran-agua",
    date: "2026-07-03",
    readingMinutes: 9,
    image: "/media/photos/splash-wide.webp",
    imageAlt: {
      es: "Equipo Hydroloop sobre agua",
      en: "Hydroloop unit over water",
    },
    tag: { es: "Negocios", en: "Business" },
    title: {
      es: "Hoteles, Airbnb y restaurantes: el ahorro de agua que sí se nota en el margen",
      en: "Hotels, Airbnbs and restaurants: water savings that actually show in the margin",
    },
    excerpt: {
      es: "En un negocio, el agua desperdiciada aparece tres veces: en el recibo, en el gas y en las reseñas. Las medidas por giro, ordenadas por retorno.",
      en: "In a business, wasted water shows up three times: on the bill, on the gas and in the reviews. Measures by trade, ranked by return.",
    },
    body: {
      es: [
        { type: "p", text: "En una casa el desperdicio de agua es dinero; en un negocio es dinero por tres: pagas el agua comercial (bloques más caros), pagas el gas que la calentó y, en hospitalidad, pagas la reseña del huésped que esperó cinco minutos el agua caliente. Aquí van las medidas con mejor retorno por giro." },
        { type: "h2", text: "Hoteles y rentas vacacionales" },
        { type: "ul", items: [
          "La queja número uno en reseñas de hospedaje pequeño es la espera del agua caliente en habitaciones lejanas al boiler. Un [hidro-retorno programado](/products/hydroloop-wifi) según las reservas la elimina; uno de nuestros usuarios lo resume: desde que lo instaló, el tema desapareció de sus reseñas.",
          "Regaderas de 8 L/min con buen aireador: el huésped no nota la diferencia, el recibo sí. Un cuarto ocupado son 1-2 duchas diarias.",
          "Lavandería con carga completa y en horario nocturno; el agua de enjuague puede reusarse para [áreas verdes](/blog/agua-gris-explicada).",
          "Medición por área: un medidor de paso barato en lavandería y otro en habitaciones te dice dónde se va el agua antes de adivinar.",
        ] },
        { type: "h2", text: "Restaurantes y cafeterías" },
        { type: "ul", items: [
          "El fregadero es la regadera del restaurante: pistolas de prelavado eficientes (5-6 L/min) contra las abiertas de 15.",
          "Descongelar en refrigeración, nunca bajo el chorro: es norma sanitaria además de ahorro.",
          "El agua del último enjuague de trapeadores y verduras sirve para el primer enjuague del día siguiente o para patios.",
          "Fugas: en cocinas, una válvula que gotea con agua caliente cuesta doble (agua + gas). El [chequeo de fugas](/blog/fugas-invisibles-como-encontrarlas) va mensual, no anual.",
        ] },
        { type: "h2", text: "Oficinas y comercios" },
        { type: "ul", items: [
          "Mingitorios de bajo consumo o secos y aireadores en TODOS los lavabos: el 90% del agua de una oficina está en los baños.",
          "Sensores solo donde el uso es intenso: en baños de poco tráfico, el sensor mal calibrado gasta más de lo que ahorra.",
        ] },
        { type: "h2", text: "El caso de negocio, en frío" },
        { type: "p", text: "Tarifa comercial típica: 1.5 a 3 veces la doméstica, sin subsidio. A [$40+ por m³](/blog/cuanto-cuesta-el-agua-en-mexico), cada medida se paga en la mitad del tiempo que en casa. Y a diferencia de casi cualquier otro recorte de costos, este no le quita nada a nadie: el cliente no nota el aireador, sí nota el agua caliente instantánea." },
        { type: "note", text: "¿Operas varias ubicaciones o un hotel y quieres cotizar por volumen? [Escríbenos](/contact): la instalación certificada extiende la garantía a 2 años y en zonas de cobertura la hace nuestro equipo." },
      ],
      en: [
        { type: "p", text: "In a home, wasted water is money; in a business it is money times three: you pay commercial water (pricier blocks), you pay the gas that heated it and, in hospitality, you pay the review of the guest who waited five minutes for hot water. Here are the best-return measures by trade." },
        { type: "h2", text: "Hotels and vacation rentals" },
        { type: "ul", items: [
          "The number one complaint in small-lodging reviews is the hot-water wait in rooms far from the boiler. A [hydro-return scheduled](/products/hydroloop-wifi) around bookings eliminates it; one of our users sums it up: since installing it, the topic vanished from his reviews.",
          "8 L/min showerheads with a good aerator: guests do not notice, the bill does. An occupied room is 1-2 showers a day.",
          "Full-load laundry on night schedule; rinse water can be reused for [green areas](/blog/agua-gris-explicada).",
          "Metering by area: a cheap inline meter on laundry and another on rooms tells you where water goes before you guess.",
        ] },
        { type: "h2", text: "Restaurants and cafés" },
        { type: "ul", items: [
          "The sink is the restaurant's shower: efficient pre-rinse spray valves (5-6 L/min) versus wide-open 15s.",
          "Defrost under refrigeration, never under running water: it is a health rule besides a saving.",
          "Last-rinse water from mops and vegetables serves as next day's first rinse or for patios.",
          "Leaks: in kitchens, a dripping hot-water valve costs double (water + gas). The [leak check](/blog/fugas-invisibles-como-encontrarlas) is monthly, not yearly.",
        ] },
        { type: "h2", text: "Offices and shops" },
        { type: "ul", items: [
          "Low-flow or dry urinals and aerators on EVERY sink: 90% of an office's water is in the bathrooms.",
          "Sensors only where use is heavy: in low-traffic bathrooms a badly calibrated sensor wastes more than it saves.",
        ] },
        { type: "h2", text: "The business case, coldly" },
        { type: "p", text: "Typical commercial rate: 1.5 to 3 times domestic, unsubsidized. At [$40+ per m³](/blog/cuanto-cuesta-el-agua-en-mexico), every measure pays back in half the time it takes at home. And unlike almost any other cost cut, this one takes nothing from anyone: the client does not notice the aerator, they do notice instant hot water." },
        { type: "note", text: "Running several locations or a hotel and want a volume quote? [Write to us](/contact): certified installation extends the warranty to 2 years and in coverage areas our own crew does it." },
      ],
    },
  },
  {
    slug: "hydroloop-vs-bombas-recirculadoras",
    date: "2026-08-26",
    readingMinutes: 12,
    image: "/media/photos/splash.webp",
    imageAlt: {
      es: "Equipo Hydroloop sobre agua",
      en: "Hydroloop unit over water",
    },
    tag: { es: "Comparativa", en: "Comparison" },
    title: {
      es: "Hydroloop vs bombas recirculadoras: la comparación honesta (Coflex, Grundfos, Watts, AquaReturn)",
      en: "Hydroloop vs recirculation pumps: the honest comparison (Coflex, Grundfos, Watts, AquaReturn)",
    },
    excerpt: {
      es: "Todos resuelven la espera del agua caliente, pero no igual ni al mismo precio. Timer vs demanda, importado vs mexicano, y la tabla completa con precios reales de 2026.",
      en: "They all solve the hot-water wait, but not the same way nor at the same price. Timer vs on-demand, imported vs Mexican, and the full table with real 2026 prices.",
    },
    body: {
      es: [
        { type: "p", text: "Si llegaste aquí comparando opciones, bien hecho: es exactamente lo que deberías hacer. En el mercado mexicano hay al menos seis formas de dejar de tirar el agua fría de la espera, y aunque nosotros vendemos una de ellas, esta comparación juega limpio: precios reales, ventajas de cada quien, y para qué casa conviene cada una." },
        { type: "h2", text: "La división que importa: timer contra demanda" },
        { type: "p", text: "Antes de las marcas, entiende las dos filosofías. Los sistemas de TIMER (Grundfos Comfort, Watts, Rheem, Coflex en modo programado) mantienen el agua caliente circulando por horarios: comodidad máxima, pero recirculan aunque nadie se vaya a bañar y el calentador repone ese calor perdido todo el día. Los sistemas POR DEMANDA (Hydroloop, TacoGenie, ACT D'MAND) solo trabajan cuando alguien lo pide con un botón o la app: la bomba corre uno o dos minutos y se apaga sola al llegar la temperatura. Para ahorrar de verdad, la demanda gana; para no pensar nunca en el tema y pagar el gas extra, el timer." },
        { type: "h2", text: "La tabla completa" },
        { type: "table",
          headers: ["Sistema", "Precio aprox.", "Activación", "Instalación", "Garantía", "Origen"],
          rows: [
            ["Hydroloop® Manual", "$3,799", "Botón (demanda)", "Bajo lavabo, sin obra", "1 año, 2 certificada", "México"],
            ["Hydroloop® WiFi", "$3,999", "Botón, app, voz y horarios", "Bajo lavabo, sin obra", "1 año, 2 certificada", "México"],
            ["Coflex PS-R125", "$5,000-6,000", "App y horarios (timer)", "Bomba en el calentador + bypass", "1 año", "México"],
            ["VARS Smart Loop", "No publicado", "Panel táctil, app, voz", "Bajo lavabo", "No publicada", "México"],
            ["Grundfos Comfort UP15", "$4,000-5,000 + instalación", "Timer 24 h", "Bomba en el calentador + válvula", "2 años", "Importado"],
            ["Watts 500800", "$4,500-6,000 + instalación", "Timer programable", "Bomba en el calentador + válvula", "1-3 años", "Importado"],
            ["AquaReturn", "~$7,000 (347€)", "Automático por temperatura", "Bajo lavabo, sin obra", "2 años", "España"],
            ["Ecobiolab hidro-retorno", "$4,750", "WiFi", "Bajo lavabo", "1 año", "México"],
          ],
        },
        { type: "h2", text: "Lo que cada rival hace bien (en serio)" },
        { type: "ul", items: [
          "Coflex: distribución imbatible (está en Home Depot de todo el país) y una app pulida. Si quieres comprarlo hoy en tienda física, es el más fácil de encontrar.",
          "Grundfos y Watts: décadas de reputación en bombas y refacciones en cualquier ciudad. Su modo timer es comodidad pura si el gas no te preocupa.",
          "AquaReturn: el único totalmente automático, arranca solo cuando detecta agua por debajo de 35°C. Cero botones, certificación europea del CSIC... y el precio más alto de la tabla.",
          "VARS: 25 años de trayectoria regia y un panel táctil inalámbrico incluido que está muy bien pensado.",
          "TacoGenie y ACT D'MAND (EUA): inventaron la categoría por demanda; excelentes equipos, difíciles de conseguir y dar servicio en México.",
        ] },
        { type: "h2", text: "Dónde gana Hydroloop, con argumentos verificables" },
        { type: "ul", items: [
          "Precio de entrada más bajo de la categoría: [$3,799 con IVA](/products/hydroloop-manual), sin bomba adicional ni válvulas importadas que cotizar.",
          "Demanda pura: no recircula de más, no le regala calor a la tubería a las 3 de la mañana. El gas se queda igual y el agua deja de tirarse; [así funciona](/blog/que-es-un-hidro-retorno).",
          "Instalación sin obra en una tarde, con [tutorial oficial de 10 minutos](/products/hydroloop-manual) y soporte remoto en español; los kits de bomba en calentador suelen necesitar plomero y ajustes.",
          "Garantía de hasta 2 años con instalación certificada: el doble del estándar nacional de 1 año.",
          "Hecho en México con refacciones e ingeniería locales: cuando algo pasa, no esperas una pieza importada seis semanas.",
          "WiFi opcional a $200 de diferencia: horarios, Alexa, Google y SmartThings [en el modelo WiFi](/products/hydroloop-wifi), al precio del modelo básico de otros.",
        ] },
        { type: "h2", text: "Y dónde no somos la mejor opción" },
        { type: "ul", items: [
          "Si quieres cero interacción para siempre y el presupuesto no importa: AquaReturn es automático de verdad.",
          "Si tu casa ya tiene línea de retorno dedicada (algunas residencias nuevas): una recirculadora tradicional con timer la aprovecha mejor.",
          "Si necesitas comprarlo físicamente hoy a las 7 pm: Coflex está en Home Depot y nosotros [en estos puntos de venta](/contact).",
        ] },
        { type: "p", text: "El resto de la decisión es la de siempre: mide tu espera, [calcula tus litros](/#como-funciona) y compara contra tu [tarifa real](/blog/cuanto-cuesta-el-agua-en-mexico). Con números en la mano, cualquier equipo de esta tabla es mejor que seguir tirando el agua." },
        { type: "note", text: "Precios consultados en agosto de 2026 en sitios oficiales, Home Depot México, MercadoLibre y Amazon; los de instalación varían por ciudad. Si un dato quedó viejo, [escríbenos](/contact) y lo corregimos: la comparación solo sirve si es honesta." },
      ],
      en: [
        { type: "p", text: "If you got here comparing options, good: that is exactly what you should do. The Mexican market has at least six ways to stop wasting the cold-water wait, and although we sell one of them, this comparison plays fair: real prices, everyone's strengths, and which house each one suits." },
        { type: "h2", text: "The split that matters: timer versus demand" },
        { type: "p", text: "Before brands, understand the two philosophies. TIMER systems (Grundfos Comfort, Watts, Rheem, Coflex on schedule) keep hot water circulating on a schedule: maximum comfort, but they recirculate even when nobody will shower and the heater replaces that lost heat all day. ON-DEMAND systems (Hydroloop, TacoGenie, ACT D'MAND) only work when someone asks via button or app: the pump runs a minute or two and stops itself at temperature. For real savings, demand wins; for never thinking about it and paying the extra gas, timer." },
        { type: "h2", text: "The full table" },
        { type: "table",
          headers: ["System", "Approx. price", "Activation", "Install", "Warranty", "Origin"],
          rows: [
            ["Hydroloop® Manual", "$3,799 MXN", "Button (demand)", "Under-sink, no construction", "1 yr, 2 certified", "Mexico"],
            ["Hydroloop® WiFi", "$3,999 MXN", "Button, app, voice, schedules", "Under-sink, no construction", "1 yr, 2 certified", "Mexico"],
            ["Coflex PS-R125", "$5,000-6,000 MXN", "App and schedules (timer)", "Pump at heater + bypass", "1 yr", "Mexico"],
            ["VARS Smart Loop", "Not published", "Touch panel, app, voice", "Under-sink", "Not published", "Mexico"],
            ["Grundfos Comfort UP15", "$4,000-5,000 + install", "24 h timer", "Pump at heater + valve", "2 yr", "Imported"],
            ["Watts 500800", "$4,500-6,000 + install", "Programmable timer", "Pump at heater + valve", "1-3 yr", "Imported"],
            ["AquaReturn", "~$7,000 MXN (347€)", "Automatic by temperature", "Under-sink, no construction", "2 yr", "Spain"],
            ["Ecobiolab hydro-return", "$4,750 MXN", "WiFi", "Under-sink", "1 yr", "Mexico"],
          ],
        },
        { type: "h2", text: "What each rival does well (seriously)" },
        { type: "ul", items: [
          "Coflex: unbeatable distribution (it is in Home Depot nationwide) and a polished app. If you want to buy in a physical store today, it is the easiest to find.",
          "Grundfos and Watts: decades of pump reputation and parts in any city. Their timer mode is pure comfort if gas is not your worry.",
          "AquaReturn: the only fully automatic one, starts itself when it detects water under 35°C. Zero buttons, European CSIC certification... and the highest price on the table.",
          "VARS: 25 years of Monterrey track record and a well-designed wireless touch panel included.",
          "TacoGenie and ACT D'MAND (US): they invented the on-demand category; excellent units, hard to buy and service in Mexico.",
        ] },
        { type: "h2", text: "Where Hydroloop wins, with verifiable arguments" },
        { type: "ul", items: [
          "Lowest entry price in the category: [$3,799 MXN tax included](/products/hydroloop-manual), no extra pump or imported valves to quote.",
          "Pure demand: it never over-recirculates or gifts heat to the pipe at 3 a.m. Gas stays the same and water stops being wasted; [here is how it works](/blog/que-es-un-hidro-retorno).",
          "No-construction install in an afternoon, with an [official 10-minute tutorial](/products/hydroloop-manual) and remote support in Spanish; heater-pump kits usually need a plumber and tuning.",
          "Warranty up to 2 years with certified installation: double the national 1-year standard.",
          "Made in Mexico with local parts and engineering: when something happens, you are not waiting six weeks for an imported piece.",
          "Optional WiFi for a $200 difference: schedules, Alexa, Google and SmartThings [on the WiFi model](/products/hydroloop-wifi), at other brands' base-model price.",
        ] },
        { type: "h2", text: "And where we are not the best option" },
        { type: "ul", items: [
          "If you want zero interaction forever and budget does not matter: AquaReturn is truly automatic.",
          "If your house already has a dedicated return line (some new builds): a traditional timer recirculator uses it better.",
          "If you need to buy it physically today at 7 pm: Coflex is at Home Depot and we are [at these points of sale](/contact).",
        ] },
        { type: "p", text: "The rest of the decision is the usual one: measure your wait, [calculate your liters](/#como-funciona) and compare against your [real rate](/blog/cuanto-cuesta-el-agua-en-mexico). With numbers in hand, any unit on this table beats continuing to waste the water." },
        { type: "note", text: "Prices checked in August 2026 on official sites, Home Depot México, MercadoLibre and Amazon; installation varies by city. If a figure went stale, [write to us](/contact) and we will fix it: a comparison is only useful if it is honest." },
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
