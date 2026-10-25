import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Apple,
  Bell,
  Bus,
  Check,
  CheckSquare,
  CreditCard,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  MessageCircle,
  MessageSquare,
  Moon,
  PartyPopper,
  Send,
  Smile,
  Soup,
  Sparkles,
  Sun,
  Users,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CountUp } from '../ui/CountUp';
import { AppCard, AppLogo, Avatar, ProgressBar, ScreenHeader, type AvatarTone } from './ui';
import type { TranslationKey } from '../../i18n/fr';

/* ------------------------------------------------------------------------------------------ */
/* Shared pieces                                                                               */
/* ------------------------------------------------------------------------------------------ */

export function TabBar({ active }: { active: number }) {
  const icons = [Home, CheckSquare, MessageCircle, ImageIcon];
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-[50px] items-start justify-around border-t border-[var(--color-border)] bg-white/95 pt-2.5">
      {icons.map((Icon, i) => (
        <Icon key={i} size={18} aria-hidden className={i === active ? 'text-[var(--color-aslef-blue)]' : 'text-[var(--color-ink-soft)]/60'} />
      ))}
    </div>
  );
}

export function TimelineRow({ time, icon, title, desc, highlight = false }: { time: string; icon: ReactNode; title: string; desc: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2.5 last:border-b-0">
      <span dir="ltr" className="w-8 shrink-0 text-[10.5px] font-semibold tabular-nums text-[var(--color-ink-soft)]">
        {time}
      </span>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          highlight ? 'bg-[var(--color-aslef-green)] text-white' : 'bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]'
        }`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="truncate text-[12px] font-semibold text-[var(--color-ink)]">{title}</div>
        <div className="truncate text-[10.5px] text-[var(--color-ink-soft)]">{desc}</div>
      </div>
    </div>
  );
}

function educatorInitial(name: string) {
  return name.replace(/^(Mme|السيدة)\s*/, '');
}

/** "Yanis · 12:10" style subtitle - the time stays left-to-right in Arabic. */
function childAt(name: string, time: string) {
  return `${name} · ${time}`;
}

/* ------------------------------------------------------------------------------------------ */
/* Parent app                                                                                  */
/* ------------------------------------------------------------------------------------------ */

/** Parent home: child card + today's timeline. `delivered` = Yanis has been marked present. */
export function ParentHomeScreen({ delivered }: { delivered: boolean }) {
  const { t } = useLanguage();

  const timeline: { time: string; icon: ReactNode; titleKey: TranslationKey; descKey: TranslationKey }[] = [
    { time: '10:00', icon: <PartyPopper size={14} aria-hidden />, titleKey: 'demo.parent.activity', descKey: 'demo.parent.activityDesc' },
    { time: '12:00', icon: <UtensilsCrossed size={14} aria-hidden />, titleKey: 'demo.parent.lunch', descKey: 'demo.parent.lunchDesc' },
  ];

  return (
    <div className="relative h-full">
      <div className="flex items-center justify-between px-4 pb-3 pt-2">
        <div className="flex items-center gap-1.5">
          <AppLogo size={20} />
          <span className="font-brand text-[15px] font-semibold text-[var(--color-ink)]">Aslef</span>
        </div>
        <span className="relative text-[var(--color-ink-soft)]">
          <Bell size={18} aria-hidden />
          <AnimatePresence>
            {delivered && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#F4F8FB] bg-[#EF4444]"
              />
            )}
          </AnimatePresence>
        </span>
      </div>

      <div className="px-3">
        <div className="rounded-2xl bg-[linear-gradient(135deg,var(--color-aslef-blue),var(--color-aslef-green))] p-3.5 text-white shadow-[0_10px_24px_-10px_rgba(23,134,206,0.6)]">
          <div className="text-[11px] font-medium text-white/80">{t('demo.parent.greeting')}</div>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-[17px] font-bold">
              {t('demo.child.yanisShort').charAt(0)}
            </span>
            <div>
              <div className="text-[15px] font-bold leading-tight">{t('demo.child.yanisShort')}</div>
              <div className="text-[11px] text-white/80">{t('demo.parent.group')}</div>
            </div>
          </div>
          <div className="mt-3 flex h-7 items-center gap-1.5 overflow-hidden rounded-full bg-white/15 px-2.5 text-[11px] font-semibold">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={delivered ? 'in' : 'out'}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1.5"
              >
                <span className={`h-2 w-2 rounded-full ${delivered ? 'bg-[#A7F3B5]' : 'bg-[var(--color-aslef-yellow)]'}`} />
                {delivered ? t('demo.parent.statusAfter') : t('demo.parent.statusBefore')}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-3.5 px-1 text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-soft)]">{t('demo.parent.today')}</div>
        <AppCard className="mt-1.5 overflow-hidden">
          <AnimatePresence initial={false}>
            {delivered && (
              <motion.div
                key="arrival"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <TimelineRow
                  time="07:32"
                  icon={<Check size={14} strokeWidth={3} aria-hidden />}
                  title={t('demo.parent.arrival')}
                  desc={t('demo.parent.arrivalDesc')}
                  highlight
                />
              </motion.div>
            )}
          </AnimatePresence>
          {timeline.map((item) => (
            <TimelineRow key={item.titleKey} time={item.time} icon={item.icon} title={t(item.titleKey)} desc={t(item.descKey)} />
          ))}
        </AppCard>
      </div>
      <TabBar active={0} />
    </div>
  );
}

/** Photo post from the éducatrice, shared with the families of the group only. */
export function ActivityScreen() {
  const { t } = useLanguage();

  return (
    <div className="relative h-full">
      <ScreenHeader title={t('day.s2.title')} subtitle={t('demo.parent.group')} />
      <div className="px-3">
        <AppCard className="overflow-hidden">
          <div className="flex items-center gap-2 px-3 pb-2 pt-3">
            <Avatar label={educatorInitial(t('demo.educatorName'))} tone="green" size={28} />
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-[var(--color-ink)]">{t('demo.educatorName')}</div>
              <div className="text-[10px] text-[var(--color-ink-soft)]">{t('day.post.meta')}</div>
            </div>
          </div>
          <p className="px-3 pb-2.5 text-[11.5px] leading-snug text-[var(--color-ink)]">{t('day.post.text')}</p>
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-3 aspect-[4/3] overflow-hidden rounded-xl"
          >
            <img src="/baby.jpg" alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mx-3 my-2.5 flex items-center gap-1.5 rounded-lg bg-[var(--color-aslef-green-light)] px-2.5 py-1.5 text-[10.5px] font-semibold text-[var(--color-aslef-green-dark)]"
          >
            <Lock size={11} aria-hidden />
            {t('day.post.private')}
          </motion.div>
        </AppCard>
      </div>
      <TabBar active={3} />
    </div>
  );
}

export function MealScreen() {
  const { t } = useLanguage();
  const courses: { icon: ReactNode; labelKey: TranslationKey; valueKey: TranslationKey }[] = [
    { icon: <Soup size={15} aria-hidden />, labelKey: 'day.meal.starter', valueKey: 'day.meal.starterValue' },
    { icon: <UtensilsCrossed size={15} aria-hidden />, labelKey: 'day.meal.main', valueKey: 'demo.parent.lunch' },
    { icon: <Apple size={15} aria-hidden />, labelKey: 'day.meal.dessert', valueKey: 'day.meal.dessertValue' },
  ];

  return (
    <div className="relative h-full">
      <ScreenHeader title={t('day.meal.title')} subtitle={childAt(t('demo.child.yanisShort'), '12:10')} />
      <div className="px-3">
        <AppCard className="divide-y divide-[var(--color-border)]">
          {courses.map((course, i) => (
            <div key={course.labelKey} className="flex items-center gap-2.5 px-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-aslef-yellow-light)] text-[var(--color-aslef-yellow-ink)]">{course.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">{t(course.labelKey)}</div>
                <div className="text-[12.5px] font-semibold leading-tight text-[var(--color-ink)]">{t(course.valueKey)}</div>
              </div>
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.25, type: 'spring', stiffness: 400, damping: 18 }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green)]"
              >
                <Check size={13} strokeWidth={3} aria-hidden />
              </motion.span>
            </div>
          ))}
        </AppCard>

        <AppCard className="mt-2.5 px-3.5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-soft)]">{t('day.meal.appetite')}</span>
            <span className="text-[12px] font-bold text-[var(--color-aslef-green-dark)]">{t('day.meal.appetiteValue')}</span>
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
                <motion.div
                  className="h-full rounded-full bg-[var(--color-aslef-green)]"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.1 + i * 0.18, duration: 0.4 }}
                />
              </div>
            ))}
          </div>
        </AppCard>
      </div>
      <TabBar active={0} />
    </div>
  );
}

export function NapScreen() {
  const { t } = useLanguage();
  const R = 46;
  const C = 2 * Math.PI * R;

  return (
    <div className="relative h-full">
      <ScreenHeader title={t('day.s4.title')} subtitle={childAt(t('demo.child.yanisShort'), '15:00')} />
      <div className="px-3">
        <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#2B3A8C,#1786CE)] p-4 text-white shadow-[0_12px_28px_-12px_rgba(43,58,140,0.7)]">
          <span aria-hidden className="absolute end-5 top-4 h-1 w-1 rounded-full bg-white/70" />
          <span aria-hidden className="absolute end-12 top-9 h-0.5 w-0.5 rounded-full bg-white/60" />
          <span aria-hidden className="absolute start-8 top-6 h-0.5 w-0.5 rounded-full bg-white/60" />
          <div className="flex justify-center">
            <div className="relative h-[116px] w-[116px]">
              <svg viewBox="0 0 116 116" className="h-full w-full -rotate-90" aria-hidden>
                <circle cx="58" cy="58" r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="9" />
                <motion.circle
                  cx="58"
                  cy="58"
                  r={R}
                  fill="none"
                  stroke="#A7F3B5"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  animate={{ strokeDashoffset: C * 0.2 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Moon size={18} className="text-white/90" aria-hidden />
                <span dir="ltr" className="mt-1 text-[17px] font-bold tabular-nums">
                  {t('day.nap.durationValue')}
                </span>
                <span className="text-[10px] text-white/75">{t('day.nap.duration')}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-white/12 py-2">
              <div className="text-[10px] text-white/75">{t('day.nap.asleep')}</div>
              <div className="text-[14px] font-bold tabular-nums">13:05</div>
            </div>
            <div className="rounded-xl bg-white/12 py-2">
              <div className="text-[10px] text-white/75">{t('day.nap.awake')}</div>
              <div className="text-[14px] font-bold tabular-nums">15:00</div>
            </div>
          </div>
        </div>

        <AppCard className="mt-2.5 flex items-center gap-2.5 px-3 py-2.5">
          <Avatar label={educatorInitial(t('demo.educatorName'))} tone="green" size={26} />
          <p className="text-[11.5px] leading-snug text-[var(--color-ink)]">{t('day.nap.note')}</p>
        </AppCard>
      </div>
      <TabBar active={0} />
    </div>
  );
}

export function ReportScreen() {
  const { t } = useLanguage();
  const tiles: { icon: ReactNode; labelKey: TranslationKey; valueKey: TranslationKey; tone: string }[] = [
    { icon: <Smile size={15} aria-hidden />, labelKey: 'day.report.mood', valueKey: 'day.report.moodValue', tone: 'bg-[var(--color-aslef-yellow-light)] text-[var(--color-aslef-yellow-ink)]' },
    { icon: <UtensilsCrossed size={15} aria-hidden />, labelKey: 'day.s3.title', valueKey: 'day.meal.appetiteValue', tone: 'bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green-dark)]' },
    { icon: <Moon size={15} aria-hidden />, labelKey: 'day.s4.title', valueKey: 'day.nap.durationValue', tone: 'bg-[#EEF0FB] text-[#2B3A8C]' },
    { icon: <Sparkles size={15} aria-hidden />, labelKey: 'day.s2.title', valueKey: 'day.report.activityValue', tone: 'bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]' },
  ];

  return (
    <div className="relative h-full">
      <ScreenHeader title={t('day.report.title')} subtitle={childAt(t('demo.child.yanisShort'), '17:30')} />
      <div className="px-3">
        <div className="grid grid-cols-2 gap-2">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.labelKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
            >
              <AppCard className="px-2.5 py-2.5">
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${tile.tone}`}>{tile.icon}</span>
                <div className="mt-1.5 text-[10px] font-semibold text-[var(--color-ink-soft)]">{t(tile.labelKey)}</div>
                <div className="text-[12px] font-bold leading-tight text-[var(--color-ink)]">{t(tile.valueKey)}</div>
              </AppCard>
            </motion.div>
          ))}
        </div>

        <AppCard className="mt-2 flex items-start gap-2.5 px-3 py-2.5">
          <Avatar label={educatorInitial(t('demo.educatorName'))} tone="green" size={26} />
          <p className="text-[11.5px] italic leading-snug text-[var(--color-ink)]">{t('day.report.note')}</p>
        </AppCard>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="mt-2 flex items-center gap-2 rounded-2xl bg-[var(--color-aslef-green)] px-3 py-2.5 text-white"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/25">
            <Check size={13} strokeWidth={3} aria-hidden />
          </span>
          <span className="text-[11.5px] font-bold">{t('day.report.pickup')}</span>
        </motion.div>
      </div>
      <TabBar active={0} />
    </div>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Gestionnaire web dashboard                                                                  */
