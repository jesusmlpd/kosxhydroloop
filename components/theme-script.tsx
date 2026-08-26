/**
 * Corre antes del primer paint. El sitio SIEMPRE abre en light: dark solo
 * existe si el usuario lo eligio con el toggle y quedo en localStorage.
 * No se consulta prefers-color-scheme a proposito.
 */
const script = `(function(){try{var s=localStorage.getItem('hydroloop-theme');document.documentElement.dataset.theme=s==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
