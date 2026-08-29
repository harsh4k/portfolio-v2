import { useEffect, useRef, useState, useCallback } from "react";
import { useCoarsePointer } from "../../hooks/use-media";

/**
 * High-performance interactive grid background. Uses refs + direct DOM writes
 * (no per-mousemove React re-renders). Cells are perfect squares derived from
 * `cellSize`. Foreground text that sits over this and uses `mix-blend-mode:
 * difference` will invert against lit cells.
 *
 * Two modes, picked from pointer capability rather than viewport width:
 *  - fine (mouse/trackpad): pointer trail only, exactly as before.
 *  - coarse (touch): drag trail + tap ripple, plus an ambient wave so the hero
 *    still moves when nobody is touching it.
 */

export interface TrailGridProps {
  cellSize?: number;
  /** Cell size on touch devices — bigger reads better at finger scale. */
  coarseCellSize?: number;
  duration?: number;
  cellColor?: string;
}

// Ambient wave (coarse pointers only). Travelling sine crests rather than a
// sweep, so the loop never reads as a repeating bar.
const AMBIENT_TICK_MS = 50; // ~20fps — imperceptible at this speed, easy on the battery
const AMBIENT_THRESHOLD = 0.86; // keeps roughly 8% of cells lit
const AMBIENT_SPEED = 1.6;
const AMBIENT_COL_K = 0.55;
const AMBIENT_ROW_K = 0.28;
/** After a touch, the ambient wave stands down this long so the trail has the stage. */
const TOUCH_QUIET_MS = 1200;
const RIPPLE_RINGS = 4;
const RIPPLE_RING_MS = 45;

