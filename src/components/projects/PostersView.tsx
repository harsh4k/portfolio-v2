import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { POSTERS } from "../../data";
import PosterCard from "./PosterCard";

export default function PostersView() {
  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        <div className="mx-auto max-w-[1440px] px-4 pt-24 pb-16 md:pt-28">
          <Link
            to="/overview"
            className="inline-flex items-center gap-2 rounded-full border border-[#161513]/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#161513]/60 transition-colors hover:bg-[#161513] hover:text-[#EEE9DC]"
          >
            <ArrowUpRight className="h-3 w-3 rotate-[-45deg]" />
            Back
          </Link>

          <div className="mt-16 md:mt-20">
            <p className="max-w-xl text-sm leading-relaxed text-[#161513]/65">
              A collection of poster designs exploring typography, composition, visual hierarchy,
              and the intersection of form and function. Each piece is a study in restraint.
            </p>
            <div className="mt-6 flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.15em]">
              <span className="text-[#161513]/40">{POSTERS.length} Works</span>
              <span className="h-3 w-px bg-[#161513]/10" />
              <span className="text-[#161513]/30">Cases 04—07</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            {POSTERS.slice(0, 3).map((poster, i) => (
              <PosterCard key={poster.id} poster={poster} index={i} />
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 pb-48 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-[#161513]/10 pt-12"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#161513]/30">
              Explore more
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
                to="/fun-code"
                className="group inline-flex items-center gap-2 rounded-full border border-[#161513]/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#161513]/60 transition-all hover:bg-[#C9FF3D] hover:text-[#161513] hover:border-[#C9FF3D]"
              >
                View Fun Code
                <ArrowUpRight className="h-3 w-3 transition-transform duration-[0.35s] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-0 left-1/2 z-0 -translate-x-1/2 select-none font-sans font-extrabold whitespace-nowrap text-[clamp(180px,18vw,340px)] leading-[0.8] text-[#161513]/[0.1]">
        POSTERS
      </p>
    </div>
  );
}
