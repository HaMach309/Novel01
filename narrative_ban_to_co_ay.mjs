#!/usr/bin/env node
/**
 * Chuyển ngôi tường thuật: "bạn" (xưng hô nhân vật chính nữ) → "cô ấy".
 * Chỉ áp dụng phần NGOÀI dấu ngoặc kép ASCII "..." — không đổi thoại trong ngoặc.
 * Bảo vệ cụm: bạn bè, bạn đập, thuật ngữ, v.v.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

const PLACE = (i) => `\uE000${i}\uE001`;

/** [regex hoặc chuỗi, placeholder] — thay cụm khớp toàn bộ, không đụng bạn→cô ấy */
const PROTECT = [
  [/ly\s+kinh\s+bạn\s+đạo/gi, 'P0'],
  [/bạn\s+đập/gi, 'P1'],
  [/bạn\s+đạo/gi, 'P2'],
  [/Bạn\s+bè/g, 'P3'],
  [/bạn\s+bè/gi, 'P4'],
  [/bạn\s+thân/gi, 'P5'],
  [/bạn\s+trai/gi, 'P6'],
  [/bạn\s+gái/gi, 'P7'],
  [/bạn\s+học/gi, 'P8'],
  [/tình\s+bạn/gi, 'P11'],
  [/kết\s+bạn/gi, 'P12'],
];

const TOKENS = {
  P0: 'ly kinh bạn đạo',
  P1: 'bạn đập',
  P2: 'bạn đạo',
  P3: 'Bạn bè',
  P4: 'bạn bè',
  P5: 'bạn thân',
  P6: 'bạn trai',
  P7: 'bạn gái',
  P8: 'bạn học',
  P11: 'tình bạn',
  P12: 'kết bạn',
};

function protectNarrative(s) {
  let out = s;
  PROTECT.forEach(([re, key], i) => {
    const token = `§${key}§`;
    out = out.replace(re, token);
  });
  return out;
}

function unprotectNarrative(s) {
  let out = s;
  Object.entries(TOKENS).forEach(([k, v]) => {
    out = out.split(`§${k}§`).join(v);
  });
  return out;
}

function narrativeBanToCoAy(text) {
  let s = protectNarrative(text);
  s = s.replace(/\bBạn\b/g, 'Cô ấy');
  s = s.replace(/\bbạn\b/g, 'cô ấy');
  s = unprotectNarrative(s);
  return s;
}

function processLine(line) {
  const parts = line.split('"');
  let out = '';
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      out += narrativeBanToCoAy(parts[i]);
    } else {
      out += '"' + parts[i] + '"';
    }
  }
  return out;
}

let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/,—\s*bạn\s+/g, ',— cô ấy ');
content = content.replace(/\s—\s*bạn\s+/g, '— cô ấy ');

const lines = content.split('\n');
content = lines.map(processLine).join('\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã chuyển bạn → cô ấy trong tường thuật (ngoài thoại).');
