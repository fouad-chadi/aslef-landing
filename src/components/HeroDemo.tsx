import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { Check, GraduationCap, Heart, MousePointerClick, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PHONE_H, PHONE_W, Phone } from './demo/devices';
import { AppCard, Avatar, ProgressBar, PushNotification, ScreenHeader } from './demo/ui';
import { ParentHomeScreen, TabBar } from './demo/screens';
import type { TranslationKey } from '../i18n/fr';

// Fixed design size of the two-phone composition (zoomed down on small screens).
const GAP = 20;
const PARENT_OFFSET = 44;
const COMP_W = PHONE_W * 2 + GAP;
const COMP_H = PHONE_H + PARENT_OFFSET;

type Phase = 'idle' | 'sending' | 'delivered' | 'done';

const SIGNAL_MS = 750;
const NOTIFICATION_MS = 3800;
const AUTOPLAY_DELAY_MS = 3200;
const POINTER_MS = 1100;

/** Hero demo: an éducatrice marks Yanis present on her phone, and the parent's phone gets the
 *  notification. Visitors can click the button themselves; if they don't, the demo plays once on
 *  its own (with an animated pointer) so phone visitors who only scroll still see it. */
export function HeroDemo() {
  const { t } = useLanguage();
  // Reduced motion: the scenario still plays (marking, notification, parent status), without
  // the gliding pointer and the flying signal.
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');
  const [autoPointer, setAutoPointer] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [path, setPath] = useState<string | null>(null);

  const compRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const inView = useInView(compRef, { amount: 0.5 });

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  // Curved path from the "Présent" button to where the notification lands, in design units.
  // Measured rather than hard-coded so it follows RTL (phones swap sides) and any zoom level.
  const measure = useCallback(() => {
    const comp = compRef.current;
    const button = buttonRef.current;
    const parent = parentRef.current;
    if (!comp || !button || !parent) return;
    const c = comp.getBoundingClientRect();
    const scale = c.width / COMP_W || 1;
    const b = button.getBoundingClientRect();
    const p = parent.getBoundingClientRect();
    const sx = (b.left + b.width / 2 - c.left) / scale;
    const sy = (b.top + b.height / 2 - c.top) / scale;
    const parentIsRight = p.left > b.left;
    // Land on the near third of the parent phone, at the height where the notification appears.
    const exD = ((parentIsRight ? p.left + p.width * 0.3 : p.right - p.width * 0.3) - c.left) / scale;
    const eyD = (p.top - c.top) / scale + 70;
    // Control point high above the gap between the phones: the signal "flies" over them.
    const cx = (sx + exD) / 2;
    const cy = Math.min(sy, eyD) - 190;
    setPath(`M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${exD.toFixed(1)} ${eyD.toFixed(1)}`);
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const send = useCallback(() => {
    clearTimers();
    measure();
    setAutoPointer(false);
    setPhase('sending');
    const delay = reduceMotion ? 0 : SIGNAL_MS;
    timers.current.push(window.setTimeout(() => setPhase('delivered'), delay));
    timers.current.push(window.setTimeout(() => setPhase('done'), delay + NOTIFICATION_MS));
  }, [measure, reduceMotion]);

  const onUserClick = () => {
    if (phase !== 'idle') return;
    setHasInteracted(true);
    send();
  };

  const replay = () => {
    clearTimers();
    setHasInteracted(true);
    setPhase('idle');
  };

  // Play once by itself when the visitor looks at it without clicking.
  useEffect(() => {
    if (!inView || hasInteracted || phase !== 'idle') return;
    const start = window.setTimeout(() => {
      if (reduceMotion) {
        setHasInteracted(true);
        send();
        return;
      }
      setAutoPointer(true);
      timers.current.push(
        window.setTimeout(() => {
          setHasInteracted(true);
          send();
        }, POINTER_MS),
      );
    }, AUTOPLAY_DELAY_MS);
    return () => window.clearTimeout(start);
  }, [inView, hasInteracted, phase, send, reduceMotion]);

  const marked = phase !== 'idle';
  const delivered = phase === 'delivered' || phase === 'done';

  return (
    <div className="aslef-zoom-wide mx-auto w-fit" role="group" aria-label={t('demo.label')}>
      <div ref={compRef} className="relative" style={{ width: COMP_W, height: COMP_H + 44 }}>
        {/* Éducatrice */}
        <div className="absolute start-0 top-0">
          <Phone time="07:32">
            <EducatorScreen marked={marked} buttonRef={buttonRef} onMark={onUserClick} autoPointer={autoPointer} />
          </Phone>
          <DeviceLabel icon={<GraduationCap size={14} aria-hidden />} labelKey="roles.educator.tab" />
        </div>

        {/* Parent */}
        <div ref={parentRef} className="absolute end-0" style={{ top: PARENT_OFFSET }}>
          <Phone
            time="07:32"
            overlay={
              <AnimatePresence>
                {phase === 'delivered' && (
                  <PushNotification title={t('demo.notif.title')} body={t('demo.notif.body')} when={t('demo.notif.now')} />
                )}
              </AnimatePresence>
            }
          >
            <ParentHomeScreen delivered={delivered} />
          </Phone>
          <DeviceLabel icon={<Heart size={14} aria-hidden />} labelKey="roles.parent.tab" />
        </div>

        {/* The "signal" travelling from one phone to the other */}
        {!reduceMotion && path && (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 overflow-visible"
            width={COMP_W}
            height={COMP_H}
            viewBox={`0 0 ${COMP_W} ${COMP_H}`}
          >
            <defs>
              <linearGradient id="aslef-signal" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="var(--color-aslef-blue)" />
                <stop offset="100%" stopColor="var(--color-aslef-green)" />
              </linearGradient>
            </defs>
            <AnimatePresence>
              {phase === 'sending' && (
                <motion.g key="signal" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.35 } }}>
                  <motion.path
                    d={path}
                    fill="none"
                    stroke="url(#aslef-signal)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray="0.1 10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: 0.25 }}
                  />
                  <SignalDot d={path} />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        )}
      </div>

      {/* Hint, then replay */}
      <div className="flex h-11 items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.p
              key="hint"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-[13.5px] font-semibold text-[var(--color-aslef-blue)] shadow-[var(--shadow-card)]"
            >
              <MousePointerClick size={16} aria-hidden />
              {t('demo.hint')}
            </motion.p>
          )}
          {phase === 'done' && (
            <motion.button
              key="replay"
              type="button"
              onClick={replay}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-[13.5px] font-semibold text-[var(--color-ink)] shadow-[var(--shadow-card)] transition-colors hover:border-[var(--color-aslef-blue)] hover:text-[var(--color-aslef-blue)]"
            >
              <RotateCcw size={15} aria-hidden />
              {t('demo.replay')}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Glowing dot that rides the signal path. Positioned from the path geometry in JS (rather than
 *  CSS offset-path) so it behaves the same in every browser, Safari included. */
function SignalDot({ d }: { d: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    const length = path.getTotalLength();
    const place = (progress: number) => {
      const point = path.getPointAtLength(progress * length);
      dot.setAttribute('cx', point.x.toFixed(1));
      dot.setAttribute('cy', point.y.toFixed(1));
    };
    place(0);
    const controls = animate(0, 1, { duration: SIGNAL_MS / 1000, ease: [0.65, 0, 0.35, 1], onUpdate: place });
    return () => controls.stop();
  }, [d]);

  return (
    <>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      <circle ref={dotRef} cx={-50} cy={-50} r={7} fill="var(--color-aslef-green)" style={{ filter: 'drop-shadow(0 0 8px rgba(69,184,90,0.85))' }} />
    </>
  );
}

function DeviceLabel({ icon, labelKey }: { icon: React.ReactNode; labelKey: TranslationKey }) {
  const { t } = useLanguage();
  return (
    <div className="mt-3 flex justify-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3 py-1 text-[12.5px] font-bold text-[var(--color-ink)] shadow-[0_1px_2px_rgba(18,39,58,0.05)]">
        <span className="text-[var(--color-aslef-blue)]">{icon}</span>
        {t(labelKey)}
      </span>
    </div>
  );
}

const roster: { nameKey: TranslationKey; tone: 'rose' | 'violet' | 'blue' | 'yellow'; time?: string; target?: boolean }[] = [
  { nameKey: 'demo.child.lina', tone: 'rose', time: '07:15' },
  { nameKey: 'demo.child.adam', tone: 'violet', time: '07:20' },
  { nameKey: 'demo.child.yanis', tone: 'blue', target: true },
  { nameKey: 'demo.child.ines', tone: 'yellow' },
];

function EducatorScreen({
  marked,
  buttonRef,
  onMark,
  autoPointer,
}: {
  marked: boolean;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onMark: () => void;
  autoPointer: boolean;
}) {
  const { t } = useLanguage();
  const present = marked ? 12 : 11;

  return (
    <div className="relative h-full">
      <ScreenHeader title={t('demo.edu.title')} subtitle={t('demo.edu.group')} trailing={<Avatar label={t('demo.educatorName').replace(/^(Mme|السيدة)\s*/, '')} tone="green" size={30} />} />

      <div className="px-3">
        <AppCard className="px-3.5 py-3">
          <div className="flex items-baseline gap-1.5">
            <span dir="ltr" className="text-[22px] font-bold tabular-nums text-[var(--color-ink)]">
              <motion.span key={present} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">
                {present}
              </motion.span>{' '}
              / 15
            </span>
            <span className="text-[12px] font-medium text-[var(--color-ink-soft)]">{t('demo.edu.count')}</span>
          </div>
          <div className="mt-2">
            <ProgressBar value={present / 15} />
          </div>
        </AppCard>

        <AppCard className="mt-2.5 divide-y divide-[var(--color-border)]">
          {roster.map((child) => {
            const isTarget = child.target;
            const done = !isTarget || marked;
            return (
              <div
                key={child.nameKey}
                className={`relative flex items-center gap-2.5 px-3 py-2.5 transition-colors duration-500 ${isTarget && marked ? 'bg-[var(--color-aslef-green-light)]' : ''}`}
              >
                <Avatar label={t(child.nameKey)} tone={child.tone} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-semibold text-[var(--color-ink)]">{t(child.nameKey)}</div>
                  <div className="text-[10.5px] tabular-nums text-[var(--color-ink-soft)]">
                    {isTarget ? (marked ? '07:32' : t('demo.edu.waiting')) : child.time ?? t('demo.edu.waiting')}
                  </div>
                </div>

                {isTarget ? (
                  <div className="relative">
                    <button
                      ref={buttonRef}
                      type="button"
                      onClick={onMark}
                      disabled={marked}
                      aria-label={t('demo.edu.markAria')}
                      aria-pressed={marked}
                      // after: invisible larger hit area - the demo is zoomed down on phones.
                      className={`relative flex h-7 items-center gap-1 rounded-full px-3 text-[11.5px] font-bold transition-all duration-300 after:absolute after:-inset-x-3 after:-inset-y-4 after:content-[''] disabled:cursor-default ${
                        marked
                          ? 'bg-[var(--color-aslef-green)] text-white'
                          : 'aslef-ring cursor-pointer bg-[var(--color-aslef-blue)] text-white hover:brightness-110'
                      }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {marked ? (
                          <motion.span key="ok" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex">
                            <Check size={13} strokeWidth={3} aria-hidden />
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                      {t('demo.edu.mark')}
                    </button>
                    <AnimatePresence>{autoPointer && <AutoPointer />}</AnimatePresence>
                  </div>
                ) : done && child.time ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green)]">
                    <Check size={13} strokeWidth={3} aria-hidden />
                  </span>
                ) : (
                  <span className="h-6 w-6 rounded-full border-2 border-dashed border-[var(--color-border)]" aria-hidden />
                )}
              </div>
            );
          })}
        </AppCard>
      </div>
      <TabBar active={1} />
    </div>
  );
}

/** A pointer that glides onto the button and taps it (autoplay only). */
function AutoPointer() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute start-1/2 top-1/2 z-20 text-[var(--color-ink)]"
      initial={{ opacity: 0, x: 34, y: 46, scale: 1 }}
      animate={{ opacity: 1, x: 2, y: 2, scale: [1, 1, 0.82, 1] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], scale: { duration: 1.05, times: [0, 0.7, 0.85, 1] } }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M5 3l14 7.5-6.2 1.6L10 18.5z" />
      </svg>
    </motion.span>
  );
}
