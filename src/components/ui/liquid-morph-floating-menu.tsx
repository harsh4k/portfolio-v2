import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const ITEM_HEIGHT = 26; // one line of display type at 22px
const ITEM_GAP = 20;
const BAR_HEIGHT = 48;
const OPEN_PADDING = 24;

export interface FloatingMenuItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

/** Label whose characters roll to a duplicate of themselves, staggered left to right. */
interface MenuButtonProps {
  label: string;
  onClick?: () => void;
  isOpen: boolean;
  index: number;
  active?: boolean;
}

function MenuButton({ label, onClick, isOpen, index, active }: MenuButtonProps) {
  const [hovered, setHovered] = useState(false);
  const animatingRef = useRef(false);
  const pendingLeaveRef = useRef(false);
  const chars = label.split("");
  const lockDuration = 30 * chars.length + 300;

  // hold the rolled state until the stagger finishes, so a quick leave doesn't snap mid-roll
  const handleEnter = useCallback(() => {
    pendingLeaveRef.current = false;
    if (hovered) return;
    setHovered(true);
    animatingRef.current = true;
    setTimeout(() => {
      animatingRef.current = false;
      if (pendingLeaveRef.current) {
        pendingLeaveRef.current = false;
        setHovered(false);
      }
    }, lockDuration);
  }, [hovered, lockDuration]);

  const handleLeave = useCallback(() => {
    if (animatingRef.current) pendingLeaveRef.current = true;
    else setHovered(false);
  }, []);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      tabIndex={isOpen ? 0 : -1}
      aria-hidden={!isOpen}
      aria-current={active ? "page" : undefined}
      className={`overflow-hidden font-display text-[22px] uppercase leading-none tracking-tight focus:outline-none ${
        active ? "text-lime" : "text-paper"
      }`}
      style={{ height: "1.15em" }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.4, delay: isOpen ? 0.4 + 0.08 * index : 0, ease: EASE }}
    >
      <span className="flex justify-center">
        {chars.map((char, i) => (
          <span key={i} className="inline-block overflow-hidden" style={{ height: "1.15em" }}>
            <span
              className="flex flex-col"
              style={{
                transitionProperty: "transform",
                transitionDuration: hovered ? "800ms" : "0ms",
                transitionDelay: hovered ? `${30 * i}ms` : "0ms",
                transform: hovered ? "translateY(-50%)" : "translateY(0%)",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <span className="block" style={{ height: "1.15em", lineHeight: "1.15em" }}>
                {char === " " ? " " : char}
              </span>
              <span
                className="block"
                style={{ height: "1.15em", lineHeight: "1.15em" }}
                aria-hidden
              >
                {char === " " ? " " : char}
              </span>
            </span>
          </span>
        ))}
      </span>
    </motion.button>
  );
}

/**
 * Bottom-docked mobile menu: a lime pill that morphs open while a night-ink
 * circle floods up from beneath it.
 */
export default function FloatingMenu({ items }: { items: FloatingMenuItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const openHeight =
    items.length * ITEM_HEIGHT + (items.length - 1) * ITEM_GAP + BAR_HEIGHT + OPEN_PADDING * 2;

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] left-1/2 z-50 select-none"
      style={{ x: "-50%" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <motion.div
        className="relative flex flex-col overflow-hidden shadow-[0_16px_32px_rgba(0,0,0,0.18)]"
        animate={{
          width: isOpen ? 260 : 150,
          height: isOpen ? openHeight : BAR_HEIGHT,
          borderRadius: isOpen ? 28 : 72,
        }}
        transition={{
          duration: 0.8,
          ease: EASE,
          height: { duration: isOpen ? 0.8 : 0.15 },
        }}
      >
        {/* accent shell */}
        <div
          className={`absolute inset-0 border bg-lime transition-colors duration-300 ${
            isOpen ? "border-lime" : "border-ink/25"
          }`}
          style={{ borderRadius: "inherit" }}
        />

        {/* ink circle flooding up from below */}
        <motion.div
          className="absolute left-1/2 bg-night"
          style={{ width: "200%", height: "200%", borderRadius: "50%", x: "-50%" }}
          animate={{ bottom: isOpen ? "-20%" : "-200%" }}
          transition={{ duration: 0.8, ease: EASE, delay: isOpen ? 0.1 : 0 }}
        />

        <div
          className="relative z-10 flex flex-col items-center justify-center gap-5"
          style={{
            pointerEvents: isOpen ? "auto" : "none",
            opacity: isOpen ? 1 : 0,
            flex: isOpen ? 1 : 0,
            overflow: "hidden",
          }}
        >
          {items.map((item, idx) => (
            <MenuButton
              key={item.label}
              label={item.label}
              active={item.active}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              isOpen={isOpen}
              index={idx}
            />
          ))}
        </div>

        {/* trigger bar — fills the pill while closed */}
        <motion.button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="relative z-10 flex w-full shrink-0 cursor-pointer items-center justify-between focus:outline-none"
          animate={{
            paddingLeft: isOpen ? OPEN_PADDING : 20,
            paddingRight: isOpen ? OPEN_PADDING : 20,
            paddingBottom: isOpen ? OPEN_PADDING : 0,
            height: isOpen ? BAR_HEIGHT + OPEN_PADDING : BAR_HEIGHT,
          }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span
            className={`font-sans text-[11px] font-medium uppercase tracking-[0.18em] leading-none transition-colors duration-300 ${
              isOpen ? "text-paper" : "text-ink"
            }`}
          >
            Menu
          </span>

          <span className="relative flex h-6 w-6 items-center justify-center">
            <motion.span
              className={`absolute block h-0.5 w-4.5 rounded-full transition-colors duration-300 ${
                isOpen ? "bg-paper" : "bg-ink"
              }`}
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -3 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
            <motion.span
              className={`absolute block h-0.5 w-4.5 rounded-full transition-colors duration-300 ${
                isOpen ? "bg-paper" : "bg-ink"
              }`}
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 3 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
