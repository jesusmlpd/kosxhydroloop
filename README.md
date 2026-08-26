# KOS x Hydroloop

Sitio de Hydroloop, cliente de KOS. Proyecto standalone: no comparte repo,
build ni deploy con ningun otro proyecto de la carpeta.

## Stack
Next.js 16 (App Router) + React 19 + Tailwind 4 + TypeScript, pnpm.
Bilingue es/en bajo `/[locale]`, con deteccion por cookie y Accept-Language en
`middleware.ts`. El sitio siempre abre en light mode y dark es solo el toggle.

## Comandos
```bash
pnpm dev      # localhost:3340
pnpm verify   # typecheck + lint + build
```

## Tienda
Carrito completo con drawer, cupones, inventario, envio y IVA, mas cuatro
mecanismos de urgencia (reloj de promocion, reserva del carrito de 15 minutos,
aviso de stock bajo y barra de envio gratis). Todo se prende y se apaga en
`lib/commerce.ts`.

El checkout tiene tres caminos: Stripe, Mercado Pago y pedido con confirmacion
por correo. El navegador manda **ids y cantidades**, nunca precios: los totales
se recalculan en el servidor antes de cobrar.

Sin llaves configuradas, en desarrollo el checkout corre una simulacion que no
cobra nada y lo avisa en pantalla. En produccion responde un error claro.

## Donde vive cada cosa
- `lib/site.ts`: datos del negocio y catalogo de productos
- `lib/dict/{es,en}.ts`: todo el copy del sitio
- `lib/metadata.ts`: canonical, hreflang y Open Graph por ruta
- `lib/schema.ts`: JSON-LD (Organization, WebSite, Product)
- `lib/commerce.ts`: reglas de la tienda y calculo de totales
- `lib/cart.ts`: carrito del navegador, persistido en localStorage
- `app/api/checkout`: los tres caminos de pago
- `app/api/webhooks`: confirmacion de Stripe y Mercado Pago
- `app/api/contact`: formulario, sale por FormSubmit

## Contenido
El contenido de producto es real y viene de hydroloop.com.mx (WooCommerce Store
API + paginas de WordPress), scrapeado el 2026-08-26. Las imagenes estan en
`public/media`, procesadas a webp desde su libreria de medios. Las resenas de
`lib/reviews.ts` son de muestra y estan marcadas como tal.

## Estado
Tienda funcional, PDP completo (galeria, calculadora de ahorro, opiniones, sellos
de confianza y formas de pago), home animado y blog con cinco articulos. Lo que
falta esta listado en [PLACEHOLDERS.md](PLACEHOLDERS.md).
