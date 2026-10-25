import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container } from './ui/Container';
import { APP_DOWNLOAD_URL, DELETE_ACCOUNT_URL, PRIVACY_URL, WEB_APP_URL } from '../lib/links';
import { selectRole, type RoleKey } from '../lib/roles';
import logo from '../assets/logo.png';
import type { TranslationKey } from '../i18n/fr';

const socials = [
  { name: 'Facebook', href: 'https://www.facebook.com/share/1CtoWo2ee6/?mibextid=wwXIfr', icon: '/icons8-facebook-96.png' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@aslef.app?_r=1&_t=ZS-99bEOGjE2dj', icon: '/icons8-tiktok-94.png' },
  { name: 'Google', href: 'https://share.google/1LYFolZTBG4XwvBlZ', icon: '/icons8-location-94.png' },
] as const;

const linkClass =
  'inline-flex min-h-10 min-w-10 items-center text-[14.5px] text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)] focus-visible:text-[var(--color-ink)]';

export function Footer({ path = '/' }: { path?: string }) {
  const { t, lang, toggleLang } = useLanguage();
  const year = new Date().getFullYear();
  // Section anchors live on the home page: from /inscription they must go home first.
  const isHome = !['/inscription', '/preinscription'].includes(path.replace(/\/$/, ''));
  const anchor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  const columns: { titleKey: TranslationKey; links: { key: TranslationKey; href: string; role?: RoleKey }[] }[] = [
    {
      titleKey: 'footer.linksTitle',
      links: [
        { key: 'footer.link.manager', href: anchor('pour-qui'), role: 'manager' },
        { key: 'footer.link.educator', href: anchor('pour-qui'), role: 'educator' },
        { key: 'footer.link.parent', href: anchor('pour-qui'), role: 'parent' },
        { key: 'nav.about', href: anchor('a-propos') },
        { key: 'nav.faq', href: anchor('faq') },
        { key: 'nav.contact', href: anchor('contact') },
      ],
    },
    {
      titleKey: 'footer.appTitle',
      links: [
        { key: 'cta.register', href: '/inscription' },
        { key: 'footer.link.pre', href: '/preinscription' },
        { key: 'cta.android', href: APP_DOWNLOAD_URL },
        { key: 'footer.link.webApp', href: WEB_APP_URL },
      ],
    },
    {
      titleKey: 'footer.legalTitle',
      links: [
        { key: 'footer.legal.privacy', href: PRIVACY_URL },
        { key: 'footer.legal.deletion', href: DELETE_ACCOUNT_URL },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-paper)]">
      <Container className="py-14 sm:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <a href={isHome ? '#top' : '/'} className="inline-flex items-center gap-2 rounded-lg" aria-label={t('nav.homeAria')}>
              <img src={logo} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="font-brand text-[21px] font-semibold tracking-tight text-[var(--color-ink)]">Aslef</span>
            </a>
            <p className="mt-3 max-w-[280px] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{t('footer.tagline')}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={toggleLang}
                className="flex h-10 items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3.5 text-[13.5px] font-semibold text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-ink)]/25 hover:text-[var(--color-ink)]"
                aria-label={t('common.langAria')}
              >
                <Globe size={15} aria-hidden />
                <span lang={lang === 'fr' ? 'ar' : 'fr'}>{t('common.langSwitch')}</span>
              </button>
              <div className="flex items-center gap-1">
                {socials.map(({ name, href, icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-white"
                  >
                    <img src={icon} alt="" width={26} height={26} loading="lazy" className="h-[26px] w-[26px] object-contain" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.titleKey} aria-label={t(col.titleKey)}>
              <h2 className="aslef-eyebrow text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-ink)]">{t(col.titleKey)}</h2>
              <ul className="mt-4 space-y-1">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <a href={link.href} onClick={link.role ? () => selectRole(link.role!) : undefined} className={linkClass}>
                      {t(link.key)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-line)] pt-6 text-[13px] text-[var(--color-ink-soft)] sm:flex-row">
          <span>
            © {year} Aslef. {t('footer.rights')}
          </span>
          <span>{t('contact.location.value')}</span>
        </div>
      </Container>
    </footer>
  );
}
