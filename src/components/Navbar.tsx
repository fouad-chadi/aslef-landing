import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Download, Globe, LogIn, Menu, UsersRound, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container } from './ui/Container';
import { ArrowIcon, Button } from './ui/Button';
import { APP_DOWNLOAD_URL, WEB_APP_URL } from '../lib/links';
import { selectRole } from '../lib/roles';
import logo from '../assets/logo.png';
import type { TranslationKey } from '../i18n/fr';

const NAV_LINKS: { key: TranslationKey; id: string }[] = [
  { key: 'nav.forWho', id: 'pour-qui' },
  { key: 'nav.how', id: 'comment-ca-marche' },
  { key: 'nav.day', id: 'journee' },
  { key: 'nav.faq', id: 'faq' },
  { key: 'nav.contact', id: 'contact' },
];

/** Which home-page section is in the middle of the viewport (for the active nav pill). */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [enabled]);
  return active;
}

export function Navbar({ path = '/' }: { path?: string }) {
  const { t, lang, toggleLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });

  // Section anchors only exist on the home page - from any other page (e.g. /inscription),
  // prefix them so the browser navigates home first instead of doing nothing.
  const isHome = !['/inscription', '/preinscription'].includes(path.replace(/\/$/, ''));
  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);
  const active = useActiveSection(isHome);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);
  // "Pour qui ?" always opens the section on the Parent tab.
  const onNavClick = (id: string) => {
    if (id === 'pour-qui') selectRole('parent');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-[background-color,box-shadow] duration-300 ${
          scrolled || mobileOpen
            ? 'bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md'
            : 'bg-[var(--color-paper)]/70 backdrop-blur-sm'
        }`}
      >
        <Container>
          <nav className="flex h-[68px] items-center justify-between gap-2 xl:gap-4" aria-label={t('nav.mainAria')}>
            <a href={isHome ? '#top' : '/'} className="group flex shrink-0 items-center gap-2 rounded-lg" aria-label={t('nav.homeAria')}>
              <img
                src={logo}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 object-contain transition-transform duration-500 ease-out group-hover:-rotate-6"
              />
              <span className="font-brand text-[21px] font-semibold tracking-tight text-[var(--color-ink)]">Aslef</span>
            </a>

            <ul className="hidden items-center gap-0.5 lg:flex">
              {NAV_LINKS.map((link) => {
                const isActive = isHome && active === link.id;
                return (
                  <li key={link.id} className="relative">
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-[var(--color-paper-deep)]"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    )}
                    <a
                      href={hrefFor(link.id)}
                      onClick={() => onNavClick(link.id)}
                      aria-current={isActive ? 'true' : undefined}
                      // z-10: the sliding pill lives in the newly active <li> and must never paint
                      // over a neighbouring label while it travels.
                      className={`relative z-10 block whitespace-nowrap rounded-full px-2.5 py-2 text-[14.5px] font-medium transition-colors xl:px-4 ${
                        isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                      }`}
                    >
                      {t(link.key)}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="hidden items-center gap-1.5 lg:flex xl:gap-2">
              <button
                type="button"
                onClick={toggleLang}
                className="flex h-10 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-semibold text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-paper-deep)] hover:text-[var(--color-ink)]"
                aria-label={t('common.langAria')}
              >
                <Globe size={15} aria-hidden />
                {/* Short code on small laptops, where the Arabic nav labels need the room. */}
                <span className="xl:hidden">{lang === 'fr' ? 'AR' : 'FR'}</span>
                <span lang={lang === 'fr' ? 'ar' : 'fr'} className="hidden xl:inline">
                  {t('common.langSwitch')}
                </span>
              </button>
              <a
                href={WEB_APP_URL}
                className="flex h-10 items-center whitespace-nowrap rounded-full px-3 text-[14.5px] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-deep)]"
              >
                {t('nav.login')}
              </a>
              <Button as="a" href="/inscription" size="md" className="ms-1">
                {t('cta.register')}
              </Button>
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-deep)] lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? t('nav.menuClose') : t('nav.menuOpen')}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'x' : 'menu'}
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.15 }}
                  className="flex"
                >
                  {mobileOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
                </motion.span>
              </AnimatePresence>
            </button>
          </nav>
        </Container>
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[linear-gradient(90deg,var(--color-aslef-blue),var(--color-aslef-green))] rtl:origin-right"
          style={{ scaleX }}
        />
      </header>

      {/* Rendered as a sibling of <header>, not a child - <header> has backdrop-blur (a
          backdrop-filter), which creates a CSS containing block for fixed-position descendants
          and would otherwise confine this panel to the header box instead of the viewport. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 top-[68px] z-40 overflow-y-auto bg-white lg:hidden"
          >
            <Container className="flex min-h-full flex-col py-5">
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } } }}
                className="flex flex-col"
              >
                {NAV_LINKS.map((link) => (
                  <motion.li
                    key={link.id}
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    className="border-b border-[var(--color-line)]"
                  >
                    <a
                      href={hrefFor(link.id)}
                      onClick={() => {
                        onNavClick(link.id);
                        close();
                      }}
                      className="aslef-display flex items-center justify-between py-4 text-[22px] font-semibold text-[var(--color-ink)]"
                    >
                      {t(link.key)}
                      <span className="text-[var(--color-ink-soft)]/50">
                        <ArrowIcon size={18} />
                      </span>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={toggleLang}
                  aria-label={t('common.langAria')}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--color-line)] text-[15px] font-semibold text-[var(--color-ink)]"
                >
                  <Globe size={17} aria-hidden />
                  {t('common.langSwitch')}
                </button>
                <a
                  href={WEB_APP_URL}
                  onClick={close}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--color-line)] text-[15px] font-semibold text-[var(--color-ink)]"
                >
                  <LogIn size={17} aria-hidden className="rtl:-scale-x-100" />
                  {t('nav.login')}
                </a>
              </div>

              <div className="mt-auto flex flex-col gap-2.5 pt-8">
                <Button as="a" href="/inscription" size="lg" className="w-full" onClick={close}>
                  {t('cta.register')}
                  <ArrowIcon />
                </Button>
                <Button as="a" href={APP_DOWNLOAD_URL} variant="secondary" size="lg" className="w-full" onClick={close}>
                  <Download size={17} aria-hidden />
                  {t('cta.android')}
                </Button>
                <Button as="a" href="/preinscription" variant="secondary" size="lg" className="w-full" onClick={close}>
                  <UsersRound size={17} aria-hidden />
                  {t('pre.cta')}
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
