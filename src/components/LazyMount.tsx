import { useEffect, useRef, useState, type ReactNode } from "react";

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
export default function LazyMount({ children, minHeight, rootMargin = "600px", id }: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  if (!visible) {
    return <div ref={ref} id={id} style={{ minHeight }} />;
  }

  return <>{children}</>;
}
