import type { ReactNode } from 'react';
import { BatteryFull, Lock, Signal, Wifi } from 'lucide-react';

/** Design size of every phone mockup. Screens are laid out for this exact size and the whole
 *  device is zoomed down on small viewports (see .aslef-device-zoom in index.css). */
export const PHONE_W = 248;
export const PHONE_H = 512;

/** A modern phone: dark bezel, camera island, live status bar. Purely presentational. */
export function Phone({
  time,
  children,
  className = '',
  overlay,
}: {
  time: string;
  children: ReactNode;
  className?: string;
  /** Rendered above the app content and under the status bar (push notifications). */
  overlay?: ReactNode;
}) {
  return (
    <div
      className={`relative shrink-0 rounded-[2.6rem] bg-[#0E1B26] p-[9px] shadow-[0_2px_4px_rgba(14,27,38,0.10),0_30px_60px_-18px_rgba(14,27,38,0.45)] ${className}`}
      style={{ width: PHONE_W, height: PHONE_H }}
    >
      {/* side buttons */}
      <span aria-hidden className="absolute -start-[3px] top-[96px] h-8 w-[3px] rounded-s bg-[#0E1B26]" />
      <span aria-hidden className="absolute -start-[3px] top-[140px] h-12 w-[3px] rounded-s bg-[#0E1B26]" />
      <span aria-hidden className="absolute -end-[3px] top-[120px] h-16 w-[3px] rounded-e bg-[#0E1B26]" />

      <div className="relative h-full w-full overflow-hidden rounded-[2.05rem] bg-[#F4F8FB]">
        <StatusBar time={time} />
        <div className="absolute inset-x-0 bottom-0 top-[36px] overflow-hidden">{children}</div>
        {overlay}
        {/* camera island */}
        <span aria-hidden className="absolute left-1/2 top-[8px] z-30 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-[#0E1B26]" />
        {/* home indicator */}
        <span aria-hidden className="absolute bottom-[6px] left-1/2 z-30 h-[4px] w-[86px] -translate-x-1/2 rounded-full bg-[#0E1B26]/80" />
        {/* soft glass reflection */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(125deg,rgba(255,255,255,0.22)_0%,transparent_32%)]"
        />
      </div>
    </div>
  );
}

function StatusBar({ time }: { time: string }) {
  return (
    <div dir="ltr" className="absolute inset-x-0 top-0 z-20 flex h-[36px] items-center justify-between px-6 pt-1 text-[#0E1B26]">
      <span className="text-[12.5px] font-bold tabular-nums tracking-tight">{time}</span>
      <span className="flex items-center gap-1">
        <Signal size={12} strokeWidth={2.6} aria-hidden />
        <Wifi size={12} strokeWidth={2.6} aria-hidden />
        <BatteryFull size={16} strokeWidth={2.2} aria-hidden />
      </span>
    </div>
  );
}

/** Desktop browser window for the gestionnaire web dashboard. */
export function Browser({ children, className = '', url = 'aslef.app' }: { children: ReactNode; className?: string; url?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[0_2px_4px_rgba(14,27,38,0.06),0_30px_60px_-20px_rgba(14,27,38,0.35)] ${className}`}
    >
      <div dir="ltr" className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span className="mx-auto flex h-6 w-full max-w-[220px] items-center justify-center gap-1.5 rounded-md border border-[var(--color-border)] bg-white text-[11px] font-medium text-[var(--color-ink-soft)]">
          <Lock size={10} aria-hidden />
          {url}
        </span>
        <span className="w-[42px]" aria-hidden />
      </div>
      {children}
    </div>
  );
}
