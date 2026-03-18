import fs from "node:fs";
import path from "node:path";

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function quantile(nums, q) {
  const a = [...nums].sort((x, y) => x - y);
  const pos = (a.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (a[base + 1] === undefined) return a[base];
  return a[base] + rest * (a[base + 1] - a[base]);
}

function parseReport(reportMd) {
  const rows = [];
  for (const line of reportMd.split(/\r?\n/)) {
    if (!line.startsWith("|")) continue;
    const cols = line
      .split("|")
      .slice(1, -1)
      .map((s) => s.trim());
    if (cols.length !== 4) continue;
    const [sttRaw, chapterRaw, startLineRaw, wordCountRaw] = cols;
    const stt = Number(sttRaw);
    const startLine = Number(startLineRaw);
    const wordCount = Number(wordCountRaw);
    const m = chapterRaw.match(/^Chương\s+(\d+)\b/);
    const chapterNum = m ? Number(m[1]) : null;
    if (!Number.isFinite(stt) || !Number.isFinite(startLine) || !Number.isFinite(wordCount)) continue;
    if (!chapterNum) continue;
    rows.push({ stt, chapterNum, chapterTitle: chapterRaw, startLine, wordCount });
  }
  return rows;
}

function countZhChars(p) {
  const text = readText(p);
  return text.replace(/\s+/g, "").length;
}

function main() {
  const cwd = process.cwd();
  const reportPath = path.join(cwd, "report.md");
  const zhDir = path.join(cwd, "chapters_zh");
  const outPath = path.join(cwd, "report_incomplete_translation_all.md");

  const rows = parseReport(readText(reportPath));
  if (rows.length === 0) throw new Error("Khong parse duoc report.md");

  const enriched = [];
  for (const row of rows) {
    const zhFile = path.join(zhDir, `ch${String(row.chapterNum).padStart(3, "0")}.txt`);
    if (!fs.existsSync(zhFile)) continue;
    const zhChars = countZhChars(zhFile);
    if (!zhChars) continue;
    const ratio = row.wordCount / zhChars;
    enriched.push({ ...row, zhChars, ratio, zhFile: `chapters_zh/ch${String(row.chapterNum).padStart(3, "0")}.txt` });
  }

  const ratios = enriched.map((r) => r.ratio);
  const p20 = quantile(ratios, 0.2);
  const p25 = quantile(ratios, 0.25);
  const median = quantile(ratios, 0.5);

  const flagged = enriched.filter((r) => r.ratio <= p25).sort((a, b) => a.ratio - b.ratio);

  const lines = [];
  lines.push("# Bao cao day du cac chuong nghi chua dich du");
  lines.push("");
  lines.push("Nguon: doi chieu `report.md` va `chapters_zh/chXXX.txt`.");
  lines.push("");
  lines.push("Tieu chi bao cao nay:");
  lines.push("- Liet ke **toan bo** chuong co ty le `VI words / ZH chars` nam trong nhom thap nhat (<= P25).");
  lines.push("- Day la danh sach can uu tien soat lai ban dich day du.");
  lines.push("");
  lines.push(`- Tong chuong du lieu: **${enriched.length}**`);
  lines.push(`- Nguong P20 ty le VI/ZH: **${p20.toFixed(4)}**`);
  lines.push(`- Nguong P25 ty le VI/ZH: **${p25.toFixed(4)}**`);
  lines.push(`- Median ty le VI/ZH: **${median.toFixed(4)}**`);
  lines.push(`- Tong chuong trong danh sach nghi chua du (<= P25): **${flagged.length}**`);
  lines.push("");
  lines.push("| STT | Chuong | So tu (VI) | Ky tu (ZH, bo trang) | Ty le VI/ZH | File goc |");
  lines.push("| --- | --- | ---: | ---: | ---: | --- |");
  flagged.forEach((r, idx) => {
    lines.push(`| ${idx + 1} | ${r.chapterTitle} | ${r.wordCount} | ${r.zhChars} | ${r.ratio.toFixed(4)} | \`${r.zhFile}\` |`);
  });

  lines.push("");
  lines.push("## Goi y");
  lines.push("");
  lines.push("- Uu tien nhom dau bang (ty le thap nhat) de dich lai truoc.");
  lines.push("- Sau moi dot cap nhat, chay lai `node gen_reportVietSub.mjs` va `node audit_translation_completeness.mjs`.");

  fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
  process.stdout.write(`Wrote ${path.basename(outPath)} with ${flagged.length} chapters.\n`);
}

main();

