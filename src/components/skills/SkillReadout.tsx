import { GooeyMorph } from "../ui/gooey-morph";
import { cn } from "../../lib/utils";
import { DISCIPLINE_BY_ID, type Skill } from "./skill-data";

/**
 * The instrument panel. The skill name is a gooey morph driven straight off
 * hover state, so moving between pins melts one word into the next instead of
 * hard-swapping. Idle it shows the section's own name.
 */

const LEVEL_LABEL: Record<Skill["level"], string> = {
  3: "Daily driver",
  2: "Confident",
  1: "Working knowledge",
};

export interface SkillReadoutProps {
  skill: Skill | null;
  total: number;
  idleLabel: string;
  className?: string;
}

export default function SkillReadout({ skill, total, idleLabel, className }: SkillReadoutProps) {
  const discipline = skill ? DISCIPLINE_BY_ID.get(skill.discipline) : null;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.18em] text-paper/45 uppercase">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
        <span>{skill ? discipline?.label : "Readout"}</span>
        <span className="h-px flex-1 bg-paper/12" />
        <span className="tabular-nums">{total} entries</span>
      </div>

      <GooeyMorph
        text={skill ? skill.name : idleLabel}
        className="mt-4 font-display"
        textClassName="text-paper text-[clamp(1.35rem,2.3vw,2.1rem)] uppercase tracking-[-0.03em]"
      />

      <div className="mt-4 flex items-center gap-2.5">
        <span aria-hidden="true" className="flex gap-1">
          {[1, 2, 3].map((step) => (
            <span
              key={step}
              className={cn(
                "h-0.75 w-5 rounded-full transition-colors duration-300",
                skill && step <= skill.level ? "bg-signal" : "bg-paper/18",
              )}
            />
          ))}
        </span>
        <span className="font-mono text-[9px] tracking-[0.16em] text-paper/55 uppercase">
          {skill ? LEVEL_LABEL[skill.level] : "Awaiting input"}
        </span>
      </div>

      <p className="mt-3 min-h-[3.2em] max-w-sm text-[13px] leading-relaxed text-paper/65">
        {skill
          ? skill.note
          : "Every tool I reach for, pinned where it lives. Point at a marker to read it, or pick a region to isolate one lobe."}
      </p>
    </div>
  );
}
