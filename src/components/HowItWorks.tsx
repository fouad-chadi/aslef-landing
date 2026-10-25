import { motion } from 'framer-motion';
import { MessageCircle, UserCog, LayoutGrid, Heart, BadgeCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { SectionHeading } from './ui/Heading';
import { ArrowIcon, Button } from './ui/Button';
import { revealItem } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

// The real onboarding: a WhatsApp request, the Aslef team creates the crèche's account, the
// gestionnaire sets the crèche up, then families connect.
const steps: { icon: typeof MessageCircle; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: MessageCircle, titleKey: 'how.step1.title', descKey: 'how.step1.desc' },
  { icon: UserCog, titleKey: 'how.step2.title', descKey: 'how.step2.desc' },
  { icon: LayoutGrid, titleKey: 'how.step3.title', descKey: 'how.step3.desc' },
  { icon: Heart, titleKey: 'how.step4.title', descKey: 'how.step4.desc' },
];

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <Section id="comment-ca-marche" background="paper">
      <Container>
        <SectionHeading eyebrow={t('how.badge')} title={t('how.headline')} sub={t('how.sub')} />

        <ol className="relative mt-14 grid grid-cols-1 gap-0 lg:mt-16 lg:grid-cols-4 lg:gap-8">
          {/* Dotted thread joining the steps: the same "signal" as the hero demo. Horizontal on
              large screens, vertical (at the start edge) on smaller ones. */}
          <span
            aria-hidden
            className="absolute start-[23px] top-6 bottom-6 w-0 border-s-2 border-dotted border-[var(--color-aslef-blue)]/35 lg:hidden"
          />
          <span
            aria-hidden
            className="absolute inset-x-[12%] top-6 hidden h-0 border-t-2 border-dotted border-[var(--color-aslef-blue)]/35 lg:block"
          />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li key={step.titleKey} {...revealItem(i, 4, 0.12)} className="relative flex gap-5 pb-10 last:pb-0 lg:flex-col lg:items-center lg:gap-0 lg:pb-0 lg:text-center">
                <span className="relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-[var(--color-aslef-blue)] shadow-[0_6px_16px_-10px_rgba(18,39,58,0.5)]">
                  <Icon size={20} aria-hidden />
                  <span
                    dir="ltr"
                    className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-ink)] px-1 text-[10.5px] font-bold text-white"
                  >
                    {i + 1}
                  </span>
                </span>
                <div className="pt-1 lg:mt-5 lg:pt-0">
                  <h3 className="aslef-display text-[18px] font-bold text-[var(--color-ink)]">{t(step.titleKey)}</h3>
                  <p className="aslef-pretty mt-2 max-w-[300px] text-[15px] leading-relaxed text-[var(--color-ink-soft)] lg:mx-auto">{t(step.descKey)}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-col items-center gap-6 rounded-[1.75rem] border border-[var(--color-line)] bg-white p-6 text-center shadow-[var(--shadow-card)] sm:p-8 lg:mt-16 lg:flex-row lg:justify-between lg:text-start"
        >
          <div className="flex flex-col items-center gap-4 lg:flex-row">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green-dark)]">
              <BadgeCheck size={24} aria-hidden />
            </span>
            <div>
              <h3 className="aslef-display text-[20px] font-bold text-[var(--color-ink)] sm:text-[22px]">{t('how.free.title')}</h3>
              <p className="mt-1 text-[15px] text-[var(--color-ink-soft)]">{t('how.free.desc')}</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 lg:items-end">
            <Button as="a" href="/inscription" size="lg">
              {t('cta.register')}
              <ArrowIcon />
            </Button>
            <span className="text-[13px] text-[var(--color-ink-soft)]">{t('how.ctaNote')}</span>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
