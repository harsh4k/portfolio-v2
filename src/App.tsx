import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import IntroPage from "./pages/IntroPage";

// keep rel=canonical pointing at the current route (static index.html only knows the root URL)
function CanonicalUpdater() {
  const { pathname } = useLocation();
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = `https://hxrshdev.vercel.app${pathname === "/" ? "" : pathname}`;
  }, [pathname]);
  return null;
}

// reset scroll on route change — otherwise a shorter page inherits the previous page's scroll offset
function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
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
      <BrowserRouter>
        <CanonicalUpdater />
        <ScrollToTop />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/overview" element={<HomePage />} />
            <Route path="/websites" element={<WebsitesPage />} />
            <Route path="/fun-code" element={<FunCodePage />} />
            <Route path="/posters" element={<PostersPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
