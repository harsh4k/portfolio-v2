import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Cloud, Grid2x2, Code2, User, Mail } from "lucide-react";

const PAGE_LINKS = [
  { id: "home", label: "Home", to: "/" },
  { id: "overview", label: "Overview", to: "/overview" },
];

const SECTION_LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const DOCK_ICONS: Record<string, typeof Code2> = {
  overview: Grid2x2,
  work: Code2,
  about: User,
  contact: Mail,
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

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

          {/* Mobile nav — hamburger opens a panel below the (top-fixed) bar */}
          <div ref={menuRef} className="relative md:hidden">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink transition-colors hover:bg-ink hover:text-paper focus:outline-none"
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M4 12L20 12"
                  className={`origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] ${
                    menuOpen ? "translate-y-0 rotate-315" : "-translate-y-1.75"
                  }`}
                />
                <path
                  d="M4 12H20"
                  className={`origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] ${
                    menuOpen ? "rotate-45" : ""
                  }`}
                />
                <path
                  d="M4 12H20"
                  className={`origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] ${
                    menuOpen ? "translate-y-0 rotate-135" : "translate-y-1.75"
                  }`}
                />
              </svg>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 24 }}
                  className="absolute top-full right-0 z-10 mt-2 w-44 overflow-hidden rounded-2xl border border-ink/10 bg-paper/95 p-1.5 shadow-[0_16px_32px_rgba(0,0,0,0.14)] backdrop-blur-md"
                >
                  {dockItems.map((item, index) => {
                    const Icon = DOCK_ICONS[item.id];
                    const active = item.id === "overview" && location.pathname === "/overview";
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                        onClick={() => {
                          item.onClick();
                          setMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                          active ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
