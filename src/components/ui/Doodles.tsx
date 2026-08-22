import type { CSSProperties } from 'react';

/** Hand-drawn style decorative accents (paper plane, heart, star outlines) echoing the
 *  reference mockups. Purely decorative - aria-hidden, no pointer events. */

interface DoodleProps {
  className?: string;
  color?: string;
  style?: CSSProperties;
}

export function PaperPlaneDoodle({ className = '', color = 'var(--color-aslef-blue)', style }: DoodleProps) {
  return (
    <svg aria-hidden viewBox="0 0 140 100" fill="none" className={className} style={style}>
      <path
        d="M4 70C20 74 34 58 30 44C27 33 14 30 8 38"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1 8"
        opacity="0.7"
      />
      <path
        d="M34 42L108 10L84 88L68 56L34 42Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M108 10L68 56" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeartDoodle({ className = '', color = 'var(--color-aslef-blue)', style }: DoodleProps) {
  return (
    <svg aria-hidden viewBox="0 0 60 54" fill="none" className={className} style={style}>
      <path
        d="M30 50C30 50 4 34.5 4 17.5C4 8.5 11 3 19 3C24.5 3 28.5 6.5 30 11C31.5 6.5 35.5 3 41 3C49 3 56 8.5 56 17.5C56 34.5 30 50 30 50Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarDoodle({ className = '', color = 'var(--color-aslef-yellow)', style }: DoodleProps) {
  return (
    <svg aria-hidden viewBox="0 0 60 60" fill="none" className={className} style={style}>
      <path
        d="M30 3L37 22L57 24L42 38L46 58L30 47L14 58L18 38L3 24L23 22L30 3Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
