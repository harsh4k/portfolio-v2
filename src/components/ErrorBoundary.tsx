import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  /** A failed dynamic import — almost always a cold cache offline or a stale deploy. */
  isChunkError: boolean;
}

/**
 * A rejected `React.lazy()` import surfaces here rather than in Suspense, so
 * offline route navigation lands on this screen. "Unexpected Error / try
 * refreshing" is the wrong thing to say in that case — refreshing without a
 * network just yields the browser's offline page — so distinguish the two.
 */
function looksLikeChunkError(error: Error): boolean {
  const message = `${error.name}: ${error.message}`;
  return (
    /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
      message,
    )
  );
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isChunkError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, isChunkError: looksLikeChunkError(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Previously the error was swallowed entirely, which made a failed chunk
    // indistinguishable from a genuine render bug.
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const offline =
        this.state.isChunkError ||
        (typeof navigator !== "undefined" && navigator.onLine === false);

      return (
        <div className="flex min-h-screen items-center justify-center bg-[#EEE9DC] px-4 text-center">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#F13A18]">
              {offline ? "Offline" : "Something broke"}
            </p>
            <p className="mt-4 font-display text-4xl uppercase leading-tight text-[#161513]">
              {offline ? "No Connection" : "Unexpected Error"}
            </p>
            <p className="mt-2 text-sm text-[#161513]/65">
              {offline
                ? "This part of the site hasn't been saved for offline use yet. Reconnect and try again."
                : "Try refreshing the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-[#F13A18] px-6 py-3 font-sans text-[10px] uppercase tracking-[0.16em] text-[#EEE9DC] transition-transform hover:-translate-y-0.5"
            >
              {offline ? "Retry" : "Refresh"}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
