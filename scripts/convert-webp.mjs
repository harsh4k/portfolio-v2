import sharp from "sharp";
import { readdirSync } from "fs";
import { extname, join } from "path";

const dir = "public/images";
const files = readdirSync(dir);

for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
  const input = join(dir, file);
  const output = join(dir, file.replace(ext, ".webp"));
  await sharp(input).webp({ quality: 80 }).toFile(output);
  console.log(`✓ ${file} → ${file.replace(ext, ".webp")}`);
}

console.log("\nDone.");
