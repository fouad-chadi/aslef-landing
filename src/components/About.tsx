import { motion } from 'framer-motion';
import { Users2, Heart, Rocket, HeartHandshake, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import logo from '../assets/logo.png';
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const facts: TranslationKey[] = ['about.fact.1', 'about.fact.2', 'how.free.title'];

const values: { icon: typeof Heart; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: Heart, titleKey: 'about.value.passion.title', descKey: 'about.value.passion.desc' },
  { icon: Rocket, titleKey: 'about.value.innovation.title', descKey: 'about.value.innovation.desc' },
  { icon: Users2, titleKey: 'about.value.engagement.title', descKey: 'about.value.engagement.desc' },
];

export function About() {
  const { t } = useLanguage();

  return (
    <Section id="a-propos" background="white">
      <Container>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer(0.12)} className="text-center lg:text-start">
            <motion.span
              variants={fadeInUp}
              className="mx-auto lg:mx-0 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-1.5 text-[13px] font-semibold text-[var(--color-aslef-blue)]"
            >
              <Users2 size={14} aria-hidden />
              {t('about.badge')}
            </motion.span>

            <motion.h2 variants={fadeInUp} className="mt-5 font-brand font-semibold text-[26px] sm:text-[34px] tracking-tight text-[var(--color-ink)]">
              {t('about.headline')}
            </motion.h2>

            <motion.p variants={fadeInUp} className="mt-5 max-w-[520px] mx-auto lg:mx-0 text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">
              {t('about.p1')}
            </motion.p>
            <motion.p variants={fadeInUp} className="mt-3 max-w-[520px] mx-auto lg:mx-0 text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">
              {t('about.p2')}
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.titleKey} className="group flex flex-col items-center gap-2 sm:items-start">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                      <Icon size={18} aria-hidden />
                    </span>
                    <h3 className="text-[14.5px] font-bold text-[var(--color-ink)]">{t(value.titleKey)}</h3>
                    <p className="text-[13px] leading-relaxed text-[var(--color-ink-soft)]">{t(value.descKey)}</p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[460px]"
          >
            <div className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(160deg,var(--color-aslef-blue-light),#fff_55%,var(--color-aslef-green-light))] p-8 shadow-[var(--shadow-card-lg)] sm:p-10">
              <img src={logo} alt="Aslef" width={72} height={72} className="h-[72px] w-[72px] object-contain" loading="lazy" />
              <p className="aslef-display mt-5 flex items-start gap-3 text-[19px] font-bold leading-snug text-[var(--color-ink)]">
                <HeartHandshake size={22} aria-hidden className="mt-0.5 shrink-0 text-[var(--color-aslef-blue)]" />
                {t('about.quote')}
              </p>
              <ul className="mt-6 space-y-3">
                {facts.map((key) => (
                  <li key={key} className="flex items-center gap-3 text-[14.5px] font-medium text-[var(--color-ink)]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-aslef-green)] text-white">
                      <Check size={13} strokeWidth={3} aria-hidden />
                    </span>
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
