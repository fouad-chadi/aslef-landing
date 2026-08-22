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
  background?: 'white' | 'soft' | 'brand';
}

const backgrounds: Record<NonNullable<SectionProps['background']>, string> = {
  white: 'bg-white',
  soft: 'bg-[var(--color-bg-soft)]',
  brand: 'bg-[linear-gradient(135deg,var(--color-aslef-blue),var(--color-aslef-green))]',
};

export function Section({ children, id, background = 'white', className = '', ...rest }: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-28 ${backgrounds[background]} ${className}`} {...rest}>
      {children}
    </section>
  );
}
