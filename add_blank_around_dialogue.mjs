#!/usr/bin/env node
/**
 * Thêm dòng trống trước và sau mỗi đoạn thoại.
 * Theo beta-truyen: mỗi lời thoại là một đoạn riêng, có 1 dòng trống trước và sau.
 * KHÔNG tách các dòng có pattern ,— (thoại nhúng với tường thuật giữa).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

let content = fs.readFileSync(filePath, 'utf8');

function extractDialogue(str, pos) {
  const quoteStart = str.indexOf('"', pos);
  if (quoteStart < 0 || quoteStart - pos > 10) return null;
  let end = quoteStart + 1;
  while (end < str.length) {
    if (str[end] === '\\') { end += 2; continue; }
    if (str[end] === "'") {
      end++;
      while (end < str.length && str[end] !== "'") end++;
      end++;
      continue;
    }
    if (str[end] === '"') return { text: str.slice(quoteStart, end + 1), start: quoteStart, end: end + 1 };
    end++;
  }
  return null;
}

const lines = content.split('\n');
const out = [];
let changes = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.startsWith('#') || line.startsWith('---') || line.trim() === '' || /^\s*\*[^*]+\*\s*$/.test(line)) {
    out.push(line);
    continue;
  }

  const trim = line.trim();

  // Dòng chỉ có thoại thuần - đảm bảo blank trước/sau
  if (/^"[^"]*[.?!]?"\s*$/.test(trim) || /^"[^"]{20,}"\s*$/.test(trim)) {
    if (out.length > 0 && out[out.length - 1] !== '') out.push('');
    out.push(line);
    out.push('');
    continue;
  }

  // BỎ QUA dòng có ,— (thoại nhúng với tường thuật - giữ nguyên)
  if (/,—\s*(hắn|Karl|cô ấy|bạn|Hắn|Cô |Bạn|Tây |Cách |giọng|ánh mắt)/.test(line) || /,—\s*[^"]*,—/.test(line)) {
    out.push(line);
    continue;
  }

  // Tìm , " hoặc : " với dialogue đủ dài
  const commaIdx = line.search(/,\s*"/);
  const colonIdx = line.search(/:\s*"/);
  let searchFrom = -1;
  if (colonIdx >= 0) searchFrom = colonIdx;
  if (commaIdx >= 0 && (searchFrom < 0 || commaIdx < searchFrom)) searchFrom = commaIdx;

  if (searchFrom < 0 || line.length < 60) {
    out.push(line);
    continue;
  }

  const d = extractDialogue(line, searchFrom);
  if (!d || d.text.length < 30) {
    out.push(line);
    continue;
  }

  const inner = d.text.slice(1, -1);
  if (inner.length < 25 && !/[.?!]/.test(inner)) {
    out.push(line);
    continue;
  }

  const before = line.slice(0, d.start).trim().replace(/\s*$/, '');
  const after = line.slice(d.end).trim();

  changes++;
  if (before) out.push(before);
  out.push('');
  out.push(d.text);
  out.push('');
  if (after) out.push(after);
}

content = out.join('\n');
content = content.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã tách', changes, 'đoạn thoại, thêm dòng trống quanh thoại.');
