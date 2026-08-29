/**
 * Rasterises public/favicon.svg into every icon the web manifest and the
 * Android app need. One source of truth, so the web and native marks can never
 * drift apart. Re-run with `node scripts/generate-icons.mjs`.
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const OUT = "public/icons";
const ANDROID_RES = "android/app/src/main/res";
const INK = "#161513";
const PAPER = "#EEE9DC";

// The cloud mark from favicon.svg, without its background plate.
const GLYPH = `<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" transform="translate(4,4)" fill="none" stroke="${PAPER}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

/** The icon exactly as favicon.svg draws it, at an explicit pixel size. */
const anySvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="${INK}"/>
  ${GLYPH}
</svg>`;

/**
 * Full-bleed background with the glyph shrunk and centred. Android crops
 * maskable and adaptive icons to an arbitrary shape and only guarantees the
 * inner 80% circle, so the mark cannot sit at the source art's ~12.5% inset.
 */
const insetSvg = (size, scale, background) => {
  const inner = 32 * scale;
  const offset = (32 - inner) / 2;
  const plate = background ? `<rect width="32" height="32" fill="${background}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  ${plate}
  <g transform="translate(${offset},${offset}) scale(${scale})">${GLYPH}</g>
</svg>`;
};

mkdirSync(OUT, { recursive: true });

// --- Web ---------------------------------------------------------------------
const webTargets = [
  ["pwa-192.png", anySvg(192)],
  ["pwa-512.png", anySvg(512)],
  ["pwa-maskable-512.png", insetSvg(512, 0.62, INK)],
  ["apple-touch-icon-180.png", anySvg(180)],
];

for (const [name, svg] of webTargets) {
  await sharp(Buffer.from(svg)).png().toFile(join(OUT, name));
  console.log(`web    ✓ ${name}`);
}

// --- Android launcher icons --------------------------------------------------
const DENSITIES = [
  ["mdpi", 48],
  ["hdpi", 72],
  ["xhdpi", 96],
  ["xxhdpi", 144],
  ["xxxhdpi", 192],
];

for (const [density, size] of DENSITIES) {
  const dir = join(ANDROID_RES, `mipmap-${density}`);
  mkdirSync(dir, { recursive: true });

  await sharp(Buffer.from(anySvg(size))).png().toFile(join(dir, "ic_launcher.png"));

  // Adaptive foreground: 108dp canvas against a 72dp nominal icon, transparent
  // ground, glyph well inside the safe zone.
  const fgSize = Math.round(size * 1.5);
  await sharp(Buffer.from(insetSvg(fgSize, 0.4, null)))
    .png()
    .toFile(join(dir, "ic_launcher_foreground.png"));

  console.log(`android ✓ mipmap-${density}`);
}

const anydpi = join(ANDROID_RES, "mipmap-anydpi-v26");
mkdirSync(anydpi, { recursive: true });
const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ink" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
`;
writeFileSync(join(anydpi, "ic_launcher.xml"), adaptive);
writeFileSync(join(anydpi, "ic_launcher_round.xml"), adaptive);
console.log("android ✓ mipmap-anydpi-v26 (adaptive)");

console.log("\nDone.");
