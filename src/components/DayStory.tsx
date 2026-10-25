import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useSpring } from 'framer-motion';
import { LayoutDashboard, LogIn, LogOut, Sparkles, Sun, UtensilsCrossed } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Container, Section } from './ui/Container';
import { SectionHeading } from './ui/Heading';
import { Browser, Phone } from './demo/devices';
import { PushNotification } from './demo/ui';
import { ActivityScreen, DashboardScreen, MealScreen, ParentHomeScreen, ReportScreen } from './demo/screens';
import { fadeInUp, viewportOnce } from '../lib/motion';
import type { TranslationKey } from '../i18n/fr';

type StepId = 's1' | 's2' | 's3' | 's5' | 's6';

interface Step {
  id: StepId;
  icon: typeof Sun;
  phoneTime: string;
  /** Halo colour behind the device: the light changes through the day. */
  glow: string;
}

const steps: Step[] = [
  { id: 's1', icon: LogIn, phoneTime: '07:32', glow: 'rgba(255,181,27,0.30)' },
  { id: 's2', icon: Sparkles, phoneTime: '10:05', glow: 'rgba(23,134,206,0.26)' },
  { id: 's3', icon: UtensilsCrossed, phoneTime: '12:10', glow: 'rgba(69,184,90,0.26)' },
  { id: 's5', icon: LogOut, phoneTime: '17:34', glow: 'rgba(255,138,61,0.28)' },
  { id: 's6', icon: LayoutDashboard, phoneTime: '17:40', glow: 'rgba(23,134,206,0.24)' },
];

const k = (id: StepId, part: 'time' | 'title' | 'desc') => `day.${id}.${part}` as TranslationKey;

/** "Une journée à la crèche": one day of Yanis, told as the visitor scrolls. On large screens a
 *  sticky device follows the text and changes screen with each step; on phones every step
 *  carries its own device. */
