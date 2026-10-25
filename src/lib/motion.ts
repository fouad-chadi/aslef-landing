import type { Variants } from 'framer-motion';

// Shared, restrained motion presets - subtle fade + slight movement only, no bounce/parallax.
// They play on every device, including phones with "reduce motion" turned on (see App.tsx).

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const staggerContainer = (stagger = 0.12, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const viewportOnce = { once: true, amount: 0.25 } as const;

// fadeInUp with its delay (seconds) passed through `custom`.
const fadeInUpDelayed: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay } }),
};

/** Props for one card of a grid: the card reveals when it scrolls into view itself, not with the
 *  whole grid. On phones grids stack into one column, so a grid-level reveal would play while the
 *  lower cards are still off screen. Cards on the same desktop row (`columns`) still stagger. */
export const revealItem = (index: number, columns: number, stagger = 0.1) =>
  ({
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, amount: 0.3 },
    variants: fadeInUpDelayed,
    custom: (index % columns) * stagger,
  }) as const;
