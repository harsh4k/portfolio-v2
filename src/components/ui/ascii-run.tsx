import * as React from "react";
import { useReducedMotion } from "motion/react";
import { imageToAscii } from "../../lib/ascii";
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

/** typing → decoding → painting → done. Each stage owns one timer. */
type Phase = "idle" | "typing" | "decoding" | "painting" | "done";

const KEY_MS = 34;
const ENTER_PAUSE = 7; // key-ticks held between the last character and Enter
const DECODE_MS = 720;
const PAINT_MS = 700;
// `decoding Hackathon.webp [ … ] 100%` is the widest line in the transcript, so
// the bar has to give ground on a phone or the terminal scrolls sideways.
const BAR_CELLS = { narrow: 10, wide: 20 };

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
  /** Row budget for the art, so one window still fits one screen. */
  maxRows?: number;
}

export function AsciiRun({ run, user, host, maxRows = 30 }: AsciiRunProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const artRef = React.useRef<HTMLDivElement>(null);
  const probeRef = React.useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const [grid, setGrid] = React.useState({ cols: 0, cellAspect: 2, lineHeight: 0, fontFamily: "monospace" });
  // null until the first decode lands; an empty array means it failed.
  const [rows, setRows] = React.useState<string[] | null>(null);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [typed, setTyped] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [painted, setPainted] = React.useState(0);

  const command = `pathfetch ${run.year}`;
  const file = run.image.split("/").pop() ?? run.image;
  const tint = TINT[run.tint ?? "paper"];
  const cells = isMobile ? BAR_CELLS.narrow : BAR_CELLS.wide;

  // Measure the character cell off a hidden probe rather than assuming the
  // font's advance width, so a fallback font can't stretch the art.
  React.useLayoutEffect(() => {
    const art = artRef.current;
    const probe = probeRef.current;
    if (!art || !probe) return;
    const read = () => {
      const cell = probe.getBoundingClientRect();
      const charWidth = cell.width / 100;
      if (!charWidth || !art.clientWidth) return;
      setGrid({
        cols: Math.max(16, Math.floor(art.clientWidth / charWidth)),
        cellAspect: Math.round((cell.height / charWidth) * 1000) / 1000,
        lineHeight: cell.height,
        fontFamily: getComputedStyle(probe).fontFamily,
      });
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(art);
    return () => observer.disconnect();
  }, []);

  // Decode as soon as the grid is known — well before the run is triggered — so
  // the progress bar is never waiting on real work. A resize re-decodes at the
  // new column count without clearing `rows` first: blanking it would drop the
  // art out of the page on every window drag and phone rotate.
  React.useEffect(() => {
    if (!grid.cols) return;
    let cancelled = false;
    imageToAscii(run.image, {
      cols: grid.cols,
      cellAspect: grid.cellAspect,
      fontFamily: grid.fontFamily,
      maxRows,
    })
      .then((art) => !cancelled && setRows(art))
      .catch(() => !cancelled && setRows([]));
    return () => {
      cancelled = true;
    };
  }, [run.image, grid.cols, grid.cellAspect, grid.fontFamily, maxRows]);

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
      setPhase("painting");
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DECODE_MS);
      setProgress(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setPhase("painting");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, reduced]);

  React.useEffect(() => {
    if (phase !== "painting" || rows === null) return;
    if (reduced || !rows.length) {
      setPainted(rows.length);
      setPhase("done");
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / PAINT_MS);
      setPainted(Math.ceil(t * rows.length));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setPhase("done");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, rows, reduced]);

  const started = phase !== "idle";
  const settled = phase === "done";
  // Once the run has settled, show whatever the current decode holds — so art
  // re-cut at a new width appears in full rather than at the old row count.
  const shown = settled ? (rows?.length ?? 0) : painted;
  const failed = settled && rows !== null && !rows.length;
  const facts: [string, string][] = [
    ["Year", run.year],
    ["Chapter", run.title],
    ["Log", run.description],
    ["Source", file],
    [
      "Render",
      rows?.length ? `ascii · ${(rows[0] ?? "").length}×${rows.length}` : "—",
    ],
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
        <div ref={artRef} className="relative min-w-0">
          {/* Zero-sized clip around the probe: it still lays out (so it can be
              measured) but can't widen the terminal's scroll box. */}
          <span
            aria-hidden="true"
            className="pointer-events-none invisible absolute top-0 left-0 h-0 w-0 overflow-hidden"
          >
            <span
              ref={probeRef}
              className="inline-block font-mono text-[6px] leading-[1.08] whitespace-pre md:text-[7px]"
            >
              {"0".repeat(100)}
            </span>
          </span>
          <pre
            role="img"
            aria-label={`ASCII rendering of a photograph from ${run.year}: ${run.title}`}
            style={{
              color: tint,
              minHeight: rows?.length ? rows.length * grid.lineHeight : undefined,
            }}
            className="overflow-hidden font-mono text-[6px] leading-[1.08] opacity-85 md:text-[7px]"
          >
            {rows ? rows.slice(0, shown).join("\n") : ""}
          </pre>
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
