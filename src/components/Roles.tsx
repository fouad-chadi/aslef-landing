import { motion } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Users2, GraduationCap, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

interface RoleCard {
  icon: typeof Users2;
  accent: 'blue' | 'green';
  titleKey: TranslationKey;
  items: TranslationKey[];
  ctaKey: TranslationKey;
}

const roles: RoleCard[] = [
  {
    icon: Users2,
    accent: 'blue',
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
    icon: GraduationCap,
    accent: 'green',
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
    icon: Heart,
    accent: 'blue',
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
  blue: { chip: 'bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]', check: 'text-[var(--color-aslef-blue)]' },
  green: { chip: 'bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green)]', check: 'text-[var(--color-aslef-green)]' },
};

export function Roles() {
  const { t, isRtl } = useLanguage();
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <Section id="pour-qui" background="white">
      <Container>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp} className="mx-auto max-w-[640px] text-center">
          <h2 className="text-[26px] sm:text-[34px] font-brand font-semibold tracking-tight text-[var(--color-ink)]">{t('roles.headline')}</h2>
          <p className="mt-3 text-[15.5px] text-[var(--color-ink-soft)]">{t('roles.sub')}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {roles.map((role) => {
            const Icon = role.icon;
            const style = accentStyles[role.accent];
            return (
              <motion.article
                key={role.titleKey}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col rounded-3xl border border-[var(--color-border)] bg-white p-7 shadow-[var(--shadow-card)]"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.chip}`}>
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="mt-5 text-[19px] font-bold leading-snug text-[var(--color-ink)]">{t(role.titleKey)}</h3>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {role.items.map((itemKey) => (
                    <li key={itemKey} className="flex items-center gap-2.5 text-[14px] text-[var(--color-ink-soft)]">
                      <Check size={15} className={`shrink-0 ${style.check}`} aria-hidden />
                      {t(itemKey)}
                    </li>
                  ))}
                </ul>
                <a
                  href="#application"
                  className="mt-7 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-[var(--color-aslef-blue)] hover:gap-2.5 transition-all"
                >
                  {t(role.ctaKey)}
                  <Arrow size={15} aria-hidden />
                </a>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
