import { motion, useReducedMotion } from "motion/react";
import { Hammer, Eye, Flag, Compass, HardDrive, WifiOff } from "lucide-react";
import type { Thought } from "../../types";
import { cn } from "../../lib/utils";

/** One icon per thought, in data order. */
const icons = [Hammer, Eye, Flag, Compass, HardDrive, WifiOff];

export type TileSurface = "photo" | "paper" | "signal" | "ink";

/**
 * Contrast is the reason the signal tile prints ink rather than paper: paper on
 * #F13A18 lands at 3.2:1, which only clears AA for large text. Ink on the same
 * orange is 4.8:1 and clears it for the body copy too.
 */
const surfaces: Record<TileSurface, string> = {
  photo: "bg-night text-paper",
  paper: "border border-ink/15 bg-paper text-ink",
  signal: "bg-signal text-ink",
  ink: "bg-night text-paper",
};

/** Muted body copy has to follow the surface, not a single global opacity. */
const bodyTone: Record<TileSurface, string> = {
  photo: "text-paper/85",
  paper: "text-ink/62",
  signal: "text-ink/75",
  ink: "text-paper/62",
};

/**
 * Signal everywhere it can be. Lime is the other brand accent, but spending it
 * on the single ink tile would read as arbitrary rather than systematic, and on
 * the orange tile signal-on-signal is invisible, so that one drops to ink.
 */
const tagTone: Record<TileSurface, string> = {
  photo: "text-signal",
  paper: "text-signal",
  signal: "text-ink/70",
  ink: "text-signal",
};

interface MindTileProps {
  thought: Thought;
  index: number;
  surface: TileSurface;
  /** The tall lead tile: bigger type, and the only one to keep the ghost numeral. */
  feature?: boolean;
  /** Grid placement, owned by the section so this component stays layout-agnostic. */
  className?: string;
}

export default function MindTile({
  thought,
  index,
  surface,
  feature = false,
  className,
}: MindTileProps) {
  const Icon = icons[index % icons.length];
  const reduced = useReducedMotion();
  const isPhoto = surface === "photo" && Boolean(thought.image);

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative isolate flex flex-col justify-end overflow-hidden rounded-[32px]",
        surfaces[surface],
        className
      )}
    >
      {isPhoto && (
        <>
          {/* Two different jobs at two widths. On a narrow screen the photo is a
              band across the top with the copy on solid ground underneath, so
              the whole picture is visible and nothing is read through a scrim.
              From md the tiles are wide and short, the overlay works, and the
              same photo becomes the card's background. */}
          <div
            className={cn(
              "relative w-full shrink-0 overflow-hidden md:absolute md:inset-0 md:-z-10 md:h-full",
              feature ? "h-52" : "h-40"
            )}
          >
            <img
              src={thought.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
            />
          </div>
          {/* Only needed once the copy sits on top of the photograph. The lead
              tile is two rows tall, so a gentle scrim would put its midpoint
              right where the tag sits; these stops keep tag and title on a dark
              ground however bright the photo is there. */}
          <div className="absolute inset-0 -z-10 hidden bg-linear-to-t from-night via-night/72 to-night/25 md:block" />
        </>
      )}

      {feature && (
        <span
          aria-hidden="true"
          // Hidden on mobile: there the photo is a clean band rather than a
          // backdrop, and a translucent numeral over it just reads as a smudge.
          className="pointer-events-none absolute left-5 top-2 hidden select-none font-sans font-black leading-none tracking-[-0.04em] text-paper/16 text-[clamp(5rem,11vw,9rem)] md:block"
        >
          {thought.number}
        </span>
      )}

      {/* The copy carries the padding rather than the card, so a photo tile's
          image band can run edge to edge above it. */}
      <div className="relative p-6 md:p-7">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4 shrink-0", tagTone[surface])} strokeWidth={2} />
          <span
            className={cn(
              "font-sans text-[9px] uppercase tracking-[0.18em]",
              tagTone[surface]
            )}
          >
            {thought.tag}
          </span>
        </div>

        <h3
          className={cn(
            "mt-4 font-display uppercase tracking-[-0.03em]",
            feature
              ? "text-[2.1rem] leading-[0.92] md:text-5xl"
              : "text-2xl leading-[0.95] md:text-[1.75rem]"
          )}
        >
          {thought.title}
        </h3>

        <p
          className={cn(
            "mt-3 max-w-[46ch] leading-relaxed",
            feature ? "text-sm md:text-base" : "text-sm",
            bodyTone[surface]
          )}
        >
          {thought.body}
        </p>
      </div>
    </motion.article>
  );
}