export default function TrailGrid({
  cellSize = 40,
  coarseCellSize = 56,
  duration = 150,
  cellColor = "#161513",
}: TrailGridProps) {
  const coarse = useCoarsePointer();
  const size = coarse ? coarseCellSize : cellSize;

  const cellsRef = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const rippleTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastHoveredRef = useRef<number>(-1);
  const quietUntilRef = useRef<number>(0);
  const quietBoxRef = useRef<{ r0: number; r1: number; c0: number; c1: number } | null>(null);

  const [gridDimensions, setGridDimensions] = useState({ cols: 0, rows: 0 });

  const calculateGrid = useCallback(() => {
    if (typeof window === "undefined") return;
    const cols = Math.ceil(document.documentElement.clientWidth / size);
    const rows = Math.ceil(document.documentElement.clientHeight / size);
    setGridDimensions({ cols, rows });

    // Cells covered by the mix-blend-mode text. The ambient wave skips them —
    // otherwise every passing crest inverts part of the headline to black.
    // Padded by a cell because the text is still mid intro-rise on first read.
    const quiet = document.querySelector("[data-trail-quiet]");
    if (quiet) {
      const r = quiet.getBoundingClientRect();
      quietBoxRef.current = {
        c0: Math.floor(r.left / size) - 1,
        c1: Math.ceil(r.right / size) + 1,
        r0: Math.floor(r.top / size) - 1,
        r1: Math.ceil(r.bottom / size) + 1,
      };
    } else {
      quietBoxRef.current = null;
    }
  }, [size]);

  useEffect(() => {
    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, [calculateGrid]);

  useEffect(() => {
    const { cols: columns, rows } = gridDimensions;
    if (columns === 0 || rows === 0) return;

    cellsRef.current = cellsRef.current.slice(0, columns * rows);

    // Scrub reused nodes so no cell is stuck lit after a resize.
    cellsRef.current.forEach((cell) => {
      if (cell) {
        cell.classList.remove("active", "ambient");
        cell.style.borderRadius = "4px";
      }
    });

    // A cell counts as lit for corner-merging whether it was lit by the pointer
    // trail or by the ambient wave, so the two never leave a seam between them.
    const isLit = (el: HTMLDivElement | null | undefined) =>
      !!el && (el.classList.contains("active") || el.classList.contains("ambient"));

    const updateCellAndNeighbors = (index: number) => {
      if (!cellsRef.current[index]) return;

      const row = Math.floor(index / columns);
      const col = index % columns;

      const updateRadii = (i: number, r: number, c: number) => {
        if (i < 0 || i >= columns * rows || !cellsRef.current[i]) return;

        const topActive = r > 0 && isLit(cellsRef.current[i - columns]);
        const bottomActive = r < rows - 1 && isLit(cellsRef.current[i + columns]);
        const leftActive = c > 0 && isLit(cellsRef.current[i - 1]);
        const rightActive = c < columns - 1 && isLit(cellsRef.current[i + 1]);

        const tl = topActive || leftActive ? "0" : "4px";
        const tr = topActive || rightActive ? "0" : "4px";
        const br = bottomActive || rightActive ? "0" : "4px";
        const bl = bottomActive || leftActive ? "0" : "4px";

        cellsRef.current[i]!.style.borderRadius = `${tl} ${tr} ${br} ${bl}`;
      };

      updateRadii(index, row, col);
      if (row > 0) updateRadii(index - columns, row - 1, col);
      if (row < rows - 1) updateRadii(index + columns, row + 1, col);
      if (col > 0) updateRadii(index - 1, row, col - 1);
      if (col < columns - 1) updateRadii(index + 1, row, col + 1);
    };

    /** Lights one cell and schedules its decay. Shared by trail and ripple. */
    const lightCell = (index: number, life: number = duration) => {
      const targetCell = cellsRef.current[index];
      if (!targetCell) return;

      targetCell.classList.add("active");
      updateCellAndNeighbors(index);

      const existing = timeoutsRef.current.get(index);
      if (existing) clearTimeout(existing);

      const timeout = setTimeout(() => {
        const cell = cellsRef.current[index];
        if (cell) {
          cell.classList.remove("active");
          updateCellAndNeighbors(index);
        }
        timeoutsRef.current.delete(index);
      }, life);

      timeoutsRef.current.set(index, timeout);
    };

    // Raw mousemove can fire far more often than the display repaints (high
    // poll-rate mice, trackpads). Only the position from the latest event
    // before each paint matters, so writes are batched to one per rAF instead
    // of running (and potentially recalculating style) on every raw event.
    const pendingPosRef = { current: null as { x: number; y: number } | null };
    let rafId: number | null = null;

    const applyPending = () => {
      rafId = null;
      const pos = pendingPosRef.current;
      if (!pos) return;

      const col = Math.floor(pos.x / size);
      const row = Math.floor(pos.y / size);

      if (col >= 0 && col < columns && row >= 0 && row < rows) {
        const index = row * columns + col;
        if (index !== lastHoveredRef.current) {
          lastHoveredRef.current = index;
          lightCell(index);
        }
      }
    };

    const queuePos = (x: number, y: number) => {
      pendingPosRef.current = { x, y };
      if (rafId === null) rafId = requestAnimationFrame(applyPending);
    };

    // Don't light cells over buttons/links, so the trail never overlaps
    // interactive elements.
    const inDeadZone = (target: EventTarget | null) =>
      !!(target as HTMLElement | null)?.closest("a, button, [data-no-trail]");

    const handleMouseMove = (e: MouseEvent) => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      if (inDeadZone(e.target)) return;
      queuePos(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      lastHoveredRef.current = -1;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch || inDeadZone(e.target)) return;
      quietUntilRef.current = performance.now() + TOUCH_QUIET_MS;
      queuePos(touch.clientX, touch.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch || inDeadZone(e.target)) return;
      quietUntilRef.current = performance.now() + TOUCH_QUIET_MS;

      const col0 = Math.floor(touch.clientX / size);
      const row0 = Math.floor(touch.clientY / size);
      if (col0 < 0 || col0 >= columns || row0 < 0 || row0 >= rows) return;

      // Reset so a drag starting on this cell can re-light it.
      lastHoveredRef.current = -1;
      lightCell(row0 * columns + col0, duration * 2);

      // Rounded-Euclidean rings give a circular ripple (Manhattan would be a diamond).
      for (let d = 1; d <= RIPPLE_RINGS; d++) {
        const ring = d;
        const timer = setTimeout(() => {
          for (let row = Math.max(0, row0 - ring); row <= Math.min(rows - 1, row0 + ring); row++) {
            for (let col = Math.max(0, col0 - ring); col <= Math.min(columns - 1, col0 + ring); col++) {
              if (Math.round(Math.hypot(col - col0, row - row0)) !== ring) continue;
              lightCell(row * columns + col, duration * 2);
            }
          }
        }, ring * RIPPLE_RING_MS);
        rippleTimersRef.current.push(timer);
      }
    };

    // ---- Ambient wave -----------------------------------------------------
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wantsAmbient = coarse && !reduced;

    let ambientRaf: number | null = null;
    let ambientLast = 0;
    let ambientLit = new Set<number>();
    const ambientStart = performance.now();

    const inQuietBox = (row: number, col: number) => {
      const b = quietBoxRef.current;
      return !!b && row >= b.r0 && row <= b.r1 && col >= b.c0 && col <= b.c1;
    };

    const clearAmbient = () => {
      ambientLit.forEach((i) => {
        cellsRef.current[i]?.classList.remove("ambient");
        updateCellAndNeighbors(i);
      });
      ambientLit = new Set();
    };

    const ambientTick = (now: number) => {
      ambientRaf = requestAnimationFrame(ambientTick);
      if (now - ambientLast < AMBIENT_TICK_MS) return;
      ambientLast = now;

      if (now < quietUntilRef.current) {
        if (ambientLit.size) clearAmbient();
        return;
      }

      const t = (now - ambientStart) / 1000;
      const next = new Set<number>();
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          if (inQuietBox(row, col)) continue;
          if (Math.sin(col * AMBIENT_COL_K + row * AMBIENT_ROW_K - t * AMBIENT_SPEED) > AMBIENT_THRESHOLD) {
            next.add(row * columns + col);
          }
        }
      }

      // Only touch cells that entered or left the crest — typically 0-4 per tick.
      ambientLit.forEach((i) => {
        if (next.has(i)) return;
        cellsRef.current[i]?.classList.remove("ambient");
        updateCellAndNeighbors(i);
      });
      next.forEach((i) => {
        if (ambientLit.has(i)) return;
        cellsRef.current[i]?.classList.add("ambient");
        updateCellAndNeighbors(i);
      });
      ambientLit = next;
    };

    const startAmbient = () => {
      if (!wantsAmbient || ambientRaf !== null) return;
      ambientLast = 0;
      ambientRaf = requestAnimationFrame(ambientTick);
    };
    const stopAmbient = () => {
      if (ambientRaf === null) return;
      cancelAnimationFrame(ambientRaf);
      ambientRaf = null;
    };
    const handleVisibility = () => {
      if (document.hidden) stopAmbient();
      else startAmbient();
    };

    const timeouts = timeoutsRef.current;
    const ripples = rippleTimersRef.current;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    startAmbient();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (rafId !== null) cancelAnimationFrame(rafId);
      stopAmbient();
      timeouts.forEach(clearTimeout);
      timeouts.clear();
      ripples.forEach(clearTimeout);
      ripples.length = 0;
      lastHoveredRef.current = -1;
    };
  }, [gridDimensions, duration, size, coarse]);

  if (gridDimensions.cols === 0) return null;

  return (
    <div
      className="bg-grid-wrapper"
      data-coarse={coarse ? "true" : "false"}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        gridTemplateColumns: `repeat(${gridDimensions.cols}, ${size}px)`,
        gridTemplateRows: `repeat(${gridDimensions.rows}, ${size}px)`,
        gap: 0,
        padding: 0,
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    >
      <style suppressHydrationWarning>{`
        .bg-grid-wrapper { display: grid; }
        .cell { background-color: transparent; border-radius: 4px; }
        .cell.active { background-color: ${cellColor}; }
        /* Ambient runs on touch only. Kept faint so passing crests read as a
           shimmer instead of hard-inverting anything blended over them. */
        .cell.ambient { background-color: color-mix(in srgb, ${cellColor} 22%, transparent); }
        .cell.active.ambient { background-color: ${cellColor}; }
        /* Softens the touch trail and the ambient wave without changing the
           instant pop of the desktop pointer trail. */
        .bg-grid-wrapper[data-coarse="true"] .cell { transition: background-color 180ms linear; }
      `}</style>
      {Array.from({ length: gridDimensions.cols * gridDimensions.rows }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            cellsRef.current[i] = el;
          }}
          className="cell"
        />
      ))}
    </div>
  );
}
