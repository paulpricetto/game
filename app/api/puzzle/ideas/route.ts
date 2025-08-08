import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

type CsvRow = {
  count: string;
  category: string;
  name: string;
  link?: string;
};

function parseCsv(content: string): CsvRow[] {
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  // skip header
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // naive split into at most 4 columns
    const parts = line.split(",");
    if (parts.length < 3) continue;
    const [count, category, name, ...rest] = parts;
    const link = rest.length > 0 ? rest.join(",") : undefined;
    rows.push({ count: count.trim(), category: (category || "").trim(), name: (name || "").trim(), link: link?.trim() });
  }
  return rows;
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
      const items = rows.filter(r => r.category === cat).slice(0, 4).map(r => ({
        name: r.name,
        image: "",
        link: r.link || "",
      }));
      return { category: cat, items };
    });
    const today = new Date().toISOString().split("T")[0];
    return NextResponse.json({ date: today, groups });
  } catch (err) {
    return NextResponse.json({ error: "Failed to read Ideas CSV" }, { status: 500 });
  }
}


