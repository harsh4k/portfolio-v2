import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Terminal } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const terminalLines = [
  { prompt: "$", text: "whoami" },
  { prompt: "", text: "Hello, thank you for stopping by. My name is Harshit Chauhan. I'm a first-year Computer Engineering student at NMIMS, Mumbai." },
  { prompt: "$", text: "cat skills.txt" },
  { prompt: "", text: "I am a full-stack developer who enjoys building software that's both functional and intuitive. Whether it's the logic behind software, the architecture of a system, or the mysteries of space — I've always enjoyed understanding what happens beneath the surface." },
  { prompt: "$", text: "echo $CURRENT_FOCUS" },
  { prompt: "", text: "Building at the intersection of design and engineering. Currently focused on React, TypeScript, Node.js and scalable architecture." },
  { prompt: "$", text: "_" },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const imageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  useEffect(() => {
    // small tick so DOM is painted before GSAP touches it
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!ready || reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // Title
      tl.fromTo(
        titleRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0,
      );

      // Portrait
      tl.fromTo(
        portraitRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        0.1,
      );

      // Bio terminal
      tl.fromTo(
        bioRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        0.2,
      );

      // Terminal lines stagger
      lineRefs.current.forEach((line, i) => {
        if (!line) return;
        tl.fromTo(
          line,
          { x: -15, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
          0.35 + i * 0.08,
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [ready, reduced]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="paper-grid relative overflow-hidden bg-paper px-4 py-16 text-ink select-none sm:px-6 md:px-12 md:py-24"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1200px]">
        {/* Heading */}
        <h2
          ref={titleRef}
          className="font-display text-[clamp(3rem,10vw,6rem)] uppercase leading-[0.85] tracking-[-0.03em]"
          style={{ opacity: ready ? undefined : 1 }}
        >
          Who Am I?
        </h2>

        <div className="mt-10 grid items-start gap-10 md:grid-cols-12 md:gap-14">
          {/* Left: Portrait in terminal card */}
          <div ref={portraitRef} className="min-w-0 md:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-ink/15 bg-[#181713]">
              <div className="flex items-center gap-2 border-b border-paper/10 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-signal/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-lime/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/30" />
                <span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-paper/40">
                  portrait.png
                </span>
              </div>

              <div ref={imageRef} className="p-2">
                <motion.div
                  style={reduced ? undefined : { y: parallaxY }}
                  className="aspect-[3/4] w-full overflow-hidden rounded-xl"
                >
                  <img
                    src="/images/profile.webp"
                    alt="Harshit Chauhan"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={1428}
                    className="h-full w-full object-cover grayscale"
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right: Terminal bio */}
          <div ref={bioRef} className="min-w-0 md:col-span-9">
            <div className="overflow-hidden rounded-2xl border border-ink/15 bg-[#181713] text-paper">
              <div className="flex items-center gap-2 border-b border-paper/10 px-4 py-2.5">
                <Terminal className="h-3.5 w-3.5 text-signal" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-paper/50">
                  about.sh
                </span>
              </div>

              <div className="p-5 font-mono text-[13px] leading-relaxed text-paper/80">
                {terminalLines.map((line, i) => (
                  <div
                    key={i}
                    ref={(el) => { lineRefs.current[i] = el; }}
                    className={line.prompt ? "mt-4" : "mt-2"}
                  >
                    {line.prompt ? (
                      <p>
                        <span className="text-lime">{line.prompt}</span> {line.text}
                      </p>
                    ) : (
                      <p className="text-paper/60">{line.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
