import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { SectionHeading } from './ui/Heading';
import { revealItem } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

export interface FaqItem {
  q: TranslationKey;
  a: TranslationKey;
}

const QUESTIONS: FaqItem[] = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
];

/** The accordion itself, shared by the home page FAQ and the privacy page FAQ. Native <details>: keyboard and screen-reader friendly with no extra script, and it follows the page
 *  direction (RTL) by itself. */
export function FaqList({ items, className = '' }: { items: FaqItem[]; className?: string }) {
  const { t } = useLanguage();
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, i) => (
        <motion.div key={item.q} {...revealItem(i, 1, 0.06)}>
          <details className="group rounded-2xl border border-[var(--color-line)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] open:shadow-[0_12px_30px_-18px_rgba(15,23,42,0.25)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-[16px] font-semibold text-[var(--color-ink)] marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-aslef-blue)] [&::-webkit-details-marker]:hidden">
              <span>{t(item.q)}</span>
              <ChevronDown size={20} aria-hidden className="shrink-0 text-[var(--color-aslef-blue)] transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
            </summary>
            <p className="aslef-pretty px-5 pb-5 text-[15px] leading-relaxed text-[var(--color-ink-soft)]">{t(item.a)}</p>
          </details>
        </motion.div>
      ))}
    </div>
  );
}

/** Frequently asked questions (hosting, security, access) on the home page. */
export function FAQ() {
  const { t } = useLanguage();

  return (
    <Section id="faq" background="paper">
      <Container>
        <SectionHeading eyebrow={t('faq.badge')} title={t('faq.headline')} sub={t('faq.sub')} />
        <FaqList items={QUESTIONS} className="mx-auto mt-10 max-w-[820px] sm:mt-12" />
      </Container>
    </Section>
  );
}
