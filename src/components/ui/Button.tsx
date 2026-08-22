import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'group relative isolate overflow-hidden inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-aslef-blue)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]';

const variants: Record<Variant, string> = {
  primary:
    'text-white shadow-[0_1px_2px_rgba(23,43,58,0.08),0_10px_24px_-6px_rgba(23,134,206,0.45)] bg-[linear-gradient(90deg,var(--color-aslef-blue),var(--color-aslef-green))] hover:brightness-[1.06] hover:shadow-[0_1px_2px_rgba(23,43,58,0.08),0_14px_32px_-6px_rgba(23,134,206,0.55)] hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-white text-[var(--color-ink)] border border-[var(--color-border)] hover:border-[var(--color-aslef-blue)] hover:-translate-y-0.5 active:translate-y-0 shadow-[var(--shadow-card)]',
  ghost: 'text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]',
};

const shine = (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-0 -z-[1] -translate-x-full bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.55)_50%,transparent_80%)] transition-transform duration-700 ease-out group-hover:translate-x-full"
  />
);

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-[52px] px-7 text-[16px]',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
  };

type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
    href: string;
  };

export function Button(props: ButtonProps | AnchorProps) {
  const { variant = 'primary', size = 'md', children, className = '', as, ...rest } = props;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (as === 'a') {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={classes} {...anchorProps}>
        {variant === 'primary' && shine}
        {children}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonProps}>
      {variant === 'primary' && shine}
      {children}
    </button>
  );
}
