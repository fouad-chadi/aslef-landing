// Build step: render each page to static HTML and inject it into the built index.html.
// Runs after `vite build` (client) and `vite build --ssr src/entry-server.tsx` (server bundle).
//
//   dist/index.html        -> /             (also the fallback for unknown paths)
//   dist/inscription.html  -> /inscription  (Cloudflare serves it without a trailing-slash redirect)

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const serverEntry = resolve(root, 'dist-server/entry-server.js');
const template = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
const { render } = await import(pathToFileURL(serverEntry).href);

const SITE = 'https://aslef.app';

const pages = [
  { path: '/', out: 'dist/index.html' },
  {
    path: '/inscription',
    out: 'dist/inscription.html',
    title: 'Inscription — Aslef',
    description: 'Inscrivez votre crèche sur Aslef : remplissez le formulaire et nous vous recontactons rapidement pour finaliser votre inscription.',
  },
  {
    path: '/preinscription',
    out: 'dist/preinscription.html',
    title: 'Préinscription — Aslef',
    description: 'Préinscrivez votre enfant en quelques minutes depuis votre téléphone : la crèche vérifie votre demande puis crée votre espace famille sur Aslef.',
  },
];

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const page of pages) {
  const appHtml = render(page.path);
  if (!appHtml || appHtml.length < 1000) {
    throw new Error(`Prerender of ${page.path} produced suspiciously little HTML (${appHtml?.length ?? 0} chars).`);
  }

  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  if (page.title) {
    const url = `${SITE}${page.path}`;
    const title = escapeAttr(page.title);
    const description = escapeAttr(page.description);
    html = html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${title}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${description}$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${title}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${description}$2`)
      .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`);
  }

  const outPath = resolve(root, page.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`prerendered ${page.path.padEnd(14)} -> ${page.out} (${(html.length / 1024).toFixed(1)} kB)`);
}

// The server bundle is only needed during the build.
rmSync(resolve(root, 'dist-server'), { recursive: true, force: true });
