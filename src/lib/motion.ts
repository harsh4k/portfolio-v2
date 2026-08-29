import type { Variants } from "motion/react";

/**
 * The house easing. Copy-pasted inline ~28 times across the app before this
 * module existed (and once more as a raw cubic-bezier in index.css) — this is
 * the single source going forward. New code should import from here; existing
 * inline literals are left alone until they're next touched.
 */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const DUR = {
  fast: 0.35,
  base: 0.5,
  slow: 0.7,
  slower: 0.9,
} as const;

/** Duplicated ~12 times as inline viewport props before this module existed. */
export const VIEWPORT = { once: true, margin: "-60px" } as const;
export const VIEWPORT_WIDE = { once: true, margin: "-80px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE } },
};

export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});
