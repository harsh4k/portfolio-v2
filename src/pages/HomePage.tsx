import { lazy, Suspense, useEffect } from "react";
import { motion } from "motion/react";
import Lenis from "lenis";
import { useIsMobile } from "../hooks/use-media";
import Navbar from "../components/Navbar";
import About from "../components/About";
import OffScreen from "../components/OffScreen";
import TraksAndTravels from "../components/TraksAndTravels";
import Projects from "../components/Projects";
import Journey from "../components/Journey";
import ThoughtsSection from "../components/ThoughtsSection";
import Contact from "../components/Contact";
import LazyMount from "../components/LazyMount";

// Deferred: only imported (and mounted) once each section nears the viewport —
// keeps ogl, the calendar's canvas game, and GooeyText's rAF loop out of the
// initial HomePage chunk and out of memory until they're actually needed.
const Skills = lazy(() => import("../components/Skills"));
const GallerySection = lazy(() => import("../components/GallerySection"));
const GitHubCalendarSection = lazy(() => import("../components/GitHubCalendarSection"));

export default function HomePage() {
  // matchMedia-backed so this re-evaluates on resize/rotate — native momentum
  // scrolling is smoother than Lenis on touch, so mobile skips it entirely.
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      infinite: false,
    });

    // Sections mount lazily as they near the viewport, so the document height
    // changes mid-scroll. Lenis debounces its own resize by 250ms and animates
    // against stale dimensions until it catches up, which surfaced as a single
    // ~200px scroll lurch. Resync the moment the height actually moves.
    let lastHeight = document.documentElement.scrollHeight;
    const resizeObserver = new ResizeObserver(() => {
      const height = document.documentElement.scrollHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      lenis.resize();
    });
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      lenis.destroy();
    };
  }, [isMobile]);

  return (
    <div className="relative min-h-screen w-full bg-[#EEE9DC] text-[#161513] overflow-x-clip antialiased">
      <div
        className="fixed inset-0 z-30 pointer-events-none opacity-[0.025] bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        id="brutalist-grain-overlay"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col w-full h-full"
        id="portfolio-main-viewport"
      >
        <Navbar />
        <main className="w-full flex flex-col">
          <About />
          <LazyMount minHeight="100vh">
            <OffScreen />
          </LazyMount>
          <LazyMount minHeight="100vh">
            <TraksAndTravels />
          </LazyMount>
          <LazyMount minHeight="100vh" id="work">
            <Projects />
          </LazyMount>
          <LazyMount minHeight="100vh">
            <Suspense fallback={null}>
              <Skills />
            </Suspense>
          </LazyMount>
          <LazyMount minHeight="100vh">
            <Journey />
          </LazyMount>
          <LazyMount minHeight="100vh">
            <Suspense fallback={null}>
              <GallerySection />
            </Suspense>
          </LazyMount>
          <LazyMount minHeight="100vh">
            <Suspense fallback={null}>
              <GitHubCalendarSection />
            </Suspense>
          </LazyMount>
          <LazyMount minHeight="100vh">
            <ThoughtsSection />
          </LazyMount>
          <LazyMount minHeight="100vh" id="contact">
            <Contact />
          </LazyMount>
        </main>
      </motion.div>
    </div>
  );
}
