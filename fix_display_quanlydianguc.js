const fs = require('fs');
const path = require('path');

const MAIN = path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）VietSub.md');
const APPEND = path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc_ch53_70_append.md');
const BACKUP = MAIN + '.display_backup';

let content = fs.readFileSync(MAIN, 'utf8');
fs.writeFileSync(BACKUP, content, 'utf8');

// 1. Thay Ch 53 bằng bản sạch từ append
const appendContent = fs.readFileSync(APPEND, 'utf8');
const ch53EndMark = '\n*Lưu ý:';
const ch53Append = appendContent.includes(ch53EndMark)
  ? appendContent.slice(appendContent.indexOf('## Chương 53'), appendContent.indexOf(ch53EndMark)).trim()
  : appendContent.slice(appendContent.indexOf('## Chương 53')).trim();

const ch53Start = content.indexOf('## Chương 53 – Việc ngươi muốn làm');
const nextCh = content.indexOf('\n## Ch', ch53Start + 5);
const endIdx = nextCh > 0 ? nextCh : content.length;

if (ch53Start >= 0 && ch53Append) {
  content = content.slice(0, ch53Start) + ch53Append + content.slice(endIdx);
  console.log('Đã thay Ch 53 bằng bản sạch');
}

// 2. Chỉ sửa tiêu đề/header (tránh thay nhầm trong nội dung)
const safeFixes = [
  ['# Qu?n L� ??a Ng?c (NPH)', '# Quản Lý Địa Ngục (NPH)'],
  ['> Ngu?n:', '> Nguồn:'],
  ['## N?i Dung Gi?i Thi?u', '## Nội Dung Giới Thiệu'],
  ['Qu?n L� ??a Ng?c (NPH)', 'Quản Lý Địa Ngục (NPH)'],
  ['Th? lo?i:', 'Thể loại:'],
  ['S? ch?:', 'Số chữ:'],
  ['S? ch??ng:', 'Số chương:'],
  ['Tr?ng th�i:', 'Trạng thái:'],
  ['?ang k?t', 'Đang kết'],
  ['Ho�n th�nh', 'Hoàn thành'],
  ['### N?i dung gi?i thi?u', '### Nội dung giới thiệu'],
  ['C?p nh?t:', 'Cập nhật:'],
];

for (const [from, to] of safeFixes) {
  if (content.includes(from)) {
    content = content.split(from).join(to);
    console.log('Sửa:', from.substring(0, 35));
  }
}

fs.writeFileSync(MAIN, content, 'utf8');
console.log('Hoàn tất! Backup:', BACKUP);
