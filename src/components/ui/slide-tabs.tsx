import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export interface SlideTabItem {
  id: string;
  label: string;
  onClick: () => void;
  /** Marks the tab the cursor rests on when nothing is hovered. */
  active?: boolean;
}

interface CursorPosition {
  left: number;
  width: number;
  opacity: number;
}

const HIDDEN: CursorPosition = { left: 0, width: 0, opacity: 0 };

/**
 * Pill nav with a single ink cursor that slides between tabs. The label under
 * the cursor flips to paper — done with explicit colours rather than
 * mix-blend-difference, which composites against the nav's blurred backdrop.
 */
export default function SlideTabs({
  items,
  className,
}: {
  items: SlideTabItem[];
  className?: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef(new Map<string, HTMLLIElement>());
  const [position, setPosition] = useState<CursorPosition>(HIDDEN);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeId = items.find((i) => i.active)?.id ?? null;
  const litId = hoveredId ?? activeId;

  const measure = useCallback((id: string | null): CursorPosition => {
    if (!id) return HIDDEN;
    const el = tabRefs.current.get(id);
    if (!el) return HIDDEN;
    return { left: el.offsetLeft, width: el.offsetWidth, opacity: 1 };
  }, []);

  // park the cursor on the active tab, and keep it parked through resizes
  useLayoutEffect(() => {
    setPosition(measure(activeId));
  }, [activeId, items.length, measure]);

  useEffect(() => {
    if (!listRef.current) return;
    const observer = new ResizeObserver(() => setPosition(measure(activeId)));
    observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [activeId, measure]);

  return (
    <ul
      ref={listRef}
      onMouseLeave={() => {
        setHoveredId(null);
        setPosition(measure(activeId));
      }}
      className={cn(
        "relative flex w-fit items-center rounded-full border border-ink/15 bg-paper p-1",
        className,
      )}
    >
      {items.map((item) => (
        <li
          key={item.id}
          ref={(el) => {
            if (el) tabRefs.current.set(item.id, el);
            else tabRefs.current.delete(item.id);
          }}
          onMouseEnter={() => {
            setHoveredId(item.id);
            setPosition(measure(item.id));
          }}
          className="relative z-10 block"
        >
          <button
            type="button"
            onClick={item.onClick}
            id={`nav-link-${item.id}`}
            aria-current={item.active ? "page" : undefined}
            className={`block cursor-pointer px-4 py-1.5 font-sans text-[13px] font-medium transition-colors duration-200 focus:outline-none ${
              litId === item.id ? "text-paper" : "text-ink"
            }`}
          >
            {item.label}
          </button>
        </li>
      ))}

      <motion.li
        aria-hidden
        animate={{ left: position.left, width: position.width, opacity: position.opacity }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="absolute top-1 bottom-1 z-0 rounded-full bg-ink"
      />
    </ul>
  );
}
