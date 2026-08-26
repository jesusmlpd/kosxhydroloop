# Pendientes de Hydroloop

El contenido de producto ya es **real**: se scrapeo de hydroloop.com.mx el
2026-08-26 (WooCommerce Store API + paginas de WordPress). Productos, SKUs,
precios con IVA, contenido del paquete, medidas, garantia, zonas de cobertura,
distribuidores, preguntas frecuentes e imagenes salen de ahi.

Lo que sigue pendiente:

## 1. Opiniones de clientes (importante)
- [ ] **Las resenas de `lib/reviews.ts` son de MUESTRA, no son reales.** El sitio
      actual no tiene ninguna publicada. Mientras `reviewsAreReal` siga en false,
      la seccion muestra un aviso y **no** se emite `aggregateRating` en el
      JSON-LD, para no mandarle estrellas inventadas a Google. Hay que
      reemplazarlas por opiniones reales antes de publicar.

## 2. Datos de contacto y marca
- [ ] Correo real de pedidos y `emailConfirmed: true` en `lib/site.ts`
- [ ] Telefono y WhatsApp de atencion
- [ ] Confirmar las URLs de Instagram y Facebook (hoy son suposicion)
- [ ] Dominio final (hoy apunta a la URL de Vercel)
- [ ] Logos oficiales de las formas de pago: los de `components/payment-badges.tsx`
      son representaciones simplificadas hechas a mano. Stripe y Mercado Pago
      publican kits oficiales.

## 3. Inventario y precios
- [ ] Inventario real por producto: WooCommerce solo publica si hay o no hay, asi
      que `stock` esta en 40 y 60 como valor de arranque. Esto alimenta el aviso
      de "quedan pocas piezas", que hoy no se dispara a proposito.
- [ ] Confirmar precio y fecha del modelo Bateria (hoy marcado como proximamente)
- [ ] Definir si la promo de arranque (`AGUA10`, 10%) va de verdad y con que
      fecha de fin. Esta en `lib/commerce.ts`.
- [ ] Costo de envio real y monto para envio gratis: hoy $299 y $5,000. El sitio
      actual dice que depende de la red de distribucion y del codigo postal.

## 4. Cobro
- [ ] Llaves de Stripe y Mercado Pago en `.env.local` (ver `.env.example`)
- [ ] Metodos de pago en el dashboard de Stripe: tarjeta, OXXO, SPEI y MSI se
      prenden ahi, no en el codigo. Apple Pay pide verificar el dominio y servir
      el archivo de asociacion en `/.well-known/`.
- [ ] Webhooks apuntados a `/api/webhooks/stripe` y `/api/webhooks/mercadopago`
- [ ] Base de datos de pedidos: hoy el pedido se avisa por correo y se escribe en
      el log, sin historial ni descuento automatico de inventario
- [ ] Firma `x-signature` del webhook de Mercado Pago
- [ ] Legales: terminos, privacidad, politica de envios y devoluciones

## 5. Calculadora de ahorro
Los valores por default reproducen las cifras publicadas por Hydroloop (7,300
litros y 18 horas al ano por persona) y todos son editables. El precio del agua
por metro cubico esta en 25 pesos, que es un promedio: conviene ajustarlo por
ciudad o dejar que el usuario lo cambie, como ya lo hace.

## 6. Contenido que falta traer del sitio actual
- [ ] Videos: hay dos MP4 en su libreria (funcionamiento y tutorial de
      instalacion) que valdria la pena comprimir e incluir
- [ ] Diagramas de instalacion en PDF y manuales de operacion
- [ ] Lista completa de distribuidores: en `lib/site.ts` estan los del estado de
      Guanajuato, Coahuila, San Luis Potosi, BCS y Estado de Mexico, mas falta el
      punto de Guatemala y los que no alcance a extraer
