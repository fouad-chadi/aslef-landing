import { useId, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { fadeInUp, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const faqKeys: { qKey: TranslationKey; aKey: TranslationKey }[] = [
  { qKey: 'faq.q1', aKey: 'faq.a1' },
  { qKey: 'faq.q2', aKey: 'faq.a2' },
  { qKey: 'faq.q3', aKey: 'faq.a3' },
  { qKey: 'faq.q4', aKey: 'faq.a4' },
  { qKey: 'faq.q5', aKey: 'faq.a5' },
  { qKey: 'faq.q6', aKey: 'faq.a6' },
  { qKey: 'faq.q7', aKey: 'faq.a7' },
  { qKey: 'faq.q8', aKey: 'faq.a8' },
];

function FAQItem({ qKey, aKey, defaultOpen = false }: { qKey: TranslationKey; aKey: TranslationKey; defaultOpen?: boolean }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(defaultOpen);
  const prefersReducedMotion = useReducedMotion();
  const id = useId();

  return (
    <div className="border-b border-[var(--color-border)]">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`faq-panel-${id}`}
          id={`faq-header-${id}`}
          className="flex w-full items-center justify-between gap-4 py-5 text-start text-[15.5px] sm:text-[16.5px] font-semibold text-[var(--color-ink)] hover:text-[var(--color-aslef-blue)] transition-colors"
        >
          {t(qKey)}
          <ChevronDown
            size={18}
            aria-hidden
            className="shrink-0 transition-transform duration-300"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-panel-${id}`}
            role="region"
            aria-labelledby={`faq-header-${id}`}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: 'auto', opacity: 1 },
              collapsed: { height: 0, opacity: 0 },
            }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{t(aKey)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const { t } = useLanguage();

  return (
    <Section id="faq" background="soft">
      <Container>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="text-center text-[26px] sm:text-[34px] font-brand font-semibold tracking-tight text-[var(--color-ink)]"
        >
          {t('faq.headline')}
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mx-auto mt-10 max-w-[720px] rounded-3xl border border-[var(--color-border)] bg-white px-6 sm:px-8"
        >
          {faqKeys.map((item, index) => (
            <FAQItem key={item.qKey} qKey={item.qKey} aKey={item.aKey} defaultOpen={index === 0} />
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
