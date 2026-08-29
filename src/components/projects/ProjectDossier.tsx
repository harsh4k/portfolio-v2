import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "../../types";
import { EASE } from "../../lib/motion";

const ACCENTS: Record<"red" | "lime", string> = {
  red: "#F13A18",
  lime: "#C9FF3D",
};

// Coffee Digital ships twice — the fast rebrand and the ground-up rebuild.
// That pairing is the point, so each dossier points at the other rather than
// leaving the reader to notice the connection on their own.
const RELATED: Record<string, { id: string; label: string }> = {
  "coffee-digital": { id: "coffee-rebuild", label: "See the ground-up rebuild" },
  "coffee-rebuild": { id: "coffee-digital", label: "See the original shipped site" },
};

interface ProjectDossierProps {
  project: Project;
  accentColor: "red" | "lime";
  onClose: () => void;
  onOpenId: (id: string) => void;
  restoreFocusRef?: React.RefObject<HTMLElement | null>;
}

export default function ProjectDossier({
  project,
  accentColor,
  onClose,
  onOpenId,
  restoreFocusRef,
}: ProjectDossierProps) {
  const accent = ACCENTS[accentColor];
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [pinned, setPinned] = useState(false);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "18%"]);
  useMotionValueEvent(scrollYProgress, "change", (v) => setPinned(v >= 0.98));

  // Scroll lock while the dossier is open — the same lock/restore pattern
  // curtain-transition.tsx uses for its full-viewport overlay.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Focus in on open, back to the originating plate on close. preventScroll
  // matters here: the close button is position:fixed, but some browsers
  // still try to "reveal" a newly-focused element by scrolling its nearest
  // scrollable ancestor — which here is the dossier's own content, so
  // without it the hero silently scrolls out of view the instant it opens.
  useEffect(() => {
    closeButtonRef.current?.focus({ preventScroll: true });
    return () => {
      restoreFocusRef?.current?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const related = RELATED[project.id];
  const spec = [
    { label: "Role", value: project.role },
    { label: "Year", value: project.year },
    { label: "Status", value: project.status },
  ];

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`dossier-title-${project.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: EASE }}
      className="fixed inset-0 z-[90] overflow-y-auto bg-paper text-ink"
    >
      {/* One header bar, not two competing fixed layers — the close button
          stays put at the right edge always, and the pinned title/live-chip
          fade in beside it once the hero scrolls past, rather than a second
          bar landing in the same corner and fighting it for space. */}
      <div
        className="fixed inset-x-0 top-0 z-10 flex items-center justify-between gap-4 px-4 py-3 backdrop-blur transition-colors duration-300 md:px-8 md:py-4"
        style={{
          backgroundColor: pinned ? "color-mix(in srgb, var(--color-paper) 95%, transparent)" : "transparent",
          borderBottom: pinned ? "1px solid color-mix(in srgb, var(--color-ink) 10%, transparent)" : "1px solid transparent",
        }}
      >
        <span
          className="font-mono text-micro uppercase tracking-widest transition-opacity duration-300"
          style={{ opacity: pinned ? 1 : 0 }}
        >
          {project.number} · {project.title}
        </span>

        <div className="flex items-center gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="label-micro rounded-full px-3 py-1.5 text-ink transition-opacity duration-300"
              style={{ backgroundColor: accent, opacity: pinned ? 1 : 0, pointerEvents: pinned ? "auto" : "none" }}
            >
              Live
            </a>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-paper/90 backdrop-blur transition-colors hover:bg-ink hover:text-paper"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[840px] px-4 pb-32 pt-14 md:px-8">
        <div ref={heroRef} className="overflow-hidden rounded-lg border border-ink/10 bg-ink">
          <motion.div layoutId={`plate-image-${project.id}`} style={{ y: heroY }} className="will-change-transform">
            <img
              src={project.detail.cover}
              alt={project.title}
              loading="eager"
              decoding="async"
              className="block h-auto w-full"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
          className="mt-8"
        >
          <div className="flex items-start gap-4">
            <span className="mt-1 shrink-0 font-sans text-[11px] font-medium leading-none tracking-[0.15em]" style={{ color: accent }}>
              {project.number}
            </span>
            <h1 id={`dossier-title-${project.id}`} className="font-display text-[clamp(1.75rem,6vw,3.25rem)] uppercase leading-[0.88] tracking-[-0.03em]">
              {project.title}
            </h1>
          </div>

          <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink/70">
            {project.description}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 sm:grid-cols-3">
            {spec.map((row) => (
              <div key={row.label} className="bg-paper px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">{row.label}</p>
                <p className="mt-1 font-mono text-[13px]">{row.value}</p>
              </div>
            ))}
            <div className="col-span-2 bg-paper px-4 py-3 sm:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">Stack</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-ink/12 px-2.5 py-1 font-mono text-[10px] text-ink/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4 border-t border-ink/[0.06] pt-8">
            {project.detail.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + 0.08 * i, duration: 0.5, ease: EASE }}
                className="text-sm leading-[1.8] text-ink/70"
              >
                {para}
              </motion.p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex items-center gap-3 rounded-full bg-signal px-6 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-paper transition-all hover:bg-ink hover:-translate-y-0.5"
              >
                Visit Live Site
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-[0.35s] group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex items-center gap-3 rounded-full border border-ink/20 px-6 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-ink transition-all hover:-translate-y-0.5 hover:border-ink"
              >
                View Source
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-[0.35s] group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
              </a>
            )}
          </div>

          {related && (
            <button
              type="button"
              onClick={() => onOpenId(related.id)}
              className="group/related mt-10 inline-flex items-center gap-2 border-b border-ink/20 pb-1 font-sans text-[11px] uppercase tracking-[0.14em] text-ink/60 transition-colors hover:border-ink hover:text-ink"
            >
              {related.label}
              <ArrowUpRight className="h-3 w-3 transition-transform duration-[0.35s] group-hover/related:translate-x-0.5 group-hover/related:-translate-y-0.5" />
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
