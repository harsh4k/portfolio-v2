import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import BrainMap from "./skills/BrainMap";
import SkillReadout from "./skills/SkillReadout";
import { BASE_ART, DISCIPLINES, SKILLS, type DisciplineId, type Skill } from "./skills/skill-data";

/**
 * Operating Range — the stack as an anatomical map.
 *
 * Every skill is a pin on the collage, clustered into six lobes by discipline,
 * with the name and note carried by the readout rather than by 50 labels. That
 * is what lets the whole thing sit inside one viewport: the old six-card grid
 * ran ~290px past the fold and the docked nav pill landed on the last row.
 *
 * The anatomy is a conceit, not a claim — the lobes are chosen so the map reads
 * as perception → movement → integration → reasoning, with the languages
 * underneath and delivery down at the stem.
 */

const TINT_TEXT: Record<string, string> = {
  signal: "text-signal",
  lime: "text-lime",
};

const TINT_MARK: Record<string, string> = {
  signal: "bg-signal",
  lime: "bg-lime",
};


export default function Skills() {
  const [focused, setFocused] = useState<Skill | null>(null);
  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineId | null>(null);

  const active = activeDiscipline ? DISCIPLINES.find((d) => d.id === activeDiscipline) : null;
  const focusedDiscipline = focused
    ? DISCIPLINES.find((d) => d.id === focused.discipline)
    : null;

  const counts = useMemo(() => {
    const map = new Map<DisciplineId, number>();
    for (const skill of SKILLS) map.set(skill.discipline, (map.get(skill.discipline) ?? 0) + 1);
    return map;
  }, []);

  // Whichever lobe is in play drives the artwork, so per-discipline collages can
  // be dropped into skill-data later without touching this component.
  const art = active?.image ?? focusedDiscipline?.image ?? BASE_ART;

  return (
    <section
      id="skills"
      className="dark-grid relative flex min-h-screen flex-col justify-center overflow-hidden border-t border-paper/10 px-4 pt-14 pb-24 text-paper select-none sm:px-6 md:px-12 md:pt-12 md:pb-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-48 hidden -translate-y-1/2 md:block"
      >
        {[360, 580, 800].map((size) => (
          <div
            key={size}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/6"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        // Explicit placement on lg only, so the stacked order can differ from the
        // desktop one: phones get title → map → readout → index, keeping the
        // artwork and its payoff above the fold instead of behind the index.
        className="relative mx-auto grid w-full max-w-[1600px] items-start gap-8 lg:grid-cols-[minmax(200px,0.78fr)_minmax(0,1.5fr)_minmax(220px,0.8fr)] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-10 lg:gap-y-6"
      >
        <div className="order-1 lg:col-start-1 lg:row-start-1">
          <span className="inline-block rounded-full bg-lime px-4 py-1.5 font-mono text-[10px] tracking-[0.16em] text-ink uppercase">
            Active matrix
          </span>
          <h2 className="mt-4 font-display text-[14vw] leading-[0.8] tracking-[-0.06em] uppercase md:text-[3.6vw] xl:text-[3.2vw]">
            Operating
            <br />
            Range
          </h2>
        </div>

        {/* ── The map ── */}
        <div className="order-2 flex flex-col items-center lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <BrainMap
            className="max-w-[460px]"
            skills={SKILLS}
            art={art}
            focused={focused}
            activeDiscipline={activeDiscipline}
            onFocusSkill={setFocused}
          />
          <p className="mt-2 text-center font-mono text-[9px] tracking-[0.16em] text-paper/40 uppercase">
            {active?.region ?? focusedDiscipline?.region ?? "Six lobes · fifty tools"}
          </p>
        </div>

        {/* ── The readout ── */}
        <SkillReadout
          skill={focused}
          total={SKILLS.length}
          idleLabel={active ? active.label : "Operating Range"}
          className="order-3 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:pt-1"
        />

        {/* ── The lobe index, which doubles as the filter ── */}
        <div
          role="group"
          aria-label="Filter by region"
          className="order-4 border-t border-paper/10 lg:col-start-1 lg:row-start-2"
        >
          {DISCIPLINES.map((discipline) => {
            const isActive = activeDiscipline === discipline.id;
            return (
              <button
                key={discipline.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveDiscipline(isActive ? null : discipline.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-3 border-b border-paper/10 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors duration-200 outline-none",
                  "focus-visible:bg-paper/5",
                  isActive ? TINT_TEXT[discipline.tint] : "text-paper/55 hover:text-paper",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-2 w-2 rotate-45 transition-transform duration-200",
                      TINT_MARK[discipline.tint],
                      isActive && "scale-150",
                    )}
                  />
                  {discipline.label}
                </span>
                <span className="tabular-nums opacity-45">{counts.get(discipline.id)}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
