import { motion } from 'framer-motion';
import { Download, Heart, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container } from './ui/Container';
import { APP_DOWNLOAD_URL, WEB_APP_LABEL, WEB_APP_URL } from '../lib/links';
import { Button } from './ui/Button';
import { HeroDemo } from './HeroDemo';
import { fadeInUp, staggerContainer } from '../lib/motion';

const trustPoints = ['hero.trust.1', 'hero.trust.2', 'hero.trust.3'] as const;

export function Hero() {
  const { t } = useLanguage();

  return (
    <div id="top" className="relative overflow-hidden bg-[var(--color-paper)]">
      {/* Static atmosphere: a fading dot grid and one soft halo behind the phones (no blur filter,
          no looping animation). */}
      <div aria-hidden className="aslef-dotgrid pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-40 top-0 h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle,rgba(23,134,206,0.13),rgba(69,184,90,0.07)_42%,transparent_68%)] max-lg:-end-[30%] max-lg:top-[38%]"
      />

      <Container className="relative pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.04fr_1fr] lg:gap-6">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer(0.09)} className="text-center lg:text-start">
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-1.5 text-[13px] font-semibold text-[var(--color-aslef-blue)] shadow-[0_1px_2px_rgba(18,39,58,0.05)]"
            >
              <Heart size={14} className="fill-current" aria-hidden />
              {t('hero.badge')}
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="aslef-display mx-auto mt-6 max-w-[15ch] text-[clamp(2.3rem,1.4rem+3.7vw,4rem)] font-bold leading-[1.06] text-[var(--color-ink)] lg:mx-0"
            >
              {t('hero.headline')}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="aslef-pretty mx-auto mt-6 max-w-[540px] text-[16.5px] leading-relaxed text-[var(--color-ink-soft)] sm:text-[18px] lg:mx-0"
            >
              {t('hero.sub')}
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <Button as="a" href={APP_DOWNLOAD_URL} size="lg">
                <Download size={18} aria-hidden />
                {t('cta.download')}
              </Button>
            </motion.div>

            <motion.p variants={fadeInUp} className="mt-4 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[14px] text-[var(--color-ink-soft)] lg:justify-start">
              <Smartphone size={15} aria-hidden className="text-[var(--color-ink-soft)]/70" />
              <span>{t('hero.ios')}</span>
              <a
                href={WEB_APP_URL}
                dir="ltr"
                className="font-semibold text-[var(--color-aslef-blue-dark)] underline decoration-[var(--color-aslef-blue)]/30 underline-offset-4 transition-colors hover:decoration-[var(--color-aslef-blue)]"
              >
                {WEB_APP_LABEL}
              </a>
            </motion.p>

            <motion.ul variants={fadeInUp} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
              {trustPoints.map((key) => (
                <li key={key} className="flex items-center gap-2 text-[14px] font-medium text-[var(--color-ink-soft)]">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-aslef-green)]" />
                  {t(key)}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-full lg:me-0"
          >
            <HeroDemo />
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
