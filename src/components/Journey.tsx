import { motion } from "motion/react";
import { TIMELINE } from "../data";
import { AsciiTerminal, type TerminalRun } from "./ui/ascii-terminal";

const timelineImages = [
  "/images/2024.webp",
  "/images/Hackathon.webp",
  "/images/2026.webp",
];

// One tint per year, so each run in the transcript reads as its own chapter.
const tints: TerminalRun["tint"][] = ["lime", "signal", "paper"];

const runs: TerminalRun[] = TIMELINE.map((item, i) => ({
  year: item.year,
  title: item.title,
  description: item.description,
  image: timelineImages[i],
  tint: tints[i],
}));

export default function Journey() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="path"
      className="paper-grid relative overflow-x-clip border-t border-[#161513]/15 px-4 py-20 text-[#161513] select-none sm:px-6 md:px-12 md:py-28"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 dark-hatch opacity-30" />

      {/* relative so the hatch panel stays behind the content instead of
          painting its diagonals across the terminal. */}
      <div className="relative mx-auto max-w-[1600px]">
        <div className="mb-12 grid gap-4 border-b border-[#161513]/15 pb-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <h2 className="mt-3 font-display text-[17vw] uppercase leading-[0.78] tracking-[-0.06em] md:text-[7.8vw]">
              The path
              <br />
              so far
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#161513]/62">
            Not every milestone belongs on a resume. Some belong here.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mx-auto max-w-5xl"
        >
          <AsciiTerminal runs={runs} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mt-12 grid gap-4 md:grid-cols-[0.8fr_1.2fr]"
        >
          <div className="rounded-[32px] bg-[#F13A18] p-5 text-[#EEE9DC]">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#EEE9DC]/65">Still iterating. Still learning. Still building.</p>
            <p className="mt-16 font-display text-5xl uppercase leading-none">Version 2.6</p>
          </div>
          <div className="rounded-[32px] border border-[#161513]/15 bg-[#EEE9DC] p-5">
            <p className="font-display text-5xl uppercase leading-[0.86] tracking-[-0.04em] md:text-7xl">
              Still early.
              <br />
              Already building.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#161513]/62">
              Experience isn't measured only by time. It's measured by curiosity, consistency and the willingness to keep improving.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
