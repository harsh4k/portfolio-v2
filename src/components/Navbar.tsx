import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Cloud } from "lucide-react";
import SlideTabs, { type SlideTabItem } from "./ui/slide-tabs";
import FloatingMenu from "./ui/liquid-morph-floating-menu";
import { useCurtain } from "./ui/curtain-transition";
import { ROUTE_CURTAINS, prefetchRoute } from "./ui/curtain-link";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { navigateWithCurtain } = useCurtain();
  const onOverview = location.pathname === "/overview";
  // Leaving a category page reuses the curtain that brought you in, so the
  // trip back reads as the same door closing rather than a hard cut.
  const leavingCurtain =
    location.pathname === "/overview" ? undefined : ROUTE_CURTAINS[location.pathname]?.variant;

  const goOverview = useCallback(() => {
    prefetchRoute("/overview");
    if (leavingCurtain) {
      navigateWithCurtain({
        to: "/overview",
        variant: leavingCurtain,
        label: "Overview",
        prefetch: () => import("../pages/HomePage"),
      });
    } else {
      navigate("/overview");
    }
  }, [leavingCurtain, navigate, navigateWithCurtain]);

  const goIntro = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const scrollToSection = useCallback(
    (id: string) => {
      if (!onOverview) {
        goOverview();
        // Long enough for the curtain (or a plain route swap) to settle before
        // the target section is scrolled into view.
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, leavingCurtain ? 1400 : 300);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [goOverview, leavingCurtain, onOverview],
  );

  // This nav only ever mounts on /overview and the category pages, so an
  // "Overview" tab pointed at the page you were already on. The first slot is
  // the way back out to the intro instead; the rest are in-page sections.
  const navItems: SlideTabItem[] = [
    { id: "intro", label: "CLaw", onClick: goIntro },
    { id: "work", label: "Work", onClick: () => scrollToSection("work") },
    { id: "about", label: "About", onClick: () => scrollToSection("about") },
    { id: "contact", label: "Contact", onClick: () => scrollToSection("contact") },
  ];

  return (
    <>
      <motion.nav
        id="main-navigation"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 w-full border-b border-ink/10 bg-paper/90 pt-[env(safe-area-inset-top)] backdrop-blur-md select-none md:hidden"
      >
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-4">
          {/* Brand */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-full border border-ink/10 px-3 py-1.5 font-display text-sm font-semibold tracking-normal text-ink transition-all hover:bg-ink hover:text-paper focus:outline-none md:text-base"
            id="nav-anchor"
          >
            <Cloud className="h-4 w-4" />
            CLaw
          </button>

          <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-ink/40">
            Mumbai, India
          </span>
        </div>
      </motion.nav>

      {/* Desktop: the pill detaches and docks bottom-centre, mirroring the
          mobile menu's position. Mobile gets the morphing menu instead. */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ x: "-50%" }}
        className="fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] left-1/2 z-50 hidden select-none md:block"
      >
        <SlideTabs
          items={navItems}
          className="bg-paper/90 shadow-[0_16px_32px_rgba(0,0,0,0.14)] backdrop-blur-md"
        />
      </motion.div>

      <div className="md:hidden">
        <FloatingMenu
          items={navItems.map((i) => ({
            label: i.label,
            onClick: i.onClick,
            active: i.active,
          }))}
        />
      </div>
    </>
  );
}
