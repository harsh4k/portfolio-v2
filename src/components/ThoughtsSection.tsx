import { motion } from "motion/react";
import { THOUGHTS } from "../data";
import MindTile, { type TileSurface } from "./mind/MindTile";

/**
 * The bento's shape, one entry per thought and in data order.
 *
 * Three steps, and every one of them tiles exactly with no empty cells:
 *
 *   md, 12 columns          sm, 2 columns      base, 1 column
 *   [ 01 4 ][ 02 5 ][ 03 3 ]  [ 01 spans 2  ]    a single stack, where the
 *   [ 01   ][ 04 8         ]  [ 02 ][ 03    ]    only rhythm left is height
 *   [ 05 6        ][ 06 6  ]  [ 04 ][ 05    ]    and surface, so the photo
 *                             [ 06 spans 2  ]    tiles stay deliberately short
 *
 * Surfaces alternate on purpose. Six photo tiles would read as a stock grid;
 * three photos against paper, orange and ink give the block its rhythm.
 */
const layout: { surface: TileSurface; feature?: boolean; className: string }[] = [
  { surface: "photo", feature: true, className: "sm:col-span-2 md:col-span-4 md:row-span-2" },
  { surface: "paper", className: "md:col-span-5" },
  { surface: "signal", className: "md:col-span-3" },
  { surface: "photo", className: "md:col-span-8" },
  { surface: "ink", className: "md:col-span-6" },
  { surface: "photo", className: "sm:col-span-2 md:col-span-6" },
];

export default function ThoughtsSection() {
  return (
    <section className="paper-grid relative overflow-hidden border-t border-ink/15 px-4 py-20 text-ink select-none sm:px-6 md:px-12 md:py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 diagonal-hatch opacity-30" />

      <div className="relative mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 border-b border-ink/15 pb-6"
        >
          <h2 className="mt-3 font-display text-[17vw] uppercase leading-[0.78] tracking-[-0.06em] md:text-[7.8vw]">
            Mind
            <br />
            Dump
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/62">
            Six ideas that shape how I build, design, and explore.
          </p>
        </motion.div>

        {/* auto-rows keeps every band the same height so the row-span-2 lead
            tile lines up with the two rows beside it. It only applies from md,
            so the narrower steps let each tile size to its own content. */}
        <div className="grid gap-4 pt-3 sm:grid-cols-2 md:auto-rows-[minmax(15rem,1fr)] md:grid-cols-12 md:pt-0">
          {THOUGHTS.map((thought, i) => {
            const cell = layout[i % layout.length];
            return (
              <MindTile
                key={thought.id}
                thought={thought}
                index={i}
                surface={cell.surface}
                feature={cell.feature}
                className={cell.className}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
