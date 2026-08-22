import { motion } from 'framer-motion';
import { ShieldCheck, Building2, Users, Lock, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const items: { icon: typeof ShieldCheck; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: SlidersHorizontal, titleKey: 'security.item.roles', descKey: 'security.item.rolesDesc' },
  { icon: Building2, titleKey: 'security.item.isolation', descKey: 'security.item.isolationDesc' },
  { icon: Users, titleKey: 'security.item.linked', descKey: 'security.item.linkedDesc' },
  { icon: Lock, titleKey: 'security.item.privacy', descKey: 'security.item.privacyDesc' },
  { icon: ShieldCheck, titleKey: 'security.item.permissions', descKey: 'security.item.permissionsDesc' },
];

export function Security() {
  const { t } = useLanguage();

  return (
    <Section background="brand" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.14),transparent)]" />
      <Container className="relative">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp} className="mx-auto max-w-[640px] text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
            <ShieldCheck size={22} aria-hidden />
          </span>
          <h2 className="mt-5 text-[26px] sm:text-[34px] font-brand font-semibold tracking-tight text-white">{t('security.headline')}</h2>
          <p className="mt-3 text-[15.5px] text-white/85">{t('security.sub')}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.titleKey} variants={fadeInUp} className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Icon size={18} aria-hidden />
                </span>
                <h3 className="mt-4 text-[15.5px] font-bold text-white">{t(item.titleKey)}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/80">{t(item.descKey)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
