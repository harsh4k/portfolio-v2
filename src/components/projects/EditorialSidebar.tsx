import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface EditorialSidebarProps {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  subtitle: string;
  description: string;
  totalCount: number;
  sectionLabel?: string;
  statsText?: string;
}

export default function EditorialSidebar({
  icon: Icon,
  iconClass,
  title,
  subtitle,
  description,
  totalCount,
  sectionLabel,
  statsText,
}: EditorialSidebarProps) {
  return (
    <header>
      <Link
        to="/overview"
        className="inline-flex items-center gap-2 rounded-full border border-[#161513]/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#161513]/60 transition-colors hover:bg-[#161513] hover:text-[#EEE9DC]"
      >
        <ArrowLeft className="h-3 w-3" />
        Back
      </Link>

      {sectionLabel && (
        <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.22em] text-[#161513]/30">
          {sectionLabel}
        </p>
      )}

      <div className="mt-2 flex items-start gap-5">
        <Icon className={`mt-1.5 h-6 w-6 shrink-0 ${iconClass}`} />
        <div>
          <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] uppercase leading-[0.82] tracking-[-0.04em]">
            {title}
          </h1>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#161513]/40">
            {subtitle}
          </p>
        </div>
      </div>

      <p className="mt-6 max-w-prose text-sm leading-relaxed text-[#161513]/65">
        {description}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        {statsText && (
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#161513]/40">
            {statsText}
          </span>
        )}
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#161513]/30">
          IN VIEW 01 / {String(totalCount).padStart(2, "0")}
        </span>
      </div>
    </header>
  );
}
