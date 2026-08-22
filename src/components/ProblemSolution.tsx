import { motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const problems: TranslationKey[] = [
  'problem.item.1',
  'problem.item.2',
  'problem.item.3',
  'problem.item.4',
  'problem.item.5',
  'problem.item.6',
];

export function ProblemSolution() {
  const { t, isRtl } = useLanguage();
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <Section background="soft">
      <Container>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mx-auto max-w-[720px] text-center text-[26px] sm:text-[34px] font-brand font-semibold leading-tight tracking-tight text-[var(--color-ink)]"
        >
          {t('problem.headline')}
        </motion.h2>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="mx-auto mt-10 grid max-w-[900px] grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {problems.map((key) => (
            <motion.li
              key={key}
              variants={fadeInUp}
              className="flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3.5"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                <X size={12} aria-hidden />
              </span>
              <span className="text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{t(key)}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-14 flex flex-col items-center gap-2 text-center"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--color-aslef-green)] shadow-[var(--shadow-card)]">
            <Arrow size={18} aria-hidden />
          </span>
          <h3 className="aslef-gradient-text text-[22px] sm:text-[28px] font-brand font-semibold">{t('problem.solution')}</h3>
          <p className="max-w-[520px] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{t('problem.solutionDesc')}</p>
        </motion.div>
      </Container>
    </Section>
  );
}
