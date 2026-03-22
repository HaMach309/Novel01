#!/usr/bin/env node
/**
 * Gộp dòng thoại bị cắt: dòng trước mở "… nhưng chưa đóng ", dòng sau bắt đầu bằng " + khoảng trắng + tường thuật.
 * (Lỗi xuống dòng giữa cặp ngoặc kép.)
 */
import fs from 'fs';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node merge_split_quote_lines.mjs <file.md>');
  process.exit(1);
}

let s = fs.readFileSync(filePath, 'utf8');
const lines = s.split(/\n/);
const out = [];
let merged = 0;

function quoteCount(line) {
  return (line.match(/"/g) || []).length;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const next = lines[i + 1];

  if (next != null && /^"\s+\S/.test(next) && out.length > 0) {
    const prev = out[out.length - 1];
    if (quoteCount(prev) % 2 === 1) {
      out[out.length - 1] = prev + '"' + next.replace(/^"\s+/, ' ');
      i++;
      merged++;
      continue;
    }
  }
  out.push(line);
}

fs.writeFileSync(filePath, out.join('\n'), 'utf8');
console.log('Đã gộp', merged, 'chỗ thoại bị tách dòng sai.');
