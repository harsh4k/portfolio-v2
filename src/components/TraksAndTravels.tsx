import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const vibes = [
  { label: "Mindset", title: "Explore & Learn", accent: "text-lime", border: "hover:border-lime/40" },
  { label: "Reset", title: "Disconnect, Recharge", accent: "text-signal", border: "hover:border-signal/40" },
  { label: "Fuel", title: "Curiosity Driven", accent: "text-paper/50", border: "hover:border-paper/40" },
];

export default function TraksAndTravels() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);

  return (
    <section
      ref={sectionRef}
      className="dark-grid relative overflow-hidden bg-night px-4 py-12 text-paper select-none sm:px-6 md:px-12 md:py-14"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1600px]">
        {/* Eyebrow */}
        <div className="flex items-center justify-between gap-4 border-b border-paper/15 pb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">
          <span>(01.3) Treks & Travels</span>
          <span className="hidden sm:block">Captured adventures</span>
        </div>

        {/* Headline */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mt-6 min-w-0 font-display text-[9vw] uppercase leading-[0.9] tracking-[-0.04em] sm:text-[7vw] lg:text-[4.5vw]"
        >
          Off the beaten path
        </motion.h2>

        {/* Video left · write-up + vibe cards right */}
        <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-12 lg:items-stretch">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="min-w-0 overflow-hidden rounded-4xl border border-paper/15 bg-night lg:col-span-7"
          >
            <motion.div
              style={reduced ? undefined : { y: parallaxY }}
              className="h-full w-full"
            >
              <video
                src="/images/lbt_vid.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="aspect-video h-full w-full scale-105 object-cover lg:aspect-auto"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex min-w-0 flex-col gap-4 lg:col-span-5"
          >
            <p className="text-base leading-relaxed text-paper/75 md:text-lg">
              Whether it's trekking through mountain ranges, exploring hidden valleys, or chasing
              sunsets across new horizons—traveling fuels my curiosity and brings fresh perspective
              to how I think about design and engineering. Every journey teaches something new.
            </p>

            <div className="grid flex-1 content-end gap-4">
              {vibes.map((vibe) => (
                <div
                  key={vibe.label}
                  className={`rounded-3xl border border-paper/15 bg-paper/5 p-6 backdrop-blur-sm transition-all hover:bg-paper/10 ${vibe.border}`}
                >
                  <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${vibe.accent}`}>
                    {vibe.label}
                  </p>
                  <p className="mt-2 font-display text-xl uppercase leading-tight md:text-2xl">
                    {vibe.title}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
