import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../../data";
import EditorialSidebar from "./EditorialSidebar";
import EditorialCard from "./EditorialCard";

export default function WebsitesView() {
  const websites = PROJECTS.filter((p) => p.category === "websites");

  return (
    <div className="mx-auto max-w-[960px] px-4 pt-24 pb-32">
      <EditorialSidebar
        icon={Globe}
        iconClass="text-[#F13A18]"
        title="SELECTED PROJECTS"
        subtitle="Web development"
        description="A curated selection of websites I've designed and developed — from e-commerce platforms to brand showcases. Each project represents a different challenge and a unique approach to solving real-world problems."
        sectionLabel="(01) Projects"
        statsText={`${websites.length} Projects`}
        currentIndex={1}
        totalCount={websites.length}
      />

      <div className="mt-20 space-y-32 md:mt-28 md:space-y-40">
        {websites.map((project, i) => (
          <div key={project.id}>
            <EditorialCard project={project} accentColor="red" />
            {i < websites.length - 1 && (
              <div className="mt-20 md:mt-28">
                <div className="h-px w-full bg-gradient-to-r from-[#161513]/0 via-[#161513]/10 to-[#161513]/0" />
              </div>
            )}
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
            to="/fun-code"
            className="group inline-flex items-center gap-2 rounded-full border border-[#161513]/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#161513]/60 transition-all hover:bg-[#C9FF3D] hover:text-[#161513] hover:border-[#C9FF3D]"
          >
            View Fun Code
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
