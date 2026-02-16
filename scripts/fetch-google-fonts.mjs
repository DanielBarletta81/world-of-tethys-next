import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'fonts');

const FONTS = [
  {
    slug: 'space-grotesk',
    query: 'family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
  },
  {
    slug: 'spectral',
    query: 'family=Spectral:wght@400;500;600;700&display=swap',
  },
  {
    slug: 'jetbrains-mono',
    query: 'family=JetBrains+Mono:wght@400;600&display=swap',
  },
  {
    slug: 'nanum-pen-script',
    query: 'family=Nanum+Pen+Script:wght@400&display=swap',
  },
  {
    slug: 'im-fell-english',
    query: 'family=IM+Fell+English:wght@400&display=swap',
  },
  {
    slug: 'cinzel-decorative',
    query: 'family=Cinzel+Decorative:wght@400;700&display=swap',
  },
  {
    slug: 'uncial-antiqua',
    query: 'family=Uncial+Antiqua:wght@400&display=swap',
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function weightLabel(weight) {
  return String(weight).trim().replace(/\s+/g, '-');
}

function parseFaces(css) {
  const blocks = css.match(/@font-face\s*\{[^}]+\}/g) || [];
  return blocks.map((block) => {
    const weight = block.match(/font-weight:\s*([^;]+);/i)?.[1] || '400';
    const style = block.match(/font-style:\s*([^;]+);/i)?.[1] || 'normal';
    const url = block.match(/url\((https:[^)]+\.(?:woff2|woff|ttf|otf))\)/i)?.[1] || null;
    return { weight, style, url };
  }).filter((face) => face.url);
}

async function downloadFont(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)' },
  });
  if (!res.ok) {
    throw new Error(`Failed to download ${url} (${res.status})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function run() {
  ensureDir(OUT_DIR);

  for (const font of FONTS) {
    const cssUrl = `https://fonts.googleapis.com/css2?${font.query}`;
    const res = await fetch(cssUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)' },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch CSS for ${font.slug}`);
    }
    const css = await res.text();
    const faces = parseFaces(css);
    if (!faces.length) {
      throw new Error(`No font faces parsed for ${font.slug}`);
    }

    const fontDir = path.join(OUT_DIR, font.slug);
    ensureDir(fontDir);

    for (const face of faces) {
      const ext = path.extname(face.url).replace('.', '') || 'ttf';
      const fileName = `${font.slug}-${weightLabel(face.weight)}${face.style === 'italic' ? '-italic' : ''}.${ext}`;
      const dest = path.join(fontDir, fileName);
      if (fs.existsSync(dest)) continue;
      await downloadFont(face.url, dest);
      process.stdout.write(`Downloaded ${fileName}\\n`);
    }
  }

  process.stdout.write('Done. Fonts saved under public/fonts.\\n');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
