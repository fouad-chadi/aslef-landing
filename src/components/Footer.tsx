import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container } from './ui/Container';
import logo from '../assets/logo.png';

const socials = [
  { name: 'Facebook', href: 'https://www.facebook.com/share/1CtoWo2ee6/?mibextid=wwXIfr', icon: '/icons8-facebook-96.png' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@aslef.app?_r=1&_t=ZS-99bEOGjE2dj', icon: '/icons8-tiktok-94.png' },
  { name: 'Google', href: 'https://share.google/1LYFolZTBG4XwvBlZ', icon: '/icons8-location-94.png' },
] as const;

export function Footer() {
  const { t, lang, toggleLang } = useLanguage();
  const year = new Date().getFullYear();

  const links = [
    { key: 'footer.link.manager', href: '#pour-qui' },
    { key: 'footer.link.educator', href: '#pour-qui' },
    { key: 'footer.link.parent', href: '#pour-qui' },
    { key: 'footer.link.faq', href: '#faq' },
    { key: 'footer.link.contact', href: '#contact' },
  ] as const;

  const legal = [
    { key: 'footer.legal.privacy', href: '#' },
    { key: 'footer.legal.terms', href: '#' },
    { key: 'footer.legal.deletion', href: '#' },
  ] as const;

  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <Container className="py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2" aria-label="Aslef, accueil">
              <img src={logo} alt="Aslef" className="h-9 w-9 object-contain" />
              <span className="font-brand text-xl font-semibold tracking-tight text-[var(--color-ink)]">Aslef</span>
            </a>
            <p className="mt-3 max-w-[260px] text-[14px] text-[var(--color-ink-soft)]">{t('footer.tagline')}</p>

            <button
              type="button"
              onClick={toggleLang}
              className="mt-6 flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-2 text-[13px] font-semibold text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-aslef-blue)] hover:text-[var(--color-aslef-blue)]"
              aria-label={lang === 'fr' ? 'Passer en arabe' : 'التبديل إلى الفرنسية'}
            >
              <Globe size={14} aria-hidden />
              {lang === 'fr' ? 'FR / AR' : 'AR / FR'}
            </button>

            <div className="mt-5 flex items-center justify-center gap-2.5 sm:justify-start">
              {socials.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex items-center justify-center transition-opacity hover:opacity-75"
                >
                  <img src={icon} alt="" className="h-8 w-8 object-contain" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[12.5px] font-bold uppercase tracking-wide text-[var(--color-ink-soft)]">{t('footer.linksTitle')}</h3>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className="text-[14.5px] text-[var(--color-ink-soft)] hover:text-[var(--color-aslef-blue)] transition-colors">
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[12.5px] font-bold uppercase tracking-wide text-[var(--color-ink-soft)]">{t('footer.legalTitle')}</h3>
            <ul className="mt-4 space-y-2.5">
              {legal.map((item) => (
                <li key={item.key}>
                  <a href={item.href} className="text-[14.5px] text-[var(--color-ink-soft)] hover:text-[var(--color-aslef-blue)] transition-colors">
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--color-border)] pt-6 text-center text-[13px] text-[var(--color-ink-soft)]">
          © {year} Aslef. {t('footer.rights')}
        </div>
      </Container>
    </footer>
  );
}
