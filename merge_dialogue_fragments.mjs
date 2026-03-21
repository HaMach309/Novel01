#!/usr/bin/env node
/**
 * Chỉ gộp khi dòng A kết thúc bằng khoảng trắng + " (mở trích dẫn lồng),
 * dòng B không có ", dòng C bắt đầu bằng " → «B» trong một dòng thoại.
 * Điều kiện chặt: /\s"\s*$/ — tránh gộp nhầm câu thoại đã kết thúc bằng ." hoặc ?"
 */
import fs from "fs";
import path from "path";

const file = path.join(
  process.cwd(),
  "Truyện đã dịch",
  "QuanLyDiaNguc（nph）TQ-VietSub.md"
);

function isStructural(line) {
  const t = line.trim();
  return (
    t === "" ||
    t.startsWith("#") ||
    t === "---" ||
    t.startsWith("```") ||
    t.startsWith(">") ||
    t.startsWith("|")
  );
}

function nextNonEmpty(lines, start) {
  let j = start;
  while (j < lines.length && lines[j].trim() === "") j++;
  return j;
}

function mergePass(lines) {
  const out = [];
  let i = 0;
  let changed = false;
  while (i < lines.length) {
    const line = lines[i];
    if (isStructural(line)) {
      out.push(line);
      i++;
      continue;
    }
    const a = line;
    const t = a.trimEnd();
    if (!/\s"\s*$/.test(t) || !a.includes('"')) {
      out.push(line);
      i++;
      continue;
    }
    const iB = nextNonEmpty(lines, i + 1);
    const iC = nextNonEmpty(lines, iB + 1);
    if (iB >= lines.length || iC >= lines.length) {
      out.push(line);
      i++;
      continue;
    }
    const b = lines[iB];
    const c = lines[iC];
    if (
      !isStructural(a) &&
      b &&
      c &&
      b.trim().length > 0 &&
      b.trim().length < 200 &&
      !b.includes('"') &&
      !b.includes("«") &&
      c.trim().startsWith('"')
    ) {
      const prefix = a.slice(0, -1);
      const inner = b.trim();
      const rest = c.trim().replace(/^"\s*/, "");
      const merged = `${prefix} «${inner}» ${rest}`;
      out.push(merged);
      i = iC + 1;
      changed = true;
      continue;
    }
    out.push(line);
    i++;
  }
  return { out, changed };
}

let lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
let rounds = 0;
for (let r = 0; r < 50; r++) {
  const { out, changed } = mergePass(lines);
  lines = out;
  if (changed) rounds++;
  else break;
}

fs.writeFileSync(file, lines.join("\n"), "utf8");
console.log("merge_dialogue_fragments rounds:", rounds, "lines:", lines.length);
