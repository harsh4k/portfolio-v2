import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cloud, FileText } from "lucide-react";
import TrailGrid from "../components/ui/trail-grid";

// Single source for the intro palette — the shader and its static stand-in must match.
const INTRO_COLORS = ["#000000", "#0A0A08", "#11110F", "#1C1B18"];

// If the chunk fails to load (offline, stale deploy), keep the static gradient
// instead of letting the ErrorBoundary blank the page over a decorative background.
const MeshGradient = lazy(async () => {
  try {
    const m = await import("@paper-design/shaders-react");
    return { default: m.MeshGradient };
  } catch {
    return { default: (() => null) as unknown as typeof import("@paper-design/shaders-react").MeshGradient };
  }
});

// Runs `callback` once the page has loaded and the main thread goes idle
// (or after a fallback timeout), so it never competes with first paint / TBT.
function onIdle(callback: () => void): () => void {
  let cancelled = false;
  const fire = () => {
    if (!cancelled) callback();
  };
  const schedule = () => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(fire, { timeout: 2000 });
    } else {
      window.setTimeout(fire, 300);
    }
  };

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", schedule);
  };
}

/**
 * Mounts the WebGL shader only after the page has loaded and the main thread
 * is idle, so first paint / TBT never pay for shader compile + RAF loop.
 * Until then the static gradient underneath (see IntroPage) is visible.
 */
function DeferredShader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return onIdle(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <MeshGradient
        className="intro-fade fixed inset-0 h-full w-full"
        colors={INTRO_COLORS}
        speed={0.6}
        backgroundColor={INTRO_COLORS[0]}
        minPixelRatio={1}
        maxPixelCount={1920 * 1080}
      />
    </Suspense>
  );
}

export default function IntroPage() {
  // Warms the /overview chunk while the visitor is still reading the intro,
  // so clicking OVERVIEW doesn't hit a cold-cache download + blank Suspense.
  useEffect(() => onIdle(() => { void import("./HomePage"); }), []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-night text-paper antialiased">
      {/* Static stand-in for the shader so first paint looks the same */}
      <div
        className="fixed inset-0"
        style={{
          background: `radial-gradient(120% 120% at 70% 25%, ${INTRO_COLORS[3]} 0%, ${INTRO_COLORS[1]} 50%, ${INTRO_COLORS[0]} 100%)`,
        }}
      />

      {/* Animated shader background — deferred, fades in over the static gradient */}
      <DeferredShader />

      {/* Hero */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Interactive grid — desktop/hover only. Must share a stacking context
            with the mix-blend-mode text below (both inside <main>), otherwise
            the blend can't see the grid's lit cells as its backdrop. */}
        <TrailGrid cellSize={40} duration={180} cellColor="var(--color-paper)" />

        {/* Inverting block: everything here reacts to the grid via mix-blend */}
        <div
          className="pointer-events-none flex flex-col items-center text-paper"
          style={{ mixBlendMode: "difference" }}
        >
          <div className="intro-rise mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em]">
            <Cloud className="h-4 w-4 stroke-2" />
            CLaw
            <span className="mx-2 opacity-40">/</span>
            44.2442° N · 7.7694° E
          </div>

          <h1
            className="intro-rise font-display text-[10vw] uppercase leading-[0.85] tracking-[-0.04em] sm:text-[8vw] lg:text-[6vw]"
            style={{ animationDelay: "0.05s" }}
          >
            Harshit
            <br />
            Chauhan
          </h1>

          <p
            className="intro-rise mt-6 max-w-md text-sm leading-relaxed sm:text-base"
            style={{ animationDelay: "0.15s" }}
          >
            Full-stack developer building fast, considered websites and tools —
            from luxury storefronts to local-first CLIs.
          </p>
        </div>

        {/* CTA row — outside the blend layer, keeps brand colors, clickable */}
        <div
          className="intro-rise relative z-20 mt-14 flex flex-wrap items-center justify-center gap-8"
          style={{ animationDelay: "0.25s" }}
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
        </div>
      </main>
    </div>
  );
}
