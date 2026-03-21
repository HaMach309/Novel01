#!/usr/bin/env node
/**
 * Tách dòng: "Thoại. Vi Ô Lai Khả|Khả Nhĩ|Hắn …" (cả khối trong một cặp ngoặc kép)
 * Chỉ khi sau dấu chấm là một trong ba tên + khoảng trắng (đầu câu kể).
 * Bỏ qua nếu thoại mở bằng xưng hô "Vi Ô Lai Khả," (dễ lẫn với kể).
 */
import fs from "fs";

const path =
  "/Users/dolananh/Desktop/Novel/Truyện đã dịch/QuanLyDiaNguc（nph）TQ-VietSub.md";

const STRICT = /\. (Vi Ô Lai Khả|Khả Nhĩ|Hắn) /;

function splitOneQuotedLine(line) {
  const t = line.trimEnd();
  if (!t.startsWith('"') || !t.endsWith('"')) return null;
  const inner = t.slice(1, -1);
  if (inner.startsWith("Vi Ô Lai Khả,")) return null;
  STRICT.lastIndex = 0;
  const m = STRICT.exec(inner);
  if (!m || m.index < 10) return null;
  const narration = inner.slice(m.index + 2).trimStart();
  if (!narration.length) return null;
  return {
    dialogueLine: `"${inner.slice(0, m.index + 1)}"`,
    narrationLine: narration,
  };
}

let s = fs.readFileSync(path, "utf8");
const lines = s.split("\n");
const out = [];
let changed = 0;

for (let i = 0; i < lines.length; i++) {
  const split = splitOneQuotedLine(lines[i]);
  if (split) {
    out.push(split.dialogueLine);
    out.push("");
    out.push(split.narrationLine);
    changed++;
  } else {
    out.push(lines[i]);
  }
}

fs.writeFileSync(path, out.join("\n"), "utf8");
console.log("Strict splits applied:", changed, path);
