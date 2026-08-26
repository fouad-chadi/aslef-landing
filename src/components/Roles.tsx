import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Users2, GraduationCap, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { fadeInUp, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

interface RoleCard {
  key: string;
  icon: typeof Users2;
  accent: 'blue' | 'green' | 'purple';
  tabKey: TranslationKey;
  titleKey: TranslationKey;
  items: TranslationKey[];
  ctaKey: TranslationKey;
}

const roles: RoleCard[] = [
  {
    key: 'manager',
    icon: Users2,
    accent: 'blue',
    tabKey: 'roles.manager.tab',
    titleKey: 'roles.manager.title',
    items: [
      'roles.manager.item.1',
      'roles.manager.item.2',
      'roles.manager.item.3',
      'roles.manager.item.4',
      'roles.manager.item.5',
      'roles.manager.item.6',
      'roles.manager.item.7',
    ],
    ctaKey: 'roles.manager.cta',
  },
  {
    key: 'educator',
    icon: GraduationCap,
    accent: 'green',
    tabKey: 'roles.educator.tab',
    titleKey: 'roles.educator.title',
    items: [
      'roles.educator.item.1',
      'roles.educator.item.2',
      'roles.educator.item.3',
      'roles.educator.item.4',
      'roles.educator.item.5',
      'roles.educator.item.6',
    ],
    ctaKey: 'roles.educator.cta',
  },
  {
    key: 'parent',
    icon: Heart,
    accent: 'purple',
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
    ],
    ctaKey: 'roles.parent.cta',
  },
];

const accentStyles = {
  blue: {
    tabActive: 'bg-[var(--color-aslef-blue)] text-white shadow-[var(--shadow-card)]',
    tabInactive: 'bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]',
    badge: 'bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]',
    check: 'text-[var(--color-aslef-blue)]',
    button: 'bg-[var(--color-aslef-blue)] hover:brightness-[1.06]',
    bar: 'bg-[var(--color-aslef-blue)]',
  },
  green: {
    tabActive: 'bg-[var(--color-aslef-green)] text-white shadow-[var(--shadow-card)]',
    tabInactive: 'bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green)]',
    badge: 'bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green)]',
    check: 'text-[var(--color-aslef-green)]',
    button: 'bg-[var(--color-aslef-green)] hover:brightness-[1.06]',
    bar: 'bg-[var(--color-aslef-green)]',
  },
  purple: {
    tabActive: 'bg-[#7C3AED] text-white shadow-[var(--shadow-card)]',
    tabInactive: 'bg-[#F3EEFE] text-[#7C3AED]',
    badge: 'bg-[#F3EEFE] text-[#7C3AED]',
    check: 'text-[#7C3AED]',
    button: 'bg-[#7C3AED] hover:brightness-[1.06]',
    bar: 'bg-[#7C3AED]',
  },
} as const;

export function Roles() {
  const { t } = useLanguage();
  const [activeKey, setActiveKey] = useState(roles[0].key);
  const active = roles.find((r) => r.key === activeKey) ?? roles[0];
  const style = accentStyles[active.accent];
  const ActiveIcon = active.icon;

  return (
    <Section id="pour-qui" background="white">
      <Container>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp} className="mx-auto max-w-[640px] text-center">
          <span className={`mx-auto block h-1 w-10 rounded-full transition-colors duration-300 ${style.bar}`} />
          <h2 className="mt-5 text-[26px] sm:text-[34px] font-brand font-semibold tracking-tight text-[var(--color-ink)]">
            {t('roles.headline')}
          </h2>
          <p className="mt-3 text-[15.5px] text-[var(--color-ink-soft)]">{t('roles.sub')}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = role.key === activeKey;
            const s = accentStyles[role.accent];
            return (
              <button
                key={role.key}
                type="button"
                onClick={() => setActiveKey(role.key)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[14.5px] font-bold transition-all duration-300 ${isActive ? s.tabActive : `${s.tabInactive} hover:brightness-95`}`}
              >
                <Icon size={17} aria-hidden />
                {t(role.tabKey)}
              </button>
            );
          })}
        </motion.div>

        <div className="relative mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-bold ${style.badge}`}>
                <ActiveIcon size={15} aria-hidden />
                {t(active.tabKey)}
              </span>

              <h3 className="mt-5 text-[24px] sm:text-[28px] font-bold leading-snug text-[var(--color-ink)]">{t(active.titleKey)}</h3>

              <ul className="mt-7 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                {active.items.map((itemKey) => (
                  <li key={itemKey} className="flex items-center gap-2.5 text-[15px] text-[var(--color-ink-soft)]">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${style.check}`} style={{ borderColor: 'currentColor' }}>
                      <Check size={13} className={style.check} aria-hidden />
                    </span>
                    {t(itemKey)}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}
