import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../../data";
import EditorialSidebar from "./EditorialSidebar";
import EditorialCard from "./EditorialCard";

export default function FunCodeView() {
  const fun = PROJECTS.filter((p) => p.category === "fun");

  return (
    <div className="mx-auto max-w-[960px] px-4 pt-24 pb-32">
      <EditorialSidebar
        icon={Sparkles}
        iconClass="text-[#C9FF3D]"
        title="CREATIVE EXPERIMENTS"
        subtitle="Fun projects"
        description="Playground projects where I explore creative coding, generative art, interactive experiences, and experimental web tools. No rules, no boundaries — just raw creativity."
        sectionLabel="(02) Experiments"
        statsText={`${fun.length} Project`}
        currentIndex={1}
        totalCount={fun.length}
      />

      <div className="mt-20 space-y-32 md:mt-28 md:space-y-40">
        {fun.map((project) => (
          <div key={project.id}>
            <EditorialCard project={project} accentColor="lime" />
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-32 border-t border-[#161513]/10 pt-16"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#161513]/30">
          Want to see more?
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link
            to="/websites"
            className="group inline-flex items-center gap-2 rounded-full border border-[#161513]/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#161513]/60 transition-all hover:bg-[#F13A18] hover:text-[#EEE9DC] hover:border-[#F13A18]"
          >
            View Websites
            <ArrowUpRight className="h-3 w-3 transition-transform duration-[0.35s] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/posters"
            className="group inline-flex items-center gap-2 rounded-full border border-[#161513]/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#161513]/60 transition-all hover:bg-[#161513] hover:text-[#EEE9DC]"
          >
            View Posters
            <ArrowUpRight className="h-3 w-3 transition-transform duration-[0.35s] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
