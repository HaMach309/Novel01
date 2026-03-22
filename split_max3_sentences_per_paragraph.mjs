#!/usr/bin/env node
/**
 * Tách tường thuật: mỗi khối tối đa 3 câu (kết thúc . ! ? …).
 * Dòng trống giữa các khối. Bỏ qua # --- > và dòng thoại thuần "...".
 */
import fs from 'fs';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node split_max3_sentences_per_paragraph.mjs <file.md>');
  process.exit(1);
}

const MAX = 3;

function shouldSkipLine(line) {
  const t = line.trim();
  if (!t) return true;
  if (t.startsWith('#')) return true;
  if (t === '---') return true;
  if (t.startsWith('>')) return true;
  if (/^\*[^*]+\*\s*$/.test(t)) return true;
  if (/^"[^"]*"\s*$/.test(t)) return true;
  return false;
}

function splitSentences(text) {
  const t = text.trim();
  if (!t) return [];
  const parts = t.match(/[^.!?…]+[.!?…]+[\s"']*|[^.!?…]+$/g) || [t];
  return parts.map((p) => p.trim()).filter(Boolean);
}

function chunkSentences(sents) {
  if (sents.length <= MAX) return [sents.join(' ').trim()];
  const out = [];
  for (let i = 0; i < sents.length; i += MAX) {
    out.push(sents.slice(i, i + MAX).join(' ').trim());
  }
  return out;
}

let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
const out = [];
let splitLines = 0;

for (const line of lines) {
  if (shouldSkipLine(line)) {
    out.push(line);
    continue;
  }
  const sents = splitSentences(line);
  if (sents.length <= MAX) {
    out.push(line);
    continue;
  }
  const chunks = chunkSentences(sents);
  splitLines++;
  for (let i = 0; i < chunks.length; i++) {
    if (i > 0) out.push('');
    out.push(chunks[i]);
  }
}

content = out.join('\n');
content = content.replace(/\n{4,}/g, '\n\n\n');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã tách', splitLines, 'dòng tường thuật (>3 câu) thành khối 3 câu.');
