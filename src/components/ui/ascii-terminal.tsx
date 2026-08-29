import * as React from "react";
import { AsciiRun, Caret, Prompt, type TerminalRun } from "./ascii-run";
import { useIsMobile } from "../../hooks/use-media";
import { cn } from "../../lib/utils";

/**
 * One terminal window per year, stacked by scroll.
 *
 * Each window is `sticky` at an offset one title-bar below the one before, so
 * scrolling piles them up the way terminals pile up on a desktop — the years
 * already read stay legible as a row of title bars above the one in focus.
 *
 * Sticky is fragile in two ways this file has to respect. An ancestor with
 * `overflow: hidden` silently becomes the scroll container and kills it, so the
 * page clips with `overflow-x: clip` instead. And a window pinned taller than
 * the screen parks its own bottom below the fold, so the art is given a row
 * budget measured from the live viewport rather than a breakpoint guess.
 */

interface AsciiTerminalProps {
  runs: TerminalRun[];
  /** Shell user in the prompt. */
  user?: string;
  /** Shell host in the prompt and the window title. */
  host?: string;
  className?: string;
}

/** Title-bar height — the sliver each stacked window leaves showing. */
const PEEK = 40;
/** Below this the art is too coarse to be worth the stack; fall back to a list. */
const MIN_STACK_ROWS = 26;

/**
 * Rows of art a window can afford and still fit on screen at its stack offset.
 * `overhead` is everything in a window that isn't art — chrome, login banner,
 * command, decode bar, trailing prompt, plus the read-out itself once it stops
 * sitting beside the art and stacks under it on a phone.
 */
function useRowBudget(topOfLast: number, isMobile: boolean) {
  const [budget, setBudget] = React.useState({ rows: isMobile ? 30 : 40, stack: true });

  React.useEffect(() => {
    const read = () => {
      // Line heights track the art type scale in AsciiRun (6px / 7px @ 1.08).
      const overhead = isMobile ? 400 : 215;
      const lineHeight = isMobile ? 6.5 : 7.6;
      const room = window.innerHeight - topOfLast - overhead - 24;
      const rows = Math.floor(room / lineHeight);
      setBudget({
        rows: Math.max(16, Math.min(isMobile ? 36 : 44, rows)),
        stack: rows >= MIN_STACK_ROWS,
      });
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [topOfLast, isMobile]);

  return budget;
}

function TerminalWindow({
  run,
  user,
  host,
  maxRows,
}: {
  run: TerminalRun;
  user: string;
  host: string;
  maxRows: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-paper/15 bg-night">
      <div className="flex items-center gap-3 border-b border-paper/12 bg-paper/5 px-4 py-2.5">
        <span aria-hidden="true" className="flex shrink-0 items-center gap-2">
          <span className="size-3 rounded-full bg-signal" />
          <span className="size-3 rounded-full bg-mist" />
          <span className="size-3 rounded-full bg-lime" />
        </span>
        {/* The year is the whole point of a stacked title bar, so on a narrow
            window everything around it goes rather than the title truncating. */}
        <p className="flex-1 truncate text-center font-mono text-[11px] text-paper/60">
          <span className="hidden md:inline">
            {user}@{host} —{" "}
          </span>
          pathfetch {run.year}
          <span className="hidden md:inline"> — zsh</span>
        </p>
        {/* Balances the traffic lights so the title sits on the real centre. */}
        <span aria-hidden="true" className="w-13 shrink-0" />
      </div>

      <div className="px-4 py-4 font-mono text-[11px] leading-relaxed text-paper md:px-6 md:py-5 md:text-[13px]">
        <p className="text-paper/60">Last login: {run.year}-01-01 09:41:22 on ttys002</p>
        <div className="mt-3">
          <AsciiRun run={run} user={user} host={host} maxRows={maxRows} />
        </div>
        <div className="pt-4">
          <Prompt user={user} host={host}>
            <Caret />
          </Prompt>
        </div>
      </div>
    </div>
  );
}

export function AsciiTerminal({
  runs,
  user = "harsh",
  host = "macbook",
  className,
}: AsciiTerminalProps) {
  const isMobile = useIsMobile();
  // Clears the fixed navbar, which sits lower relative to a phone viewport.
  const base = isMobile ? 64 : 76;
  const { rows, stack } = useRowBudget(
    base + Math.max(0, runs.length - 1) * PEEK,
    isMobile
  );
  // Unstacked, nothing has to fit one screen, so the art gets its full size.
  const maxRows = stack ? rows : isMobile ? 34 : 42;

  return (
    <div className={cn("relative flex flex-col", stack ? "gap-[7vh]" : "gap-8", className)}>
      {runs.map((run, i) => (
        <div
          key={run.year}
          className={stack ? "sticky" : undefined}
          style={stack ? { top: base + i * PEEK } : undefined}
        >
          <TerminalWindow run={run} user={user} host={host} maxRows={maxRows} />
        </div>
      ))}
      {/* Runway for the last window. A sticky child is constrained by its
          parent's *content* box, so padding on the stack buys nothing — only a
          real element does. Without it the deck scrolls away in the same breath
          it finishes assembling, and the top window never pins at all. */}
      {stack ? <div aria-hidden="true" className="h-[16vh]" /> : null}
    </div>
  );
}

export type { TerminalRun };
