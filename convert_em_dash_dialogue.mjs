#!/usr/bin/env node
/**
 * Chuyển thoại dùng — sang dạng "" và xuống dòng trước/sau lời thoại.
 * Chỉ xử lý: [narrative],— [dialogue] khi dialogue chưa có ""
 * KHÔNG đụng: dòng bắt đầu bằng " (đã có ""), và ,— bên trong "" (thoại nhúng)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
const out = [];
let changes = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Bỏ qua dòng bắt đầu bằng " (đã trong ngoặc kép, có thể có ,— nhúng)
  if (line.trimStart().startsWith('"')) {
    out.push(line);
    continue;
  }

  // Tìm pattern: ,— hoặc :— theo sau bởi khoảng trắng và văn bản (thoại)
  const match = line.match(/^(.+?)([,:])\s*—\s+(.+)$/);
  if (!match) {
    out.push(line);
    continue;
  }

  const [, before, punct, dialogueRaw] = match;
  const beforeTrim = before.trim();
  const dialogue = dialogueRaw.trim();

  if (dialogue.length < 15) {
    out.push(line);
    continue;
  }

  changes++;

  out.push(beforeTrim + (punct === ':' ? ':' : ','));
  out.push('');
  out.push('"' + dialogue + '"');
  out.push('');
}

content = out.join('\n');
content = content.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã chuyển', changes, 'thoại từ — sang "".');
