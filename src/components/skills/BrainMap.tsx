import { cn } from "../../lib/utils";
import { DISCIPLINE_BY_ID, type DisciplineId, type Skill, type Tint } from "./skill-data";

/**
 * The collage artwork with every skill pinned to it as a marker.
 *
 * Positions come from skill-data (generated against the artwork's alpha mask,
 * see the note there). Only the pointed-at marker ever shows a label, which is
 * what keeps 50 of them from collapsing back into a tag cloud — the name and
 * the note live in the readout instead.
 */

const TINT_MARK: Record<Tint, string> = {
  signal: "bg-signal",
  lime: "bg-lime",
};

const TINT_RING: Record<Tint, string> = {
  signal: "border-signal",
  lime: "border-lime",
};

const TINT_LABEL: Record<Tint, string> = {
  signal: "text-signal border-signal/40",
  lime: "text-lime border-lime/40",
};


/** Daily drivers read as bigger pins. */
const LEVEL_SIZE: Record<Skill["level"], string> = {
  3: "h-3 w-3",
  2: "h-2.5 w-2.5",
  1: "h-2 w-2",
};

/**
 * A hard dark ring plus a soft dark halo. The artwork is halftone, so a pin is
 * always sitting on some mix of black dots and white paper — the ring separates
 * it from the light areas and the halo from the dark ones. Without both, half
 * the map disappears depending on where a pin happens to land.
 */
const PIN_RELIEF =
  "shadow-[0_0_0_2px_var(--color-night),0_0_9px_3px_var(--color-night)]";

export interface BrainMapProps {
  skills: Skill[];
  art: string;
  focused: Skill | null;
  activeDiscipline: DisciplineId | null;
  onFocusSkill: (skill: Skill | null) => void;
  className?: string;
}

export default function BrainMap({
  skills,
  art,
  focused,
  activeDiscipline,
  onFocusSkill,
  className,
}: BrainMapProps) {
  return (
    <div
      className={cn("relative aspect-[900/726] w-full", className)}
      onPointerLeave={() => onFocusSkill(null)}
    >
      <img
        src={art}
        alt=""
        width={900}
        height={726}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain opacity-80"
      />

      {skills.map((skill, i) => {
        const discipline = DISCIPLINE_BY_ID.get(skill.discipline);
        const tint: Tint = discipline?.tint ?? "signal";
        const isFocused = focused?.name === skill.name;
        const isDimmed = activeDiscipline !== null && activeDiscipline !== skill.discipline;
        // Labels flip to the left half so they never run off the right edge.
        const flip = skill.x > 58;

        return (
          <button
            key={skill.name}
            type="button"
            style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
            onPointerEnter={() => onFocusSkill(skill)}
            onFocus={() => onFocusSkill(skill)}
            onBlur={() => onFocusSkill(null)}
            aria-label={`${skill.name} — ${discipline?.label ?? ""}`}
            className={cn(
              "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center",
              "h-7 w-7 rounded-full outline-none", // generous hit area around a small pin
              "transition-opacity duration-300",
              isDimmed ? "opacity-25" : "opacity-100",
              isFocused && "z-30",
            )}
          >
            {/* Ring blooms out of the pin on hover. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute h-7 w-7 rotate-45 border-2 transition-all duration-300 ease-out",
                TINT_RING[tint],
                isFocused ? "scale-100 opacity-60" : "scale-50 opacity-0",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "brain-pin rotate-45 transition-transform duration-300 ease-out",
                PIN_RELIEF,
                LEVEL_SIZE[skill.level],
                TINT_MARK[tint],
                isFocused && "scale-[1.6]",
              )}
              // Staggered breathe so the map reads as live instrumentation.
              style={{ animationDelay: `${(i % 12) * 0.34}s` }}
            />

            {isFocused && (
              <span
                className={cn(
                  "pointer-events-none absolute top-1/2 -translate-y-1/2 border-b bg-night/85 px-1.5 pb-0.5 font-mono text-[9px] whitespace-nowrap uppercase tracking-[0.14em] backdrop-blur-[1px] sm:text-[10px]",
                  TINT_LABEL[tint],
                  flip ? "right-full mr-2" : "left-full ml-2",
                )}
              >
                {skill.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
