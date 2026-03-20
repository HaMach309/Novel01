import fs from "node:fs";
import path from "node:path";

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function median(nums) {
  const a = [...nums].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 === 0 ? (a[mid - 1] + a[mid]) / 2 : a[mid];
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

function normalizeForLineCount(s) {
  return s
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() !== "");
}

function countNonWhitespaceChars(s) {
  // Rough proxy length; works well for Chinese sources where whitespace is sparse.
  return s.replace(/\s+/g, "").length;
}

function main() {
  const cwd = process.cwd();
  const reportPath = path.join(cwd, "report.md");
  const vietSubPath = path.join(cwd, "VietSub.md");
  const zhDir = path.join(cwd, "chapters_zh");

  if (!fs.existsSync(reportPath)) throw new Error(`Missing ${reportPath}`);
  if (!fs.existsSync(vietSubPath)) throw new Error(`Missing ${vietSubPath}`);
  if (!fs.existsSync(zhDir)) throw new Error(`Missing ${zhDir}`);

  const report = readText(reportPath);
  const vietSub = readText(vietSubPath);
  const rows = parseReport(report);
  if (rows.length === 0) throw new Error("Could not parse report.md table rows.");

  const wordCounts = rows.map((r) => r.wordCount);
  const q1 = quantile(wordCounts, 0.25);
  const q3 = quantile(wordCounts, 0.75);
  const iqr = q3 - q1;
  const outlierThreshold = Math.max(0, Math.floor(q1 - 1.5 * iqr));

  // Also provide a "soft" threshold: bottom 10% by wordcount.
  const p10 = Math.floor(quantile(wordCounts, 0.1));
  const med = Math.floor(median(wordCounts));

  const candidates = rows
    .filter((r) => r.wordCount <= Math.max(p10, outlierThreshold))
    .sort((a, b) => a.wordCount - b.wordCount);

  const lines = [];
  lines.push("# Candidates nghi thiếu nội dung / tóm tắt");
  lines.push("");
  lines.push("Tạo bởi `audit_translation_completeness.mjs`.");
  lines.push("");
  lines.push(`- Median (ước lượng): **${med}** từ/chương`);
  lines.push(`- P10 (bottom 10%): **${p10}**`);
  lines.push(`- Outlier threshold (Q1 - 1.5*IQR): **${outlierThreshold}**`);
  lines.push(`- Ngưỡng chọn dùng: **<= ${Math.max(p10, outlierThreshold)}**`);
  lines.push("");
  lines.push(
    "| Chương | Số từ (VI) | Dòng bắt đầu trong VietSub.md | Ký tự ZH (không trắng) | Dòng ZH (không rỗng) | VI words / ZH chars | File gốc |"
  );
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: | --- |");

  for (const c of candidates) {
    const chFile = `ch${String(c.chapterNum).padStart(3, "0")}.txt`;
    const chPath = path.join(zhDir, chFile);
    let zhLines = null;
    let zhChars = null;
    if (fs.existsSync(chPath)) {
      const zh = readText(chPath);
      zhLines = normalizeForLineCount(zh).length;
      zhChars = countNonWhitespaceChars(zh);
    }
    const ratio = zhChars ? (c.wordCount / zhChars).toFixed(4) : "n/a";

    // sanity: ensure chapter header exists in VietSub
    const headerRegex = new RegExp(String.raw`^##\s+Chương\s+${c.chapterNum}\b`, "m");
    const existsInVietSub = headerRegex.test(vietSub);
    const startLine = existsInVietSub ? c.startLine : -1;

    lines.push(`| ${c.chapterTitle} | ${c.wordCount} | ${startLine} | ${zhChars ?? "n/a"} | ${zhLines ?? "n/a"} | ${ratio} | ${chFile} |`);
  }

  const outPath = path.join(cwd, "retranslation_candidates.md");
  fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
  process.stdout.write(`Wrote ${path.relative(cwd, outPath)} with ${candidates.length} candidates.\n`);
}

main();

