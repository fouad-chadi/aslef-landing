import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Check, Users2, GraduationCap, Heart, Bus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { SectionHeading } from './ui/Heading';
import { ArrowIcon, Button } from './ui/Button';
import { Browser, Phone } from './demo/devices';
import { DashboardScreen, EducatorAutoScreen, ReportScreen, TransportScreen } from './demo/screens';
import { ROLE_EVENT, type RoleKey } from '../lib/roles';
import type { TranslationKey } from '../i18n/fr';

type Accent = 'blue' | 'green' | 'coral' | 'yellow';

interface RoleCard {
  key: RoleKey;
  icon: typeof Users2;
  accent: Accent;
  tabKey: TranslationKey;
  titleKey: TranslationKey;
  items: TranslationKey[];
}

const roles: RoleCard[] = [
  {
    key: 'parent',
    icon: Heart,
    accent: 'coral',
    tabKey: 'roles.parent.tab',
    titleKey: 'roles.parent.title',
    items: [
      'roles.parent.item.1',
      'roles.parent.item.2',
      'roles.parent.item.3',
      'roles.parent.item.4',
      'roles.parent.item.5',
      'roles.parent.item.6',
      'roles.parent.item.7',
      'roles.parent.item.8',
      'roles.parent.item.9',
    ],
  },
  {
    key: 'educator',
    icon: GraduationCap,
    accent: 'green',
    tabKey: 'roles.educator.tab',
    titleKey: 'roles.educator.title',
    items: ['roles.educator.item.1', 'roles.educator.item.2', 'roles.educator.item.3', 'roles.educator.item.4', 'roles.educator.item.5', 'roles.educator.item.6'],
  },
  {
    key: 'transport',
    icon: Bus,
    accent: 'yellow',
    tabKey: 'roles.transport.tab',
    titleKey: 'roles.transport.title',
    items: ['roles.transport.item.1', 'roles.transport.item.2', 'roles.transport.item.3', 'roles.transport.item.4'],
  },
  {
    key: 'manager',
    icon: Users2,
    accent: 'blue',
    tabKey: 'roles.manager.tab',
    titleKey: 'roles.manager.title',
    items: ['roles.manager.item.1', 'roles.manager.item.2', 'roles.manager.item.3', 'roles.manager.item.4', 'roles.manager.item.5', 'roles.manager.item.6', 'roles.manager.item.7'],
  },
];

// Every pair below keeps text readable (at least 4.5:1) - the brand yellow carries dark ink, never white.
const accentStyles: Record<Accent, { pill: string; activeText: string; soft: string; ink: string; glow: string }> = {
  blue: {
    pill: 'bg-[var(--color-aslef-blue)]',
    activeText: 'text-white',
    soft: 'bg-[var(--color-aslef-blue-light)]',
    ink: 'text-[var(--color-aslef-blue-dark)]',
    glow: 'rgba(23,134,206,0.16)',
  },
  green: {
    pill: 'bg-[var(--color-aslef-green-dark)]',
    activeText: 'text-white',
    soft: 'bg-[var(--color-aslef-green-light)]',
    ink: 'text-[var(--color-aslef-green-dark)]',
    glow: 'rgba(69,184,90,0.16)',
  },
  coral: {
    pill: 'bg-[#C24A2C]',
    activeText: 'text-white',
    soft: 'bg-[#FCEDE7]',
    ink: 'text-[#B0421F]',
    glow: 'rgba(224,96,63,0.14)',
  },
  yellow: {
    pill: 'bg-[var(--color-aslef-yellow)]',
    activeText: 'text-[var(--color-ink)]',
    soft: 'bg-[var(--color-aslef-yellow-light)]',
    ink: 'text-[var(--color-aslef-yellow-ink)]',
    glow: 'rgba(255,181,27,0.18)',
  },
};

function RoleDevice({ roleKey }: { roleKey: string }) {
  if (roleKey === 'manager') {
    return (
      <div className="aslef-zoom-wide">
        <Browser className="w-[520px]">
          <DashboardScreen />
        </Browser>
      </div>
    );
  }
  const screen = roleKey === 'educator' ? <EducatorAutoScreen /> : roleKey === 'parent' ? <ReportScreen /> : <TransportScreen />;
  const time = roleKey === 'educator' ? '07:41' : roleKey === 'parent' ? '17:34' : '07:16';
  return (
    <div className="aslef-device-zoom">
      <Phone time={time}>{screen}</Phone>
    </div>
  );
}

