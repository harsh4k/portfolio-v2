import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface LoaderProps {
  onComplete: () => void;
  key?: string;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 420);

    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      id="portfolio-preloader"
      className="paper-grid fixed inset-0 z-50 flex flex-col justify-between p-6 text-[#161513] select-none md:p-12"
    >
      <div className="flex items-start justify-between border-b border-[#161513]/15 pb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#161513]/55">
        <div>Harshit Chauhan / Portfolio OS</div>
        <div>Mumbai, India</div>
      </div>

      <div>
        <div className="mb-4 w-fit rounded-full bg-[#161513] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#EEE9DC]">
          Loading interface{dots}
        </div>
        <div className="font-display text-[17vw] uppercase leading-[0.75] tracking-[-0.06em] md:text-[10vw]">
          Make
          <br />
          It Yours
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 border-t border-[#161513]/15 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#161513]/55 sm:flex-row">
        <div>Edition 2026</div>
        <div>Fresh build / no template dust</div>
      </div>
    </motion.div>
  );
}
