/**
 * Image → ASCII, by sampling the bitmap down to one pixel per character cell.
 *
 * Three things carry the detail, and all three matter:
 *
 * 1. The ramp is *measured*, not hand-ordered. Every candidate glyph is drawn
 *    and its ink coverage counted in the font actually being used, then sorted.
 *    Hand-written ramps are the usual reason ASCII art looks noisy: guess the
 *    order wrong and a "darker" character lands lighter than its neighbour, so
 *    smooth gradients come out speckled.
 * 2. Tone mapping is mostly a percentile stretch, with only a quarter-weight
 *    of histogram equalisation mixed in. Equalisation guarantees every ramp
 *    step gets used, but leaned on hard it flattens the very contrast that
 *    makes a picture readable — a bright sky and a dark ridge get dragged
 *    toward the same mid-tone and the frame turns to noise. The small dose is
 *    insurance against a pathological histogram, nothing more.
 * 3. An unsharp mask runs before mapping. Downsampling to a character grid is a
 *    savage reduction and softens every edge; re-sharpening is what keeps a
 *    horizon or a face readable at this size.
 */

/**
 * Glyphs worth considering, deliberately narrow. Ordering here is irrelevant —
 * that gets measured — but membership is not. Ascenders and descenders
 * (b d k h p q l) and busy letterforms (M W Q R) read as *letters* laid over a
 * photograph and fight the picture; round, roughly symmetric marks read as
 * tone. A wider pool buys more tonal steps at the cost of the image itself,
 * which is the wrong trade: legibility beats gradient smoothness here.
 */
const CANDIDATES = " .,:;-~=+ox*OQ0#%8&@$";

/** Used if the canvas is unavailable, e.g. a hardened browser. */
const FALLBACK_RAMP = " .:-=+*#%@";

const rampCache = new Map<string, string>();

/**
 * Sorts glyphs by how much ink each actually puts on screen in `fontFamily`,
 * dropping any that don't add a distinct tonal step.
 */
function buildRamp(fontFamily: string): string {
  const cached = rampCache.get(fontFamily);
  if (cached) return cached;

  const box = 24;
  const canvas = document.createElement("canvas");
  canvas.width = box;
  canvas.height = box;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return FALLBACK_RAMP;

  ctx.font = `${Math.round(box * 0.8)}px ${fontFamily}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";

  const scored: { ch: string; ink: number }[] = [];
  for (const ch of CANDIDATES) {
    ctx.clearRect(0, 0, box, box);
    ctx.fillText(ch, box / 2, box / 2);
    const { data } = ctx.getImageData(0, 0, box, box);
    let ink = 0;
    for (let i = 3; i < data.length; i += 4) ink += data[i];
    scored.push({ ch, ink: ink / (box * box * 255) });
  }
  scored.sort((a, b) => a.ink - b.ink);

  // Coverage is measured in a square, but a monospace cell is only ~0.6 as wide
  // as it is tall, so even '@' tops out near 0.16 of the box. Spacing the steps
  // by an absolute amount would therefore keep about a dozen glyphs; normalise
  // against the real range first so the threshold means what it looks like.
  const heaviest = scored[scored.length - 1]?.ink ?? 0;
  if (heaviest <= 0) return FALLBACK_RAMP;

  // Two glyphs of near-identical weight are two chances to pick the noisier
  // one, so keep only those that genuinely advance the ramp.
  const steps: string[] = [];
  let previous = -1;
  for (const { ch, ink } of scored) {
    const level = ink / heaviest;
    if (level - previous < 0.045) continue;
    steps.push(ch);
    previous = level;
  }

  const ramp = steps.length > 4 ? steps.join("") : FALLBACK_RAMP;
  rampCache.set(fontFamily, ramp);
  return ramp;
}

/** Unsharp mask over the luminance grid, against a 4-neighbour blur. */
function sharpen(source: Float32Array, width: number, height: number, amount: number) {
  const out = Float32Array.from(source);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      const blur =
        (source[i - 1] + source[i + 1] + source[i - width] + source[i + width]) * 0.25;
      out[i] = source[i] + (source[i] - blur) * amount;
    }
  }
  return out;
}

/** Index of the last sorted value below `v` — the cell's rank in the histogram. */
function rank(sorted: Float32Array, v: number) {
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < v) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

export interface AsciiOptions {
  /** Character columns to sample into. */
  cols: number;
  /** Cell height ÷ cell width for the font in use, so the art isn't stretched. */
  cellAspect: number;
  /** Font family the art renders in, so the ramp is measured against it. */
  fontFamily?: string;
  /** Cap on rows, for images tall enough to run off the page. */
  maxRows?: number;
  /** 0 = percentile stretch only, 1 = full equalisation. @default 0.25 */
  equalise?: number;
  /** Unsharp strength. @default 0.5 */
  sharpness?: number;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`ascii: could not load ${src}`));
    img.src = src;
  });
}

export async function imageToAscii(
  src: string,
  {
    cols,
    cellAspect,
    fontFamily = "monospace",
    maxRows = 34,
    equalise = 0.25,
    sharpness = 0.5,
  }: AsciiOptions
): Promise<string[]> {
  // The ramp is measured against the rendered face and then cached, so building
  // it before the webfont arrives would pin a fallback's ramp for the session.
  await document.fonts?.ready;

  const img = await loadImage(src);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  if (!width || !height || cols < 2) return [];

  let grid = cols;
  let rows = Math.max(2, Math.round((cols * height) / width / cellAspect));
  if (rows > maxRows) {
    // Narrow the grid rather than keeping every column — dropping rows alone
    // would scale the picture into fewer of them and squash it.
    rows = maxRows;
    grid = Math.max(2, Math.round((rows * cellAspect * width) / height));
  }

  const canvas = document.createElement("canvas");
  canvas.width = grid;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  // The default is a cheap filter; at this reduction ratio it throws away
  // detail the ramp could otherwise have shown.
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, grid, rows);

  const { data } = ctx.getImageData(0, 0, grid, rows);
  const raw = new Float32Array(grid * rows);
  for (let i = 0; i < raw.length; i += 1) {
    const p = i * 4;
    raw[i] =
      (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255;
  }

  const lum = sharpness > 0 ? sharpen(raw, grid, rows, sharpness) : raw;

  const ordered = Float32Array.from(lum).sort();
  const low = ordered[Math.floor(ordered.length * 0.02)];
  const high = ordered[Math.floor(ordered.length * 0.98)];
  const span = Math.max(0.0001, high - low);
  const lastRank = Math.max(1, ordered.length - 1);

  const ramp = buildRamp(fontFamily);
  const top = ramp.length - 1;

  const out: string[] = [];
  for (let y = 0; y < rows; y += 1) {
    let line = "";
    for (let x = 0; x < grid; x += 1) {
      const value = lum[y * grid + x];
      const stretched = Math.min(1, Math.max(0, (value - low) / span));
      const equalised = rank(ordered, value) / lastRank;
      const v = stretched * (1 - equalise) + equalised * equalise;
      line += ramp[Math.round(v * top)];
    }
    out.push(line);
  }
  return out;
}
