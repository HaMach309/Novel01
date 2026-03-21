/**
 * Chuyển ngôi kể truyện từ ngôi 2 (bạn) sang ngôi 3 (cô ấy)
 * Chỉ thay trong tường thuật, KHÔNG thay trong lời thoại ("...")
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

let content = fs.readFileSync(filePath, 'utf8');

// Bảo vệ cụm từ không thay
content = content.replace(/\bbạn bè\b/g, '«BANBE»');
content = content.replace(/\bbạn thân\b/g, '«BANTHAN»');
content = content.replace(/\bngười bạn\b/g, '«NGUOIBAN»');

function processNarrative(s) {
  let t = s;
  // "các bạn" → "họ" (nhóm người)
  t = t.replace(/\bcác bạn\b/gi, 'họ');
  // "Các ngươi" trong tường thuật (nhóm di chuyển)
  t = t.replace(/\bCác ngươi\s+(dọc theo|xuyên qua|nhanh chóng|lại rời|tới gần|tới nơi|trở lại|bước vào|đã đến|sắp rẽ|rời khỏi|tới cửa|tới gian)/g, 'Họ $1');
  t = t.replace(/\.\s*Các ngươi\s+/g, '. Họ ');
  // "Bạn" (đầu từ) → "Cô ấy"
  t = t.replace(/\bBạn\b/g, 'Cô ấy');
  // "bạn" → "cô ấy"
  t = t.replace(/\bbạn\b/g, 'cô ấy');
  return t;
}

// Tách theo " - phần chẵn (0,2,4...) là tường thuật, phần lẻ (1,3,5...) là thoại
const parts = content.split('"');
for (let i = 0; i < parts.length; i += 2) {
  parts[i] = processNarrative(parts[i]);
}
content = parts.join('"');

// Khôi phục
content = content.replace(/«BANBE»/g, 'bạn bè');
content = content.replace(/«BANTHAN»/g, 'bạn thân');
content = content.replace(/«NGUOIBAN»/g, 'người bạn');

// Câu mở đầu: "Cô ấy tên Lâm Vãn" → "Lâm Vãn" cho tự nhiên
content = content.replace(/Cô ấy tên Lâm Vãn, hai mươi lăm tuổi/, 'Lâm Vãn, hai mươi lăm tuổi');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã chuyển ngôi kể từ ngôi 2 sang ngôi 3 (cô ấy).');
