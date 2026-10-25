import { motion } from 'framer-motion';
import { Download, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { Eyebrow } from './ui/Heading';
import { ArrowIcon, Button } from './ui/Button';
import { APP_DOWNLOAD_URL } from '../lib/links';
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

/** "06 98 11 52 22" -> "+213698115222" (Algerian number in international form, for tel: links). */
const toTel = (local: string) => `+213${local.replace(/\D/g, '').replace(/^0/, '')}`;

export function FinalCTA() {
  const { t } = useLanguage();

  const contactRows: { icon: typeof Mail; labelKey: TranslationKey; valueKey: TranslationKey; href?: string }[] = [
    { icon: Mail, labelKey: 'contact.email.label', valueKey: 'contact.email.value', href: `mailto:${t('contact.email.value')}` },
    { icon: Phone, labelKey: 'contact.phone.label', valueKey: 'contact.phone.value', href: `tel:${toTel(t('contact.phone.value'))}` },
    { icon: MapPin, labelKey: 'contact.location.label', valueKey: 'contact.location.value' },
  ];

  return (
    <Section id="contact" background="white">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
          className="relative isolate overflow-hidden rounded-[2rem] bg-[var(--color-night)] text-white shadow-[var(--shadow-float)]"
        >
          <div aria-hidden className="aslef-dotgrid-light pointer-events-none absolute inset-0 -z-10" />
          <div
            aria-hidden
            className="pointer-events-none absolute -end-32 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(69,184,90,0.28),transparent_65%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-48 -start-24 -z-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(23,134,206,0.32),transparent_65%)]"
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr]">
            <div className="p-7 text-center sm:p-12 lg:p-14 lg:text-start">
              <motion.div variants={fadeInUp}>
                <Eyebrow tone="light">{t('contact.badge')}</Eyebrow>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="aslef-display mx-auto mt-5 max-w-[520px] text-[clamp(1.85rem,1.2rem+2.4vw,2.9rem)] font-bold leading-[1.1] lg:mx-0"
              >
                {t('cta.headline')}
              </motion.h2>
              <motion.p variants={fadeInUp} className="aslef-pretty mx-auto mt-4 max-w-[460px] text-[16px] leading-relaxed text-white/75 lg:mx-0">
                {t('cta.sub')}
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button as="a" href="/inscription" size="lg">
                  {t('cta.register')}
                  <ArrowIcon />
                </Button>
                <Button as="a" href={APP_DOWNLOAD_URL} variant="outline-light" size="lg">
                  <Download size={17} aria-hidden />
                  {t('cta.android')}
                </Button>
              </motion.div>
            </div>

            <motion.div
              variants={fadeInUp}
              className="border-t border-white/10 bg-white/[0.04] p-7 sm:p-12 lg:border-s lg:border-t-0 lg:p-14"
            >
              <h3 className="aslef-display text-[20px] font-bold leading-snug">
                {t('contact.headline')} <span className="text-[#8FD3A0]">{t('contact.headlineHighlight')}</span>
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/65">{t('contact.sub')}</p>
              <ul className="mt-7 space-y-3">
                {contactRows.map((row) => {
                  const Icon = row.icon;
                  const body = (
                    <>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                        <Icon size={18} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12px] font-semibold text-white/60">{t(row.labelKey)}</span>
                        {/* Email and phone stay left-to-right inside Arabic text; the line itself
                            still aligns with the page direction. */}
                        <span className="block truncate text-[15px] font-semibold">
                          {row.href ? <bdi dir="ltr">{t(row.valueKey)}</bdi> : t(row.valueKey)}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li key={row.labelKey}>
                      {row.href ? (
                        <a href={row.href} className="-mx-2 flex items-center gap-3.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/[0.06]">
                          {body}
                        </a>
                      ) : (
                        <div className="-mx-2 flex items-center gap-3.5 px-2 py-1.5">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
