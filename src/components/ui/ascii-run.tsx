import * as React from "react";
import { useReducedMotion } from "motion/react";
import { useIsMobile } from "../../hooks/use-media";
import { AsciiReadout } from "./ascii-readout";

export interface TerminalRun {
  year: string;
  title: string;
  description: string;
  image: string;
  tint?: "lime" | "signal" | "paper";
}

const TINT: Record<NonNullable<TerminalRun["tint"]>, string> = {
  lime: "var(--color-lime)",
  signal: "var(--color-signal)",
  paper: "var(--color-paper)",
};

/** typing → decoding → done. Each stage owns one timer. */
type Phase = "idle" | "typing" | "decoding" | "done";

const KEY_MS = 34;
const ENTER_PAUSE = 7; // key-ticks held between the last character and Enter
const DECODE_MS = 720;
const REVEAL_MS = 700;
// `decoding Hackathon.webp [ … ] 100%` is the widest line in the transcript, so
// the bar has to give ground on a phone or the terminal scrolls sideways.
const BAR_CELLS = { narrow: 10, wide: 20 };
// Matches the row budget `AsciiTerminal` computes for a window's art area, so
// swapping ascii rows for a real photo keeps the same stacked-window height.
const LINE_HEIGHT = { narrow: 6.5, wide: 7.6 };

export function Caret() {
  return (
    <span
      aria-hidden="true"
      className="terminal-caret ml-px inline-block h-[1em] w-[0.55em] translate-y-[0.12em] bg-paper"
    />
  );
}

export function Prompt({
  user,
  host,
  accent,
  children,
}: {
  user: string;
  host: string;
  /** Colour for `user@host`. Defaults to the shell's own lime. */
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <p className="break-all">
      <span className={accent ? undefined : "text-lime"} style={accent ? { color: accent } : undefined}>
        {user}
        <span className="text-paper/45">@</span>
        {host}
      </span>{" "}
      <span className="text-paper/55">~/path</span>{" "}
      <span className="text-signal">%</span> {children}
    </p>
  );
}

interface AsciiRunProps {
  run: TerminalRun;
  user: string;
  host: string;
  /** Row budget the art used to fill as ascii text; now converted to a pixel
   * height cap so a real photo still keeps one screen's worth of stacked
   * windows fitting the viewport. */
  maxRows?: number;
}

export function AsciiRun({ run, user, host, maxRows = 30 }: AsciiRunProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const [phase, setPhase] = React.useState<Phase>("idle");
  const [typed, setTyped] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [imgSize, setImgSize] = React.useState<{ w: number; h: number } | null>(null);
  const [imgError, setImgError] = React.useState(false);

  const command = `pathfetch ${run.year}`;
  const file = run.image.split("/").pop() ?? run.image;
  const tint = TINT[run.tint ?? "paper"];
  const cells = isMobile ? BAR_CELLS.narrow : BAR_CELLS.wide;
  const artHeight = Math.round(maxRows * (isMobile ? LINE_HEIGHT.narrow : LINE_HEIGHT.wide));

  // Preload as soon as the run mounts — well before the decode bar is
  // triggered — so the progress bar is never waiting on real work.
  React.useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => {
      if (!cancelled) setImgError(true);
    };
    img.src = run.image;
    return () => {
      cancelled = true;
    };
  }, [run.image]);

  // Runs fire on scroll, so each window prints itself as it reaches the top of
  // the stack rather than all three racing on mount.
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPhase("typing");
        observer.disconnect();
      },
      { rootMargin: "-5% 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (phase !== "typing") return;
    if (reduced) {
      setTyped(command.length);
      setPhase("decoding");
      return;
    }
    let tick = 0;
    const id = window.setInterval(() => {
      tick += 1;
      if (tick <= command.length) setTyped(tick);
      else if (tick >= command.length + ENTER_PAUSE) {
        window.clearInterval(id);
        setPhase("decoding");
      }
    }, KEY_MS);
    return () => window.clearInterval(id);
  }, [phase, command, reduced]);

  React.useEffect(() => {
    if (phase !== "decoding") return;
    if (reduced) {
      setProgress(100);
      setPhase("done");
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DECODE_MS);
      setProgress(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setPhase("done");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, reduced]);

  const started = phase !== "idle";
  const settled = phase === "done";
  const failed = settled && imgError;
  const facts: [string, string][] = [
    ["Year", run.year],
    ["Chapter", run.title],
    ["Log", run.description],
    ["Source", file],
    ["Render", imgSize ? `image · ${imgSize.w}×${imgSize.h}` : "—"],
  ];

  return (
    <div ref={rootRef}>
      <Prompt user={user} host={host} accent={tint}>
        <span className="text-paper">{command.slice(0, typed)}</span>
        {phase === "typing" ? <Caret /> : null}
      </Prompt>

      {started && phase !== "typing" ? (
        <p className="mt-1.5 text-paper/60">
          <span className="text-paper/60">decoding</span>{" "}
          <span className="text-paper/85">{file}</span>{"  "}
          <span style={{ color: tint }}>
            [{"█".repeat(Math.round((progress / 100) * cells))}
            {"░".repeat(cells - Math.round((progress / 100) * cells))}]
          </span>{" "}
          <span className="tabular-nums">{String(progress).padStart(3, " ")}%</span>
        </p>
      ) : null}

      {failed ? (
        <p className="mt-1.5 text-signal">error: could not decode {file}</p>
      ) : null}

      <div className="mt-3 grid gap-4 md:grid-cols-[1fr_0.9fr] md:gap-8">
        <div className="relative min-w-0 overflow-hidden rounded-md bg-night" style={{ height: artHeight }}>
          <img
            src={run.image}
            alt={`Photo from ${run.year}: ${run.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain transition-opacity ease-out"
            style={{
              opacity: settled ? 1 : 0,
              transitionDuration: reduced ? "0ms" : `${REVEAL_MS}ms`,
            }}
          />
        </div>

        <AsciiReadout
          user={user}
          scope={run.year}
          facts={facts}
          tint={tint}
          shown={settled}
          reduced={!!reduced}
        />
      </div>
    </div>
  );
}
