import type { HTMLAttributes, ReactNode } from 'react';

export function Container({ children, className = '', ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8 ${className}`} {...rest}>
      {children}
    </div>
  );
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  id?: string;
  /** 'soft' is kept as an alias of 'paper' for older sections. */
  background?: 'white' | 'paper' | 'soft' | 'night';
}

const backgrounds: Record<NonNullable<SectionProps['background']>, string> = {
  white: 'bg-white',
  paper: 'bg-[var(--color-paper)]',
  soft: 'bg-[var(--color-paper)]',
  night: 'bg-[var(--color-night)] text-white',
};

export function Section({ children, id, background = 'white', className = '', ...rest }: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-28 ${backgrounds[background]} ${className}`} {...rest}>
      {children}
    </section>
  );
}
