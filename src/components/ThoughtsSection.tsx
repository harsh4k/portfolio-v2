import { motion } from "motion/react";
import { THOUGHTS } from "../data";
import ThoughtCard from "./ThoughtCard";

export default function ThoughtsSection() {
  return (
    <section className="paper-grid relative overflow-hidden border-t border-[#161513]/15 px-4 py-20 text-[#161513] select-none sm:px-6 md:px-12 md:py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 diagonal-hatch opacity-30" />

      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 border-b border-[#161513]/15 pb-6"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#161513]/50">
            (07) Mind Dump
          </p>
          <h2 className="mt-3 font-display text-[17vw] uppercase leading-[0.78] tracking-[-0.06em] md:text-[7.8vw]">
            Mind
            <br />
            Dump
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#161513]/62">
            Three ideas that shape how I build, design, and explore.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {THOUGHTS.map((thought, i) => (
            <ThoughtCard key={thought.id} thought={thought} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
