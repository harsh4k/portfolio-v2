import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import type { Project } from "../../types";

interface EditorialCardProps {
  project: Project;
  accentColor: string;
}

const accentMap: Record<string, string> = {
  red: "#F13A18",
  lime: "#C9FF3D",
};

export default function EditorialCard({ project, accentColor }: EditorialCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  const accent = accentMap[accentColor] ?? accentColor;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="group">
        <div className="overflow-hidden rounded-lg border border-[#161513]/10 bg-[#161513]">
          <div className="flex items-center gap-1.5 border-b border-[#161513]/10 bg-[#EEE9DC] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F13A18]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5A93D]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#5CB85C]/60" />
            <span className="ml-3 font-mono text-[8px] uppercase tracking-[0.15em] text-[#161513]/30">
              {project.link.replace(/https?:\/\//, "").replace(/\/$/, "")}
            </span>
          </div>
          <div className="relative overflow-hidden">
            <motion.div style={{ y: imgY }} className="will-change-transform">
              <div className="transition-transform duration-[0.9s] ease-out group-hover:scale-[1.03]">
                <img
                  src={project.detail.cover}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-start gap-4">
          <span
            className="mt-1 shrink-0 font-mono text-[11px] font-medium leading-none tracking-[0.15em]"
            style={{ color: accent }}
          >
            {project.number}
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-[clamp(1.5rem,5vw,2.5rem)] uppercase leading-[0.88] tracking-[-0.03em]">
              {project.title}
            </h2>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#161513]/40">
              {project.role}
            </p>
          </div>
        </div>

        <p className="mt-5 max-w-prose text-sm leading-relaxed text-[#161513]/65">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#161513]/12 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#161513]/55 transition-colors hover:border-[#161513]/30 hover:text-[#161513]/80"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accent }}
              />
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 space-y-4 border-t border-[#161513]/[0.06] pt-8">
          {project.detail.paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm leading-[1.8] text-[#161513]/70"
            >
              {para}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8"
        >
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="group/link inline-flex items-center gap-3 rounded-full bg-[#F13A18] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#EEE9DC] transition-all hover:bg-[#161513] hover:-translate-y-0.5"
          >
            {project.link.includes("github.com") ? "View on GitHub" : "Visit Live Site"}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-[0.35s] group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
          </a>
        </motion.div>
      </div>
    </motion.article>
  );
}
