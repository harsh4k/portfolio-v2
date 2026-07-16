import * as React from "react";
import { cn } from "../../lib/utils";

interface ListItem {
  id: number;
  title: string;
  category: string;
  src: string;
  alt: string;
  accent: string;
  description?: string;
}

interface RollingTextItemProps {
  item: ListItem;
}

function RollingTextItem(props: RollingTextItemProps & { key?: React.Key }) {
  const { item } = props;
  return (
    <div className="group relative w-full cursor-pointer border-b border-[#161513]/12 py-6 last:border-b-0">
      <div className="relative overflow-hidden h-[60px] md:h-20">
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:group-hover:-translate-y-1/2">
          <div className="h-[60px] md:h-20 flex items-center">
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter text-[#161513]">
              {item.title}
            </h2>
          </div>
          <div className="max-md:hidden h-[60px] md:h-20 flex items-center">
            <h2
              className="text-5xl md:text-7xl font-display uppercase tracking-tighter italic"
              style={{ color: item.accent }}
            >
              {item.title}
            </h2>
          </div>
        </div>
      </div>

      <span className="max-md:mt-1 max-md:opacity-60 md:absolute md:top-8 md:right-0 text-xs font-mono uppercase tracking-widest text-[#161513]/40 transition-opacity duration-300 md:group-hover:opacity-0 block">
        {item.category}
      </span>

      {item.description && (
        <p className="mt-2 text-xs font-mono leading-relaxed text-[#161513]/55 max-w-md">
          {item.description}
        </p>
      )}

      <div
        className={cn(
          "z-20 h-52 w-full max-w-sm overflow-hidden rounded-xl shadow-[6px_6px_0_#161513] md:h-60 md:w-96",
          "relative mt-4 opacity-100 scale-100 rotate-0 translate-x-0 pointer-events-auto",
          "md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:pointer-events-none",
          "md:opacity-0 md:scale-95 md:rotate-3 md:translate-x-4",
          "md:transition-all md:duration-500 md:ease-out",
          "md:group-hover:opacity-100 md:group-hover:scale-100 md:group-hover:rotate-0 md:group-hover:translate-x-0"
        )}
      >
        <div className="relative h-full w-full">
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover max-md:grayscale-0 grayscale transition-all duration-500 ease-out md:group-hover:grayscale-0"
          />
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{ backgroundColor: item.accent, opacity: 0.15 }}
          />
        </div>
      </div>
    </div>
  );
}

interface RollingTextListProps {
  items: ListItem[];
}

function RollingTextList({ items }: RollingTextListProps) {
  return (
    <div className="w-full flex flex-col">
      {items.map((item) => (
        <RollingTextItem key={item.id} item={item} />
      ))}
    </div>
  );
}

export { RollingTextList };
export type { ListItem };
