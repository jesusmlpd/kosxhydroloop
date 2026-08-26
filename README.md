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

## Donde vive cada cosa
- `lib/site.ts`: datos del negocio y catalogo de productos
- `lib/dict/{es,en}.ts`: todo el copy del sitio
- `lib/metadata.ts`: canonical, hreflang y Open Graph por ruta
- `lib/schema.ts`: JSON-LD (Organization, WebSite, Product)
- `app/api/contact`: formulario, sale por FormSubmit

## Estado
Build generico con contenido de arranque. Lo que falta esta listado en
[PLACEHOLDERS.md](PLACEHOLDERS.md).
