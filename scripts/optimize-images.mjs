// One-off: shrink oversized gallery/portrait images. Originals in image-originals/.
import sharp from "sharp";
import { statSync } from "node:fs";

const kb = (f) => Math.round(statSync(f).size / 1024);

// Portrait: 939x1676 PNG -> 800w webp
{
  const out = "public/images/profile.webp";
  await sharp("image-originals/profile.png").resize({ width: 800 }).webp({ quality: 80 }).toFile(out);
  console.log(`profile.webp ${kb(out)} KB`);
}

// Gallery v1-v12: cap longest edge at 1600px, q72
for (let i = 1; i <= 12; i++) {
  const f = `public/images/v${i}.webp`;
  // node fs can't overwrite these files on this drive (errno -4094); a .tmp is
  // written here and PowerShell Copy-Item does the replace (see plan/run notes)
  await sharp(f)
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(`${f}.tmp`);
  console.log(`v${i}.webp.tmp ${kb(`${f}.tmp`)} KB`);
}
