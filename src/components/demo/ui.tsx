import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

/** Small building blocks shared by every app screen in the demos, so the hero, the day story
 *  and the role switcher all look like the same product. */

const AVATAR_TONES = {
  blue: 'bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]',
  green: 'bg-[var(--color-aslef-green-light)] text-[var(--color-aslef-green-dark)]',
  yellow: 'bg-[var(--color-aslef-yellow-light)] text-[var(--color-aslef-yellow-ink)]',
  rose: 'bg-[#FDECEF] text-[#C2416A]',
  violet: 'bg-[#F1EDFD] text-[#6D4BD8]',
} as const;

export type AvatarTone = keyof typeof AVATAR_TONES;

export function Avatar({ label, tone = 'blue', size = 30 }: { label: string; tone?: AvatarTone; size?: number }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${AVATAR_TONES[tone]}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {label.trim().charAt(0)}
    </span>
  );
}

export function ScreenHeader({ title, subtitle, trailing }: { title: string; subtitle?: string; trailing?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 px-4 pb-3 pt-2">
      <div className="min-w-0">
        <div className="truncate text-[16px] font-bold leading-tight text-[var(--color-ink)]">{title}</div>
        {subtitle && <div className="mt-0.5 truncate text-[11px] font-medium text-[var(--color-ink-soft)]">{subtitle}</div>}
      </div>
      {trailing}
    </div>
  );
}

export function AppCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[var(--color-border)] bg-white shadow-[0_1px_2px_rgba(23,43,58,0.04)] ${className}`}>{children}</div>
  );
}

export function AppLogo({ size = 18 }: { size?: number }) {
  return <img src={logo} alt="" aria-hidden className="object-contain" style={{ width: size, height: size }} />;
}

/** iOS-style push notification that drops in from the top of a phone screen. */
export function PushNotification({ title, body, when }: { title: string; body: string; when: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -46, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className="absolute inset-x-2.5 top-[38px] z-[25] rounded-[1.1rem] border border-white/60 bg-white/90 px-3 py-2.5 shadow-[0_12px_30px_-8px_rgba(14,27,38,0.35)] backdrop-blur-md"
    >
      <div className="flex items-center gap-1.5">
        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-white shadow-[0_0_0_1px_var(--color-border)]">
          <AppLogo size={13} />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-soft)]">Aslef</span>
        <span className="ms-auto text-[10px] text-[var(--color-ink-soft)]">{when}</span>
      </div>
      <div className="mt-1 text-[12.5px] font-bold leading-snug text-[var(--color-ink)]">{title}</div>
      <div className="text-[11.5px] leading-snug text-[var(--color-ink-soft)]">{body}</div>
    </motion.div>
  );
}

export function ProgressBar({ value, tone = 'green', delay = 0 }: { value: number; tone?: 'green' | 'blue' | 'yellow'; delay?: number }) {
  const color = {
    green: 'bg-[var(--color-aslef-green)]',
    blue: 'bg-[var(--color-aslef-blue)]',
    yellow: 'bg-[var(--color-aslef-yellow)]',
  }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.round(value * 100)}%` }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
