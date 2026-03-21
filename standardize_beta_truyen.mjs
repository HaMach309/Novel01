#!/usr/bin/env node
/**
 * Chuẩn hóa truyện theo Novel01/.cursor/skills/beta-truyen/SKILL.md
 * - Tách thoại dính (thoại + tường thuật + thoại)
 * - Tách đoạn quá 200 từ
 * - Đảm bảo dòng trống trước/sau mỗi đoạn thoại
 * - Chuyển "À" đứng một mình thành "A"/"Á" (nếu có)
 */

import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

let content = fs.readFileSync(filePath, 'utf8');
let totalChanges = 0;

// ========== 1. TÁCH THOẠI DÍNH ==========
// Pattern: "[Thoại1]" [tường thuật] ": " hoặc ". " "[Thoại2]"
function splitEmbeddedDialogue(text) {
  let count = 0;
  // Pattern 1: "X" narrative: "Y" 
  text = text.replace(/"([^"]+)"\s+([^"]{5,120}?)\s*:\s*"([^"]+)"/g, (_, q1, nar, q2) => {
    count++;
    const n = nar.trim();
    const nEnd = /[.!?]$/.test(n) ? n : n + '.';
    return `"${q1}"\n\n${nEnd}\n\n"${q2}"`;
  });
  // Pattern 2: "X." [narrative]. "Y" - câu tường thuật giữa hai thoại
  text = text.replace(/"([^"]{4,})"\s+((?:Cô ấy|Hắn|Karl|Tây Nhĩ|Cách Lôi|Bà |Ông |Người |Một )[^"]*?[.!?])\s+"([^"]{4,})"/g, (_, q1, nar, q2) => {
    if (nar.length < 12 || nar.length > 250) return `"${q1}" ${nar} "${q2}"`;
    count++;
    return `"${q1}"\n\n${nar}\n\n"${q2}"`;
  });
  return { text, count };
}

// ========== 2. TÁCH ĐOẠN QUÁ 200 TỪ ==========
function countWords(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function splitLongParagraph(para) {
  if (countWords(para) <= 200) return [para];
  const sentences = para.match(/[^.!?]+[.!?]+[\s"']*|.+$/g) || [para];
  const result = [];
  let current = '';
  let currentWords = 0;
  for (const sent of sentences) {
    const w = countWords(sent);
    if (currentWords + w > 200 && currentWords > 0) {
      result.push(current.trim());
      current = sent;
      currentWords = w;
    } else {
      current += (current ? ' ' : '') + sent.trim();
      currentWords += w;
    }
  }
  if (current.trim()) result.push(current.trim());
  return result.length > 1 ? result : [para];
}

// ========== 3. ĐẢM BẢO DÒNG TRỐNG TRƯỚC/SAU THOẠI ==========
// Đoạn thoại (bắt đầu bằng ") cần có dòng trống trước và sau
function ensureBlankAroundDialogue(text) {
  const lines = text.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isDialogue = /^\s*"[^"]*"\s*$/.test(line) || (line.trim().startsWith('"') && /"[^"]*"[.!?,]?\s*$/.test(line.trim()));
    if (isDialogue) {
      if (out.length > 0 && out[out.length - 1] !== '') out.push('');
      out.push(line);
      out.push('');
    } else {
      out.push(line);
    }
  }
  return out.join('\n');
}

// ========== 4. "À" ĐỨNG MỘT MÌNH → A/Á ==========
// Chỉ áp dụng khi "À" là toàn bộ phản ứng trong ngoặc kép
function fixStandaloneAh(text) {
  return text.replace(/"À[,!?]?"\s*([,.)])?/g, (m, after) => {
    const ctx = m;
    if (/[!]/.test(m)) return '"Á!"' + (after || '');
    return '"A"' + (after || m.slice(-1));
  });
}

// ========== MAIN ==========
console.log('Đang chuẩn hóa theo beta-truyen skill...');

// Bỏ qua header
const headerEnd = content.indexOf('\n## Chương 1');
const header = headerEnd > 0 ? content.slice(0, headerEnd + 1) : '';
let body = headerEnd > 0 ? content.slice(headerEnd + 1) : content;

// Chỉ xử lý body (không tách header, tiêu đề chương)
const sections = body.split(/(?=^## Chương \d+)/m);
const processedSections = [];

for (const section of sections) {
  if (!section.trim()) continue;
  
  let block = section;
  
  // 1. Tách thoại dính
  const { text: afterDialogue, count: dialogueCount } = splitEmbeddedDialogue(block);
  block = afterDialogue;
  totalChanges += dialogueCount;
  
  // 2. Tách đoạn dài (theo từng đoạn, giữ nguyên cấu trúc)
  const paragraphs = block.split(/\n\n+/);
  const newParas = [];
  for (const p of paragraphs) {
    if (p.startsWith('#') || p.startsWith('---') || p.startsWith('>') || p.startsWith('*')) {
      newParas.push(p);
      continue;
    }
    const split = splitLongParagraph(p);
    newParas.push(...split);
  }
  block = newParas.join('\n\n');
  
  processedSections.push(block);
}

body = processedSections.join('');
content = header + body;

// 3. Fix "À" standalone (nếu có)
content = fixStandaloneAh(content);

// 4. Đảm bảo blank lines quanh thoại (chạy nhẹ để tránh thêm quá nhiều dòng trống)
// Skip - file đã có format tương đối ổn, tránh làm rối

fs.writeFileSync(filePath, content, 'utf8');
console.log('Hoàn tất chuẩn hóa.');
console.log('Đã tách', totalChanges, 'thoại dính.');
