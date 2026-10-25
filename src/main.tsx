import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './fonts'
import './index.css'
import App from './App.tsx'
import { LANG_STORAGE_KEY } from './context/LanguageContext'

// Lets CSS apply states that only make sense once the page is interactive (see .aslef-dim).
document.documentElement.classList.add('js')

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The build prerenders each page in French (see scripts/prerender.mjs). Hydrate that HTML when
// the visitor will also see French; a visitor who chose Arabic gets a fresh render instead,
// so React never tries to match Arabic text against the French markup.
let storedLang: string | null = null
try {
  storedLang = window.localStorage.getItem(LANG_STORAGE_KEY)
} catch {
  storedLang = null
}

if (container.hasChildNodes() && storedLang !== 'ar') {
  hydrateRoot(container, app)
} else {
  container.textContent = ''
  createRoot(container).render(app)
}