export function Roles() {
  const { t } = useLanguage();
  const [activeKey, setActiveKey] = useState<RoleKey>(roles[0].key);
  // Links elsewhere on the page ("Pour qui ?" in the navbar, footer role links) pick the tab.
  useEffect(() => {
    const onSelect = (e: Event) => setActiveKey((e as CustomEvent<RoleKey>).detail);
    window.addEventListener(ROLE_EVENT, onSelect);
    return () => window.removeEventListener(ROLE_EVENT, onSelect);
  }, []);
  const active = roles.find((r) => r.key === activeKey) ?? roles[0];
  const style = accentStyles[active.accent];
  const ActiveIcon = active.icon;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Mount the device only once the section is on screen, so its animation plays when seen.
  const deviceRef = useRef<HTMLDivElement>(null);
  const deviceSeen = useInView(deviceRef, { once: true, amount: 0.3 });

  // Arrow keys move between tabs (WAI-ARIA tabs pattern); in Arabic the visual order is mirrored.
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rtl = document.documentElement.dir === 'rtl';
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, Home: -index, End: roles.length - 1 - index }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const next = (index + step + roles.length) % roles.length;
    setActiveKey(roles[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section id="pour-qui" background="paper">
      <Container>
        <SectionHeading eyebrow={t('nav.forWho')} title={t('roles.headline')} sub={t('roles.sub')} />

        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label={t('roles.headline')}
            className="grid w-full max-w-[560px] grid-cols-2 gap-1 rounded-[1.4rem] border border-[var(--color-line)] bg-white p-1.5 shadow-[0_1px_2px_rgba(18,39,58,0.05)] md:flex md:w-auto md:max-w-none md:rounded-full"
          >
            {roles.map((role, i) => {
              const Icon = role.icon;
              const isActive = role.key === activeKey;
              const s = accentStyles[role.accent];
              return (
                <button
                  key={role.key}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`role-tab-${role.key}`}
                  aria-selected={isActive}
                  aria-controls="role-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveKey(role.key)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`relative flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[14.5px] font-bold transition-colors duration-300 sm:px-5 ${
                    isActive ? s.activeText : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="role-pill"
                      aria-hidden
                      className={`absolute inset-0 rounded-full ${s.pill} shadow-[0_6px_16px_-8px_rgba(18,39,58,0.45)]`}
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  <Icon size={17} aria-hidden className="relative" />
                  <span className="relative">{t(role.tabKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="role-panel"
          role="tabpanel"
          aria-labelledby={`role-tab-${active.key}`}
          className="relative mt-10 grid grid-cols-1 items-center gap-10 lg:mt-6 lg:grid-cols-2 lg:gap-16"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:text-start"
            >
              <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-bold ${style.soft} ${style.ink}`}>
                <ActiveIcon size={15} aria-hidden />
                {t(active.tabKey)}
              </span>

              <h3 className="aslef-display mx-auto mt-5 max-w-[480px] text-[26px] font-bold leading-[1.18] text-[var(--color-ink)] sm:text-[32px] lg:mx-0">
                {t(active.titleKey)}
              </h3>

              <ul className="mx-auto mt-8 grid max-w-[520px] grid-cols-1 gap-x-8 gap-y-3.5 text-start sm:grid-cols-2 lg:mx-0">
                {active.items.map((itemKey, i) => (
                  <motion.li
                    key={itemKey}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.035, duration: 0.3 }}
                    className="flex items-center gap-3 text-[15.5px] text-[var(--color-ink)]"
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style.soft} ${style.ink}`}>
                      <Check size={13} strokeWidth={3} aria-hidden />
                    </span>
                    {t(itemKey)}
                  </motion.li>
                ))}
              </ul>

              {/* Parents get a direct way in: they can pre-register their child without any account. */}
              {active.key === 'parent' && (
                <div className="mt-8 flex flex-col items-center gap-2 lg:items-start">
                  <Button as="a" href="/preinscription" size="md">
                    {t('pre.cta')}
                    <ArrowIcon />
                  </Button>
                  <p className="text-[13px] text-[var(--color-ink-soft)]">{t('pre.ctaNote')}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Live preview of that role's main screen */}
          <div ref={deviceRef} aria-hidden className="relative flex min-h-[360px] items-center justify-center lg:min-h-[530px]">
            <motion.div
              className="pointer-events-none absolute inset-0 m-auto h-[440px] w-[min(440px,100%)] rounded-full bg-[radial-gradient(circle,currentColor,transparent_66%)]"
              animate={{ color: style.glow }}
              transition={{ duration: 0.6 }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.key}
                className="relative"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {deviceSeen && <RoleDevice roleKey={active.key} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  );
}
