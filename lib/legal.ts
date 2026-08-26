import type { Locale } from "@/lib/i18n";

/**
 * Paginas legales en codigo.
 *
 * IMPORTANTE: son borradores redactados a partir de lo que Hydroloop publica
 * (garantia de 1 y 2 anos, envios cotizados por codigo postal, pagos con
 * Stripe y Mercado Pago) mas practicas estandar de comercio en Mexico.
 * Deben pasar por revision legal del cliente antes de publicarse como
 * definitivas: PROFECO y la LFPDPPP tienen requisitos que un abogado debe
 * validar con los datos reales de la empresa.
 */
export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type LegalPage = {
  slug: string;
  updated: string;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  body: Record<Locale, LegalBlock[]>;
};

export const legalPages: LegalPage[] = [
  {
    slug: "terminos",
    updated: "2026-08-26",
    title: { es: "Términos de compra y reembolsos", en: "Purchase terms and refunds" },
    intro: {
      es: "Las reglas claras de comprar en esta tienda: qué incluye tu compra, cómo funcionan la garantía, las devoluciones y los reembolsos.",
      en: "The clear rules of buying from this store: what your purchase includes and how warranty, returns and refunds work.",
    },
    body: {
      es: [
        { type: "h2", text: "La compra" },
        { type: "p", text: "Los precios se muestran en pesos mexicanos e incluyen IVA. El pedido queda confirmado cuando el pago se acredita en Stripe o Mercado Pago, o cuando confirmamos por correo un pedido con pago por transferencia. Recibes la confirmación con tu referencia de pedido en el correo que capturaste en el checkout." },
        { type: "h2", text: "Garantía" },
        { type: "ul", items: [
          "Todo equipo Hydroloop® tiene garantía limitada de 1 año por defectos de fabricación, sobre el equipo de recirculación y el módulo de control, a partir de la fecha de compra.",
          "Si la instalación la hace nuestro personal técnico certificado, la garantía se extiende hasta 2 años y cubre también la instalación.",
          "Para hacer válida la garantía es indispensable el comprobante de compra con fecha y monto.",
          "La garantía no cubre: instalación incorrecta, fallas de las instalaciones eléctricas o hidráulicas del inmueble, variaciones bruscas de presión, golpes, intervención de personal no autorizado, ni accesorios no fabricados por Hydroloop® (mangueras, conexiones en T, caja eléctrica).",
        ] },
        { type: "h2", text: "Devoluciones y reembolsos" },
        { type: "ul", items: [
          "Tienes 7 días naturales desde la entrega para solicitar la devolución de un equipo sin instalar, en su empaque original y con todos sus componentes.",
          "Si el equipo llega dañado por el envío o con un defecto de fábrica, repórtalo dentro de las 72 horas siguientes a la entrega con fotos del empaque y del equipo: reponemos el componente o la unidad completa sin costo.",
          "Aprobada la devolución, el reembolso se emite por el mismo medio de pago en un plazo de 5 a 10 días hábiles, según los tiempos del banco o de la plataforma de pago.",
          "Los costos de envío de una devolución sin defecto corren por cuenta del cliente; los de una devolución por defecto o error nuestro corren por nuestra cuenta.",
        ] },
        { type: "h2", text: "Contacto" },
        { type: "p", text: "Para cualquier aclaración de compra, garantía o reembolso escríbenos a ventas@hydroloop.com.mx o por WhatsApp al 442 334 4455." },
      ],
      en: [
        { type: "h2", text: "The purchase" },
        { type: "p", text: "Prices are shown in Mexican pesos and include tax. An order is confirmed when payment clears through Stripe or Mercado Pago, or when we confirm a bank transfer order by email. You receive a confirmation with your order reference at the email captured at checkout." },
        { type: "h2", text: "Warranty" },
        { type: "ul", items: [
          "Every Hydroloop® unit carries a limited one year warranty against manufacturing defects, on the recirculation unit and the control module, starting on the purchase date.",
          "When our certified technical crew installs the unit, the warranty extends to two years and also covers the installation.",
          "Proof of purchase showing date and amount is required for any warranty claim.",
          "The warranty does not cover: incorrect installation, faults in the building's electrical or plumbing systems, sudden pressure swings, impacts, service by unauthorized personnel, or accessories not manufactured by Hydroloop® (hoses, T fittings, electrical box).",
        ] },
        { type: "h2", text: "Returns and refunds" },
        { type: "ul", items: [
          "You have 7 calendar days from delivery to request the return of an uninstalled unit, in its original packaging with every component.",
          "If the unit arrives damaged in shipping or with a factory defect, report it within 72 hours of delivery with photos of the package and the unit: we replace the component or the full unit at no cost.",
          "Once a return is approved, the refund is issued to the same payment method within 5 to 10 business days, depending on the bank or payment platform.",
          "Shipping costs of a non-defective return are covered by the customer; returns due to a defect or our error are covered by us.",
        ] },
        { type: "h2", text: "Contact" },
        { type: "p", text: "For any purchase, warranty or refund question write to ventas@hydroloop.com.mx or WhatsApp 442 334 4455." },
      ],
    },
  },
  {
    slug: "privacidad",
    updated: "2026-08-26",
    title: { es: "Aviso de privacidad", en: "Privacy notice" },
    intro: {
      es: "Qué datos pedimos, para qué los usamos y qué no hacemos nunca con ellos.",
      en: "What data we ask for, what we use it for, and what we never do with it.",
    },
    body: {
      es: [
        { type: "h2", text: "Qué datos recabamos" },
        { type: "ul", items: [
          "Al comprar: nombre, correo, teléfono y dirección de envío. Son los datos mínimos para entregar tu pedido y emitir tu garantía.",
          "Al escribirnos: nombre, correo, teléfono y lo que nos cuentes de tu proyecto.",
          "Los datos de tu tarjeta nunca pasan por nuestros servidores: los procesan directamente Stripe o Mercado Pago bajo sus propios avisos de privacidad y certificaciones PCI.",
        ] },
        { type: "h2", text: "Para qué los usamos" },
        { type: "ul", items: [
          "Procesar, enviar y dar seguimiento a tu pedido.",
          "Atender garantías, devoluciones y soporte técnico.",
          "Responder tus mensajes de contacto.",
        ] },
        { type: "h2", text: "Lo que no hacemos" },
        { type: "ul", items: [
          "No vendemos ni rentamos tus datos a terceros.",
          "No te suscribimos a boletines que no pediste.",
          "No guardamos datos de pago.",
        ] },
        { type: "h2", text: "Tus derechos" },
        { type: "p", text: "Puedes solicitar el acceso, rectificación, cancelación u oposición al uso de tus datos (derechos ARCO) escribiendo a ventas@hydroloop.com.mx. Respondemos en los plazos que marca la Ley Federal de Protección de Datos Personales en Posesión de los Particulares." },
        { type: "h2", text: "Cookies" },
        { type: "p", text: "Este sitio usa almacenamiento local únicamente para recordar tu carrito, tu idioma y tu preferencia de tema. No usamos rastreadores de publicidad." },
      ],
      en: [
        { type: "h2", text: "What data we collect" },
        { type: "ul", items: [
          "When you buy: name, email, phone and shipping address. The minimum needed to deliver your order and issue your warranty.",
          "When you write to us: name, email, phone and whatever you tell us about your project.",
          "Your card details never touch our servers: they are processed directly by Stripe or Mercado Pago under their own privacy notices and PCI certifications.",
        ] },
        { type: "h2", text: "What we use it for" },
        { type: "ul", items: [
          "Processing, shipping and following up on your order.",
          "Handling warranty claims, returns and technical support.",
          "Answering your contact messages.",
        ] },
        { type: "h2", text: "What we never do" },
        { type: "ul", items: [
          "We do not sell or rent your data to third parties.",
          "We do not subscribe you to newsletters you did not ask for.",
          "We do not store payment data.",
        ] },
        { type: "h2", text: "Your rights" },
        { type: "p", text: "You may request access, rectification, cancellation or opposition regarding your data (ARCO rights under Mexican law) by writing to ventas@hydroloop.com.mx." },
        { type: "h2", text: "Cookies" },
        { type: "p", text: "This site uses local storage only to remember your cart, language and theme preference. No advertising trackers." },
      ],
    },
  },
  {
    slug: "envios",
    updated: "2026-08-26",
    title: { es: "Política de envíos", en: "Shipping policy" },
    intro: {
      es: "A dónde enviamos, cuánto tarda y qué hacer si algo llega mal.",
      en: "Where we ship, how long it takes and what to do if something arrives wrong.",
    },
    body: {
      es: [
        { type: "h2", text: "Cobertura" },
        { type: "p", text: "Enviamos a todo México. En varias zonas el envío es gratis según nuestra red de distribución; cuando no aplica, se cotiza con tu código postal. También hay entrega en puntos de venta autorizados en Guanajuato, Querétaro, Coahuila, San Luis Potosí, Baja California Sur, Estado de México y Ciudad de Guatemala." },
        { type: "h2", text: "Tiempos" },
        { type: "ul", items: [
          "El pedido se prepara en 1 a 2 días hábiles después de acreditarse el pago.",
          "La paquetería entrega normalmente en 2 a 7 días hábiles según la zona.",
          "Zonas extendidas (por ejemplo Baja California Sur) pueden tomar días adicionales; te avisamos al confirmar el pedido.",
        ] },
        { type: "h2", text: "Seguimiento" },
        { type: "p", text: "Al despachar tu pedido te mandamos la guía de rastreo por correo. El paquete pesa alrededor de 2 kg en una caja de 34 x 23 x 20 cm." },
        { type: "h2", text: "Si algo llega mal" },
        { type: "ul", items: [
          "Revisa el paquete al recibirlo. Si la caja llega visiblemente dañada, anótalo con el repartidor o rechaza la entrega.",
          "Reporta cualquier daño dentro de las 72 horas siguientes con fotos a ventas@hydroloop.com.mx o al WhatsApp 442 334 4455: reponemos sin costo.",
        ] },
      ],
      en: [
        { type: "h2", text: "Coverage" },
        { type: "p", text: "We ship across Mexico. In several zones shipping is free depending on our distribution network; when it does not apply we quote it with your postal code. Pickup is also available at authorized points of sale in Guanajuato, Querétaro, Coahuila, San Luis Potosí, Baja California Sur, Estado de México and Guatemala City." },
        { type: "h2", text: "Times" },
        { type: "ul", items: [
          "Orders are prepared within 1 to 2 business days after payment clears.",
          "Carriers usually deliver within 2 to 7 business days depending on the area.",
          "Extended zones (Baja California Sur, for example) can take additional days; we let you know when confirming the order.",
        ] },
        { type: "h2", text: "Tracking" },
        { type: "p", text: "When your order ships we email you the tracking number. The package weighs about 2 kg in a 34 x 23 x 20 cm box." },
        { type: "h2", text: "If something arrives wrong" },
        { type: "ul", items: [
          "Inspect the package on delivery. If the box is visibly damaged, note it with the courier or refuse the delivery.",
          "Report any damage within 72 hours with photos to ventas@hydroloop.com.mx or WhatsApp 442 334 4455: we replace at no cost.",
        ] },
      ],
    },
  },
];

export function findLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
