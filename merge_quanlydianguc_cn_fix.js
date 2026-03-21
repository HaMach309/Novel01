/**
 * Sửa triệt để lỗi encoding: thay chương 1-52 (corrupted) bằng nội dung tiếng Trung sạch từ nguồn TQ.
 * Áp dụng mapping tên nhân vật. Chương 53+ giữ nguyên (đã sạch).
 * Chạy: node merge_quanlydianguc_cn_fix.js
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname);
const CN_PATH = path.join(BASE, 'quanlydianguc_ch1_52_cn_extract.md');
const VN_PATH = path.join(BASE, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）VietSub.md');

const NAMES = {
  '卡尔': 'Karl',
  '维奥莱卡': 'Vi O Lai Khả',
  '莉莉丝娅': 'Lily Tư Á',
  '西尔凡': 'Tây Nhĩ Phàm',
  '伊利亚': 'Y Lợi Á',
  '格雷戈': 'Cách Lý Cách',
  '锈骨': 'Tú Cốt',
  '晚晚': 'Vãn Vãn',
  '阿萨谢尔': 'A Tát Tạ Nhĩ',
  '艾瑞克': 'Eric',
  '猩红圣杯': 'Chén Thánh Đỏ Thẫm',
  '绯色魅影': 'Ảo Ảnh Màu Đỏ',
};

function applyNames(text) {
  let r = text;
  for (const [cn, vn] of Object.entries(NAMES)) {
    r = r.split(cn).join(vn);
  }
  return r;
}

if (!fs.existsSync(CN_PATH)) {
  console.error('Chạy node extract_quanlydianguc_ch1_52.js trước');
  process.exit(1);
}

if (!fs.existsSync(VN_PATH)) {
  console.error('Không tìm thấy VietSub:', VN_PATH);
  process.exit(1);
}

const cnContent = fs.readFileSync(CN_PATH, 'utf8');
let vnContent = fs.readFileSync(VN_PATH, 'utf8');

const chRegex = /## 第(\d+)章\s+([^\n]+)\n\n([\s\S]*?)(?=\n---\n\n|$)/g;
const outParts = [];
let m;
while ((m = chRegex.exec(cnContent)) !== null) {
  const num = parseInt(m[1], 10);
  if (num >= 1 && num <= 52) {
    const titleCn = m[2];
    const body = applyNames(m[3]);
    outParts.push(`## Chương ${num} – ${titleCn}\n\n${body}\n\n---\n\n`);
  }
}

const newCh1_52 = outParts.join('').trim();

const idxFirst = vnContent.indexOf('## Ch');
if (idxFirst <= 0) {
  console.error('Không tìm thấy chương đầu');
  process.exit(1);
}

let header = vnContent.substring(0, idxFirst);
// Sửa header bị lỗi encoding - thay bằng header sạch
const cleanHeader = `# Quản Lý Địa Ngục (NPH)

> Nguồn: https://m.xyushuwu4.com/book/125734/

---

## Nội Dung Giới Thiệu

Quản Lý Địa Ngục (NPH)

Thể loại: Tinh phẩm văn học
Số chữ: (Trang web không cung cấp)
Số chương: 95
Trạng thái: Đang kể / Hoàn thành

### Nội dung giới thiệu

Cập nhật: 2026-03-19 22:34

---

`;
header = cleanHeader;

const ch53Match = vnContent.match(/\n## Chương 53\s*[–\-]/) || vnContent.match(/\n## Ch[^\n]*53[^\n]*\n/);
const ch53Start = ch53Match ? vnContent.indexOf(ch53Match[0]) + 1 : -1;
const tail = ch53Start > 0 ? vnContent.substring(ch53Start) : '';

let result = header + newCh1_52;
if (tail) result += '\n\n---\n\n' + tail;

const backupPath = VN_PATH + '.before_cn_fix';
fs.writeFileSync(backupPath, vnContent, 'utf8');
console.log('Backup:', backupPath);

fs.writeFileSync(VN_PATH, result, 'utf8');
console.log('Đã sửa triệt để! Chương 1-52: nội dung tiếng Trung sạch (đã map tên). Chương 53+: giữ nguyên.');
