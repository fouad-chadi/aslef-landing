import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { SectionHeading } from './ui/Heading';
import type { TranslationKey } from '../i18n/fr';

// Crèche managers are the primary audience: price, getting started and roles come first. Related
// questions are merged (devices; reports + messages + menu) - every original answer is still shown.
const faqKeys: { qKey: TranslationKey; aKeys: TranslationKey[] }[] = [
  { qKey: 'faq.q9', aKeys: ['faq.a9'] },
  { qKey: 'faq.q8', aKeys: ['faq.a8'] },
  { qKey: 'faq.q2', aKeys: ['faq.a2'] },
  { qKey: 'faq.q.devices', aKeys: ['faq.a1', 'faq.a10'] },
  { qKey: 'faq.q7', aKeys: ['faq.a7'] },
  { qKey: 'faq.q3', aKeys: ['faq.a3'] },
  { qKey: 'faq.q.daily', aKeys: ['faq.a4', 'faq.a5', 'faq.a6'] },
];

function FAQItem({ qKey, aKeys, defaultOpen = false }: { qKey: TranslationKey; aKeys: TranslationKey[]; defaultOpen?: boolean }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-[var(--color-line)] last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`faq-panel-${id}`}
          id={`faq-header-${id}`}
          className="group flex min-h-[64px] w-full items-center justify-between gap-5 py-4 text-start text-[16px] font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-aslef-blue-dark)] sm:text-[17px]"
        >
          <span className="aslef-pretty">{t(qKey)}</span>
          <span
            aria-hidden
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ${
              open
                ? 'rotate-45 border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
                : 'border-[var(--color-line)] text-[var(--color-ink-soft)] group-hover:border-[var(--color-ink)]/30'
            }`}
          >
            <Plus size={16} strokeWidth={2.4} />
          </span>
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="aslef-pretty max-w-[640px] pb-6 pe-12 text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">{aKeys.map((key) => t(key)).join(' ')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const { t } = useLanguage();

  return (
    <Section id="faq" background="paper">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading align="split" eyebrow={t('nav.faq')} title={t('faq.headline')} sub={t('contact.sub')} />
              <div className="mt-6 flex justify-center lg:justify-start">
                <a
                  href={`mailto:${t('contact.email.value')}`}
                  dir="ltr"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 text-[14.5px] font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]/25"
                >
                  <Mail size={16} aria-hidden className="text-[var(--color-aslef-blue)]" />
                  {t('contact.email.value')}
                </a>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[1.75rem] border border-[var(--color-line)] bg-white px-5 shadow-[var(--shadow-card)] sm:px-8 lg:col-span-8"
          >
            {faqKeys.map((item, index) => (
              <FAQItem key={item.qKey} qKey={item.qKey} aKeys={item.aKeys} defaultOpen={index === 0} />
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
