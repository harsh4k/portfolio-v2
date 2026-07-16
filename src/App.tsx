import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import IntroPage from "./pages/IntroPage";
import WebsitesPage from "./pages/WebsitesPage";
import FunCodePage from "./pages/FunCodePage";
import PostersPage from "./pages/PostersPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/overview" element={<HomePage />} />
          <Route path="/websites" element={<WebsitesPage />} />
          <Route path="/fun-code" element={<FunCodePage />} />
          <Route path="/posters" element={<PostersPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
