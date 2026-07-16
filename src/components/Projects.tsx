import { motion } from "motion/react";
import { ArrowUpRight, Globe, Sparkles, Image } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    path: "/websites",
    title: "Websites",
    description: "Full-featured web applications — e-commerce, dashboards, and platforms built from the ground up.",
    count: 3,
    icon: Globe,
  },
  {
    path: "/fun-code",
    title: "Fun Code",
    description: "Experimental projects and creative coding — where constraints don't exist and ideas run free.",
    count: 4,
    icon: Sparkles,
  },
  {
    path: "/posters",
    title: "Posters",
    description: "Poster designs exploring typography, composition, and visual hierarchy.",
    count: 4,
    icon: Image,
  },
];

export default function Projects() {
  return (
    <section
      id="work"
      className="paper-grid relative overflow-hidden border-t border-[#161513]/15 px-4 py-20 text-[#161513] select-none sm:px-6 md:px-12 md:py-28"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 diagonal-hatch opacity-30" />

      <div className="mx-auto max-w-[1600px]">
        <div className="mb-12 border-b border-[#161513]/15 pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#161513]/50">(02) Build Board</p>
          <h2 className="mt-3 font-display text-[17vw] uppercase leading-[0.78] tracking-[-0.06em] sm:text-[12vw] md:text-[8vw]">
            Build
            <br />
            Board
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#161513]/62">
            A curated library of everything I've built — websites, posters, and experiments.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Link
                  to={cat.path}
                  className="group relative flex h-[320px] flex-col justify-between overflow-hidden rounded-[32px] border border-[#161513]/20 bg-[#EEE9DC] p-6 text-left no-underline transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(22,21,19,0.1)] md:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#161513]/40">
                      {String(cat.count).padStart(2, "0")} projects
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-[#F13A18] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>

                  <div className="flex flex-col gap-4">
                    <Icon className="h-8 w-8 text-[#161513]/10 md:h-10 md:w-10" />
                    <h3 className="font-display text-5xl uppercase leading-[0.82] tracking-[-0.04em] sm:text-6xl md:text-7xl">
                      {cat.title.split(" ").length > 1 ? (
                        <>
                          {cat.title.split(" ").map((word, wi) => (
                            <span key={wi} className="inline md:block">
                              {word}{wi < cat.title.split(" ").length - 1 ? "\u00A0" : ""}
                            </span>
                          ))}
                        </>
                      ) : (
                        cat.title
                      )}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-[#161513]/62">{cat.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 rounded-[32px] bg-[#161513] p-5 text-[#EEE9DC] md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <p className="font-display text-[14vw] uppercase leading-[0.78] tracking-[-0.06em] md:text-[6.5vw]">
              More reps.
              <br />
              Better taste.
            </p>
            <p className="text-sm leading-relaxed text-[#EEE9DC]/65">
              Every project leaves me with something valuable — better architecture, stronger problem solving, cleaner code or a new perspective. Progress comes from building consistently.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
