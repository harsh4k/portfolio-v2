import { useEffect, useState } from "react";

/**
 * Subscribes to a media query. `matchMedia` is preferred over reading
 * `window.innerWidth` on every resize event — the browser only notifies us when
 * the query result actually flips, so there's no per-pixel resize thrash.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Below Tailwind's `md` breakpoint (768px). */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * Touch/pen rather than mouse or trackpad. Capability-based, so it stays correct
 * on a small desktop window and on a large tablet — unlike a width check.
 */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

export default useMediaQuery;
