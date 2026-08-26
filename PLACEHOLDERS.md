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

## 6. Tienda y cobro
El carrito, la urgencia y el checkout ya funcionan completos. Lo que falta es
todo lo que depende de una cuenta o de un dato del cliente:

- [ ] **Llaves de pago** en `.env.local` (ver `.env.example`). Sin ellas, en
      desarrollo el checkout corre una simulacion que no cobra y lo dice en
      pantalla; en produccion responde error.
- [ ] **Metodos de pago en el dashboard de Stripe**: tarjeta, OXXO, SPEI y MSI
      se prenden ahi, no en el codigo. Apple Pay pide ademas verificar el
      dominio y servir el archivo de asociacion en `/.well-known/`.
- [ ] **Webhooks**: apuntar Stripe a `/api/webhooks/stripe` y Mercado Pago a
      `/api/webhooks/mercadopago`, y pegar los secretos.
- [ ] **Buzon de pedidos**: `FORMSUBMIT_TO` o poner `emailConfirmed: true` en
      `lib/site.ts` cuando el correo sea real. Mientras siga en false, ningun
      pedido ni mensaje intenta enviarse, a proposito.
- [ ] **Precios, inventario y nombres reales** en `lib/site.ts`.
- [ ] **Reglas de la tienda** en `lib/commerce.ts`: costo de envio, monto para
      envio gratis, IVA, minutos de reserva, fecha de fin de promo y cupones.
- [ ] **Base de datos de pedidos**: hoy el pedido se avisa por correo y se
      escribe en el log. No hay historial ni descuento de inventario
      automatico. Los webhooks tienen marcado el lugar donde entraria.
- [ ] **Firma del webhook de Mercado Pago**: falta validar `x-signature`.
- [ ] **Legales**: terminos, privacidad, politica de envios y devoluciones.
      Un checkout en produccion los necesita.
