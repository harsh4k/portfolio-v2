import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import CurtainLink from "../ui/curtain-link";
import { PROJECTS } from "../../data";
import EditorialSidebar from "./EditorialSidebar";
import ProjectGrid from "./ProjectGrid";
import { EASE } from "../../lib/motion";

export default function FunCodeView() {
  const fun = PROJECTS.filter((p) => p.category === "fun");
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-32">
      <EditorialSidebar
        icon={Sparkles}
        iconClass="text-lime"
        title="CREATIVE EXPERIMENTS"
        subtitle="Fun projects"
        description="Playground projects where I explore creative coding, generative art, interactive experiences, and experimental web tools. No rules, no boundaries — just raw creativity."
        statsText={`${fun.length} Projects`}
        totalCount={fun.length}
        activeIndex={activeIndex}
      />

      <div className="mt-20 md:mt-28">
        <ProjectGrid
          projects={fun}
          accentColor="lime"
          basePath="/fun-code"
          onActiveIndexChange={setActiveIndex}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-32 border-t border-ink/10 pt-16"
      >
        <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink/30">
          Want to see more?
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <CurtainLink
            to="/websites"
            className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.16em] text-ink/60 transition-all hover:border-signal hover:bg-signal hover:text-paper"
          >
            View Websites
            <ArrowUpRight className="h-3 w-3 transition-transform duration-[0.35s] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </CurtainLink>
          <CurtainLink
            to="/posters"
            className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.16em] text-ink/60 transition-all hover:bg-ink hover:text-paper"
          >
            View Posters
            <ArrowUpRight className="h-3 w-3 transition-transform duration-[0.35s] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </CurtainLink>
        </div>
      </motion.div>
    </div>
  );
}
