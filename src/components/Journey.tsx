import { motion } from "motion/react";
import { TIMELINE } from "../data";
import { RollingTextList, ListItem } from "./ui/rolling-list";

const timelineImages = [
  "/images/2024.webp",
  "/images/Hackathon.webp",
  "/images/2026.webp",
];

const accentColors = ["#C9FF3D", "#F13A18", "#C9FF3D"];

const rollingItems: ListItem[] = TIMELINE.map((item, i) => ({
  id: i + 1,
  title: item.year,
  category: item.title,
  src: timelineImages[i],
  alt: item.title,
  accent: accentColors[i],
  description: item.description,
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
      className="paper-grid relative overflow-hidden border-t border-[#161513]/15 px-4 py-20 text-[#161513] select-none sm:px-6 md:px-12 md:py-28"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 dark-hatch opacity-30" />

      <div className="mx-auto max-w-[1600px]">
        <div className="mb-12 grid gap-4 border-b border-[#161513]/15 pb-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#161513]/50">(04) Journey</p>
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
          <RollingTextList items={rollingItems} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mt-12 grid gap-4 md:grid-cols-[0.8fr_1.2fr]"
        >
          <div className="rounded-[32px] bg-[#F13A18] p-5 text-[#EEE9DC]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#EEE9DC]/65">Still iterating. Still learning. Still building.</p>
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