export function DayStory() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  // The rail fills from the first step's dot to the active one.
  const progress = useSpring(0, { stiffness: 120, damping: 24, restDelta: 0.001 });
  useEffect(() => {
    progress.set(active / (steps.length - 1));
  }, [active, progress]);

  return (
    <Section id="journee" background="white" className="relative overflow-x-clip">
      <Container>
        <SectionHeading eyebrow={t('day.badge')} title={t('day.headline')} sub={t('day.sub')} />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-6 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-16">
          {/* Steps */}
          <div className="relative">
            {/* progress rail: from the first step's dot to the last one (py 10vh + half a 40vh step) */}
            <div aria-hidden className="absolute start-[19px] hidden w-[3px] rounded-full bg-[var(--color-line)] lg:bottom-[30vh] lg:top-[30vh] lg:block">
              <motion.div
                className="h-full w-full origin-top rounded-full bg-[linear-gradient(180deg,var(--color-aslef-yellow),var(--color-aslef-blue)_45%,var(--color-aslef-green))]"
                style={{ scaleY: progress }}
              />
            </div>

            <ol className="relative space-y-12 lg:space-y-0 lg:py-[10vh]">
              {steps.map((step, i) => (
                <StepBlock key={step.id} step={step} index={i} total={steps.length} activeIndex={active} onActive={setActive} />
              ))}
            </ol>
          </div>

          {/* Sticky device (large screens) */}
          <div className="hidden lg:block">
            <div className="sticky top-[max(96px,calc(50vh-300px))] flex h-[600px] items-center justify-center">
              {/* The light changes through the day: a radial gradient of currentColor, so only the
                  colour animates (no blur filter). */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 m-auto h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,currentColor,transparent_66%)]"
                animate={{ color: steps[active].glow }}
                transition={{ duration: 0.8 }}
              />
              <div className="relative" aria-hidden>
                <StepDevice step={steps[active]} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function StepBlock({ step, index, total, activeIndex, onActive }: { step: Step; index: number; total: number; activeIndex: number; onActive: (index: number) => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLLIElement>(null);
  // A step becomes active when it crosses the middle band of the viewport.
  const inCenter = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => {
    if (inCenter) onActive(index);
  }, [inCenter, onActive, index]);

  const Icon = step.icon;
  const isDashboard = step.id === 's6';
  const active = activeIndex === index;
  const passed = activeIndex > index;

  return (
    <li ref={ref} className="relative lg:flex lg:min-h-[40vh] lg:items-center">
      {/* Phones and tablets: this step's piece of the progress rail, filled once the story has moved
          past it (large screens use the single sticky rail in DayStory instead). */}
      {index < total - 1 && (
        <span aria-hidden className="absolute start-[19px] top-[22px] -bottom-12 w-[3px] rounded-full bg-[var(--color-line)] lg:hidden">
          <motion.span
            className="block h-full w-full origin-top rounded-full bg-[linear-gradient(180deg,var(--color-aslef-yellow),var(--color-aslef-blue)_45%,var(--color-aslef-green))]"
            initial={false}
            animate={{ scaleY: passed ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>
      )}

      {/* Reveal wrapper kept separate: its inline opacity would override the dimming classes below. */}
      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp}>
        {/* aslef-dim (index.css) fades inactive steps (more on large screens), only when JavaScript runs. */}
        <div className={`transition-opacity duration-500 ps-12 lg:ps-16 ${active ? '' : 'aslef-dim'}`}>
          {/* rail dot */}
          <span
            aria-hidden
            className={`absolute start-[7px] top-[22px] flex h-[27px] w-[27px] -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white transition-all duration-500 lg:top-1/2 ${
              active ? 'scale-110 bg-[linear-gradient(135deg,var(--color-aslef-blue),var(--color-aslef-green))] shadow-[0_0_0_6px_rgba(23,134,206,0.12)]' : 'bg-[var(--color-line)]'
            }`}
          />

          <div className="flex items-center gap-3">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-500 ${
                active ? 'bg-[var(--color-aslef-blue)] text-white' : 'bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]'
              }`}
            >
              <Icon size={20} aria-hidden />
            </span>
            <span dir={isDashboard ? undefined : 'ltr'} className="font-hero text-[15px] font-bold tabular-nums text-[var(--color-aslef-blue)]">
              {t(k(step.id, 'time'))}
            </span>
            <span dir="ltr" className="text-[12.5px] font-semibold tabular-nums text-[var(--color-ink-soft)]">
              {index + 1} / {steps.length}
            </span>
          </div>
          <h3 className="aslef-display mt-4 text-[24px] font-bold text-[var(--color-ink)] sm:text-[30px]">{t(k(step.id, 'title'))}</h3>
          <p className="aslef-pretty mt-2 max-w-[460px] text-[15.5px] leading-relaxed text-[var(--color-ink-soft)] sm:text-[16.5px]">{t(k(step.id, 'desc'))}</p>
        </div>
      </motion.div>

      {/* Phones and tablets: the device sits right under its step */}
      <MobileDevice step={step} />
    </li>
  );
}

function MobileDevice({ step }: { step: Step }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  return (
    <div ref={ref} aria-hidden className="relative mt-7 flex justify-center lg:hidden">
      <div
        className="pointer-events-none absolute inset-0 m-auto h-[340px] w-[min(340px,100%)] rounded-full bg-[radial-gradient(circle,currentColor,transparent_66%)]"
        style={{ color: step.glow }}
      />
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 28, scale: 0.94 }}
        animate={seen ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {seen ? <StepDevice step={step} /> : <StepDevice step={step} placeholder />}
      </motion.div>
    </div>
  );
}

/** Phone for steps 1-5, browser window for the gestionnaire dashboard. */
function StepDevice({ step, placeholder = false }: { step: Step; placeholder?: boolean }) {
  const { t } = useLanguage();
  const isDashboard = step.id === 's6';
  const showNotification = useNotificationWindow(step.id, placeholder);

  const notification: ReactNode =
    placeholder || !showNotification ? null : step.id === 's1' ? (
      <PushNotification key="n1" title={t('demo.notif.title')} body={t('demo.notif.body')} when={t('demo.notif.now')} />
    ) : step.id === 's5' ? (
      <PushNotification key="n5" title={t('day.report.ready')} body={t('day.report.readyBody')} when={t('demo.notif.now')} />
    ) : null;

  return (
    <div className={isDashboard ? 'aslef-zoom-wide' : 'aslef-device-zoom'}>
      <AnimatePresence mode="wait" initial={false}>
        {isDashboard ? (
          <motion.div
            key="browser"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Browser className="w-[520px]">{placeholder ? <div className="h-[316px] bg-[#F4F8FB]" /> : <DashboardScreen />}</Browser>
          </motion.div>
        ) : (
          <motion.div
            key="phone"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Phone time={step.phoneTime} overlay={<AnimatePresence mode="wait">{notification}</AnimatePresence>}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step.id}
                  className="h-full"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {placeholder ? null : <StepScreen id={step.id} />}
                </motion.div>
              </AnimatePresence>
            </Phone>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Like a real push notification: drops in shortly after the step appears, then slides away so
 *  the screen underneath can be read. */
function useNotificationWindow(id: StepId, disabled: boolean) {
  // Which step's notification is showing (null = none). Comparing with `id` hides it at once
  // when the step changes, without resetting state inside the effect.
  const [shownFor, setShownFor] = useState<StepId | null>(null);
  useEffect(() => {
    if (disabled) return;
    const show = window.setTimeout(() => setShownFor(id), 350);
    const hide = window.setTimeout(() => setShownFor(null), 3200);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [id, disabled]);
  return !disabled && shownFor === id;
}

function StepScreen({ id }: { id: StepId }) {
  switch (id) {
    case 's1':
      return <ParentHomeScreen delivered />;
    case 's2':
      return <ActivityScreen />;
    case 's3':
      return <MealScreen />;
    case 's5':
      return <ReportScreen />;
    default:
      return null;
  }
}
