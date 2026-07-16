import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type HobbyRow = {
  id: string;
  title: string;
  tag: string;
  copy: string;
  image: string;
};

const rows: HobbyRow[] = [
  {
    id: "01",
    title: "Gaming",
    tag: "Interface",
    copy: "Immersive worlds, clean HUDs, and game mechanics shape how I think about interface design—clarity, feedback and interaction.",
    image: "/images/pic1.jpg",
  },
  {
    id: "02",
    title: "Sci-Fi & Space",
    tag: "Curiosity",
    copy: "Curiosity doesn't stop at software. Space reminds me how much there still is to discover—and keeps me asking better questions.",
    image: "/images/pic2.jpg",
  },
  {
    id: "03",
    title: "Sports",
    tag: "Balance",
    copy: "Football, volleyball and badminton help me reset, stay competitive and keep a balanced mindset away from the screen.",
    image: "/images/pic3.jpg",
  },
];

export default function OffScreen() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="offscreen"
      className="dark-grid relative overflow-hidden bg-night px-4 py-12 text-paper select-none sm:px-6 md:px-12 md:py-14"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1600px]">
        {/* Eyebrow strip */}
        <div className="flex items-center justify-between gap-4 border-b border-paper/15 pb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">
          <span>(01.2) Off Screen</span>
          <span className="hidden sm:block">Inputs that aren't code</span>
        </div>

        {/* Header row */}
        <div className="mt-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="min-w-0 font-display text-[9vw] uppercase leading-[0.9] tracking-[-0.04em] sm:text-[7vw] lg:text-[4.6vw]"
          >
            Life beyond <span>the terminal</span>
          </motion.h2>
        </div>

        {/* Hobby cards — expandable */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mt-8 border-t border-paper/12"
        >
          {rows.map((row, i) => {
            const isOpen = open === i;
            return (
              <div key={row.id}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  onMouseEnter={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                  aria-expanded={isOpen}
                  aria-controls={`hobby-panel-${i}`}
                  className="group flex w-full items-baseline gap-4 border-b border-paper/12 py-4 text-left md:gap-8 md:py-5"
                >
                  <span className="font-mono text-[10px] tracking-[0.18em] text-signal">
                    {row.id}
                  </span>
                  <span
                    className={`min-w-0 font-display text-[clamp(1.8rem,4vw,3.8rem)] uppercase leading-none tracking-[-0.03em] transition-colors duration-300 ${
                      isOpen ? "text-paper" : "text-paper/35 group-hover:text-paper/70"
                    }`}
                  >
                    {row.title}
                  </span>
                  <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-[0.22em] text-paper/40 sm:block">
                    {row.tag}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 self-center text-lime"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>

                <motion.div
                  id={`hobby-panel-${i}`}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{
                    height: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.3 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-5 pb-6 md:grid-cols-[minmax(0,400px)_1fr] md:items-center md:gap-10">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden rounded-2xl border border-paper/15 shadow-lg"
                    >
                      <img
                        src={row.image}
                        alt={row.title}
                        className="aspect-video w-full object-cover"
                      />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 12 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="max-w-md text-sm leading-relaxed text-paper/60"
                    >
                      {row.copy}
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
