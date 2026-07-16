import { useEffect } from "react";
import { motion } from "motion/react";
import Lenis from "lenis";
import Navbar from "../components/Navbar";
import About from "../components/About";
import OffScreen from "../components/OffScreen";
import TraksAndTravels from "../components/TraksAndTravels";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Journey from "../components/Journey";
import GallerySection from "../components/GallerySection";
import GitHubCalendarSection from "../components/GitHubCalendarSection";
import ThoughtsSection from "../components/ThoughtsSection";
import Contact from "../components/Contact";

export default function HomePage() {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      infinite: false,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#EEE9DC] text-[#161513] overflow-hidden antialiased">
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
          <OffScreen />
          <TraksAndTravels />
          <Projects />
          <Skills />
          <Journey />
          <GallerySection />
          <GitHubCalendarSection />
          <ThoughtsSection />
          <Contact />
        </main>
      </motion.div>
    </div>
  );
}
