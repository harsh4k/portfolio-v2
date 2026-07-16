import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Poster } from "../../types";

interface PosterCardProps {
  key?: string | number | null;
  poster: Poster;
  index: number;
}

const tilts = [-2, 1.5, -1, 2.5, -1.5, 0.5, -2.5, 1];

export default function PosterCard({ poster, index }: PosterCardProps) {
  const tilt = tilts[index % tilts.length];
  const delay = index * 0.12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <motion.span
        initial={{ opacity: 0, x: -20, rotate: -3 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -top-4 left-0 z-0 select-none font-sans font-thin text-[clamp(5rem,18vw,13rem)] leading-none text-[#161513]/[0.07]"
      >
        {poster.number}
      </motion.span>

      <div className="relative z-10 overflow-hidden rounded-[32px] bg-[#161513]">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={poster.image}
            alt={poster.keywords.join(", ")}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-all duration-[0.9s] ease-out group-hover:scale-[1.04]"
          />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <p className="text-sm leading-relaxed text-[#161513]/65">
          {poster.tagline}
        </p>

        <button
          onClick={() => window.open(poster.image, "_blank")}
          className="group/link inline-flex items-center gap-1.5 border-b border-[#161513]/20 pb-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#161513]/45 transition-all hover:border-[#161513]"
        >
          View
          <ArrowUpRight className="h-3 w-3 transition-transform duration-[0.35s] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </button>
      </div>
    </motion.div>
  );
}
