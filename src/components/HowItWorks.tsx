import { motion } from 'framer-motion';
import { UserCheck, SearchCheck, MessageCircle, Heart, LayoutGrid, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { Button } from './ui/Button';
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const stepColors = [
  { ring: 'bg-[var(--color-aslef-blue)]', bg: 'bg-[var(--color-aslef-blue-light)]', fg: 'text-[var(--color-aslef-blue)]', bar: 'bg-[var(--color-aslef-blue)]' },
  { ring: 'bg-[var(--color-aslef-green)]', bg: 'bg-[var(--color-aslef-green-light)]', fg: 'text-[var(--color-aslef-green)]', bar: 'bg-[var(--color-aslef-green)]' },
  { ring: 'bg-[var(--color-aslef-yellow)]', bg: 'bg-[var(--color-aslef-yellow-light)]', fg: 'text-[var(--color-aslef-yellow)]', bar: 'bg-[var(--color-aslef-yellow)]' },
  { ring: 'bg-[var(--color-aslef-blue)]', bg: 'bg-[var(--color-aslef-blue-light)]', fg: 'text-[var(--color-aslef-blue)]', bar: 'bg-[var(--color-aslef-blue)]' },
];

const steps: { icon: typeof UserCheck; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: UserCheck, titleKey: 'how.step1.title', descKey: 'how.step1.desc' },
  { icon: SearchCheck, titleKey: 'how.step2.title', descKey: 'how.step2.desc' },
  { icon: MessageCircle, titleKey: 'how.step3.title', descKey: 'how.step3.desc' },
  { icon: Heart, titleKey: 'how.step4.title', descKey: 'how.step4.desc' },
];

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <Section id="comment-ca-marche" background="white">
      <Container>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp} className="mx-auto max-w-[640px] text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-1.5 text-[13px] font-semibold text-[var(--color-aslef-blue)]">
            <LayoutGrid size={14} aria-hidden />
            {t('how.badge')}
          </span>
          <h2 className="mt-5 font-brand font-semibold text-[26px] sm:text-[34px] tracking-tight text-[var(--color-ink)]">
            {t('how.headline')}
          </h2>
          <p className="mt-3 text-[15.5px] text-[var(--color-ink-soft)]">{t('how.sub')}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.15)}
          className="relative mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div aria-hidden className="absolute top-6 hidden h-px w-full border-t border-dashed border-[var(--color-border)] lg:block" />
          {steps.map((step, i) => {
            const Icon = step.icon;
            const c = stepColors[i];
            return (
              <motion.div
                key={step.titleKey}
                variants={fadeInUp}
                className="aslef-card-hover group relative flex flex-col items-center rounded-3xl border border-[var(--color-border)] bg-white px-6 py-8 text-center shadow-[var(--shadow-card)]"
              >
                <span className={`absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full ${c.ring} text-[13px] font-bold text-white shadow-[var(--shadow-card)]`}>
                  {i + 1}
                </span>
                <span className={`mt-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${c.bg} ${c.fg}`}>
                  <Icon size={26} aria-hidden />
                </span>
                <h3 className="mt-5 text-[16.5px] font-bold text-[var(--color-ink)]">{t(step.titleKey)}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{t(step.descKey)}</p>
                <span className={`mt-5 h-1 w-10 rounded-full ${c.bar}`} />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-10 flex flex-col items-center justify-between gap-6 rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-8 py-7 sm:flex-row"
        >
          <div className="flex items-center gap-3.5 text-center sm:text-start">
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)] sm:flex">
              <ShieldCheck size={22} aria-hidden />
            </span>
            <div>
              <h3 className="text-[15px] font-bold text-[var(--color-ink)]">{t('how.bottom.secure')}</h3>
              <p className="mt-1 text-[13px] text-[var(--color-ink-soft)]">{t('how.bottom.secureDesc')}</p>
            </div>
          </div>
          <div className="hidden h-10 w-px bg-[var(--color-border)] sm:block" />
          <div className="text-center sm:text-start">
            <h3 className="text-[15px] font-bold text-[var(--color-ink)]">{t('how.bottom.ctaTitle')}</h3>
            <p className="mt-1 text-[13px] text-[var(--color-ink-soft)]">{t('how.bottom.ctaDesc')}</p>
          </div>
          <Button as="a" href="#contact" size="md" className="w-full sm:w-auto">
            {t('hero.cta.primary')}
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
}
