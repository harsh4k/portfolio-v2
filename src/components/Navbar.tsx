import { useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Cloud, LayoutGrid, Briefcase, User, Mail } from "lucide-react";

const PAGE_LINKS = [
  { id: "home", label: "Home", to: "/" },
  { id: "overview", label: "Overview", to: "/overview" },
];

const SECTION_LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const DOCK_ICONS: Record<string, typeof Briefcase> = {
  overview: LayoutGrid,
  work: Briefcase,
  about: User,
  contact: Mail,
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scrollToSection = useCallback(
    (id: string) => {
      const onOverview = location.pathname === "/overview";
      if (!onOverview) {
        navigate("/overview");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [navigate, location.pathname],
  );

  const dockItems = [
    ...(!isHome ? [{ id: "overview", label: "Overview", onClick: () => navigate("/overview") }] : []),
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
        className="sticky top-0 z-40 w-full border-b border-ink/10 bg-paper/90 backdrop-blur-md select-none"
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

          {/* Center links — desktop */}
          <div className="hidden items-center gap-6 md:flex">
            {!isHome &&
              PAGE_LINKS.filter((l) => l.to !== "/").map((l) => {
                const active = location.pathname === l.to;
                return (
                  <button
                    key={l.id}
                    onClick={() => navigate(l.to)}
                    onMouseEnter={() => setHoveredId(l.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`relative overflow-hidden rounded-full border border-ink/10 px-4 py-1.5 font-sans text-[13px] font-medium transition-colors focus:outline-none ${
                      active ? "bg-ink text-paper" : "text-ink hover:text-paper"
                    }`}
                    id={`nav-link-${l.id}`}
                  >
                    {hoveredId === l.id && !active && (
                      <motion.span
                        layoutId="navHoverPill"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{l.label}</span>
                  </button>
                );
              })}
            {SECTION_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToSection(l.id)}
                onMouseEnter={() => setHoveredId(l.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative overflow-hidden rounded-full border border-ink/10 px-4 py-1.5 font-sans text-[13px] font-medium text-ink transition-colors hover:text-paper focus:outline-none"
                id={`nav-link-${l.id}`}
              >
                {hoveredId === l.id && (
                  <motion.span
                    layoutId="navHoverPill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </button>
            ))}
          </div>

          {/* Right side — desktop */}
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40 md:block">
            Mumbai, India
          </span>
        </div>
      </motion.nav>

      {/* Mobile dock — persistent, no open/close state */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 mx-auto flex w-fit items-center gap-1 rounded-full border border-ink/10 bg-paper/95 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md md:hidden"
      >
        {dockItems.map((item) => {
          const Icon = DOCK_ICONS[item.id];
          const active = item.id === "overview" && location.pathname === "/overview";
          return (
            <motion.button
              key={item.id}
              onClick={item.onClick}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-0.5 rounded-full px-4 py-2 transition-colors ${
                active ? "bg-ink text-paper" : "text-ink/70"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-mono text-[9px] uppercase tracking-[0.1em]">{item.label}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </>
  );
}
