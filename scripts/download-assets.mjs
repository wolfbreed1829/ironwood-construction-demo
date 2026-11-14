import { mkdir, writeFile } from 'node:fs/promises';
const directory = new URL('../theme/ironwood/assets/', import.meta.url);
await mkdir(directory, { recursive: true });
const photos = {
  'hero.jpg': ['photo-1600585154340-be6161a56a0c', 1800],
  'residence.jpg': ['photo-1600607687920-4e2a09cf159d', 1100],
  'interior.jpg': ['photo-1600210492486-724fe5c67fb0', 1100],
  'commercial.jpg': ['photo-1497366754035-f200968a6e72', 1100],
  'detail.jpg': ['photo-1600566753086-00f18fb6b3ea', 1100],
};
await Promise.all(Object.entries(photos).map(async ([name, [id, width]]) => {
  const response = await fetch(`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  await writeFile(new URL(name, directory), Buffer.from(await response.arrayBuffer()));
  console.log(`Downloaded ${name}`);
}));
const css = await (await fetch('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap', {
  headers: {'User-Agent': 'Mozilla/5.0'}
})).text();
let localCSS = css;
let count = 0;
for (const url of [...new Set([...css.matchAll(/url\((https[^)]+)\)/g)].map(match => match[1]))]) {
  const name = `font-${++count}.${url.includes('.woff2') ? 'woff2' : 'ttf'}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Font failed: ${response.status}`);
  await writeFile(new URL(name, directory), Buffer.from(await response.arrayBuffer()));
  localCSS = localCSS.replaceAll(url, `./${name}`);
}
await writeFile(new URL('fonts.css', directory), localCSS);
console.log(`Downloaded ${count} local fonts`);

