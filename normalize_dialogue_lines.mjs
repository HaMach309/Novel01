#!/usr/bin/env node
/**
 * Chuẩn hóa file truyện: thêm xuống dòng (dòng trống) trước và sau mỗi câu thoại dạng "..."
 * - Tách các dòng có thoại dính với tường thuật thành các đoạn riêng
 * - Đảm bảo mỗi đoạn thoại có dòng trống trước và sau
 * - Bỏ qua thoại nhúng ,— và trích dẫn ngắn (tên, thuật ngữ)
 *
 * CẢNH BÁO: Chạy cả file có thể tách sai khi một dòng có nhiều cặp "…" lồng nhau
 * (ví dụ thoại trong ngoặc kèm từ khóa "kịch bản", "hiệp ước…"). Nên xử lý từng chương
 * hoặc chỉnh tay; đã từng làm hỏng cuối chương 95 nếu chạy blind trên toàn bộ.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');
let content = fs.readFileSync(filePath, 'utf8');

// Từ/cụm trước " thường chỉ trích dẫn thuật ngữ, không phải thoại
const INLINE_BEFORE = /\b(nút|câu|tên|chữ|từ|nội dung|tính chất|sự |việc |chữ |tính |đã|với|về|thành|bằng|gọi|như|là|mang)\s*$/i;

/**
 * Tìm tất cả vị trí thoại "..." trong chuỗi.
 * Thoại = lời nói thực sự, không phải trích dẫn thuật ngữ inline.
 */
function findDialogues(str) {
  const results = [];
  let pos = 0;
  while (pos < str.length) {
    const start = str.indexOf('"', pos);
    if (start < 0) break;
    let end = start + 1;
    while (end < str.length) {
      if (str[end] === '\\') { end += 2; continue; }
      if (str[end] === '"') {
        const inner = str.slice(start + 1, end);
        const before = str.slice(Math.max(0, start - 30), start);
        const beforeShort = str.slice(Math.max(0, start - 15), start);

        // Bỏ qua trích dẫn inline: từ ngắn, đứng sau nút/tên/câu/tính...
        if (INLINE_BEFORE.test(before) && inner.length < 25) { end++; break; }
        if (/(của|và|hoặc|với|về)\s*$/i.test(beforeShort) && inner.length < 20) { end++; break; }

        // Thoại thực: (1) câu dài >= 25 ký tự, HOẶC
        // (2) >= 15 ký tự và kết thúc . ? ! … , HOẶC
        // (3) ở đầu dòng, HOẶC sau dấu chấm câu . ? ! : ,
        const atLineStart = /^\s*$/.test(str.slice(0, start));
        const afterPunct = /[.!?:]\s*$/.test(before) || /,\s*$/.test(before) || /[.!?…]\s*$/.test(before);
        const isDialogue = inner.length >= 25 ||
          (inner.length >= 15 && /[.?!…,]"?\s*$/.test(inner)) ||
          (inner.length >= 12 && (atLineStart || afterPunct)) ||
          (inner.length >= 8 && atLineStart) ||
          (inner.length >= 6 &&
            inner.length <= 60 &&
            afterPunct &&
            !INLINE_BEFORE.test(before));

        if (isDialogue) {
          results.push({ start, end: end + 1, text: str.slice(start, end + 1), inner });
        }
        end++;
        break;
      }
      end++;
    }
    pos = end;
  }
  return results;
}

function processLine(line) {
  const trim = line.trim();
  if (!trim) return [line];

  // Bỏ qua header, blockquote, horizontal rule
  if (line.startsWith('#') || line.startsWith('---') || line.startsWith('>') || /^\s*\*[^*]+\*\s*$/.test(line)) {
    return [line];
  }

  // Bỏ qua dòng có ,— (thoại nhúng - giữ nguyên)
  if (/,—\s*(hắn|Karl|cô ấy|bạn|Hắn|Cô |Bạn|Tây |Cách |giọng|ánh mắt)/.test(line) || /,—\s*[^"]*,—/.test(line)) {
    return [line];
  }

  const dialogues = findDialogues(line);
  if (dialogues.length === 0) return [line];

  const out = [];
  let lastEnd = 0;

  for (let i = 0; i < dialogues.length; i++) {
    const d = dialogues[i];
    const before = line.slice(lastEnd, d.start).trim();
    if (before) out.push(before);
    if (before && out.length > 0) out.push('');
    out.push(d.text);
    out.push('');
    lastEnd = d.end;
  }

  const after = line.slice(lastEnd).trim();
  if (after) out.push(after);

  return out;
}

// ========== Main ==========
const lines = content.split('\n');
const out = [];
let changes = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const processed = processLine(line);

  if (processed.length > 1) {
    changes++;
    for (const p of processed) {
      out.push(p);
    }
  } else {
    // Dòng chỉ có thoại thuần - đảm bảo blank trước/sau
    const trim = line.trim();
    const isDialogueOnly = /^"[^"]*[.?!,]?"\s*$/.test(trim) || /^"[^"]{15,}"\s*$/.test(trim);
    if (isDialogueOnly) {
      if (out.length > 0 && out[out.length - 1] !== '') out.push('');
      out.push(line);
      out.push('');
    } else {
      out.push(line);
    }
  }
}

content = out.join('\n');
content = content.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã chuẩn hóa xuống dòng quanh thoại.');
console.log('Đã tách', changes, 'dòng có thoại dính tường thuật.');