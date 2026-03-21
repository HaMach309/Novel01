#!/usr/bin/env node
/**
 * @deprecated CẢNH BÁO: chạy trực tiếp lên toàn file sẽ làm hỏng thoại trong ngoặc kép.
 * Dùng thay thế: `safe_replace_em_dash.mjs` rồi `replace_em_dash_inside_quotes.mjs`, sau đó sửa tay
 * các khối thoại có lời dẫn xen kẽ (ví dụ đoạn Karl chào mừng địa ngục).
 *
 * Thay dấu gạch ngang em (—) trong văn xuôi: phẩy / ngắt câu, bỏ gạch đầu dòng.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath =
  process.argv[2] ||
  path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

let s = fs.readFileSync(filePath, 'utf8');

function countEm(t) {
  let n = 0;
  for (const ch of t) if (ch === '—') n++;
  return n;
}

const before = countEm(s);

// 1. Kết câu + gạch + tiếp: bỏ gạch
s = s.replace(/([.!?]) — /g, '$1 ');
s = s.replace(/([.!?])— /g, '$1 ');
s = s.replace(/([.!?]) —/g, '$1 ');

// 2. Phẩy + gạch
s = s.replace(/,—/g, ', ');
s = s.replace(/, —/g, ', ');

// 3. Hai bên có khoảng trắng
s = s.replace(/ — /g, ', ');

// 4. Gạch dính hai ký tự không phải khoảng (lặp)
for (let i = 0; i < 10; i++) {
  s = s.replace(/([^\s—])—([^\s—])/g, '$1, $2');
}

// 5. Onomatopoeia
s = s.replace(/"chít—"/g, '"chít…"');

// 6. Đầu dòng: — nội dung
s = s.replace(/^(\s*)—\s+/gm, '$1');

// 7. Sót: gạch sau dấu đóng ngoặc
s = s.replace(/([»"'”])—/g, '$1, ');
s = s.replace(/—\s*«/g, ', «');

// 8. Còn lại → phẩy + khoảng
s = s.replace(/—/g, ', ');

// Gộp phẩy kép , , → ,
s = s.replace(/,\s*,/g, ',');
s = s.replace(/,\s*,/g, ',');

fs.writeFileSync(filePath, s, 'utf8');
const after = countEm(fs.readFileSync(filePath, 'utf8'));
console.log(`Em dash (U+2014): ${before} → ${after}`);
console.log('Đã ghi file.');
