import "../globals.css";

/**
 * El panel vive fuera del arbol /[locale], asi que trae su propio layout
 * raiz: html y body minimos con los estilos globales, siempre en claro.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
