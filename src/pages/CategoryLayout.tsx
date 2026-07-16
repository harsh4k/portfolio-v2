import type { ReactNode } from "react";
import Navbar from "../components/Navbar";

interface Props {
  children: ReactNode;
}

export default function CategoryLayout({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full bg-[#EEE9DC] text-[#161513] antialiased">
      <div
        className="fixed inset-0 z-30 pointer-events-none opacity-[0.025] bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        id="brutalist-grain-overlay"
      />

      <Navbar />

      <main className="w-full min-h-screen paper-grid border-t border-[#161513]/15 px-4 py-8 text-[#161513] select-none sm:px-6 md:px-12">
        {children}
      </main>
    </div>
  );
}
