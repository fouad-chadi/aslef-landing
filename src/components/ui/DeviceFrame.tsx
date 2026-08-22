import type { ReactNode } from 'react';

/** Realistic-enough browser chrome wrapped around a real Aslef-Web screenshot - deliberately
 *  restrained (no fake OS chrome) so the actual product UI stays the focus. */
export function BrowserFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-card-lg)] ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <div className="ms-3 h-5 flex-1 rounded-md bg-white/70 border border-[var(--color-border)] max-w-[220px]" />
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

/** Simplified phone chrome around a real Aslef-Mobile-styled screenshot. */
export function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[2.25rem] border-[6px] border-[var(--color-ink)] bg-[var(--color-ink)] shadow-[var(--shadow-card-lg)] ${className}`}>
      <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[var(--color-ink)]" />
      <div className="overflow-hidden rounded-[1.75rem] bg-white">{children}</div>
    </div>
  );
}
