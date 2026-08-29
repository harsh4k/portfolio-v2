import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import ErrorBoundary from "./components/ErrorBoundary";
import IntroPage from "./pages/IntroPage";
import { CurtainProvider } from "./components/ui/curtain-transition";

// keep rel=canonical pointing at the current route (static index.html only knows the root URL)
function CanonicalUpdater() {
  const { pathname } = useLocation();
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = `https://harshh.pages.dev${pathname === "/" ? "" : pathname}`;
  }, [pathname]);
  return null;
}

// The intro at "/" is near-black while every inner page is light paper, so a
// single static theme-color would be wrong for one of them — in standalone
// that shows up as a mismatched Android status bar. Mirrors CanonicalUpdater.
const ROUTE_THEME_COLORS: Record<string, string> = { "/": "#11110F" };
const DEFAULT_THEME_COLOR = "#EEE9DC";

function ThemeColorUpdater() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;
    const color = ROUTE_THEME_COLORS[pathname] ?? DEFAULT_THEME_COLOR;
    meta.content = color;
    // The inline pre-paint override in index.html only covers the first load;
    // keep html in step so in-app navigation doesn't flash the wrong ground.
    document.documentElement.style.backgroundColor = color;
  }, [pathname]);
  return null;
}

// reset scroll on route change — otherwise a shorter page inherits the previous page's scroll offset.
// Exception: a project dossier (/websites/:id, /fun-code/:id) is an overlay on top of its own index
// page, not a new page — resetting scroll there would both jump the grid to the top the instant a
// dossier opens and strand it there once closed. Only reset when the category itself changes.
function scrollBase(pathname: string) {
  const projectSubroute = pathname.match(/^\/(websites|fun-code)(?:\/.+)?$/);
  return projectSubroute ? `/${projectSubroute[1]}` : pathname;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  const prevBase = useRef<string | null>(null);
  useLayoutEffect(() => {
    const base = scrollBase(pathname);
    if (base !== prevBase.current) window.scrollTo(0, 0);
    prevBase.current = base;
  }, [pathname]);
  return null;
}

const HomePage = lazy(() => import("./pages/HomePage"));
const WebsitesPage = lazy(() => import("./pages/WebsitesPage"));
const FunCodePage = lazy(() => import("./pages/FunCodePage"));
const PostersPage = lazy(() => import("./pages/PostersPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return (
    <ErrorBoundary>
      {/* Retrofits prefers-reduced-motion across every whileInView reveal in
          the app in one place, instead of each section opting in individually. */}
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <CanonicalUpdater />
          <ThemeColorUpdater />
          <ScrollToTop />
          <CurtainProvider>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<IntroPage />} />
                <Route path="/overview" element={<HomePage />} />
                {/* The :id variant renders the same page — the dossier is an overlay the page
                    itself opens by reading useParams(), not a separate route element, since the
                    layoutId shared-layout morph needs the plate and the dossier hero mounted in
                    the same tree. */}
                <Route path="/websites" element={<WebsitesPage />} />
                <Route path="/websites/:id" element={<WebsitesPage />} />
                <Route path="/fun-code" element={<FunCodePage />} />
                <Route path="/fun-code/:id" element={<FunCodePage />} />
                <Route path="/posters" element={<PostersPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </CurtainProvider>
        </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  );
}
