import { getDict } from "@/lib/dict";
import { posts } from "@/lib/blog";
import { formatMoney } from "@/lib/commerce";
import { buyableProducts, coverage, site } from "@/lib/site";
import { loadStoreSettings } from "@/lib/store-settings-server";

/**
 * llms.txt: resumen del sitio para modelos de lenguaje y motores de respuesta.
 * Se genera desde lib/site, lib/dict y lib/blog para que nunca se desincronice
 * del catalogo ni del contenido real.
 */
export async function GET() {
  await loadStoreSettings();
  const dict = getDict("es");

  const productLines = buyableProducts
    .map((product) => {
      const copy = dict.products.items[product.slug as keyof typeof dict.products.items];
      return `- ${copy.name} (${formatMoney(product.priceCents, "es")} MXN, IVA incluido): ${copy.tagline}. ${site.url}/es/products/${product.slug}`;
    })
    .join("\n");

  const faqLines = dict.faq.items
    .map((item) => `### ${item.q}\n${item.a}`)
    .join("\n\n");

  const postLines = posts
    .map((post) => `- ${post.title.es}: ${site.url}/es/blog/${post.slug}`)
    .join("\n");

  const body = `# Hydroloop®

> Hydroloop® es un hidro-retorno mexicano: un dispositivo que evita el
> desperdicio de agua fría mientras esperas a que llegue la caliente en la
> regadera o el fregadero. Una bomba interna de 12 V regresa esa agua al
> calentador por el tubo de agua fría; un termostato de 40 grados apaga el
> equipo solo. Ahorra agua, tiempo y dinero. No ahorra gas.

Datos clave publicados por la marca:
- Ahorra hasta 50% del agua que se consume en la regadera
- 7,300 litros de agua al año por habitante de la casa
- 18 horas al año que se dejan de esperar
- Consume menos energía que un foco LED
- Vida útil de 20 años sin mantenimientos
- Compatible con cualquier tipo de calentador
- Hecho en México
- Garantía de 1 año, y de 2 años con instalación certificada

Sitio bilingüe: ${site.url}/es (español) y ${site.url}/en (inglés).

## Productos
${productLines}
- Hydroloop® Batería (próximamente): versión de batería recargable para baños sin toma de corriente. ${site.url}/es/products/hydroloop-bateria

## Páginas
- Inicio y cómo funciona: ${site.url}/es
- Tienda: ${site.url}/es/products
- Blog: ${site.url}/es/blog
- Nosotros: ${site.url}/es/about
- Contacto y distribuidores: ${site.url}/es/contact

## Artículos del blog
${postLines}

## Cobertura de instalación certificada
${coverage.map((zone) => `- ${zone.zone === "norte" ? "Zona norte" : "Zona centro"}: ${zone.cities.join(", ")}`).join("\n")}

## Preguntas frecuentes

${faqLines}

## Compra y pagos
Pagos con tarjeta de crédito y débito, Apple Pay, Google Pay, meses sin
intereses, OXXO, SPEI y transferencia. En puntos de venta autorizados también
en efectivo. Envío gratis a todo México.
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
