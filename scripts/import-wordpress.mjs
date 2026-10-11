// Importiert die Blogbeiträge der alten WordPress-Seite als Markdown nach src/content/blog/de/.
// Bilder werden neben den Beitrag geladen, damit Astro sie optimieren kann.
// Aufruf: node scripts/import-wordpress.mjs
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';

const API = 'https://smilesafricacharity.com/wp-json/wp/v2';
const OUT = path.resolve('src/content/blog/de');
// Bereits gesicherte Medien (assets/smilesafrica/bilder) zuerst nutzen, um die alte Seite zu schonen
const LOCAL = path.resolve('assets/smilesafrica/bilder');

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });
// Enfold-Layout-Container bringen keinen Inhalt mit
turndown.remove(['script', 'style', 'noscript', 'iframe', 'form']);

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…');

const yaml = (s) => JSON.stringify(s);

async function download(src, dir) {
  // WordPress-Größenvarianten (-300x200) durch das Original ersetzen
  const original = src.replace(/-\d+x\d+(\.\w+)$/, '$1').split('?')[0];
  const name = path.basename(original);
  const target = path.join(dir, name);
  const local = path.join(LOCAL, original.split('/wp-content/uploads/')[1]?.replaceAll('/', '_') ?? '');
  if (existsSync(local)) {
    await copyFile(local, target);
    return `./${path.basename(dir)}/${name}`;
  }
  const res = await fetch(original);
  if (!res.ok) {
    console.warn(`  Bild nicht geladen (${res.status}): ${original}`);
    return null;
  }
  await writeFile(target, Buffer.from(await res.arrayBuffer()));
  return `./${path.basename(dir)}/${name}`;
}

const res = await fetch(`${API}/posts?per_page=100&_embed=1`);
const posts = await res.json();
console.log(`${posts.length} Beiträge gefunden`);

for (const post of posts) {
  const slug = post.slug;
  const imgDir = path.join(OUT, slug);
  await mkdir(imgDir, { recursive: true });

  let html = post.content.rendered;
  const srcs = [...new Set([...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]))];
  for (const src of srcs) {
    if (!src.includes('smilesafricacharity.com/wp-content/uploads')) continue;
    const local = await download(src, imgDir);
    if (local) html = html.split(src).join(local);
  }
  // srcset verweist weiter auf die alte Seite und wird nicht gebraucht
  html = html.replace(/\s(srcset|sizes)="[^"]*"/g, '');

  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const cover = media?.source_url ? await download(media.source_url, imgDir) : null;
  const author = post._embedded?.author?.[0]?.name ?? 'Smiles Africa';
  const excerpt = decode(post.excerpt.rendered.replace(/<[^>]+>/g, '').trim()).slice(0, 220);

  const body = turndown
    .turndown(html)
    .replace(/^[ \t\u00a0]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const frontmatter = [
    '---',
    `title: ${yaml(decode(post.title.rendered))}`,
    `date: ${post.date.slice(0, 10)}`,
    `author: ${yaml(author)}`,
    `description: ${yaml(excerpt)}`,
    cover ? `cover: ${yaml(cover)}` : null,
    cover ? `coverAlt: ${yaml(decode(media.alt_text || ''))}` : null,
    `legacyUrl: ${yaml(post.link)}`,
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  await writeFile(path.join(OUT, `${slug}.md`), `${frontmatter}\n\n${body}\n`);
  console.log(`  ✓ ${slug}`);
}
