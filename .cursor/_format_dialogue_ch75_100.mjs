import { readFileSync, writeFileSync } from "fs";

const PATH =
  "c:/Users/KienNT/Desktop/AnhDL/Novel/Novel01/Truyện đã dịch/ChangTraiThoKechVaCoNuongVietSub.md";

// ASCII "..." và dấu ngoặc tiếng Việt “...” (U+201C / U+201D)
const QUOTE_RE = /\u201c[^\u201d]*\u201d|"[^"]*"/g;

function splitInlineDialogues(s) {
  if (!s.includes('"') && !s.includes("\u201c") && !s.includes("\u201d")) {
    return s;
  }
  const matches = [...s.matchAll(QUOTE_RE)];
  if (!matches.length) return s;
  const chunks = [];
  let pos = 0;
  for (const m of matches) {
    const before = s.slice(pos, m.index).trim();
    const quote = m[0];
    if (before) chunks.push(before);
    chunks.push(quote);
    pos = m.index + quote.length;
  }
  let after = s.slice(pos).trim();
  if (after) {
    // Gộp dấu chấm câu sau ngoặc đóng (trước đó nằm sau “…” trong một câu)
    if (after.startsWith(".") && chunks.length) {
      const last = chunks[chunks.length - 1];
      if (last && /[\u201d"]$/.test(last)) {
        chunks[chunks.length - 1] = last + ".";
        after = after.slice(1).trim();
      }
    }
    if (after) chunks.push(after);
  }
  return chunks.join("\n\n");
}

function normalizeExcessiveBlanks(s) {
  return s.replace(/\n{4,}/g, "\n\n\n");
}

let text = readFileSync(PATH, "utf8");
text = text.replace(/\r\n/g, "\n");
const start = text.indexOf("## Chương 75 ");
if (start === -1) throw new Error("Ch75 not found");
const end = text.indexOf("\n\n---\n\n*Tác giả", start);
if (end === -1) throw new Error("Footer not found");

const before = text.slice(0, start);
const block = text.slice(start, end);
const after = text.slice(end);

const hasQuoteMark = (p) =>
  p.includes('"') || p.includes("\u201c") || p.includes("\u201d");

const parts = block.split("\n\n");
const outParts = parts.map((p) =>
  hasQuoteMark(p) ? splitInlineDialogues(p) : p
);
let newBlock = outParts.join("\n\n");
newBlock = normalizeExcessiveBlanks(newBlock);
// Sửa dòng chỉ còn “.” sau khối thoại (do tách câu)
newBlock = newBlock.replace(/(\u201d)\n\n\. /g, "$1.\n\n");
newBlock = newBlock.replace(/"\n\n\. /g, '".\n\n');

writeFileSync(PATH, before + newBlock + after, "utf8");
console.log("OK");
