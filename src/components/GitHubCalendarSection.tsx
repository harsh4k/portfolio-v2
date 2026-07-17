import { motion } from "motion/react";
import { GithubCalendar } from "./ui/retro-space-shooter-git-hub-calendar";

export default function GitHubCalendarSection() {
  return (
    <section
      id="github"
      className="relative overflow-hidden bg-paper px-4 pt-16 pb-16 text-ink select-none sm:px-6 md:px-12 md:pt-20 md:pb-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-ink/10 pt-6"
        >
          <h2 className="font-display text-[clamp(3rem,13vw,7rem)] uppercase leading-[0.82] tracking-[-0.03em]">
            Code <span>Activity</span>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/65">
            A year&apos;s worth of commits, contributions, and late-night fixes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="mt-10"
        >
          <GithubCalendar
            username="harsh4k"
            cellSize={13}
            cellGap={4}
            startsOnSunday={false}
          />
        </motion.div>
      </div>
    </section>
  );
}