/* ------------------------------------------------------------------------------------------ */

const groups: { key: TranslationKey; present: number; total: number }[] = [
  { key: 'day.group.babies', present: 8, total: 9 },
  { key: 'demo.parent.group', present: 14, total: 15 },
  { key: 'day.group.medium', present: 12, total: 14 },
  { key: 'day.group.large', present: 8, total: 10 },
];

export function DashboardScreen() {
  const { t } = useLanguage();
  const kpis: { icon: ReactNode; labelKey: TranslationKey; value: ReactNode; tone: string }[] = [
    {
      icon: <Users size={15} aria-hidden />,
      labelKey: 'day.dash.present',
      value: (
        <span dir="ltr">
          <CountUp to={42} /> / 48
        </span>
      ),
      tone: 'bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]',
    },
    { icon: <Send size={15} aria-hidden />, labelKey: 'day.dash.reports', value: <CountUp to={42} />, tone: 'bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green-dark)]' },
    { icon: <MessageSquare size={15} aria-hidden />, labelKey: 'day.dash.messages', value: <CountUp to={3} />, tone: 'bg-[#F1EDFD] text-[#6D4BD8]' },
    { icon: <CreditCard size={15} aria-hidden />, labelKey: 'day.dash.payments', value: t('day.dash.paymentsValue'), tone: 'bg-[var(--color-aslef-yellow-light)] text-[var(--color-aslef-yellow-ink)]' },
  ];
  const nav = [LayoutDashboard, Users, CheckSquare, MessageSquare, Wallet];

  return (
    <div className="flex min-h-[316px] bg-[#F4F8FB]">
      <aside className="flex w-[52px] shrink-0 flex-col items-center gap-3 border-e border-[var(--color-border)] bg-white py-3">
        <AppLogo size={22} />
        <span className="mt-1 h-px w-6 bg-[var(--color-border)]" />
        {nav.map((Icon, i) => (
          <span
            key={i}
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              i === 0 ? 'bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]' : 'text-[var(--color-ink-soft)]/70'
            }`}
          >
            <Icon size={16} aria-hidden />
          </span>
        ))}
      </aside>
      <div className="min-w-0 flex-1 p-4">
        <div className="flex items-center justify-between">
          <div className="text-[15px] font-bold text-[var(--color-ink)]">{t('day.dash.title')}</div>
          <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-semibold text-[var(--color-ink-soft)] shadow-[0_0_0_1px_var(--color-border)]">
            <Sun size={12} aria-hidden className="text-[var(--color-aslef-yellow)]" />
            {t('demo.parent.today')}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {kpis.map((kpi) => (
            <AppCard key={kpi.labelKey} className="px-2.5 py-2.5">
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${kpi.tone}`}>{kpi.icon}</span>
              <div className="mt-2 text-[16px] font-bold leading-none tabular-nums text-[var(--color-ink)]">{kpi.value}</div>
              <div className="mt-1 text-[9.5px] font-semibold leading-tight text-[var(--color-ink-soft)]">{t(kpi.labelKey)}</div>
            </AppCard>
          ))}
        </div>
        <AppCard className="mt-2.5 px-3.5 py-3">
          <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-soft)]">{t('day.dash.groups')}</div>
          <div className="mt-2.5 space-y-2.5">
            {groups.map((g, i) => (
              <div key={g.key} className="flex items-center gap-3">
                <span className="w-[104px] shrink-0 truncate text-[11.5px] font-semibold text-[var(--color-ink)]">{t(g.key)}</span>
                <div className="flex-1">
                  <ProgressBar value={g.present / g.total} tone={i % 2 ? 'green' : 'blue'} delay={0.2 + i * 0.12} />
                </div>
                <span dir="ltr" className="w-10 shrink-0 text-end text-[11px] font-semibold tabular-nums text-[var(--color-ink-soft)]">
                  {g.present}/{g.total}
                </span>
              </div>
            ))}
          </div>
        </AppCard>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Role switcher screens                                                                       */
