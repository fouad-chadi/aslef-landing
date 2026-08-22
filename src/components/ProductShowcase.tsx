import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Smartphone, Check, X, Users, CreditCard, MessageSquare, UtensilsCrossed, Moon, Image } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { BrowserFrame, PhoneFrame } from './ui/DeviceFrame';
import { MockPanel, MockRow } from './ui/MockPanel';
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

const attendanceRows = [
  { name: 'Yanis Bekkouche', present: true },
  { name: 'Lina Cherif', present: true },
  { name: 'Adam Saadi', present: false },
];

export function ProductShowcase() {
  const { t } = useLanguage();

  const items: { labelKey: TranslationKey; deviceKey: TranslationKey; frame: 'browser' | 'phone'; content: ReactNode }[] = [
    {
      labelKey: 'showcase.manager.label',
      deviceKey: 'showcase.manager.device',
      frame: 'browser',
      content: (
        <MockPanel title="Aujourd'hui">
          <MockRow icon={<Users size={16} aria-hidden />} title="Enfants présents" subtitle="12 / 15" />
          <MockRow icon={<CreditCard size={16} aria-hidden />} title="Paiements en attente" subtitle="3 familles" />
          <MockRow icon={<MessageSquare size={16} aria-hidden />} title="Messages non lus" subtitle="5 nouveaux" />
        </MockPanel>
      ),
    },
    {
      labelKey: 'showcase.educator.label',
      deviceKey: 'showcase.educator.device',
      frame: 'phone',
      content: (
        <MockPanel title="Présence — Petite section">
          {attendanceRows.map((row) => (
            <div key={row.name} className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-white px-3.5 py-2.5">
              <span className="text-[12.5px] font-semibold text-[var(--color-ink)]">{row.name}</span>
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  row.present ? 'bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green)]' : 'bg-red-50 text-red-400'
                }`}
              >
                {row.present ? <Check size={13} aria-hidden /> : <X size={13} aria-hidden />}
              </span>
            </div>
          ))}
        </MockPanel>
      ),
    },
    {
      labelKey: 'showcase.parent.label',
      deviceKey: 'showcase.parent.device',
      frame: 'phone',
      content: (
        <MockPanel title="Rapport du jour">
          <MockRow icon={<UtensilsCrossed size={16} aria-hidden />} title="Repas" subtitle="A bien mangé" />
          <MockRow icon={<Moon size={16} aria-hidden />} title="Sieste" subtitle="13h30 — 15h00" />
          <MockRow icon={<Image size={16} aria-hidden />} title="Photo ajoutée" subtitle="Atelier peinture" />
        </MockPanel>
      ),
    },
  ];

  return (
    <Section id="application" background="soft">
      <Container>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp} className="mx-auto max-w-[640px] text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--color-aslef-blue)] shadow-[var(--shadow-card)]">
            <LayoutDashboard size={20} aria-hidden />
          </span>
          <h2 className="mt-5 text-[26px] sm:text-[34px] font-brand font-semibold tracking-tight text-[var(--color-ink)]">{t('showcase.headline')}</h2>
          <p className="mt-3 text-[15.5px] text-[var(--color-ink-soft)]">{t('showcase.sub')}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.15)}
          className="mt-16 grid grid-cols-1 items-end gap-14 md:grid-cols-3 md:gap-8"
        >
          {items.map((item) => (
            <motion.div key={item.labelKey} variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="mb-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[var(--shadow-card)]">
                {item.frame === 'browser' ? <LayoutDashboard size={14} className="text-[var(--color-aslef-blue)]" aria-hidden /> : <Smartphone size={14} className="text-[var(--color-aslef-green)]" aria-hidden />}
                <span className="text-[13px] font-bold text-[var(--color-ink)]">{t(item.labelKey)}</span>
                <span className="text-[12px] text-[var(--color-ink-soft)]">· {t(item.deviceKey)}</span>
              </div>
              <div className="aslef-card-hover w-full max-w-[300px] rounded-2xl">
                {item.frame === 'browser' ? <BrowserFrame>{item.content}</BrowserFrame> : <PhoneFrame className="mx-auto w-[220px] sm:w-[240px]">{item.content}</PhoneFrame>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
