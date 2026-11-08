import { Fragment, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Heading';
import { Button } from '../components/ui/Button';
import { FaqList, type FaqItem } from '../components/FAQ';
import { fadeInUp, staggerContainer } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const SECTIONS = Array.from({ length: 13 }, (_, i) => i + 1);
const PRIVACY_FAQ: FaqItem[] = [1, 2, 3, 4, 5, 6, 7].map((n) => ({ q: `privacy.faq.q${n}` as TranslationKey, a: `privacy.faq.a${n}` as TranslationKey }));
const CONTACT_EMAIL = 'contact@aslef.app';

/** **bold** inside a line. */
function inline(text: string): ReactNode {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-semibold text-[var(--color-ink)]">{part}</strong> : <Fragment key={i}>{part}</Fragment>));
}

/** A section body is plain text: blank line = new paragraph, lines starting with "- " = a list item (consecutive ones form one list). */
function Body({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  for (const [i, chunk] of text.split('\n\n').entries()) {
    const lines = chunk.split('\n');
    let list: string[] = [];
    const flush = (key: string) => {
      if (list.length === 0) return;
      blocks.push(
        <ul key={key} className="my-3 space-y-2 ps-1">
          {list.map((item, k) => (
            <li key={k} className="flex gap-3">
              <span aria-hidden className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-aslef-blue)]" />
              <span>{inline(item)}</span>
            </li>
          ))}
        </ul>,
      );
      list = [];
    };
    lines.forEach((line, j) => {
      if (line.startsWith('- ')) {
        list.push(line.slice(2));
      } else {
        flush(`l${i}-${j}`);
        blocks.push(<p key={`p${i}-${j}`} className="my-3 first:mt-0">{inline(line)}</p>);
      }
    });
    flush(`l${i}-end`);
  }
  return <div className="aslef-pretty text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)]">{blocks}</div>;
}

/** /privacy - the public privacy policy: what Aslef collects on the website and in the apps, why, where it is hosted, how long it is kept, and how to exercise the rights. The
 *  content lives in the i18n files (privacy.*), French and Arabic, and was written from what the code really does (see the audit notes in the commit/PR). */
export function PrivacyPage() {
  const { t } = useLanguage();
  const sectionKey = (n: number, part: 'title' | 'body') => `privacy.s${n}.${part}` as TranslationKey;

  return (
    <main id="main">
      <Section background="paper" className="relative overflow-hidden !pb-10 !pt-28 sm:!pt-32 lg:!pt-36">
        <div aria-hidden className="aslef-dotgrid pointer-events-none absolute inset-0" />
        <Container className="relative">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer(0.08)} className="mx-auto max-w-[760px] text-center">
            <motion.span
              variants={fadeInUp}
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-aslef-blue),var(--color-aslef-green))] text-white shadow-[0_14px_30px_-12px_rgba(23,134,206,0.8)]"
            >
              <ShieldCheck size={28} aria-hidden />
            </motion.span>
            <motion.div variants={fadeInUp}>
              <Eyebrow>{t('privacy.badge')}</Eyebrow>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="aslef-display mt-4 text-[clamp(2rem,1.3rem+2.8vw,3.1rem)] font-bold leading-[1.1] text-[var(--color-ink)]">
              {t('privacy.title')}
            </motion.h1>
            <motion.p variants={fadeInUp} className="aslef-pretty mx-auto mt-5 max-w-[640px] text-[16.5px] leading-relaxed text-[var(--color-ink-soft)]">
              {t('privacy.lead')}
            </motion.p>
            <motion.p variants={fadeInUp} className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] font-medium text-[var(--color-ink-soft)]">
              <span>{t('privacy.updated')}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--color-line)]" />
              <span>{t('privacy.law')}</span>
            </motion.p>
          </motion.div>
        </Container>
      </Section>

      <Section background="white" className="!pt-10 sm:!pt-12 lg:!pt-14">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Table of contents: a card above the text on phones, sticky beside it on large screens. */}
            <nav aria-label={t('privacy.toc')} className="min-w-0 lg:col-span-4">
              <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5 lg:sticky lg:top-28">
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-aslef-blue)]">{t('privacy.toc')}</p>
                <ol className="mt-3 space-y-0.5">
                  {SECTIONS.map((n) => (
                    <li key={n}>
                      <a
                        href={`#privacy-${n}`}
                        className="flex gap-3 rounded-lg px-2 py-1.5 text-[14.5px] leading-snug text-[var(--color-ink-soft)] transition-colors hover:bg-white hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-aslef-blue)]"
                      >
                        <span className="w-5 shrink-0 font-semibold text-[var(--color-aslef-blue)]">{n}.</span>
                        <span>{t(sectionKey(n, 'title'))}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <div className="min-w-0 lg:col-span-8">
              <div className="space-y-5">
                {SECTIONS.map((n) => (
                  <motion.section
                    key={n}
                    id={`privacy-${n}`}
                    aria-labelledby={`privacy-${n}-title`}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="scroll-mt-28 rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8"
                  >
                    <h2 id={`privacy-${n}-title`} className="flex items-start gap-3 text-[20px] font-bold leading-snug text-[var(--color-ink)] sm:text-[22px]">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-paper)] text-[14px] font-bold text-[var(--color-aslef-blue)] shadow-[inset_0_0_0_1px_var(--color-line)]">{n}</span>
                      <span>{t(sectionKey(n, 'title'))}</span>
                    </h2>
                    <div className="mt-4">
                      <Body text={t(sectionKey(n, 'body'))} />
                    </div>
                  </motion.section>
                ))}
              </div>

              {/* Short answers to the questions families ask most; the full detail is in the sections above. */}
              <section id="privacy-faq" aria-labelledby="privacy-faq-title" className="mt-12 scroll-mt-28">
                <h2 id="privacy-faq-title" className="text-[22px] font-bold leading-snug text-[var(--color-ink)] sm:text-[26px]">{t('privacy.faq.title')}</h2>
                <FaqList items={PRIVACY_FAQ} className="mt-5" />
              </section>

              <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-[var(--color-night)] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <p className="text-[18px] font-bold">{t('privacy.cta.title')}</p>
                  <p className="mt-1 text-[14.5px] text-white/70">{t('privacy.cta.desc')}</p>
                </div>
                <Button as="a" href={`mailto:${CONTACT_EMAIL}`} variant="light" size="lg">
                  <Mail size={18} aria-hidden />
                  {t('privacy.cta.button')}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
