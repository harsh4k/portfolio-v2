import { motion } from "motion/react";
import { Hammer, Eye, Compass } from "lucide-react";
import type { Thought } from "../types";

const icons = [Hammer, Eye, Compass];

interface ThoughtCardProps {
  key?: string | number | null;
  thought: Thought;
  index: number;
}

export default function ThoughtCard({ thought, index }: ThoughtCardProps) {
  const Icon = icons[index % icons.length];
  const delay = index * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col"
    >
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -top-4 left-0 z-10 select-none font-sans font-black text-[clamp(5rem,12vw,10rem)] leading-none text-white/[0.2]"
      >
        {thought.number}
      </motion.span>

      <div className="relative overflow-hidden rounded-3xl bg-[#161513]">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={thought.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#161513]/90 via-[#161513]/40 to-[#161513]/10" />

        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-[#F13A18]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#F13A18]">
              {thought.tag}
            </span>
          </div>

          <p className="mt-3 text-base leading-relaxed text-white/90 md:text-lg">
            {thought.thought}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
