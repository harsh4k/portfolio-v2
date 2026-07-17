import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CircularGallery, type GalleryItem } from "./ui/circular-gallery-2";

const galleryItems: GalleryItem[] = Array.from({ length: 12 }, (_, i) => ({
  image: `/images/v${i + 1}.webp`,
  text: `V${i + 1}`,
}));

export default function GallerySection() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="gallery"
      className="paper-grid relative overflow-hidden border-t border-[#161513]/15 px-4 py-20 text-[#161513] select-none sm:px-6 md:px-12 md:py-28"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 diagonal-hatch opacity-30" />

      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 border-b border-[#161513]/15 pb-6"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#161513]/50">(05) Gallery Grid</p>
          <h2 className="mt-3 font-display text-[17vw] uppercase leading-[0.78] tracking-[-0.06em] md:text-[7.8vw]">
            Visual
            <br />
            Archive
          </h2>
        </motion.div>

        {isMobile ? (
          <div
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[4/5] w-[80vw] shrink-0 snap-center overflow-hidden rounded-2xl bg-[#161513]"
              >
                <img
                  src={item.image}
                  alt={item.text}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161513]/80 to-transparent" />
                <span className="absolute bottom-4 left-4 font-display text-xl uppercase tracking-tight text-white/80">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="relative h-[500px] w-full md:h-[600px]" style={{ touchAction: "none" }}>
            <CircularGallery
              items={galleryItems}
              bend={6}
              borderRadius={0.05}
              scrollEase={0.02}
            />
          </div>
        )}
      </div>
    </section>
  );
}
