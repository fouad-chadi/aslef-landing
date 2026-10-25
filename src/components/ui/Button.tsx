import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outline-light';
type Size = 'md' | 'lg';

const base =
  'group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,border-color,box-shadow,transform,color,filter] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-aslef-blue)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';

const variants: Record<Variant, string> = {
  // The brand gradient (blue to green, as in the logo), mirrored in Arabic so it always flows
  // from the start of the reading direction.
  primary:
    'text-white bg-[linear-gradient(90deg,var(--color-aslef-blue),var(--color-aslef-green))] rtl:bg-[linear-gradient(270deg,var(--color-aslef-blue),var(--color-aslef-green))] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(18,39,58,0.1),0_10px_24px_-8px_rgba(23,134,206,0.5)] hover:brightness-[1.06] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(18,39,58,0.1),0_14px_30px_-8px_rgba(23,134,206,0.55)]',
  secondary:
    'border border-[var(--color-line)] bg-white text-[var(--color-ink)] shadow-[0_1px_2px_rgba(18,39,58,0.05)] hover:border-[var(--color-ink)]/25 hover:bg-[var(--color-paper)]',
  ghost: 'text-[var(--color-ink)] hover:bg-[var(--color-paper-deep)]',
  light: 'bg-white text-[var(--color-night)] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)] hover:bg-[var(--color-paper)]',
  'outline-light': 'border border-white/25 text-white hover:border-white/50 hover:bg-white/[0.06]',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-[52px] px-7 text-[16px]',
};

/** Trailing arrow that nudges forward on hover, mirrored in Arabic. */
export function ArrowIcon({ size = 17 }: { size?: number }) {
  return (
    <ArrowRight
      size={size}
      aria-hidden
      className="shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
    />
  );
}

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
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
