import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCoarsePointer } from "../hooks/use-media";

interface LazyMountProps {
  children: ReactNode;
  minHeight: string;
  rootMargin?: string;
  id?: string;
}

/**
 * Renders children only once the placeholder nears the viewport. Used to defer
 * heavy below-fold sections (and their dynamic imports / API calls / WebGL
 * setup) until they're actually about to be seen. minHeight reserves the
 * section's footprint up front so nothing shifts (CLS) when it mounts.
 *
 * Pass `id` when the wrapped section is a scroll-anchor target (e.g. nav links
 * using scrollIntoView) — it's applied to the placeholder so getElementById
 * finds something to scroll to even before the real section has mounted; that
 * scroll pulls the placeholder into rootMargin, which mounts the real section
 * (carrying the same id) in its place.
 */
export default function LazyMount({ children, minHeight, rootMargin, id }: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // A phone viewport is shorter than 600px worth of scroll-ahead, so the
  // default margin can fire mid-scroll; give coarse pointers more headroom.
  const coarse = useCoarsePointer();
  const margin = rootMargin ?? (coarse ? "1200px" : "600px");

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, margin]);

  if (!visible) {
    return <div ref={ref} id={id} style={{ minHeight }} />;
  }

  return <>{children}</>;
}
