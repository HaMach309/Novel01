/**
 * Tách đoạn văn quá 200 từ (rule 4 beta-truyen)
 * Tách tại cuối câu (sau . ! ? : )
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');
const MAX_WORDS = 200;
const SPLIT_TARGET = 150;

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function splitParagraph(text) {
  if (countWords(text) <= MAX_WORDS) return [text];
  
  const sentences = text.match(/[^.!?]+[.!?]+[\s”'"]*|.+$/g) || [text];
  const result = [];
  let current = '';
  let currentWords = 0;
  
  for (const sent of sentences) {
    const w = countWords(sent);
    if (currentWords + w > MAX_WORDS && currentWords > 0) {
      result.push(current.trim());
      current = sent;
      currentWords = w;
    } else {
      current += sent;
      currentWords += w;
    }
  }
  if (current.trim()) result.push(current.trim());
  
  return result.length > 1 ? result : [text];
}

function main() {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const output = [];
  let count = 0;
  
  for (const line of lines) {
    if (line.startsWith('#') || line.startsWith('---') || line.startsWith('>') || 
        line.startsWith('*') || line === '' || line.startsWith('##') ||
        (line.startsWith('"') && line.endsWith('"'))) {
      output.push(line);
      continue;
    }
    
    const parts = splitParagraph(line);
    if (parts.length > 1) {
      count += parts.length - 1;
      output.push(parts.join('\n\n'));
    } else {
      output.push(line);
    }
  }
  
  fs.writeFileSync(filePath, output.join('\n'), 'utf8');
  console.log('Đã tách', count, 'đoạn dài.');
}

main();
