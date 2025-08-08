import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

type CsvRow = {
  count: string;
  category: string;
  name: string;
  image?: string;
  link?: string;
};

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // toggle quotes or escape
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  // header
  const headerParts = splitCsvLine(lines[0]).map(s => s.trim());
  const norm = (s: string) => s.toLowerCase();
  const headerIndex: Record<string, number> = {};
  headerParts.forEach((h, i) => {
    headerIndex[norm(h)] = i;
  });
  const getIndex = (...names: string[]) => {
    for (const n of names) {
      const idx = headerIndex[norm(n)];
      if (typeof idx === 'number') return idx;
    }
    return -1;
  };
  const idxCount = getIndex('count', 'counting', '#');
  const idxCategory = getIndex('category', 'group', 'set');
  const idxName = getIndex('product name', 'name', 'item');
  const idxImage = getIndex('image', 'image url', 'img', 'photo');
  const idxLink = getIndex('link', 'url', 'product url');
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = splitCsvLine(lines[i]);
    if (parts.length < 2) continue;
    const count = idxCount >= 0 ? (parts[idxCount] || '').trim() : '';
    const category = idxCategory >= 0 ? (parts[idxCategory] || '').trim() : '';
    const name = idxName >= 0 ? (parts[idxName] || '').trim() : '';
    const image = idxImage >= 0 ? (parts[idxImage] || '').trim() || undefined : undefined;
    const link = idxLink >= 0 ? (parts[idxLink] || '').trim() || undefined : undefined;
    rows.push({ count, category, name, image, link });
  }
  return rows;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "Ideas - Sheet1 (1).csv");
    const content = fs.readFileSync(filePath, "utf8");
    const rows = parseCsv(content).filter(r => r.category);
    const categoriesInOrder: string[] = [];
    for (const r of rows) {
      if (!categoriesInOrder.includes(r.category)) {
        categoriesInOrder.push(r.category);
      }
    }
    const firstFour = categoriesInOrder.slice(0, 4);
    const groups = firstFour.map(cat => {
      const items = rows.filter(r => r.category === cat).slice(0, 4).map(r => {
        // prefer explicit image column
        let image = r.image || '';
        // fallback: local file under public/product-images/<slug>.{jpg,png,webp}
        if (!image) {
          const slug = slugify(r.name);
          const baseDir = path.join(process.cwd(), 'public', 'product-images');
          const candidates = ['jpg', 'png', 'webp'].map(ext => ({
            fsPath: path.join(baseDir, `${slug}.${ext}`),
            url: `/product-images/${slug}.${ext}`,
          }));
          const found = candidates.find(c => fs.existsSync(c.fsPath));
          if (found) image = found.url;
        }
        return {
          name: r.name,
          image,
          link: r.link || '',
        };
      });
      return { category: cat, items };
    });
    const today = new Date().toISOString().split("T")[0];
    return NextResponse.json({ date: today, groups });
  } catch (err) {
    return NextResponse.json({ error: "Failed to read Ideas CSV" }, { status: 500 });
  }
}


