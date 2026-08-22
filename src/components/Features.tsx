import { motion } from 'framer-motion';
import {
  CalendarCheck,
  ClipboardList,
  MessageSquare,
  Image as ImageIcon,
  UtensilsCrossed,
  Sparkles,
  FileText,
  Wallet,
  Sun,
  Moon,
  Smile,
  Check,
  Clock3,
  Users,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { BrowserFrame } from './ui/DeviceFrame';
import { MockPanel, MockRow } from './ui/MockPanel';
import { fadeInUp, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

interface FeatureRow {
  icon: typeof CalendarCheck;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  bodyKey: TranslationKey;
  visual: 'dashboard' | 'report' | 'messaging' | 'photos' | 'menu' | 'activities' | 'documents' | 'payments';
}

const rows: FeatureRow[] = [
  { icon: CalendarCheck, titleKey: 'features.attendance.title', descKey: 'features.attendance.desc', bodyKey: 'features.attendance.body', visual: 'dashboard' },
  { icon: ClipboardList, titleKey: 'features.reports.title', descKey: 'features.reports.desc', bodyKey: 'features.reports.body', visual: 'report' },
  { icon: MessageSquare, titleKey: 'features.messaging.title', descKey: 'features.messaging.desc', bodyKey: 'features.messaging.body', visual: 'messaging' },
  { icon: ImageIcon, titleKey: 'features.photos.title', descKey: 'features.photos.desc', bodyKey: 'features.photos.body', visual: 'photos' },
  { icon: UtensilsCrossed, titleKey: 'features.menu.title', descKey: 'features.menu.desc', bodyKey: 'features.menu.body', visual: 'menu' },
  { icon: Sparkles, titleKey: 'features.activities.title', descKey: 'features.activities.desc', bodyKey: 'features.activities.body', visual: 'activities' },
  { icon: FileText, titleKey: 'features.documents.title', descKey: 'features.documents.desc', bodyKey: 'features.documents.body', visual: 'documents' },
  { icon: Wallet, titleKey: 'features.payments.title', descKey: 'features.payments.desc', bodyKey: 'features.payments.body', visual: 'payments' },
];

function FeatureVisual({ visual }: { visual: FeatureRow['visual'] }) {
  if (visual === 'dashboard') {
    return (
      <BrowserFrame>
        <MockPanel title="Présence — Petite section">
          <MockRow icon={<Users size={16} aria-hidden />} title="12 / 15 présents" subtitle="Mis à jour à l'instant" trailing={<Check size={16} className="text-[var(--color-aslef-green)]" aria-hidden />} />
          <MockRow icon={<Users size={16} aria-hidden />} title="Yanis Bekkouche" subtitle="Arrivé à 08h12" trailing={<Check size={16} className="text-[var(--color-aslef-green)]" aria-hidden />} />
          <MockRow icon={<Users size={16} aria-hidden />} title="Adam Saadi" subtitle="Absent aujourd'hui" trailing={<Clock3 size={16} className="text-[var(--color-aslef-yellow)]" aria-hidden />} />
        </MockPanel>
      </BrowserFrame>
    );
  }
  if (visual === 'report') {
    return (
      <BrowserFrame>
        <MockPanel title="Rapport quotidien — Yanis">
          <MockRow icon={<Smile size={16} aria-hidden />} title="Humeur" subtitle="Joyeux toute la journée" />
          <MockRow icon={<UtensilsCrossed size={16} aria-hidden />} title="Appétit" subtitle="A bien mangé" />
          <MockRow icon={<Moon size={16} aria-hidden />} title="Sieste" subtitle="13h30 — 15h00" />
        </MockPanel>
      </BrowserFrame>
    );
  }
  if (visual === 'messaging') {
    return (
      <BrowserFrame>
        <MockPanel title="Messagerie">
          <div className="ms-auto max-w-[75%] rounded-2xl rounded-se-sm bg-[var(--color-aslef-blue)] px-4 py-2.5 text-[13px] text-white">
            Bonjour, comment s'est passée la sieste de Yanis aujourd'hui ?
          </div>
          <div className="max-w-[75%] rounded-2xl rounded-ss-sm bg-white border border-[var(--color-border)] px-4 py-2.5 text-[13px] text-[var(--color-ink)]">
            Il a très bien dormi, 1h30 sans réveil 😊
          </div>
          <div className="ms-auto max-w-[75%] rounded-2xl rounded-se-sm bg-[var(--color-aslef-blue)] px-4 py-2.5 text-[13px] text-white">
            Merci beaucoup !
          </div>
        </MockPanel>
      </BrowserFrame>
    );
  }
  if (visual === 'photos') {
    return (
      <BrowserFrame>
        <MockPanel title="Photos du jour">
          <div className="grid grid-cols-3 gap-2.5">
            {['bg-[var(--color-aslef-blue-light)]', 'bg-[var(--color-aslef-green-light)]', 'bg-[var(--color-aslef-yellow-light)]', 'bg-[var(--color-aslef-green-light)]', 'bg-[var(--color-aslef-blue-light)]', 'bg-[var(--color-aslef-yellow-light)]'].map(
              (bg, i) => (
                <div key={i} className={`aspect-square rounded-xl ${bg} flex items-center justify-center text-[var(--color-ink-soft)]`}>
                  <ImageIcon size={20} aria-hidden />
                </div>
              ),
            )}
          </div>
        </MockPanel>
      </BrowserFrame>
    );
  }
  if (visual === 'menu') {
    return (
      <BrowserFrame>
        <MockPanel title="Menu de la semaine">
          <MockRow icon={<Sun size={16} aria-hidden />} title="Lundi" subtitle="Soupe de légumes, poulet grillé, fruit" />
          <MockRow icon={<Sun size={16} aria-hidden />} title="Mardi" subtitle="Riz, poisson pané, yaourt" />
          <MockRow icon={<Moon size={16} aria-hidden />} title="Mercredi" subtitle="Pâtes bolognaise, compote" />
        </MockPanel>
      </BrowserFrame>
    );
  }
  if (visual === 'activities') {
    return (
      <BrowserFrame>
        <MockPanel title="Activités du jour">
          <MockRow icon={<Sparkles size={16} aria-hidden />} title="Atelier peinture" subtitle="Petite section · 10h30" />
          <MockRow icon={<Smile size={16} aria-hidden />} title="Jeux dans la cour" subtitle="Toutes sections · 15h00" />
          <MockRow icon={<ClipboardList size={16} aria-hidden />} title="Chant et comptines" subtitle="Petite section · 16h00" />
        </MockPanel>
      </BrowserFrame>
    );
  }
  if (visual === 'documents') {
    return (
      <BrowserFrame>
        <MockPanel title="Documents">
          <MockRow icon={<FileText size={16} aria-hidden />} title="Contrat d'inscription.pdf" subtitle="Ajouté le 03/09/2026" trailing={<Check size={16} className="text-[var(--color-aslef-green)]" aria-hidden />} />
          <MockRow icon={<FileText size={16} aria-hidden />} title="Fiche sanitaire.pdf" subtitle="Ajouté le 03/09/2026" trailing={<Check size={16} className="text-[var(--color-aslef-green)]" aria-hidden />} />
          <MockRow icon={<FileText size={16} aria-hidden />} title="Justificatif de vaccination.pdf" subtitle="Ajouté le 12/09/2026" trailing={<Check size={16} className="text-[var(--color-aslef-green)]" aria-hidden />} />
        </MockPanel>
      </BrowserFrame>
    );
  }
  return (
    <BrowserFrame>
      <MockPanel title="Paiements">
        <MockRow icon={<Wallet size={16} aria-hidden />} title="Facture — Septembre 2026" subtitle="8 500 DA" trailing={<Check size={16} className="text-[var(--color-aslef-green)]" aria-hidden />} />
        <MockRow icon={<Wallet size={16} aria-hidden />} title="Facture — Octobre 2026" subtitle="8 500 DA" trailing={<Clock3 size={16} className="text-[var(--color-aslef-yellow)]" aria-hidden />} />
        <MockRow icon={<Wallet size={16} aria-hidden />} title="Facture — Novembre 2026" subtitle="8 500 DA" trailing={<Clock3 size={16} className="text-[var(--color-aslef-yellow)]" aria-hidden />} />
      </MockPanel>
    </BrowserFrame>
  );
}

export function Features() {
  const { t } = useLanguage();

  return (
    <Section id="fonctionnalites" background="white">
      <Container>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp} className="mx-auto max-w-[640px] text-center">
          <h2 className="text-[26px] sm:text-[34px] font-brand font-semibold tracking-tight text-[var(--color-ink)]">{t('features.headline')}</h2>
          <p className="mt-3 text-[15.5px] text-[var(--color-ink-soft)]">{t('features.sub')}</p>
        </motion.div>

        <div className="mt-16 flex flex-col gap-20 sm:gap-24 lg:gap-28">
          {rows.map((row, index) => {
            const Icon = row.icon;
            const imageFirst = index % 2 === 1;
            return (
              <div key={row.titleKey} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={fadeInUp}
                  className={imageFirst ? 'lg:order-2' : ''}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]">
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-[21px] sm:text-[24px] font-bold leading-snug text-[var(--color-ink)]">{t(row.descKey)}</h3>
                  <p className="mt-3 max-w-[440px] text-[15px] leading-relaxed text-[var(--color-ink-soft)]">{t(row.bodyKey)}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 16 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={imageFirst ? 'lg:order-1' : ''}
                >
                  <FeatureVisual visual={row.visual} />
                </motion.div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
