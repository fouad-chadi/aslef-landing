import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import type { TranslationKey } from './i18n/fr';
import { RegistrationPage } from './pages/RegistrationPage';
import { PreRegistrationPage } from './pages/PreRegistrationPage';
import { PrivacyPage } from './pages/PrivacyPage';

/** Keeps the tab title and meta description in the visitor's language. The prerendered HTML
 *  carries the French values (scripts/prerender.mjs), so French visitors see no change. */
function DocumentMeta({ page }: { page: 'home' | 'register' | 'pre' | 'privacy' }) {
  const { t } = useLanguage();
  useEffect(() => {
    const [title, description] = {
      home: ['meta.title', 'meta.description'],
      register: ['meta.register.title', 'meta.register.description'],
      pre: ['meta.pre.title', 'meta.pre.description'],
      privacy: ['meta.privacy.title', 'meta.privacy.description'],
    }[page] as [TranslationKey, TranslationKey];
    document.title = t(title);
    document.querySelector('meta[name="description"]')?.setAttribute('content', t(description));
  }, [t, page]);
  return null;
}

/** `path` is only passed by the build-time prerender (scripts/prerender.mjs); in the browser the
 *  current location decides which page to show. */
function App({ path }: { path?: string }) {
  const currentPath = path ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  const cleanPath = currentPath.replace(/\/$/, '');
  const isRegistrationPage = cleanPath === '/inscription';
  const isPreRegistrationPage = cleanPath === '/preinscription';
  const isPrivacyPage = cleanPath === '/privacy';
  const page = isRegistrationPage ? 'register' : isPreRegistrationPage ? 'pre' : isPrivacyPage ? 'privacy' : 'home';

  return (
    // "user": visitors whose device asks for reduced motion still get the fades and the demos'
    // state changes, without movement (Framer Motion drops transforms, CSS stops the loops).
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <DocumentMeta page={page} />
        <SkipLink />
        <Navbar path={currentPath} />
        {isRegistrationPage ? <RegistrationPage /> : isPreRegistrationPage ? <PreRegistrationPage /> : isPrivacyPage ? <PrivacyPage /> : <HomePage />}
        <Footer path={currentPath} />
      </LanguageProvider>
    </MotionConfig>
  );
}

function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main"
      className="sr-only z-[60] rounded-full bg-[var(--color-ink)] px-4 py-2.5 text-[14px] font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-3"
    >
      {t('common.skip')}
    </a>
  );
}

export default App;
