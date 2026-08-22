import type { ReactNode } from 'react';

/** Illustrative UI panel matching Aslef's real design tokens (cream surface, white rows,
 *  colored icon chips, same border radius/typography) - used only for the feature rows that
 *  don't have a captured product screenshot, so the composition never looks like a disconnected
 *  generic template. Always presented inside the same BrowserFrame/PhoneFrame chrome as the
 *  real screenshots. */
export function MockPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-[var(--color-bg-soft)] p-5 sm:p-6">
      <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-soft)]">{title}</div>
      <div className="mt-3 space-y-2.5">{children}</div>
    </div>
  );
}

export function MockRow({ icon, title, subtitle, trailing }: { icon: ReactNode; title: string; subtitle?: string; trailing?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-aslef-blue-light)] text-[var(--color-aslef-blue)]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-semibold text-[var(--color-ink)]">{title}</div>
        {subtitle && <div className="truncate text-[12px] text-[var(--color-ink-soft)]">{subtitle}</div>}
      </div>
      {trailing}
    </div>
  );
}
