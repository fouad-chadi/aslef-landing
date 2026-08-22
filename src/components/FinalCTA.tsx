import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { Button } from './ui/Button';
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const contactRows: { icon: typeof Mail; bg: string; fg: string; labelKey: TranslationKey; valueKey: TranslationKey }[] = [
  { icon: Mail, bg: 'bg-[var(--color-aslef-blue-light)]', fg: 'text-[var(--color-aslef-blue)]', labelKey: 'contact.email.label', valueKey: 'contact.email.value' },
  { icon: Phone, bg: 'bg-[var(--color-aslef-green-light)]', fg: 'text-[var(--color-aslef-green)]', labelKey: 'contact.phone.label', valueKey: 'contact.phone.value' },
  { icon: MapPin, bg: 'bg-[var(--color-aslef-yellow-light)]', fg: 'text-[var(--color-aslef-yellow)]', labelKey: 'contact.location.label', valueKey: 'contact.location.value' },
];

export function FinalCTA() {
  const { t } = useLanguage();

  return (
    <Section id="contact" background="soft">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.12)}
          className="overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <motion.span
                variants={fadeInUp}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-1.5 text-[13px] font-semibold text-[var(--color-aslef-blue)]"
              >
                <Mail size={14} aria-hidden />
                {t('contact.badge')}
              </motion.span>
              <motion.h2 variants={fadeInUp} className="mt-5 font-brand font-semibold text-[26px] sm:text-[32px] tracking-tight text-[var(--color-ink)]">
                {t('contact.headline')}
                <br />
                <span className="text-[var(--color-aslef-blue)]">{t('contact.headlineHighlight')}</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                {t('contact.sub')}
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-8">
                <Button as="a" href={`mailto:${t('contact.email.value')}`} size="lg">
                  {t('cta.primary')}
                </Button>
              </motion.div>
            </div>

            <div className="flex flex-col justify-center gap-6 border-t border-[var(--color-border)] bg-[var(--color-bg-soft)] p-8 sm:p-12 lg:border-t-0 lg:border-s">
              {contactRows.map((row) => {
                const Icon = row.icon;
                return (
                  <motion.div key={row.labelKey} variants={fadeInUp} className="flex items-center gap-4">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${row.bg} ${row.fg}`}>
                      <Icon size={20} aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-[13px] font-bold text-[var(--color-ink)]">{t(row.labelKey)}</h3>
                      <p className="mt-0.5 text-[14.5px] text-[var(--color-ink-soft)]" dir="ltr">
                        {t(row.valueKey)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
