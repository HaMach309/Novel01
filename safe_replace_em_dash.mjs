#!/usr/bin/env node
/**
 * Thay U+2014 (—) chỉ ở đoạn NGOÀI cặp dấu nháy kép ASCII " trên cùng một dòng.
 * Trong thoại (trong ngoặc) giữ nguyên để xử lý tay / tách câu.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath =
  process.argv[2] ||
  path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

function replaceOutsideQuotes(line) {
  let out = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuote = !inQuote;
    if (ch === '—' && !inQuote) {
      const prev = i > 0 ? line[i - 1] : '';
      const next = i + 1 < line.length ? line[i + 1] : '';
      if (/[.!?]/.test(prev)) {
        out += ' ';
      } else if (/\s/.test(next) || next === '' || next === '—') {
        out += ', ';
      } else if (/\s/.test(prev) || prev === '') {
        out += '';
      } else {
        out += ', ';
      }
    } else if (ch !== '—' || inQuote) {
      out += ch;
    }
  }
  return out;
}

function countEm(t) {
  let n = 0;
  for (const ch of t) if (ch === '—') n++;
  return n;
}

let s = fs.readFileSync(filePath, 'utf8');
const before = countEm(s);
const lines = s.split('\n');
const newLines = lines.map((line) => replaceOutsideQuotes(line));
s = newLines.join('\n');

// Dọn phẩy kép (chỉ khoảng trắng ASCII; không gộp xuống dòng)
s = s.replace(/, {2,}/g, ', ');
s = s.replace(/, {2,}/g, ', ');

fs.writeFileSync(filePath, s, 'utf8');
const after = countEm(fs.readFileSync(filePath, 'utf8'));
console.log(`Em dash (U+2014): ${before} → ${after} (chỉ ngoài dấu " trên mỗi dòng)`);
