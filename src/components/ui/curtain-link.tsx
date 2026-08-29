import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useCurtain, type CurtainVariant } from "./curtain-transition";

/**
 * Which curtain each destination arrives through. Keeping this in one place
 * means a route always feels the same whether you reached it from the Build
 * Board, a sibling category page, or the nav.
 */
export const ROUTE_CURTAINS: Record<string, { variant: CurtainVariant; label: string }> = {
  "/websites": { variant: "wipe", label: "Websites" },
  "/fun-code": { variant: "stagger", label: "Fun Code" },
  "/posters": { variant: "shutter", label: "Posters" },
  "/overview": { variant: "clipWipe", label: "Overview" },
};

const PREFETCH: Record<string, () => Promise<unknown>> = {
  "/websites": () => import("../../pages/WebsitesPage"),
  "/fun-code": () => import("../../pages/FunCodePage"),
  "/posters": () => import("../../pages/PostersPage"),
  "/overview": () => import("../../pages/HomePage"),
};

export function prefetchRoute(path: string) {
  void PREFETCH[path]?.();
}

interface Props {
  to: string;
  className?: string;
  children: ReactNode;
  /** Overrides the destination's default curtain — used when leaving a page should echo how you entered it. */
  variant?: CurtainVariant;
  label?: string;
}

/**
 * A <Link> that plays a curtain before the route swaps. The real href is kept
 * so middle-click, modifier-click and crawlers behave normally; only the plain
 * left-click is intercepted.
 */
export default function CurtainLink({ to, className, children, variant, label }: Props) {
  const { navigateWithCurtain } = useCurtain();
  const route = ROUTE_CURTAINS[to];

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigateWithCurtain({
      to,
      variant: variant ?? route?.variant ?? "wipe",
      label: label ?? route?.label,
      prefetch: PREFETCH[to],
    });
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      onMouseEnter={() => prefetchRoute(to)}
      className={className}
    >
      {children}
    </Link>
  );
}
