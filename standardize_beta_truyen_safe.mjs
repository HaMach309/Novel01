#!/usr/bin/env node
/**
 * Chuẩn hóa beta (an toàn cho file một-dòng-một-đoạn, ít \\n\\n):
 * - Chuẩn dấu ngoặc kép Unicode → "
 * - Tách dòng >200 từ tại cuối câu
 * - Dòng trống trước/sau thoại thuần (cả dòng chỉ là "…")
 * - "À" đứng một mình trong ngoặc → A/Á
 * KHÔNG dùng regex tách thoại dính toàn cục (dễ vỡ với nội dung nhạy cảm).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'VoCuaBanKhongKhachKhi.md');

function countWords(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function splitLongLine(line) {
  if (countWords(line) <= 200) return [line];
  const sentences = line.match(/[^.!?…]+[.!?…]+[\s"']*|.+$/g) || [line];
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
  return result.length > 1 ? result : [line];
}

function normalizeQuotes(text) {
  return text
    .replace(/\u201c/g, '"')
    .replace(/\u201d/g, '"')
    .replace(/\u2018/g, "'")
    .replace(/\u2019/g, "'");
}

function fixStandaloneAh(text) {
  return text.replace(/"À[,!?]?"\s*([,.)])?/g, (m, after) => {
    if (/[!]/.test(m)) return '"Á!"' + (after || '');
    return '"A"' + (after || m.slice(-1));
  });
}

/** Dòng chỉ là một cặp thoại "…" (có thể có khoảng trắng đầu/cuối) */
function isPureDialogueLine(line) {
  const t = line.trim();
  return t.startsWith('"') && t.endsWith('"') && t.length >= 2;
}

function addBlankAroundPureDialogue(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const pure = isPureDialogueLine(line);
    if (pure) {
      if (out.length > 0 && out[out.length - 1] !== '') out.push('');
      out.push(line);
      out.push('');
    } else {
      out.push(line);
    }
  }
  return out;
}

function collapseTripleBlank(text) {
  return text.replace(/\n{4,}/g, '\n\n\n');
}

let content = fs.readFileSync(filePath, 'utf8');
content = normalizeQuotes(content);
content = fixStandaloneAh(content);

const headerEnd = content.indexOf('\n## Chương 1');
const header = headerEnd > 0 ? content.slice(0, headerEnd + 1) : '';
let body = headerEnd > 0 ? content.slice(headerEnd + 1) : content;

const lines = body.split('\n');
const expanded = [];
for (const line of lines) {
  const parts = splitLongLine(line);
  for (const p of parts) expanded.push(p);
}

const withBlanks = addBlankAroundPureDialogue(expanded);
body = withBlanks.join('\n');
body = collapseTripleBlank(body);

content = header + body;
fs.writeFileSync(filePath, content, 'utf8');
console.log('Hoàn tất standardize_beta_truyen_safe (chuẩn ngoặc, >200 từ, thoại thuần, À).');
