import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/** Used only at build time by scripts/prerender.mjs to turn each page into real HTML
 *  (French, the default language) so search engines and link previews see the content. */
export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
