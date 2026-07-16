import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

interface EditorialFeatureProps {
  index: string;
  title: string;
  description: string;
  media: string;
  buttonText: string;
  buttonLink: string;
  tags: string[];
  role: string;
  paragraphs: string[];
  buttonHover: string;
}

export default function EditorialFeature({
  index,
  title,
  description,
  media,
  buttonText,
  buttonLink,
  tags,
  role,
  paragraphs,
  buttonHover,
}: EditorialFeatureProps) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div>
      <div className="min-h-[650px] py-20 md:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 md:grid-cols-[40%_30%_30%] md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-sm tracking-[0.15em] text-[#161513]/30">
              {index}
            </span>
            <h2 className="mt-6 font-display text-5xl uppercase leading-[0.85] tracking-[-0.03em] md:text-6xl">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#161513]/50">
              {role}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#161513]/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#161513]/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            ref={mediaRef}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-[4px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <motion.div
                className="absolute left-[-5%] top-[-5%] h-[110%] w-[110%]"
                style={{ y }}
              >
                <img
                  src={media}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <p className="text-base leading-[1.8] text-[#161513]/60">
              {description}
            </p>
            <div className="mt-auto pt-8">
              <a
                href={buttonLink}
                target="_blank"
                rel="noreferrer"
                className={`group inline-flex items-center gap-2 rounded-lg border border-[#161513]/20 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#161513]/50 transition-all duration-[0.35s] ${buttonHover}`}
              >
                {buttonText}
                <ArrowUpRight className="h-3 w-3 transition-transform duration-[0.35s] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-4 pb-20">
        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-[#161513]/80 md:text-lg">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
