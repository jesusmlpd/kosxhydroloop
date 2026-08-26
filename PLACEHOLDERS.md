# Pendientes de Hydroloop

Todo el contenido de este sitio es de arranque. Nada de lo que dice aqui viene
del cliente todavia, asi que hay que reemplazarlo antes de ensenarlo como algo
definitivo.

## 1. Datos duros (`lib/site.ts`)
- [ ] Razon social y nombre comercial correcto
- [ ] Correo real, telefono y WhatsApp
- [ ] Ano de fundacion, ciudad y direccion
- [ ] Dominio final (hoy apunta a la URL de Vercel)
- [ ] Redes sociales reales

## 2. Marca (`public/brand/`, `components/logo.tsx`)
- [ ] Logo en SVG, version clara y version oscura
- [ ] Paleta real (hoy es azul/teal de arranque en `app/globals.css`)
- [ ] Tipografia definitiva (hoy Sora + Inter)
- [ ] Favicon y OG image

## 3. Copy (`lib/dict/es.ts` y `lib/dict/en.ts`)
- [ ] Hero, propuesta de valor y proceso
- [ ] Historia real en `about.body` (hoy dice TODO)
- [ ] Numeros de `stats`: hoy son inventados y no se pueden publicar asi
- [ ] Nombres, fichas tecnicas y precios reales de cada producto

## 4. Catalogo (`lib/site.ts` -> `products`)
- [ ] Productos reales con SKU, precio y moneda
- [ ] Fotos de producto (hoy hay un SVG generico)
- [ ] Definir que se vende en linea y que se cotiza

## 5. Formulario
- [ ] Definir correo destino y activar FormSubmit dando clic al mail de
      "Activate Form" que llega en el primer envio. Se activa por origen:
      produccion y localhost se activan por separado.

## 6. Claude Commerce
- [ ] Conectar el checkout en la pagina de producto. Ya esta el lugar marcado en
      `app/[locale]/products/[slug]/page.tsx` y el modelo de datos en
      `lib/site.ts` trae id, precio en centavos y moneda para no rehacerlo.