/* ------------------------------------------------------------------------------------------ */

const autoRoster: { nameKey: TranslationKey; tone: AvatarTone; time: string }[] = [
  { nameKey: 'demo.child.lina', tone: 'rose', time: '07:15' },
  { nameKey: 'demo.child.adam', tone: 'violet', time: '07:20' },
  { nameKey: 'demo.child.yanis', tone: 'blue', time: '07:32' },
  { nameKey: 'demo.child.ines', tone: 'yellow', time: '07:41' },
];

/** Éducatrice: children are checked in one after another, then reports are sent. */
export function EducatorAutoScreen() {
  const { t } = useLanguage();
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    if (checked >= autoRoster.length) return;
    const id = window.setTimeout(() => setChecked((c) => c + 1), checked === 0 ? 600 : 650);
    return () => window.clearTimeout(id);
  }, [checked]);

  const present = 11 + checked;

  return (
    <div className="relative h-full">
      <ScreenHeader title={t('demo.edu.title')} subtitle={t('demo.edu.group')} trailing={<Avatar label={educatorInitial(t('demo.educatorName'))} tone="green" size={30} />} />
      <div className="px-3">
        <AppCard className="px-3.5 py-3">
          <div className="flex items-baseline gap-1.5">
            <span dir="ltr" className="text-[22px] font-bold tabular-nums text-[var(--color-ink)]">
              {present} / 15
            </span>
            <span className="text-[12px] font-medium text-[var(--color-ink-soft)]">{t('demo.edu.count')}</span>
          </div>
          <div className="mt-2">
            <ProgressBar value={present / 15} />
          </div>
        </AppCard>
        <AppCard className="mt-2.5 divide-y divide-[var(--color-border)]">
          {autoRoster.map((child, i) => {
            const done = i < checked;
            return (
              <div key={child.nameKey} className={`flex items-center gap-2.5 px-3 py-2 transition-colors duration-500 ${done && i === checked - 1 ? 'bg-[var(--color-aslef-green-light)]' : ''}`}>
                <Avatar label={t(child.nameKey)} tone={child.tone} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-semibold text-[var(--color-ink)]">{t(child.nameKey)}</div>
                  <div className="text-[10.5px] tabular-nums text-[var(--color-ink-soft)]">{done ? child.time : t('demo.edu.waiting')}</div>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  {done ? (
                    <motion.span
                      key="done"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-aslef-green)] text-white"
                    >
                      <Check size={13} strokeWidth={3} aria-hidden />
                    </motion.span>
                  ) : (
                    <motion.span key="todo" exit={{ scale: 0 }} className="h-6 w-6 rounded-full border-2 border-dashed border-[var(--color-border)]" />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </AppCard>
        <motion.div
          animate={checked >= autoRoster.length ? { opacity: 1, y: 0 } : { opacity: 0.45, y: 0 }}
          className="mt-2 flex h-9 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,var(--color-aslef-blue),var(--color-aslef-green))] text-[12.5px] font-bold text-white"
        >
          <Send size={14} aria-hidden />
          {t('roles.demo.sendReports')}
        </motion.div>
      </div>
      <TabBar active={1} />
    </div>
  );
}

// Each child's trip moves through statuses (picked up, on the way, waiting) - status updates,
// not a GPS map: the product has no live location.
const stops: { nameKey: TranslationKey; tone: AvatarTone; state: 'done' | 'current' | 'waiting'; time: string }[] = [
  { nameKey: 'demo.child.lina', tone: 'rose', state: 'done', time: '07:05' },
  { nameKey: 'demo.child.adam', tone: 'violet', state: 'done', time: '07:12' },
  { nameKey: 'demo.child.yanis', tone: 'blue', state: 'current', time: '07:18' },
  { nameKey: 'demo.child.ines', tone: 'yellow', state: 'waiting', time: '07:26' },
];

/** Accompagnatrice: the morning trip, child by child. */
export function TransportScreen() {
  const { t } = useLanguage();

  return (
    <div className="relative h-full">
      <ScreenHeader
        title={t('roles.demo.trip.title')}
        subtitle={t('roles.demo.trip.sub')}
        trailing={
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-aslef-yellow-light)] text-[var(--color-aslef-yellow-ink)]">
            <Bus size={15} aria-hidden />
          </span>
        }
      />
      <div className="px-3">
        <AppCard className="relative px-3 py-2">
          {/* route line */}
          <span aria-hidden className="absolute bottom-6 start-[25px] top-6 w-[3px] rounded-full bg-[var(--color-border)]" />
          <motion.span
            aria-hidden
            className="absolute start-[25px] top-6 w-[3px] origin-top rounded-full bg-[var(--color-aslef-green)]"
            initial={{ height: 0 }}
            animate={{ height: '52%' }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
          {stops.map((stop) => (
            <div key={stop.nameKey} className="relative flex items-center gap-2.5 py-2">
              <span
                className={`relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  stop.state === 'done'
                    ? 'border-[var(--color-aslef-green)] bg-[var(--color-aslef-green)] text-white'
                    : stop.state === 'current'
                      ? 'aslef-ring border-[var(--color-aslef-blue)] bg-white text-[var(--color-aslef-blue)]'
                      : 'border-[var(--color-border)] bg-white text-[var(--color-ink-soft)]'
                }`}
              >
                {stop.state === 'done' ? <Check size={12} strokeWidth={3} aria-hidden /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              <Avatar label={t(stop.nameKey)} tone={stop.tone} size={26} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold text-[var(--color-ink)]">{t(stop.nameKey)}</div>
                <div className="text-[10.5px] text-[var(--color-ink-soft)]">
                  {stop.state === 'done' ? t('roles.demo.trip.done') : stop.state === 'current' ? t('roles.demo.trip.current') : t('roles.demo.trip.waiting')}
                </div>
              </div>
              <span dir="ltr" className="text-[10.5px] font-semibold tabular-nums text-[var(--color-ink-soft)]">
                {stop.time}
              </span>
            </div>
          ))}
        </AppCard>
        <AppCard className="mt-2.5 flex items-center gap-2.5 px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]">
            <Bell size={16} aria-hidden />
          </span>
          <span className="text-[11.5px] font-semibold leading-snug text-[var(--color-ink)]">{t('roles.demo.trip.notified')}</span>
        </AppCard>
      </div>
      <TabBar active={0} />
    </div>
  );
}
