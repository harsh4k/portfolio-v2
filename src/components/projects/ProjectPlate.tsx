import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { KeyboardEvent } from "react";
import type { Project } from "../../types";
import { EASE, DUR } from "../../lib/motion";

const ACCENTS: Record<"red" | "lime", string> = {
  red: "#F13A18",
  lime: "#C9FF3D",
};

interface ProjectPlateProps {
  project: Project;
  accentColor: "red" | "lime";
  index: number;
  /** True while this plate's own dossier is mounted — the layoutId hands off
   * to the dossier's hero then, so exactly one element ever holds it. */
  isOpen: boolean;
  onOpen: () => void;
  plateRef?: (el: HTMLDivElement | null) => void;
}

export default function ProjectPlate({
  project,
  accentColor,
  index,
  isOpen,
  onOpen,
  plateRef,
}: ProjectPlateProps) {
  const accent = ACCENTS[accentColor];
  const hasLive = Boolean(project.liveUrl);
  const chipUrl = project.liveUrl ?? project.repoUrl;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <motion.div
      ref={plateRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: DUR.slow, delay: (index % 4) * 0.06, ease: EASE }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open the ${project.title} case study`}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
        className="group block w-full cursor-zoom-in text-left"
      >
        <div className="overflow-hidden rounded-lg border border-ink/10 bg-ink">
          {project.category === "websites" ? (
            <div className="flex items-center gap-1.5 border-b border-ink/10 bg-paper px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5A93D]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#5CB85C]/60" />
              <span className="label-micro ml-3 text-ink">
                {(project.liveUrl ?? project.repoUrl ?? "").replace(/https?:\/\//, "").replace(/\/$/, "")}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-b border-paper/10 bg-[#0d0c0b] px-4 py-2.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent, opacity: 0.75 }} />
              <span className="font-mono text-[10px] tracking-[0.08em]" style={{ color: accent }}>
                ~/{project.id}
              </span>
              <span className="terminal-caret font-mono text-[10px] text-paper/40">_</span>
            </div>
          )}

          <div className="relative overflow-hidden">
            <motion.div
              layoutId={isOpen ? undefined : `plate-image-${project.id}`}
              className="will-change-transform"
            >
              <div className="transition-transform duration-[0.9s] ease-out group-hover:scale-[1.03]">
                <img
                  src={project.visual}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-[clamp(1.25rem,3.2vw,1.875rem)] uppercase leading-[0.9] tracking-[-0.02em]">
              {project.title}
            </h3>
            <p className="label-micro mt-1.5 text-ink">
              {project.role} · {project.year}
            </p>
          </div>

          {chipUrl && (
            <a
              href={chipUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              className="label-micro inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 text-ink transition-all hover:-translate-y-0.5 hover:border-transparent"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accent)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
            >
              {hasLive ? "Live" : "Source"}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
