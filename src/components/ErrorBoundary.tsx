import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#EEE9DC] px-4 text-center">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#F13A18]">
              Something broke
            </p>
            <p className="mt-4 font-display text-4xl uppercase leading-tight text-[#161513]">
              Unexpected Error
            </p>
            <p className="mt-2 text-sm text-[#161513]/65">
              Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-[#F13A18] px-6 py-3 font-sans text-[10px] uppercase tracking-[0.16em] text-[#EEE9DC] transition-transform hover:-translate-y-0.5"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    // no @types/react in this project, so tsc can't see props inherited from Component
    return (this as any).props.children;
  }
}
