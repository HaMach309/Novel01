/**
 * Merge bản dịch chương 1-52 vào file VietSub.
 * Chạy: node merge_quanlydianguc_translation.js
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname);
const VN_PATH = path.join(BASE, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）VietSub.md');
const TRANSLATED_PATH = path.join(BASE, 'quanlydianguc_ch1_52_vn_translated.md');

if (!fs.existsSync(TRANSLATED_PATH)) {
  console.error(`Không tìm thấy: ${TRANSLATED_PATH}`);
  process.exit(1);
}

const newContent = fs.readFileSync(TRANSLATED_PATH, 'utf8');
let fullContent = fs.readFileSync(VN_PATH, 'utf8');

const idxFirst = fullContent.indexOf('## Ch');
if (idxFirst <= 0) {
  console.error('Không tìm thấy chương đầu');
  process.exit(1);
}

const header = fullContent.substring(0, idxFirst);

const ch53Match = fullContent.match(/\n## Chương 53\s*[–\-]/) || fullContent.match(/\n## Ch[^\n]*53[^\n]*\n/);
const ch53Start = ch53Match ? fullContent.indexOf(ch53Match[0]) + 1 : -1;

const tail = ch53Start > 0 ? fullContent.substring(ch53Start) : '';
let result = header + newContent.trim();
if (tail) result += '\n\n---\n\n' + tail;

const backupPath = VN_PATH + '.before_merge';
fs.writeFileSync(backupPath, fullContent, 'utf8');
console.log('Backup:', backupPath);

fs.writeFileSync(VN_PATH, result, 'utf8');
console.log('Đã merge xong!');
