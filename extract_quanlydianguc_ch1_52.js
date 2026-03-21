/**
 * Trích chương 1-52 từ nguồn TQ, lưu ra file để dịch.
 * Chạy: node extract_quanlydianguc_ch1_52.js
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname);
const TQ_PATH = path.join(BASE, 'Truyện chưa dịch', 'QuanLyDiaNguc（nph）TQ.md');
const OUT_CN = path.join(BASE, 'quanlydianguc_ch1_52_cn_extract.md');

const content = fs.readFileSync(TQ_PATH, 'utf8');
const navPattern = /上一章\s*返回目录\s*加入书签\s*下一章/g;

const regex = /## 第(\d+)章\s+([^\n]+)\n([\s\S]*?)(?=\n---\n|$)/g;
let match;
const parts = [];

while ((match = regex.exec(content)) !== null) {
  const n = parseInt(match[1], 10);
  if (n >= 1 && n <= 52) {
    let body = match[3].trim().replace(navPattern, '');
    parts.push(`## 第${n}章 ${match[2]}\n\n${body}\n\n---\n\n`);
  }
}

fs.writeFileSync(OUT_CN, parts.join(''), 'utf8');
console.log(`Đã trích chương 1-52 → ${OUT_CN}`);
console.log('Dịch file này sang tiếng Việt (Google Translate, ChatGPT...), lưu thành quanlydianguc_ch1_52_vn_translated.md');
console.log('Sau đó chạy: node merge_quanlydianguc_translation.js');
