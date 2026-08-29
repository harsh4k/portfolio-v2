import { useEffect, useId, useRef } from "react";
import { cn } from "../../lib/utils";

/**
 * Gooey text that morphs *on demand* rather than on a timer.
 *
 * The original GooeyText cycled a fixed array forever, which is no use when the
 * word has to follow whatever the visitor is pointing at. This one runs a single
 * morph each time `text` changes and then sits crisp, so it can be driven
 * straight off hover state.
 *
 * Same trick underneath: two overlapping spans, one blurring out while the other
 * blurs in, with an SVG alpha threshold over both so the blurs weld into each
 * other instead of cross-fading. The filter id is per-instance — a hardcoded one
 * collides the moment two of these render on a page.
 */

export interface GooeyMorphProps {
  text: string;
  /** Seconds for one morph. */
  morphTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyMorph({ text, morphTime = 0.55, className, textClassName }: GooeyMorphProps) {
  const filterId = `gooey-${useId().replace(/:/g, "")}`;
  const fromRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);
  const previousRef = useRef<string | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = toRef.current;
    if (!from || !to) return;

    const settle = () => {
      to.textContent = text;
      to.style.filter = "";
      to.style.opacity = "1";
      from.style.filter = "";
      from.style.opacity = "0";
    };

    const previous = previousRef.current;
    previousRef.current = text;

    // First paint, or nothing actually changed: no morph, just show it.
    if (previous === null || previous === text) {
      settle();
      return;
    }

    from.textContent = previous;
    to.textContent = text;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const fraction = Math.min((now - start) / 1000 / morphTime, 1);
      if (fraction >= 1) {
        settle();
        return;
      }
      // Guard the divide: at fraction 0 this is Infinity, which the min caps.
      to.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      to.style.opacity = `${Math.pow(fraction, 0.4)}`;
      const inverse = 1 - fraction;
      from.style.filter = `blur(${Math.min(8 / inverse - 8, 100)}px)`;
      from.style.opacity = `${Math.pow(inverse, 0.4)}`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [text, morphTime]);

  return (
    <div className={cn("relative w-full min-w-0", className)}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="relative flex h-[1.05em] w-full min-w-0 items-center overflow-visible"
        style={{ filter: `url(#${filterId})` }}
      >
        <span
          ref={fromRef}
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 left-0 inline-block max-w-full -translate-y-1/2 leading-none whitespace-nowrap select-none",
            textClassName,
          )}
        />
        <span
          ref={toRef}
          className={cn(
            "absolute top-1/2 left-0 inline-block max-w-full -translate-y-1/2 leading-none whitespace-nowrap select-none",
            textClassName,
          )}
        />
      </div>
    </div>
  );
}
