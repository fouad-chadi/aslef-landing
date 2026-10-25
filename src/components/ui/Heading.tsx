import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, viewportOnce } from '../../lib/motion';

/** Small label above a section title: a dot and a short rule, then the text. */
export function Eyebrow({ children, tone = 'brand', className = '' }: { children: ReactNode; tone?: 'brand' | 'light'; className?: string }) {
  const color = tone === 'light' ? 'text-white/75' : 'text-[var(--color-aslef-blue)]';
  return (
    <span className={`aslef-eyebrow inline-flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.16em] ${color} ${className}`}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      <span aria-hidden className="h-px w-5 bg-current opacity-40" />
      {children}
    </span>
  );
}

/** Eyebrow + title + optional lead paragraph, revealed together when scrolled into view. */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = 'center',
  tone = 'dark',
  className = '',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  /** 'split': centered on phones and tablets, aligned to the start on large screens. */
  align?: 'center' | 'start' | 'split';
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const alignment = {
    center: 'mx-auto max-w-[720px] text-center',
    start: 'max-w-[620px] text-start',
    split: 'mx-auto max-w-[620px] text-center lg:mx-0 lg:text-start',
  }[align];
  const subAlignment = { center: 'mx-auto max-w-[580px]', start: '', split: 'mx-auto max-w-[580px] lg:mx-0' }[align];
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer(0.08)} className={`${alignment} ${className}`}>
      {eyebrow && (
        <motion.div variants={fadeInUp}>
          <Eyebrow tone={tone === 'light' ? 'light' : 'brand'}>{eyebrow}</Eyebrow>
        </motion.div>
      )}
      <motion.h2
        variants={fadeInUp}
        className={`aslef-display mt-4 text-[clamp(1.75rem,1.15rem+2.3vw,2.75rem)] font-bold leading-[1.12] ${
          tone === 'light' ? 'text-white' : 'text-[var(--color-ink)]'
        }`}
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          variants={fadeInUp}
          className={`aslef-pretty mt-4 text-[16px] leading-relaxed sm:text-[17px] ${subAlignment} ${
            tone === 'light' ? 'text-white/75' : 'text-[var(--color-ink-soft)]'
          }`}
        >
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
}
