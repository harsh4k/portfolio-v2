import { useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Cloud } from "lucide-react";

const PAGE_LINKS = [
  { id: "home", label: "Home", to: "/" },
  { id: "overview", label: "Overview", to: "/overview" },
];

const SECTION_LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = useCallback(
    (id: string) => {
      setMobileOpen(false);
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

  return (
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
            PAGE_LINKS.filter((l) => l.to !== "/").map((l) => (
              <button
                key={l.id}
                onClick={() => navigate(l.to)}
                className={`rounded-full border border-ink/10 px-4 py-1.5 font-sans text-[13px] font-medium transition-all hover:bg-ink hover:text-paper focus:outline-none ${
                  location.pathname === l.to
                    ? "bg-ink text-paper"
                    : "text-ink"
                }`}
                id={`nav-link-${l.id}`}
              >
                {l.label}
              </button>
            ))}
          {SECTION_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToSection(l.id)}
              className="rounded-full border border-ink/10 px-4 py-1.5 font-sans text-[13px] font-medium text-ink transition-all hover:bg-ink hover:text-paper focus:outline-none"
              id={`nav-link-${l.id}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right side — desktop */}
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40 md:block">
          Mumbai, India
        </span>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-8 w-8 items-center justify-center text-ink md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-ink/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {!isHome &&
                PAGE_LINKS.filter((l) => l.to !== "/").map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setMobileOpen(false);
                      navigate(l.to);
                    }}
                    className={`rounded-full border border-ink/10 px-4 py-2 text-left font-sans text-sm font-medium transition-all hover:bg-ink hover:text-paper ${
                      location.pathname === l.to
                        ? "bg-ink text-paper"
                        : "text-ink"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              {SECTION_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollToSection(l.id)}
                  className="rounded-full border border-ink/10 px-4 py-2 text-left font-sans text-sm font-medium text-ink transition-all hover:bg-ink hover:text-paper"
                >
                  {l.label}
                </button>
              ))}
              <div className="mt-2 border-t border-ink/10 pt-3">
                <span className="block px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
                  Mumbai, India
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
