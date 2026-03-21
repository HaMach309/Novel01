#!/usr/bin/env node
/**
 * Chuyển tên nhân vật sang Hán Việt theo《地狱经理人》
 * - Karl (卡尔) → Khả Nhĩ
 * - Lilithia / Lili Tư Á (莉莉丝娅) → Lệ Lệ Tư Á
 * - Lili (莉莉, Luật Ma) → Lệ Lệ
 *
 * Các tên đã đúng Hán Việt: Lâm Vãn, Tây Nhĩ Phàm, Vi Ô Lai Khả, Cách Lôi Cách, Tú Cốt, Y Lị Á
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');
let content = fs.readFileSync(filePath, 'utf8');

// Thứ tự quan trọng: thay cụm dài trước để tránh thay sai
// 1. Lili Tư Á (莉莉丝娅 Lilithia) → Lệ Lệ Tư Á
content = content.replace(/Lili Tư Á/g, 'Lệ Lệ Tư Á');

// 2. Lilithia → Lệ Lệ Tư Á
content = content.replace(/Lilithia/g, 'Lệ Lệ Tư Á');

// 3. Lili (莉莉, nhân vật Luật Ma) → Lệ Lệ
content = content.replace(/\bLili\b/g, 'Lệ Lệ');

// 4. Karl (卡尔) → Khả Nhĩ
content = content.replace(/\bKarl\b/g, 'Khả Nhĩ');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã chuyển tên nhân vật sang Hán Việt.');
