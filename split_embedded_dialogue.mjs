#!/usr/bin/env node
/**
 * Tách thoại nhúng: "X,— narrator,— Y" và các biến thể thành format chuẩn với dòng trống.
 * Pattern: dialogue / narrative tách riêng, viết hoa đầu câu tường thuật.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
const out = [];
let changes = 0;

function capitalize(s) {
  if (!s || s.length === 0) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ensureEndPunctuation(s) {
  if (!s || s.length === 0) return s;
  return /[.!?。]$/.test(s.trim()) ? s.trim() : s.trim() + '.';
}

function ensureDialogueComma(s) {
  if (!s || s.length === 0) return s;
  const t = s.trim();
  if (t.length < 15 && !/[,.!?;:…]$/.test(t)) return t + ',';
  return t;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // === Pattern 1: "part1,— narrative,— part2" (comma-dash both sides) ===
  const m1 = line.match(/^"(.*?),\s*—\s*([^—]+?),\s*—\s*(.*)"\s*$/);
  if (m1) {
    let [, part1, narrative, part2] = m1;
    part1 = part1.trim();
    narrative = narrative.trim();
    part2 = part2.trim();
    if (narrative.length >= 3 && part1.length >= 1 && part2.length >= 1) {
      narrative = capitalize(ensureEndPunctuation(narrative));
      part1 = ensureDialogueComma(part1);
      out.push('"' + part1 + '"');
      out.push('');
      out.push(narrative);
      out.push('');
      out.push('"' + part2 + '"');
      changes++;
      continue;
    }
  }

  // === Pattern 2: "part1.— narrative,— part2" (period-dash, comma-dash) ===
  const m2 = line.match(/^"(.*?)[.。]\s*—\s*([^—]+?),\s*—\s*(.*)"\s*$/);
  if (m2) {
    let [, part1, narrative, part2] = m2;
    part1 = part1.trim();
    narrative = narrative.trim();
    part2 = part2.trim();
    if (narrative.length >= 3 && part1.length >= 1 && part2.length >= 1) {
      narrative = capitalize(ensureEndPunctuation(narrative));
      if (!/[.!?]$/.test(part1)) part1 = part1 + '.';
      out.push('"' + part1 + '"');
      out.push('');
      out.push(narrative);
      out.push('');
      out.push('"' + part2 + '"');
      changes++;
      continue;
    }
  }

  // === Pattern 3: "part1…… narrative,— part2" or "part1—— narrative,— part2" ===
  const m3 = line.match(/^"(.*?)[…]{2,}\s+([^—]+?),\s*—\s*(.*)"\s*$/);
  if (m3) {
    let [, part1, narrative, part2] = m3;
    part1 = part1.trim();
    narrative = narrative.trim();
    part2 = part2.trim();
    if (narrative.length >= 5 && part1.length >= 3 && part2.length >= 3) {
      narrative = capitalize(ensureEndPunctuation(narrative));
      out.push('"' + part1 + '……"');
      out.push('');
      out.push(narrative);
      out.push('');
      out.push('"' + part2 + '"');
      changes++;
      continue;
    }
  }

  // === Pattern 4a: "dialogue1. narrative,— dialogue2" (period then narrative; phải chạy trước m4) ===
  const m4a = line.match(/^"(.*?)\.\s+(.+?),\s*—\s*(.*)"\s*$/);
  if (m4a) {
    let [, part1, narrative, part2] = m4a;
    part1 = part1.trim();
    narrative = narrative.trim();
    part2 = part2.trim();
    if (narrative.length >= 10 && part1.length >= 5 && part2.length >= 5) {
      narrative = capitalize(ensureEndPunctuation(narrative));
      out.push('"' + part1 + '."');
      out.push('');
      out.push(narrative);
      out.push('');
      out.push('"' + part2 + '"');
      changes++;
      continue;
    }
  }

  // === Pattern 4: "dialogue,— narrative" (only narrative at end, no second dialogue) ===
  const m4 = line.match(/^"(.*?),\s*—\s*([^"]+)"\s*$/);
  if (m4) {
    let [, dialogue, narrative] = m4;
    dialogue = dialogue.trim();
    narrative = narrative.trim();
    // narrative thường là hành động: "bạn nhẹ nói...", "Hắn...", "Cô ấy..."
    if (narrative.length >= 5 && dialogue.length >= 3) {
      narrative = capitalize(ensureEndPunctuation(narrative));
      dialogue = ensureDialogueComma(dialogue);
      out.push('"' + dialogue + '"');
      out.push('');
      out.push(narrative);
      changes++;
      continue;
    }
  }

  // === Pattern 5: "narrative,— dialogue" (narrative inside quotes first, then dialogue) ===
  const m5 = line.match(/^"([^"]{10,}?),\s*—\s*(.*)"\s*$/);
  if (m5) {
    let [, narrative, dialogue] = m5;
    narrative = narrative.trim();
    dialogue = dialogue.trim();
    // narrative thường bắt đầu: Hắn, Cô ấy, Giọng, Đôi mắt...
    const narrativeStarters = /^(hắn|cô ấy|giọng|đôi mắt|bạn|Karl|ánh mắt|ngón tay|đôi chân|phần ngực|sự phấn khởi|yết hầu)/i;
    if (narrative.length >= 10 && dialogue.length >= 2 && narrativeStarters.test(narrative)) {
      narrative = capitalize(ensureEndPunctuation(narrative));
      if (!dialogue.startsWith('"')) dialogue = '"' + dialogue + '"';
      else if (!dialogue.endsWith('"')) dialogue = dialogue + '"';
      out.push(narrative);
      out.push('');
      out.push(dialogue.startsWith('"') ? dialogue : '"' + dialogue + '"');
      changes++;
      continue;
    }
  }

  // === Pattern 5b: narrative.— dialogue (line without quote, period then em-dash) ===
  const m5b = line.match(/^(.+[.。])\s*—\s+(.+)$/);
  if (m5b && !line.trimStart().startsWith('"') && !line.trimStart().startsWith('—')) {
    let [, narrative, dialogue] = m5b;
    narrative = narrative.trim();
    dialogue = dialogue.trim();
    // dialogue thường bắt đầu bằng chữ hoa, là lời nói
    if (narrative.length >= 15 && dialogue.length >= 5 && /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/.test(dialogue)) {
      narrative = capitalize(ensureEndPunctuation(narrative));
      if (!dialogue.startsWith('"')) dialogue = '"' + dialogue + '"';
      out.push(narrative);
      out.push('');
      out.push(dialogue);
      changes++;
      continue;
    }
  }

  // === Pattern 6: line WITHOUT leading quote: narrative,— dialogue ===
  const m6 = line.match(/^(.+?),\s*—\s*(.+)$/);
  if (m6 && !line.trimStart().startsWith('"')) {
    let [, narrative, dialogue] = m6;
    narrative = narrative.trim();
    dialogue = dialogue.trim();
    if (narrative.length >= 5 && dialogue.length >= 2) {
      narrative = capitalize(ensureEndPunctuation(narrative));
      if (!dialogue.startsWith('"')) dialogue = '"' + dialogue + '"';
      out.push(narrative);
      out.push('');
      out.push(dialogue);
      changes++;
      continue;
    }
  }

  // === Pattern 6c: "dialogue…… narrative" (dialogue ends with ……, narrative starts with Hắn/Cô ấy/Karl...) ===
  const m6c = line.match(/^"(.+)……\s+((?:Hắn|Cô ấy|Karl|Giọng|Đáy mắt|Đôi mắt|Ngón tay|Bạn)\s+[^"]*)"\s*$/);
  if (m6c) {
    let [, dialogue, narrative] = m6c;
    dialogue = dialogue.trim();
    narrative = narrative.trim();
    if (dialogue.length >= 2 && narrative.length >= 5) {
      narrative = capitalize(ensureEndPunctuation(narrative));
      dialogue = dialogue.endsWith('……') ? dialogue : dialogue + '……';
      out.push('"' + dialogue + '"');
      out.push('');
      out.push(narrative);
      changes++;
      continue;
    }
  }

  // === Pattern 6d: "dialogue…… narrative" - narrative starts with "Cô" or "Xì" (Cô ấy...) ===
  const m6d = line.match(/^"(.+?)……\s+(Cô\s+[^"]*)"\s*$/);
  if (m6d) {
    let [, dialogue, narrative] = m6d;
    dialogue = dialogue.trim();
    narrative = narrative.trim();
    if (dialogue.length >= 2 && narrative.length >= 8 && narrative.startsWith('Cô ')) {
      narrative = capitalize(ensureEndPunctuation(narrative));
      out.push('"' + dialogue + '……"');
      out.push('');
      out.push(narrative);
      changes++;
      continue;
    }
  }

  // === Pattern 7: "part1.— narrative" (period-dash, only narrative at end) ===
  const m7 = line.match(/^"(.*?)[.。]\s*—\s*([^"]+)"\s*$/);
  if (m7) {
    let [, dialogue, narrative] = m7;
    dialogue = dialogue.trim();
    narrative = narrative.trim();
    if (narrative.length >= 5 && dialogue.length >= 3) {
      narrative = capitalize(ensureEndPunctuation(narrative));
      if (!/[.!?]$/.test(dialogue)) dialogue = dialogue + '.';
      out.push('"' + dialogue + '"');
      out.push('');
      out.push(narrative);
      changes++;
      continue;
    }
  }

  out.push(line);
}

content = out.join('\n');
content = content.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã tách', changes, 'thoại nhúng.');
