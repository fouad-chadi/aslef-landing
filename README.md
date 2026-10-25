# Aslef — landing page

Marketing site for [aslef.app](https://aslef.app): React 19 + Vite + Tailwind CSS 4 + Framer Motion,
in French and Arabic (RTL). Deployed on Cloudflare (static assets from `dist/`, see `wrangler.jsonc`).

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check, build, then prerender the pages to static HTML
npm run preview   # serve the production build locally
npm run lint
```

`npm run build` does three things:

1. `vite build` builds the site into `dist/`.
2. `vite build --ssr src/entry-server.tsx` builds a small server bundle.
3. `scripts/prerender.mjs` renders `/` and `/inscription` (in French) into `dist/index.html` and
   `dist/inscription.html`, so search engines see real content. In the browser React picks up
   that HTML; visitors who chose Arabic get a fresh Arabic render.

## Where things live

| What | File |
| --- | --- |
| Page order | `src/pages/HomePage.tsx` |
| All text (French / Arabic) | `src/i18n/fr.ts`, `src/i18n/ar.ts` — every key must exist in both, the build fails otherwise |
| Hero live demo (éducatrice marks Yanis present, parent is notified) | `src/components/HeroDemo.tsx` |
| "Une journée à la crèche" scroll story | `src/components/DayStory.tsx` |
| App screens used by the demos | `src/components/demo/screens.tsx` |
| Phone and browser mockups | `src/components/demo/devices.tsx` |
| Download link, demo video | `src/lib/links.ts` |
| Fonts (self-hosted) | `src/fonts.ts` |
| Share image for WhatsApp / Facebook | `public/og-image.jpg` (1200×630) |

## Adding the demo video

The "Découvrez Aslef en vidéo" section is hidden until a video is set. In `src/lib/links.ts`:

```ts
export const DEMO_VIDEO_URL = '/aslef-demo.mp4';          // file in /public, a MinIO/Stream URL,
                                                          // or 'https://www.youtube-nocookie.com/embed/ID'
export const DEMO_VIDEO_POSTER = '/aslef-demo-poster.jpg'; // still image shown before playing
```

Keep the file light (H.264 MP4, 1080p, under ~15 MB for 60–90 s) and add French/Arabic subtitles.
