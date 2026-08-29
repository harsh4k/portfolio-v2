import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import type { Project } from "../../types";
import ProjectPlate from "./ProjectPlate";
import ProjectDossier from "./ProjectDossier";

interface ProjectGridProps {
  projects: Project[];
  accentColor: "red" | "lime";
  basePath: "/websites" | "/fun-code";
  onActiveIndexChange?: (index: number) => void;
}

/**
 * Owns the index grid AND the dossier overlay together, in one tree — the
 * open/close morph is a `layoutId` hand-off between a plate's cover and the
 * dossier's hero, which only works when both can ever be mounted, so they
 * can't live in separate route elements.
 */
export default function ProjectGrid({ projects, accentColor, basePath, onActiveIndexChange }: ProjectGridProps) {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  // Whether the current dossier was opened by a click in this session (so
  // closing should pop that history entry) vs. landed on directly via a
  // deep link (so closing should go to the category page instead).
  const openedInAppRef = useRef(false);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const plateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const openProject = id ? projects.find((p) => p.id === id) : undefined;

  useEffect(() => {
    if (!id) openedInAppRef.current = false;
  }, [id]);

  const handleOpen = (projectId: string) => {
    openedInAppRef.current = true;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    navigate(`${basePath}/${projectId}`);
  };

  const handleClose = () => {
    if (openedInAppRef.current) navigate(-1);
    else navigate(basePath);
    openedInAppRef.current = false;
  };

  const handleOpenRelated = (nextId: string) => {
    openedInAppRef.current = true;
    navigate(`${basePath}/${nextId}`, { replace: true });
  };

  // Drives EditorialSidebar's "IN VIEW" readout — the plate nearest the
  // vertical centre of the viewport becomes the active one.
  useEffect(() => {
    if (!onActiveIndexChange) return;
    const elements = projects.map((p) => plateRefs.current[p.id]).filter((el): el is HTMLDivElement => Boolean(el));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const top = visible.reduce((a, b) => (b.intersectionRatio > a.intersectionRatio ? b : a));
        const idx = elements.findIndex((el) => el === top.target);
        if (idx !== -1) onActiveIndexChange(idx);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [projects, onActiveIndexChange]);

  return (
    <>
      <div className="mx-auto flex max-w-205 flex-col gap-y-16 md:gap-y-24">
        {projects.map((project, i) => (
          <ProjectPlate
            key={project.id}
            project={project}
            accentColor={accentColor}
            index={i}
            isOpen={project.id === id}
            onOpen={() => handleOpen(project.id)}
            plateRef={(el) => {
              plateRefs.current[project.id] = el;
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {openProject && (
          <ProjectDossier
            key={openProject.id}
            project={openProject}
            accentColor={accentColor}
            onClose={handleClose}
            onOpenId={handleOpenRelated}
            restoreFocusRef={restoreFocusRef}
          />
        )}
      </AnimatePresence>
    </>
  );
}
