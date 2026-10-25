// Self-hosted fonts (bundled by Vite) instead of a render-blocking Google Fonts @import.
// Only the weights the site actually uses are loaded; each file carries a unicode-range,
// so the Arabic files are downloaded only when Arabic text is on screen.

// Latin - body (Plus Jakarta Sans), display titles (Sora), "Aslef" wordmark (Fredoka)
import '@fontsource/plus-jakarta-sans/latin-400.css';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/sora/latin-600.css';
import '@fontsource/sora/latin-700.css';
import '@fontsource/fredoka/latin-600.css';

// Arabic - Tajawal for both body text and display titles
import '@fontsource/tajawal/arabic-400.css';
import '@fontsource/tajawal/arabic-500.css';
import '@fontsource/tajawal/arabic-700.css';
import '@fontsource/tajawal/arabic-800.css';
