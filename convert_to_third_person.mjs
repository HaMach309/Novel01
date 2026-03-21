#!/usr/bin/env node
/**
 * Chuyển ngôi kể truyện sang ngôi thứ 3:
 * - "mình" → "bản thân" / "cô ấy" (trong tường thuật, không đổi trong thoại)
 * - "chính mình" → "chính bản thân"
 * - Trong nội tâm *...*: "tôi"/"của tôi"/"mình" → ngôi thứ 3
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');
let content = fs.readFileSync(filePath, 'utf8');

function processNarrative(text) {
  return text
    .replace(/\bchính mình\b/gi, 'chính bản thân')
    .replace(/\bngười mình\b/gi, 'người cô ấy')
    .replace(/\btưởng mình\b/gi, 'tưởng chừng')
    .replace(/\bphát hiện mình\b/gi, 'phát hiện bản thân')
    .replace(/\bcảm thấy mình\b/gi, 'cảm thấy bản thân')
    .replace(/\bcảm giác mình\b/gi, 'cảm giác bản thân')
    .replace(/\bgiọng mình\b/gi, 'giọng cô ấy')
    .replace(/\bsắc mặt mình\b/gi, 'sắc mặt cô ấy')
    .replace(/\bsức mình\b/gi, 'sức cô ấy')
    .replace(/\bóc mình\b/gi, 'óc cô ấy')
    .replace(/\bnão mình\b/gi, 'não cô ấy')
    .replace(/\btay mình\b/gi, 'tay cô ấy')
    .replace(/\bđể mình\b/gi, 'để bản thân')
    .replace(/\bkhiến chính mình\b/gi, 'khiến chính bản thân')
    .replace(/\bthuyết phục chính mình\b/gi, 'thuyết phục chính bản thân')
    .replace(/\bxác nhận với chính mình\b/gi, 'xác nhận với chính bản thân')
    .replace(/\btrông mong chính mình\b/gi, 'trông mong chính bản thân')
    .replace(/\bthiếu tự tin của chính mình\b/gi, 'thiếu tự tin của chính bản thân')
    .replace(/\btò mò của chính mình\b/gi, 'tò mò của chính bản thân')
    .replace(/\btrên tay mình\b/gi, 'trên tay cô ấy')
    .replace(/\bbên mình\b/gi, 'bên cô ấy')
    .replace(/\bmình hoàn toàn\b/gi, 'bản thân hoàn toàn')
    .replace(/\bmình như\b/gi, 'bản thân như')
    .replace(/\bmình không\b/gi, 'bản thân không')
    .replace(/\bmình đang\b/gi, 'bản thân đang')
    .replace(/\bmình cũng\b/gi, 'bản thân cũng')
    .replace(/\bmình cuối cùng\b/gi, 'bản thân cuối cùng')
    .replace(/\b(?:trên người|ống tay áo) mình\b/gi, (m) => m.replace(/\bmình\b/, 'hắn'))
    .replace(/\bcủa mình\b/gi, 'của cô ấy')
    .replace(/\bmình\b/g, 'bản thân');
}

function processLine(line) {
  let result = line;

  // 1. Xử lý block *nội tâm* - chuyển tôi/mình sang ngôi 3
  result = result.replace(/\*([^*]+)\*/g, (_, inner) => {
    return (
      '*' +
      inner
        .replace(/\bcủa tôi\b/gi, 'của cô ấy')
        .replace(/\bTôi\b/g, 'Cô ấy')
        .replace(/\btôi\b/g, 'cô ấy')
        .replace(/\bchính mình\b/gi, 'chính bản thân')
        .replace(/\bmình\b/g, 'bản thân') +
      '*'
    );
  });

  // 2. Thay thế trong tường thuật (phần ngoài "...")
  const parts = result.split('"');
  let out = '';
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      out += processNarrative(parts[i]);
    } else {
      out += '"' + parts[i] + '"';
    }
  }

  return out;
}

const lines = content.split('\n');
const processed = lines.map(processLine);
content = processed.join('\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã chuyển ngôi kể truyện sang ngôi thứ 3.');