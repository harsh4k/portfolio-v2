import { ArrowLeft } from "lucide-react";
import CurtainLink from "../ui/curtain-link";
import type { LucideIcon } from "lucide-react";

interface EditorialSidebarProps {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  subtitle: string;
  description: string;
  totalCount: number;
  statsText?: string;
  /** Index (0-based) of the plate nearest the viewport centre, if the page tracks it. */
  activeIndex?: number;
}

export default function EditorialSidebar({
  icon: Icon,
  iconClass,
  title,
  subtitle,
  description,
  totalCount,
  statsText,
  activeIndex = 0,
}: EditorialSidebarProps) {
  return (
    <header>
      <CurtainLink
        to="/overview"
        className="inline-flex items-center gap-2 rounded-full border border-[#161513]/20 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.18em] text-[#161513]/60 transition-colors hover:bg-[#161513] hover:text-[#EEE9DC]"
      >
        <ArrowLeft className="h-3 w-3" />
        Back
      </CurtainLink>

      <div className="mt-12 flex items-start gap-5">
        <Icon className={`mt-1.5 h-6 w-6 shrink-0 ${iconClass}`} />
        <div>
          <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] uppercase leading-[0.82] tracking-[-0.04em]">
            {title}
          </h1>
          <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.18em] text-[#161513]/40">
            {subtitle}
          </p>
        </div>
      </div>

      <p className="mt-6 max-w-prose text-sm leading-relaxed text-[#161513]/65">
        {description}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        {statsText && (
          <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#161513]/40">
            {statsText}
          </span>
        )}
        <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-ink/30">
          IN VIEW {String(activeIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
        </span>
      </div>
    </header>
  );
}
