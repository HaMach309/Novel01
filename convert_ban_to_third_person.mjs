#!/usr/bin/env node
/**
 * Chuyển "bạn" sang cô ấy, anh ấy... tùy ngữ cảnh:
 * - Tường thuật (ngoài thoại): bạn = nhân vật chính → cô ấy
 * - Thoại khi nói với nam (Karl, Cách Lôi Cách, Tây Nhĩ Phàm): bạn → anh / cậu
 * - Thoại khi nói với nữ (Lâm Vãn): bạn → cô
 * - Bảo vệ: "bạn đập", "ly kinh bạn đạo", "bạn đạo"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');
let content = fs.readFileSync(filePath, 'utf8');

// Trước hết: thay thế tag tường thuật "— bạn " (luôn = nhân vật chính) kể cả khi nằm trong chuỗi
content = content.replace(/,—\s*bạn\s+/g, ',— cô ấy ');
content = content.replace(/\s—\s*bạn\s+/g, '— cô ấy ');

// Bảo vệ các cụm từ đặc biệt (tạm thay rồi khôi phục sau)
const PROTECT = [
  ['bạn đập', '\uFFFFBANDAP\uFFFF'],
  ['ly kinh bạn đạo', '\uFFFFLYKINHBANDAO\uFFFF'],
  ['bạn đạo', '\uFFFFBANDAO\uFFFF'],
];

for (const [orig, place] of PROTECT) {
  content = content.split(orig).join(place);
}

/**
 * Xử lý từng dòng: tách phần thoại "..." và tường thuật
 */
function processLine(line) {
  const parts = line.split('"');
  let out = '';

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // TƯỜNG THUẬT: bạn (nhân vật chính) → cô ấy
      out += parts[i]
        .replace(/\s*—\s*bạn\s+/g, '— cô ấy ')
        .replace(/,—\s*bạn\s+/g, ',— cô ấy ')
        .replace(/\s+bạn\s+(tiếp tục|nhìn|nói|hỏi|đặt|quay|đi|dừng|gọi|hạ|tổng kết|mở lời|dùng|đẩy|cố|nghiêm túc|nhẹ|dựa|bước|đưa)/gi, ' cô ấy $1')
        .replace(/\s+(cho|với|tới|sát|bên tai|tới trước mặt|về phía)\s+bạn\b/gi, ' $1 cô ấy')
        .replace(/\b(nhìn|hướng về|chỉ về|vang bên tai|áp sát tai|đổ lên|in bóng)\s+bạn\b/gi, '$1 cô ấy')
        .replace(/\b(giọng)\s+bạn\b/gi, '$1 cô ấy')
        .replace(/\b(hắn)\s+(nhìn|chỉnh|đưa về phía|động tác)\s+bạn\b/gi, '$1 $2 cô ấy')
        .replace(/\bnhư với bạn,/gi, 'như với cô ấy,')
        .replace(/\bBạn\b/g, 'Cô ấy')
        .replace(/\bbạn\b/g, 'cô ấy');
    } else {
      // THOẠI: bạn tùy người được nói tới
      let dialogue = parts[i];
      // Lâm Vãn nói với Karl: "Karl, ... bạn ..." → anh
      dialogue = dialogue.replace(/\b(Karl,?\s*[^"]*)\bbạn\b/gi, (m) => m.replace(/\bbạn\b/gi, 'anh'));
      // Lâm Vãn nói với Cách Lôi Cách, Tây Nhĩ Phàm → cậu
      dialogue = dialogue.replace(/\b(Cách Lôi Cách|Tây Nhĩ Phàm),?\s*[^"]*\bbạn\b/gi, (m) => m.replace(/\bbạn\b/g, 'cậu'));
      // Lâm Vãn phỏng vấn tuyển người: "Chào bạn", "về bạn", "mời bạn", "Bảng của bạn" → cậu
      dialogue = dialogue.replace(/\b(Chào|tìm hiểu về|mời|Bảng của)\s+bạn\b/gi, '$1 cậu');
      dialogue = dialogue.replace(/\b(chính là)\s+bạn\b/gi, '$1 cậu');
      dialogue = dialogue.replace(/\b(sẵn lòng làm việc cho)\s+bạn\b/gi, '$1 cô ');
      // Lâm Vãn nói với Lili Tư Á (quá cố): "bạn muốn" → bà (trong "những gì bạn muốn làm")
      dialogue = dialogue.replace(/\b(những gì)\s+bạn\s+(muốn)/gi, '$1 bà ấy $2');
      // "Ông chủ", "Ông Tú Cốt" - Lâm Vãn nói với chủ tiệm nam → ông
      dialogue = dialogue.replace(/\b(ông nói|ông có thể|theo ông)[^"]*\bbạn\b/gi, (m) => m.replace(/\bbạn\b/g, 'ông'));
      dialogue = dialogue.replace(/\b(Ông Tú Cốt|Ông chủ),?\s*[^"]*\bbạn\b/gi, (m) => m.replace(/\bbạn\b/g, 'ông'));
      // Còn lại: phần lớn Lâm Vãn nói với Karl/nam → anh (kể cả Bạn viết hoa)
      dialogue = dialogue.replace(/\bBạn\b/g, 'Anh').replace(/\bbạn\b/g, 'anh');
      out += '"' + dialogue + '"';
    }
  }

  return out;
}

const lines = content.split('\n');
const processed = lines.map(processLine);
content = processed.join('\n');

// Khôi phục các cụm bảo vệ
for (const [orig, place] of PROTECT) {
  content = content.split(place).join(orig);
}

// Sửa tag tường thuật bị thay nhầm: ",— anh tiếp tục," và tương tự (luôn là nhân vật chính)
content = content.replace(/,—\s*anh\s+(tiếp tục|nhìn|nói|hỏi|đặt|quay|đi|dừng|gọi|hạ|tổng kết|mở lời|dùng|đẩy|cố|nghiêm túc|nhẹ|bước|đưa),/gi, ',— cô ấy $1,');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã chuyển bạn sang cô ấy / anh / cậu / cô tùy ngữ cảnh.');