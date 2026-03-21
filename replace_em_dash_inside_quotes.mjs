#!/usr/bin/env node
/**
 * Thay U+2014 (—) trong đoạn BÊN TRONG cặp " trên cùng một dòng → ", " (dấu phẩy + khoảng).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath =
  process.argv[2] ||
  path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

function replaceInsideQuotes(line) {
  let out = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuote = !inQuote;
    if (ch === '—' && inQuote) {
      const prev = i > 0 ? line[i - 1] : '';
      if (/[.!?]/.test(prev)) out += ' ';
      else out += ', ';
    } else {
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
s = s.split('\n').map((l) => replaceInsideQuotes(l)).join('\n');
s = s.replace(/, {2,}/g, ', ');
s = s.replace(/, {2,}/g, ', ');

fs.writeFileSync(filePath, s, 'utf8');
const after = countEm(fs.readFileSync(filePath, 'utf8'));
console.log(`Em dash (U+2014): ${before} → ${after} (trong dấu " trên mỗi dòng)`);
