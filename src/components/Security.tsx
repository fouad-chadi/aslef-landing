import { motion } from 'framer-motion';
import { ShieldCheck, Building2, Users, Lock, SlidersHorizontal, Server } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { SectionHeading } from './ui/Heading';
import { revealItem } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const items: { icon: typeof ShieldCheck; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: SlidersHorizontal, titleKey: 'security.item.roles', descKey: 'security.item.rolesDesc' },
  { icon: Building2, titleKey: 'security.item.isolation', descKey: 'security.item.isolationDesc' },
  { icon: Users, titleKey: 'security.item.linked', descKey: 'security.item.linkedDesc' },
  { icon: Lock, titleKey: 'security.item.privacy', descKey: 'security.item.privacyDesc' },
  { icon: ShieldCheck, titleKey: 'security.item.permissions', descKey: 'security.item.permissionsDesc' },
  { icon: Server, titleKey: 'security.item.hosting', descKey: 'security.item.hostingDesc' },
];

/** Privacy, on deep ink: the one dark section of the page, so it reads as a change of register. */
export function Security() {
  const { t } = useLanguage();

  return (
    <Section background="night" className="relative overflow-hidden !py-14 sm:!py-16 lg:!py-20">
      <div aria-hidden className="aslef-dotgrid-light pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -start-40 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(23,134,206,0.32),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 -end-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(69,184,90,0.18),transparent_65%)]"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-aslef-blue),var(--color-aslef-green))] text-white shadow-[0_14px_30px_-12px_rgba(23,134,206,0.8)] lg:mx-0"
              >
                <ShieldCheck size={26} aria-hidden />
              </motion.span>
              <SectionHeading align="split" tone="light" eyebrow={t('security.badge')} title={t('security.headline')} sub={t('security.sub')} />
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:col-span-7">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.li key={item.titleKey} {...revealItem(i, 1)} className="flex gap-4 border-b border-white/10 py-4 sm:py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                    <Icon size={19} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-bold text-white">{t(item.titleKey)}</h3>
                    <p className="aslef-pretty mt-1 text-[14px] leading-relaxed text-white/70">{t(item.descKey)}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
