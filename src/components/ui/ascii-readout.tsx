import { Fragment } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * The `neofetch` half of a run: the block of `key value` lines that sits beside
 * the art. Held back until the art has finished painting, so the window reads
 * as one command completing rather than two things arriving at once.
 */

interface AsciiReadoutProps {
  user: string;
  /** Heading after the `@` — the year this run fetched. */
  scope: string;
  facts: [string, string][];
  tint: string;
  /** The run has settled; reveal. */
  shown: boolean;
  reduced: boolean;
}

/** The page's own palette, printed the way neofetch prints a terminal's. */
const SWATCHES = [
  "bg-signal",
  "bg-lime",
  "bg-mist",
  "bg-paper",
  "bg-paper/45",
  "bg-paper/20",
];

export function AsciiReadout({
  user,
  scope,
  facts,
  tint,
  shown,
  reduced,
}: AsciiReadoutProps) {
  return (
    <motion.div
      className={cn("min-w-0", !shown && "pointer-events-none")}
      initial={false}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
      aria-hidden={!shown}
    >
      <p>
        <span style={{ color: tint }}>{user}</span>
        <span className="text-paper/45">@</span>
        <span style={{ color: tint }}>{scope}</span>
      </p>
      <p className="text-paper/30 select-none">{"─".repeat(22)}</p>

      <dl className="mt-1 grid grid-cols-[8ch_minmax(0,1fr)] gap-x-3 gap-y-1">
        {facts.map(([key, value]) => (
          <Fragment key={key}>
            <dt className="text-signal">{key}</dt>
            <dd className="text-paper/85">{value}</dd>
          </Fragment>
        ))}
      </dl>

      <div aria-hidden="true" className="mt-4 flex gap-1">
        {SWATCHES.map((swatch) => (
          <span key={swatch} className={cn("h-3 w-5", swatch)} />
        ))}
      </div>
    </motion.div>
  );
}
