import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { SectionHeading } from './ui/Heading';
import { revealItem } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const problems: TranslationKey[] = [
  'problem.item.1',
  'problem.item.2',
  'problem.item.3',
  'problem.item.6',
];

/** The four day-to-day pains a crèche director recognises, then the answer (problem.item.4/5 remain in
 *  the dictionaries; their themes are covered by items 1 and 3). */
export function ProblemSolution() {
  const { t } = useLanguage();

  return (
    <Section background="paper">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading align="split" eyebrow={t('problem.badge')} title={t('problem.headline')} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ol className="border-t border-[var(--color-line)]">
              {problems.map((key, i) => (
                <motion.li
                  key={key}
                  {...revealItem(i, 1)}
                  className="flex items-center gap-4 border-b border-[var(--color-line)] py-4 sm:gap-6 sm:py-5"
                >
                  <span dir="ltr" className="aslef-display w-7 shrink-0 text-[13px] font-semibold tabular-nums text-[var(--color-ink-soft)]/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="aslef-pretty flex-1 text-[15.5px] leading-snug text-[var(--color-ink)] sm:text-[17px]">{t(key)}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FBEDEA] text-[#C24A3A]">
                    <X size={13} strokeWidth={2.6} aria-hidden />
                  </span>
                </motion.li>
              ))}
            </ol>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex gap-4 rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-7"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-aslef-green)] text-white shadow-[0_8px_18px_-8px_rgba(69,184,90,0.8)]">
                <Check size={20} strokeWidth={3} aria-hidden />
              </span>
              <div>
                <h3 className="aslef-display text-[20px] font-bold leading-snug text-[var(--color-ink)] sm:text-[23px]">{t('problem.solution')}</h3>
                <p className="aslef-pretty mt-2 text-[15px] leading-relaxed text-[var(--color-ink-soft)]">{t('problem.solutionDesc')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
