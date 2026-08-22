import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import logo from '../assets/logo.png';
import type { TranslationKey } from '../i18n/fr';

const NAV_LINKS: { key: TranslationKey; href: string }[] = [
  { key: 'nav.features', href: '#fonctionnalites' },
  { key: 'nav.how', href: '#comment-ca-marche' },
  { key: 'nav.about', href: '#a-propos' },
  { key: 'nav.contact', href: '#contact' },
];

export function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-[0_1px_0_var(--color-border),0_8px_24px_-16px_rgba(23,43,58,0.25)]' : 'bg-white/60 backdrop-blur-sm'
      }`}
    >
      <Container>
        <nav className="flex h-[72px] items-center justify-between py-3.5" aria-label="Navigation principale">
          <a href="#top" className="group flex items-center gap-2 shrink-0" aria-label="Aslef, accueil">
            <img src={logo} alt="Aslef" className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
            <span className="font-brand text-xl font-semibold tracking-tight text-[var(--color-ink)]">Aslef</span>
          </a>

          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  className="group relative rounded-full px-4 py-2 text-[14.5px] font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]"
                >
                  {t(link.key)}
                  <span className="absolute inset-x-4 -bottom-0.5 h-[2px] scale-x-0 rounded-full bg-[linear-gradient(90deg,var(--color-aslef-blue),var(--color-aslef-green))] transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-2 text-[13.5px] font-semibold text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-aslef-blue)] hover:text-[var(--color-aslef-blue)]"
              aria-label={lang === 'fr' ? 'Passer en arabe' : 'التبديل إلى الفرنسية'}
            >
              <Globe size={15} aria-hidden />
              {lang === 'fr' ? 'AR' : 'FR'}
            </button>
            <a href="#contact" className="text-[14.5px] font-semibold text-[var(--color-ink)] hover:text-[var(--color-aslef-blue)] transition-colors px-2">
              {t('nav.login')}
            </a>
            <Button as="a" href="#contact" size="md">
              {t('nav.demo')}
            </Button>
          </div>

          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </Container>
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2.5px] origin-left bg-[linear-gradient(90deg,var(--color-aslef-blue),var(--color-aslef-green))]"
        style={{ scaleX }}
      />
    </header>

      {/* Rendered as a sibling of <header>, not a child - <header> has backdrop-blur (a
          backdrop-filter), which creates a CSS containing block for fixed-position descendants
          and would otherwise confine this panel to the 72px header box instead of the viewport. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-40 bg-white overflow-y-auto"
          >
            <Container className="flex flex-col gap-1 py-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3.5 text-[17px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]"
                >
                  {t(link.key)}
                </a>
              ))}
              <div className="my-3 h-px bg-[var(--color-border)]" />
              <button
                type="button"
                onClick={() => {
                  toggleLang();
                }}
                className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-[17px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]"
              >
                <Globe size={18} aria-hidden />
                {t('common.langSwitch')}
              </button>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3.5 text-[17px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]">
                {t('nav.login')}
              </a>
              <div className="mt-3">
                <Button as="a" href="#contact" size="lg" className="w-full" onClick={() => setMobileOpen(false)}>
                  {t('nav.demo')}
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
