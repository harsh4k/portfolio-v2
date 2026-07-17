import { useEffect, useRef, useState, useCallback } from "react";

/**
 * High-performance interactive grid background. Uses refs + direct DOM writes
 * (no per-mousemove React re-renders). Cells are perfect squares derived from
 * `cellSize`. Foreground text that sits over this and uses `mix-blend-mode:
 * difference` will invert against lit cells.
 */

export interface TrailGridProps {
  cellSize?: number;
  duration?: number;
  cellColor?: string;
}

export default function TrailGrid({
  cellSize = 40,
  duration = 150,
  cellColor = "#161513",
}: TrailGridProps) {
  const cellsRef = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const lastHoveredRef = useRef<number>(-1);

  const [gridDimensions, setGridDimensions] = useState({ cols: 0, rows: 0 });

  const calculateGrid = useCallback(() => {
    if (typeof window === "undefined") return;
    // Touch devices never show the grid (CSS hides it) — skip building the DOM at all.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const cols = Math.ceil(document.documentElement.clientWidth / cellSize);
    const rows = Math.ceil(document.documentElement.clientHeight / cellSize);
    setGridDimensions({ cols, rows });
  }, [cellSize]);

  useEffect(() => {
    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, [calculateGrid]);

  useEffect(() => {
    const { cols: columns, rows } = gridDimensions;
    if (columns === 0 || rows === 0) return;

    cellsRef.current = cellsRef.current.slice(0, columns * rows);

    // Scrub reused nodes so no cell is stuck active after a resize.
    cellsRef.current.forEach((cell) => {
      if (cell) {
        cell.classList.remove("active");
        cell.style.borderRadius = "4px";
      }
    });

    const updateCellAndNeighbors = (index: number) => {
      if (!cellsRef.current[index]) return;

      const row = Math.floor(index / columns);
      const col = index % columns;

      const updateRadii = (i: number, r: number, c: number) => {
        if (i < 0 || i >= columns * rows || !cellsRef.current[i]) return;

        const topActive = r > 0 && cellsRef.current[i - columns]?.classList.contains("active");
        const bottomActive = r < rows - 1 && cellsRef.current[i + columns]?.classList.contains("active");
        const leftActive = c > 0 && cellsRef.current[i - 1]?.classList.contains("active");
        const rightActive = c < columns - 1 && cellsRef.current[i + 1]?.classList.contains("active");

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

    const handleMouseMove = (e: MouseEvent) => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      // Dead zone: don't light cells while hovering buttons/links so the trail
      // never overlaps interactive elements.
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, [data-no-trail]")) return;

      const col = Math.floor(e.clientX / cellSize);
      const row = Math.floor(e.clientY / cellSize);

      if (col >= 0 && col < columns && row >= 0 && row < rows) {
        const index = row * columns + col;

        if (index !== lastHoveredRef.current) {
          lastHoveredRef.current = index;
          const targetCell = cellsRef.current[index];
          if (!targetCell) return;

          targetCell.classList.add("active");
          updateCellAndNeighbors(index);

          if (timeoutsRef.current.has(index)) {
            clearTimeout(timeoutsRef.current.get(index)!);
          }

          const timeout = setTimeout(() => {
            const cell = cellsRef.current[index];
            if (cell) {
              cell.classList.remove("active");
              updateCellAndNeighbors(index);
            }
          }, duration);

          timeoutsRef.current.set(index, timeout);
        }
      }
    };

    const handleMouseLeave = () => {
      lastHoveredRef.current = -1;
    };

    const timeouts = timeoutsRef.current;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      timeouts.forEach(clearTimeout);
      timeouts.clear();
      lastHoveredRef.current = -1;
    };
  }, [gridDimensions, duration, cellSize]);

  if (gridDimensions.cols === 0) return null;

  return (
    <div
      className="bg-grid-wrapper"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        gridTemplateColumns: `repeat(${gridDimensions.cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridDimensions.rows}, ${cellSize}px)`,
        gap: 0,
        padding: 0,
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    >
      <style suppressHydrationWarning>{`
        .bg-grid-wrapper { display: none; }
        @media (hover: hover) and (pointer: fine) {
          .bg-grid-wrapper { display: grid; }
        }
        .cell { background-color: transparent; border-radius: 4px; }
        .cell.active { background-color: ${cellColor}; }
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
