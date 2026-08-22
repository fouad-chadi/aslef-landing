import { motion } from 'framer-motion';
import { Settings2, MessageSquare, HeartHandshake, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container } from './ui/Container';
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const items: { icon: typeof Settings2; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: Settings2, titleKey: 'trust.item.management', descKey: 'trust.item.managementDesc' },
  { icon: MessageSquare, titleKey: 'trust.item.communication', descKey: 'trust.item.communicationDesc' },
  { icon: HeartHandshake, titleKey: 'trust.item.tracking', descKey: 'trust.item.trackingDesc' },
  { icon: Smartphone, titleKey: 'trust.item.apps', descKey: 'trust.item.appsDesc' },
];

export function TrustBar() {
  const { t } = useLanguage();

  return (
    <section className="bg-white border-y border-[var(--color-border)]">
      <Container className="py-14 sm:py-16">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="text-center text-[22px] sm:text-[26px] font-bold tracking-tight text-[var(--color-ink)] mb-10"
        >
          {t('trust.headline')}
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
          className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.titleKey} variants={fadeInUp} className="group text-center lg:text-start">
                <span className="mx-auto lg:mx-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="mt-4 text-[15.5px] font-bold text-[var(--color-ink)]">{t(item.titleKey)}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{t(item.descKey)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
