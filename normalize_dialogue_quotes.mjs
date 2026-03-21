#!/usr/bin/env node
/**
 * Chuẩn hóa thoại:
 * 1) Chuyển ",— thoại" và ": — thoại" (dòng không chứa ") thành thoại riêng trong "".
 * 2) Chuyển đầu dòng "— thoại" (không có " trong dòng) thành "".
 * 3) Sau bước 1–2: thêm một dòng trống trước mỗi dòng bắt đầu bằng " (thoại) nếu dòng trước là văn xuôi;
 *    thêm một dòng trống sau dòng thoại nếu dòng sau không trống và không phải thoại tiếp.
 *
 * Không bọc thêm nếu thoại đã có " đầy đủ. Không tách dòng đã có " bên trong (tránh nổi thoại lồng).
 */
import fs from "fs";
import path from "path";

const file = path.join(
  process.cwd(),
  "Truyện đã dịch",
  "QuanLyDiaNguc（nph）TQ-VietSub.md"
);

function wrapQuote(s) {
  let x = s.trim();
  if (x.startsWith('"') && x.endsWith('"')) return x;
  if (!x.startsWith('"')) x = `"${x}`;
  if (!x.endsWith('"')) x = `${x}"`;
  return x;
}

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

function isDialogueLine(line) {
  const t = line.trim();
  return t.startsWith('"') && t.length > 1;
}

let lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
const out = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  if (isStructural(line)) {
    out.push(line);
    continue;
  }

  // Nguyên dòng đã là thoại trong "" (một dòng đủ)
  if (
    trimmed.startsWith('"') &&
    trimmed.endsWith('"') &&
    trimmed.length > 2
  ) {
    out.push(line);
    continue;
  }

  // : — thoại
  if (trimmed.includes(": — ") && !trimmed.includes('"')) {
    const idx = trimmed.indexOf(": — ");
    const before = trimmed.slice(0, idx).trimEnd();
    const speech = trimmed.slice(idx + 4).trim();
    if (before) out.push(before);
    out.push(wrapQuote(speech));
    continue;
  }

  // ,— thoại (một lần)
  if (trimmed.includes(",— ") && !trimmed.includes('"')) {
    const idx = trimmed.indexOf(",— ");
    const before = trimmed.slice(0, idx).trimEnd();
    const speech = trimmed.slice(idx + 3).trim();
    if (before) out.push(before);
    out.push(wrapQuote(speech));
    continue;
  }

  // Đầu dòng — thoại
  if (
    /^—\s+\S/.test(trimmed) &&
    !trimmed.startsWith("——") &&
    !trimmed.includes('"')
  ) {
    const inner = trimmed.replace(/^—\s+/, "").trim();
    if (inner.length >= 6 || /[.!?…][\s]*$/.test(inner)) {
      out.push(wrapQuote(inner));
      continue;
    }
  }

  out.push(line);
}

// Thêm dòng trống trước/sau thoại
const spaced = [];
for (let j = 0; j < out.length; j++) {
  const line = out[j];
  const prev = spaced[spaced.length - 1];
  const next = j + 1 < out.length ? out[j + 1] : null;

  if (isDialogueLine(line) && !isStructural(line)) {
    if (
      prev !== undefined &&
      prev !== null &&
      prev.trim() !== "" &&
      !isStructural(prev) &&
      !isDialogueLine(prev)
    ) {
      if (spaced[spaced.length - 1] !== "") spaced.push("");
    }
  }

  spaced.push(line);

  if (isDialogueLine(line) && !isStructural(line) && next != null) {
    const nt = next.trim();
    if (
      nt !== "" &&
      !isStructural(next) &&
      !isDialogueLine(next)
    ) {
      spaced.push("");
    }
  }
}

let result = spaced.join("\n");
result = result.replace(/\n{3,}/g, "\n\n");

fs.writeFileSync(file, result, "utf8");
console.log("OK lines:", result.split("\n").length);
