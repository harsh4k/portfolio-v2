import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

/**
 * Full-screen curtain page transitions, modelled on the motion.dev "curtains"
 * examples (wipe / stagger wipe / shutter). The curtain covers the viewport,
 * the route swaps underneath it, then it retracts — so the visitor never sees
 * the Suspense gap or the scroll-reset jump between routes.
 */
export type CurtainVariant = "wipe" | "clipWipe" | "stagger" | "shutter";

const COLUMNS: Record<CurtainVariant, number> = {
  wipe: 1,
  clipWipe: 1,
  stagger: 6,
  shutter: 6,
};

// Per-panel stagger. The single-panel variants have nothing to stagger.
const STAGGER: Record<CurtainVariant, number> = {
  wipe: 0,
  clipWipe: 0,
  stagger: 0.045,
  shutter: 0.06,
};

const DURATION = 0.52;

// easeInOutQuart on the way in (decisive), easeOutExpo on the way out (soft landing)
const EASE_COVER = [0.76, 0, 0.24, 1] as const;
const EASE_REVEAL = [0.16, 1, 0.3, 1] as const;

// Delay of panel `i`, in seconds. `stagger` sweeps left→right; `shutter` opens
// from the middle outwards like real shutter blades.
function panelDelay(variant: CurtainVariant, i: number, total: number) {
  if (variant === "shutter") {
    const centre = (total - 1) / 2;
    return Math.abs(i - centre) * STAGGER[variant];
  }
  return i * STAGGER[variant];
}

function phaseMs(variant: CurtainVariant) {
  const total = COLUMNS[variant];
  const last = Math.max(...Array.from({ length: total }, (_, i) => panelDelay(variant, i, total)));
  return (DURATION + last) * 1000;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type Phase = "idle" | "cover" | "reveal";

interface CurtainRequest {
  to: string;
  variant: CurtainVariant;
  label?: string;
  /** Warms the destination's lazy chunk so the reveal never lands on a blank frame. */
  prefetch?: () => Promise<unknown>;
}

interface CurtainContextValue {
  navigateWithCurtain: (request: CurtainRequest) => void;
  transitioning: boolean;
}

const CurtainContext = createContext<CurtainContextValue | null>(null);

export function useCurtain() {
  const ctx = useContext(CurtainContext);
  if (!ctx) throw new Error("useCurtain must be used inside <CurtainProvider>");
  return ctx;
}

export function CurtainProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("idle");
  const [request, setRequest] = useState<CurtainRequest | null>(null);
  const phaseRef = useRef<Phase>("idle");

  phaseRef.current = phase;

  const navigateWithCurtain = useCallback(
    (next: CurtainRequest) => {
      // Ignore re-entrant clicks while a curtain is already running.
      if (phaseRef.current !== "idle") return;

      if (prefersReducedMotion()) {
        navigate(next.to);
        return;
      }

      void next.prefetch?.();
      setRequest(next);
      setPhase("cover");
    },
    [navigate],
  );

  // cover → (route swap) → reveal → idle
  useEffect(() => {
    if (phase === "idle" || !request) return;

    if (phase === "cover") {
      let cancelled = false;
      const covered = new Promise<void>((resolve) =>
        window.setTimeout(resolve, phaseMs(request.variant)),
      );
      // Wait for the chunk too — an unresolved lazy import would otherwise
      // reveal an empty Suspense fallback.
      void Promise.all([covered, request.prefetch?.()])
        // A rejected import (offline with a cold cache, or a stale deploy)
        // must not strand us in "cover": that leaves a full-screen opaque
        // overlay with pointerEvents:auto and body overflow locked, and the
        // freeze effect below only unwinds on a phase change that never
        // comes. Fall back to the cover timing and reveal anyway — Suspense
        // and the ErrorBoundary handle the missing route from there.
        .catch(() => covered)
        .then(() => {
          if (cancelled) return;
          navigate(request.to);
          setPhase("reveal");
        });
      return () => {
        cancelled = true;
      };
    }

    const id = window.setTimeout(() => {
      setPhase("idle");
      setRequest(null);
    }, phaseMs(request.variant));
    return () => window.clearTimeout(id);
  }, [phase, request, navigate]);

  // Freeze the page behind the curtain so a stray scroll can't shift the
  // outgoing route while it's hidden.
  useEffect(() => {
    if (phase === "idle") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  const value = useMemo(
    () => ({ navigateWithCurtain, transitioning: phase !== "idle" }),
    [navigateWithCurtain, phase],
  );

  return (
    <CurtainContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {request && phase !== "idle" ? (
          <Curtain key="curtain" phase={phase} variant={request.variant} label={request.label} />
        ) : null}
      </AnimatePresence>
    </CurtainContext.Provider>
  );
}

function Curtain({
  phase,
  variant,
  label,
}: {
  phase: Phase;
  variant: CurtainVariant;
  label?: string;
}) {
  const total = COLUMNS[variant];
  const covering = phase === "cover";

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex overflow-hidden"
      style={{ pointerEvents: "auto" }}
    >
      {Array.from({ length: total }, (_, i) => {
        const delay = panelDelay(variant, i, total);
        const transition = {
          duration: DURATION,
          delay,
          ease: covering ? EASE_COVER : EASE_REVEAL,
        };

        if (variant === "shutter") {
          // Two blades per column, closing on the horizon and retracting to it.
          return (
            <div key={i} className="relative h-full flex-1">
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2 bg-ink"
                style={{ originY: 0 }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: covering ? 1 : 0 }}
                transition={transition}
              />
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
                style={{ originY: 1 }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: covering ? 1 : 0 }}
                transition={transition}
              />
            </div>
          );
        }

        if (variant === "clipWipe") {
          // The panel never moves — its clip region does, so the fill is
          // revealed and erased in place rather than sliding across.
          return (
            <motion.div
              key={i}
              className="relative h-full flex-1 bg-ink"
              initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
              animate={{
                clipPath: covering ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)",
              }}
              transition={transition}
            />
          );
        }

        if (variant === "wipe") {
          // Single panel sweeping across: in from the left, out to the right.
          return (
            <motion.div
              key={i}
              className="relative h-full flex-1 bg-ink"
              initial={{ x: "-101%" }}
              animate={{ x: covering ? "0%" : "101%" }}
              transition={transition}
            >
              <span className="absolute inset-y-0 right-0 w-[3px] bg-signal" />
            </motion.div>
          );
        }

        // stagger: full-height columns dropping in from the top, out the bottom.
        return (
          <motion.div
            key={i}
            className="h-full flex-1 bg-ink"
            style={{ originY: covering ? 0 : 1 }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: covering ? 1 : 0 }}
            transition={transition}
          />
        );
      })}

      {label ? (
        <motion.span
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-display text-[13vw] uppercase leading-none tracking-[-0.05em] text-paper md:text-[7vw]"
          initial={{ opacity: 0, y: 16 }}
          animate={covering ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
          transition={{
            duration: 0.32,
            delay: covering ? DURATION * 0.55 : 0,
            ease: EASE_REVEAL,
          }}
        >
          {label}
        </motion.span>
      ) : null}
    </div>
  );
}
