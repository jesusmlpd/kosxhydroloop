import { locales } from "@/lib/i18n";
import { products, site } from "@/lib/site";

/**
 * llms.txt: resumen legible para modelos de lenguaje. Se genera de lib/site
 * para que nunca se desincronice del catalogo real.
 */
export function GET() {
  const body = `# ${site.name}

> ${site.name} disena, instala y da mantenimiento a sistemas de tratamiento y reuso de agua.

Sitio bilingue: ${locales.map((locale) => `${site.url}/${locale}`).join(", ")}

## Paginas
- Inicio: ${site.url}/es
- Productos: ${site.url}/es/products
- Nosotros: ${site.url}/es/about
- Contacto: ${site.url}/es/contact

## Catalogo
${products
  .map((product) => `- ${product.slug}: ${site.url}/es/products/${product.slug}`)
  .join("\n")}

## Contacto
- Correo: ${site.email}
- Ubicacion: ${site.city}

## Nota
Sitio en construccion. Parte del contenido es de arranque y sera reemplazado por
informacion verificada del cliente.
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
