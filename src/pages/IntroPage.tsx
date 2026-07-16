import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Cloud, FileText } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import TrailGrid from "../components/ui/trail-grid";

export default function IntroPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-night text-paper antialiased">
      {/* Animated shader background — sits behind everything */}
      <MeshGradient
        className="fixed inset-0 h-full w-full"
        colors={["#000000", "#0A0A08", "#11110F", "#1C1B18"]}
        speed={0.6}
        backgroundColor="#000000"
      />

      {/* Interactive grid — desktop/hover only, sits above the shader */}
      <TrailGrid cellSize={40} duration={180} cellColor="var(--color-paper)" />

      {/* Hero */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Inverting block: everything here reacts to the grid via mix-blend */}
        <div
          className="pointer-events-none flex flex-col items-center text-paper"
          style={{ mixBlendMode: "difference" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em]"
          >
            <Cloud className="h-4 w-4 stroke-2" />
            CLaw
            <span className="mx-2 opacity-40">/</span>
            44.2442° N · 7.7694° E
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[10vw] uppercase leading-[0.85] tracking-[-0.04em] sm:text-[8vw] lg:text-[6vw]"
          >
            Harshit
            <br />
            Chauhan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-md text-sm leading-relaxed sm:text-base"
          >
            Full-stack developer building fast, considered websites and tools —
            from luxury storefronts to local-first CLIs.
          </motion.p>
        </div>

        {/* CTA row — outside the blend layer, keeps brand colors, clickable */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 mt-14 flex flex-wrap items-center justify-center gap-8"
        >
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="uv-resume">
            <FileText className="uv-resume__icon h-4 w-4" strokeWidth={2} />
            <span>Resume</span>
          </a>
          <Link to="/overview" className="uv-entry">
            <div className="uv-entry__line" />
            <div className="uv-entry__line" />
            <span className="uv-entry__text">OVERVIEW</span>
            <div className="uv-entry__drow1" />
            <div className="uv-entry__drow2" />
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
