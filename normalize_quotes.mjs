#!/usr/bin/env node
/**
 * Chuẩn hóa tất cả câu thoại thành dạng ""
 * - « » (diary/quoted text) → ""
 * - —— hoặc — ở đầu dòng (thoại) → ""
 * - — thoại inline → ""
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

let content = fs.readFileSync(filePath, 'utf8');
let count = 0;

// Proper nouns - GIỮ NGUYÊN « » (tên riêng, tiêu đề mục)
const KEEP_GUILLEMETS = [
  'Huyết Hồng Thánh Bôi',
  'Phi Sắc Quỷ Ảnh',
  'Ngày thứ',
  'Giai đoạn',
  'Một lát sau',
  'Sáng ngày',
  'Đêm ngày',
  'Báo cáo kết toán',
  'Kết thúc',
  'Bắt đầu',
  'Đang kinh doanh',
  'Chiều tà',
  'Sáng sớm',
  'Chợ U Ảnh',
  'Giai đoạn thanh toán',
  'Huyết Hồng Thánh Bôi ·',
];

function isProperNoun(text) {
  const t = text.trim();
  return KEEP_GUILLEMETS.some(k => t.includes(k) || t.startsWith(k));
}

// 1. Dòng bắt đầu bằng —— hoặc — (toàn bộ là thoại)
content = content.replace(/^(\s*)—— (.+)$/gm, (_, space, dialog) => {
  const t = dialog.trim();
  if (t.startsWith('"') && t.endsWith('"')) return `${space}—— ${dialog}`;
  count++;
  return `${space}"${t}"`;
});

content = content.replace(/^(\s*)— (.+)$/gm, (_, space, dialog) => {
  const t = dialog.trim();
  if (t.startsWith('"') && t.endsWith('"')) return `${space}— ${dialog}`;
  count++;
  return `${space}"${t}"`;
});

// 2. « ... » (trích nhật ký, lời trích) → "..." — CHỈ khi KHÔNG phải proper noun
content = content.replace(/«([^»]+)»/g, (_, inner) => {
  if (isProperNoun(inner)) return `«${inner}»`;
  count++;
  return `"${inner}"`;
});

// 3. Inline: " — Thoại. " hoặc " — Thoại? " hoặc " — Thoại! " → " "Thoại." "
// Pattern: [. !?:] — [Dialogue]. [Hắn/Cô/Karl/... hoặc : hoặc \n]
content = content.replace(/([.!?:\s])— ([^—]{2,}?)([.!?…])\s+(Hắn |hắn |Cô ấy|cô ấy|Karl |Karl,|Tây Nhĩ|Cách Lôi|Bà |Giọng |Rồi |Sau |Khi |Nói |Vừa |Đồng |Hai |Lời |Mùi |Tiếng |Kèm |Cơ thể|Sự |Lần |Như |Tự |Cửa |Một |Trong |Ngoài )/g,
  (_, before, dialog, punct, attr) => {
    count++;
    return `${before}"${dialog}${punct}" ${attr}`;
  });

content = content.replace(/([.!?:\s])— ([^—]{2,}?[.!?…])\s+—/g,
  (_, before, dialog) => {
    count++;
    return `${before}"${dialog}" —`;
  });

// 4. Pattern: ... : — Thoại. (sau dấu hai chấm)
content = content.replace(/:\s*— ([^—]+?)([.!?…])\s+/g, (_, dialog, punct) => {
  count++;
  return `: "${dialog}${punct}" `;
});

// 5. Pattern: . — Thoại. (đầu đoạn dialogue ngắn)
content = content.replace(/\.\s+— ([^—]+?)([.!?…])\s+/g, (_, dialog, punct) => {
  count++;
  return `. "${dialog}${punct}" `;
});

// 6. Inline: " — Dialogue" (sau dấu đóng ngoặc)
content = content.replace(/"\s+— ([^"—]+?)([.!?…])\s+/g, (_, dialog, punct) => {
  if (dialog.length < 3) return `" — ${dialog}${punct} `;
  count++;
  return `" "${dialog}${punct}" `;
});

// 7. Inline: . — Dialogue. Hắn/Cô/Karl (dialogue rồi attribution)
content = content.replace(/\.\s+— ([^—]+?)([.!?…])\s+(Hắn |hắn |Cô ấy|cô ấy|Karl |Karl,|Tây Nhĩ|Cách Lôi|Bà |Giọng )/g,
  (_, dialog, punct, attr) => {
    count++;
    return `. "${dialog}${punct}" ${attr}`;
  });

// 8. Inline: ! — Á á——! (tiếng kêu)
content = content.replace(/([!.])\s+— (Á [^—]+—!?)\s+/g, (_, p, dialog) => {
  count++;
  return `${p} "${dialog}" `;
});

// 9. ,— Dialogue. (attribution rồi thoại tiếp) - TRỪ khi bắt đầu bằng từ attribution
const ATTRIBUTION_START = /^(Hắn |hắn |Karl |Cô ấy |cô ấy |giọng |ánh mắt |Giọng )/;
content = content.replace(/,— ([^"—]{3,}?)([.!?])\s+/g, (_, dialog, punct) => {
  if (ATTRIBUTION_START.test(dialog)) return `,— ${dialog}${punct} `;
  count++;
  return `, "${dialog}${punct}" `;
});

// 10. ấp úng,— Tôi… / ấp úng,— Linh hồn… (thoại sau mô tả)
content = content.replace(/(ấp úng|lẩm bẩm|nhắc lại|nhìn |ngơ ngác[^,]+,)\s*—\s+((?:Tôi|Linh hồn|Nhưng|Còn|Ồ)\S[^"]+?)([.!?…])\s+/g, (_, prefix, dialog, punct) => {
  count++;
  return `${prefix}: "${dialog}${punct}" `;
});

// 11. . — Tôi có thể dệt...[chữ],— giọng hắn (thoại kết thúc bằng phẩy trước attribution)
content = content.replace(/\.\s+— ([^"—]{10,}?),\s*—\s+(giọng|hắn|Hắn|Karl |ánh mắt )/g, (_, dialog, attr) => {
  count++;
  return `. "${dialog}", — ${attr}`;
});

// 12. : — Thưa cô, phương án... (thoại dài sau hai chấm)
content = content.replace(/:\s*— (Thưa cô,[^"]+?\.)\s+/g, (_, dialog) => {
  count++;
  return `: "${dialog}" `;
});

// 13. . "X." — Hắn dùng giọng đáp, "Y" → giữ nguyên (— là attribution)
// 14. . — Hắn dùng giọng... → đây là attribution, không đổi
// 15. Các thoại inline còn sót: . — Dialogue (chỉ khi bắt đầu bằng đại từ/thán từ thoại)
content = content.replace(/([.…])\s+— (Tôi|Linh hồn|Nhưng|Còn|Đi thôi|Về kênh|Thành phần|Hắn tiếp tục|Này|Ồ|Ự|Chúng ta|Cựu cựu)([^"—]+?)([.!?])\s+/g, (_, p, start, mid, punct) => {
  count++;
  return `${p} "${start}${mid}${punct}" `;
});

// 16. "X" — Á à à——! (tiếng kêu còn sót)
content = content.replace(/\?\"\s+—\s+(Á à à——!|Ự á á á á——!)\s+/g, (_, exclaim) => {
  count++;
  return `?" "${exclaim}" `;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã chuẩn hóa', count, 'câu thoại thành dạng "".');
