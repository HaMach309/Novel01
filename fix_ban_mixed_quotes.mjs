#!/usr/bin/env node
/**
 * Lượt 2: sửa "bạn" còn sót trong các dòng thoại lẫn tường thuật (một khối "..." dài).
 * Thứ tự: cụm dài → ngắn; bảo vệ bạn bè, bạn trai, v.v.
 */

import fs from 'fs';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node fix_ban_mixed_quotes.mjs <file.md>');
  process.exit(1);
}

let s = fs.readFileSync(filePath, 'utf8');

const PROTECT = [
  'ly kinh bạn đạo',
  'bạn đập',
  'bạn đạo',
  'bạn bè',
  'Bạn bè',
  'bạn thân',
  'bạn trai',
  'bạn gái',
  'bạn học',
  'tình bạn',
  'kết bạn',
  'người bạn thân',
];

function protect(t) {
  let out = t;
  PROTECT.forEach((ph, i) => {
    const tok = `\uE100${i}\uE101`;
    const re = new RegExp(ph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    out = out.replace(re, tok);
  });
  return out;
}

function unprotect(t) {
  let out = t;
  PROTECT.forEach((ph, i) => {
    const tok = `\uE100${i}\uE101`;
    out = out.split(tok).join(ph);
  });
  return out;
}

/** [from, to] — thứ tự quan trọng */
const REPLACEMENTS = [
  // Karl = đối tượng được xưng "anh"
  ['Karl, Cách Lôi Cách, bạn dừng bước', 'Karl, Cách Lôi Cách, hai anh dừng bước'],
  ['Karl, bạn vừa cảnh giác', 'Karl, anh vừa cảnh giác'],
  ['Karl, bạn đặt ly xuống', 'Karl, anh đặt ly xuống'],
  ['Karl, bây giờ bạn muốn', 'Karl, bây giờ anh muốn'],
  ['Karl, bạn biết tôi chỉ đang dọa', 'Karl, anh biết tôi chỉ đang dọa'],
  ['Karl, bạn thật dâm đãng', 'Karl, anh thật dâm đãng'],

  ['Cách Lôi Cách, bạn đi thẳng tới người bảo vệ', 'Cách Lôi Cách, cậu đi thẳng tới người bảo vệ'],
  ['Cách Lôi Cách, bạn hỏi nhẹ', 'Cách Lôi Cách, cô ấy hỏi nhẹ'],
  ['Cách Lôi Cách, bạn hạ giọng', 'Cách Lôi Cách, cô ấy hạ giọng'],
  ['Cách Lôi Cách, bạn quay sang "núi"', 'Cách Lôi Cách, cô ấy quay sang "núi"'],
  ['Cách Lôi Cách, bạn mở lời', 'Cách Lôi Cách, cô ấy mở lời'],
  ['Cách Lôi Cách, bạn tổ chức ngôn ngữ', 'Cách Lôi Cách, cô ấy tổ chức ngôn ngữ'],

  ['Tây Nhĩ Phàm, bạn gọi hắn', 'Tây Nhĩ Phàm, cô ấy gọi hắn'],
  ['Ông chủ, bạn quay sang ma quỷ', 'Ông chủ, cô ấy quay sang ma quỷ'],
  ['Ông chủ, bạn hít sâu', 'Ông chủ, cô ấy hít sâu'],
  ['Ông Tú Cốt, bạn cố để giọng', 'Ông Tú Cốt, cô ấy cố để giọng'],

  ['Bây giờ đã có vốn khởi nghiệp, bạn tiếp tục,', 'Bây giờ đã có vốn khởi nghiệp, cô ấy tiếp tục,'],

  ['Karl nói đúng, bạn nhìn hắn', 'Karl nói đúng, cô ấy nhìn hắn'],
  ['Đi thôi, bạn nói với Karl', 'Đi thôi, cô ấy nói với Karl'],
  ['Cậu ở lại trông quán, bạn quay lại cười', 'Cậu ở lại trông quán, cô ấy quay lại cười'],

  ['Tôi không giỏi như vậy, bạn áp tai hắn', 'Tôi không giỏi như vậy, cô ấy áp tai hắn'],
  ['Tiền chúng ta không còn nhiều, bạn đi thẳng vấn đề', 'Tiền chúng ta không còn nhiều, cô ấy đi thẳng vấn đề'],

  ['giọng bạn không lớn', 'giọng cô ấy không lớn'],

  ['Chúng ta… Tôi biết yêu cầu tôi quá đáng, bạn nhìn mắt hắn', 'Chúng ta… Tôi biết yêu cầu tôi quá đáng, cô ấy nhìn mắt hắn'],
  ['Không phải thế, bạn nghiêm túc nói', 'Không phải thế, cô ấy nghiêm túc nói'],
  ['tôi không muốn cậu hiểu lầm, bạn nhìn mắt hắn', 'tôi không muốn cậu hiểu lầm, cô ấy nhìn mắt hắn'],
  ['Tôi không muốn lấy toàn bộ của cậu, bạn nhìn hắn', 'Tôi không muốn lấy toàn bộ của cậu, cô ấy nhìn hắn'],

  ['Thế nào, bạn dựa đầu lên vai hắn', 'Thế nào, cô ấy dựa đầu lên vai hắn'],
  ['Ngủ đi, bạn nhìn hắn', 'Ngủ đi, cô ấy nhìn hắn'],
  ['Tôi tới xem cậu, bạn nhìn mắt hắn', 'Tôi tới xem cậu, cô ấy nhìn mắt hắn'],
  ['Không được, bạn bước tới', 'Không được, cô ấy bước tới'],
  ['Tôi không hiểu sinh mệnh địa ngục, bạn nhìn vết tím', 'Tôi không hiểu sinh mệnh địa ngục, cô ấy nhìn vết tím'],

  ['Ừ, ra ngoài tuyển người, bạn đi tới trước mặt hắn', 'Ừ, ra ngoài tuyển người, cô ấy đi tới trước mặt hắn'],
  ['để tích lũy vốn, bạn tổng kết', 'để tích lũy vốn, cô ấy tổng kết'],
  ['Ừ, “tiếc nuối”, bạn nhìn hắn nghiêm túc nói', 'Ừ, “tiếc nuối”, cô ấy nhìn hắn nghiêm túc nói'],
  ['bỏ lỡ trực tiếp thì quá tiếc, bạn nhẹ nói với Tây Nhĩ Phàm', 'bỏ lỡ trực tiếp thì quá tiếc, cô ấy nhẹ nói với Tây Nhĩ Phàm'],
  ['Xin chào, bạn dùng giọng ôn hoà nhất', 'Xin chào, cô ấy dùng giọng ôn hoà nhất'],

  ['trong giọng bạn mang chút mềm mỏng chính bạn cũng chưa nhận ra', 'trong giọng cô ấy mang chút mềm mỏng chính cô ấy cũng chưa nhận ra'],
  ['Cậu nói đúng, bạn quay sang Tây Nhĩ Phàm', 'Cậu nói đúng, cô ấy quay sang Tây Nhĩ Phàm'],

  ['để ông yên tâm sáng tạo, bạn trước ném điều kiện', 'để ông yên tâm sáng tạo, cô ấy trước ném điều kiện'],
  ['quán bar nổi tiếng nhất, bạn trước ném bối cảnh', 'quán bar nổi tiếng nhất, cô ấy trước ném bối cảnh'],
  ['đã trống lâu, bạn đẩy cửa tầng hầm', 'đã trống lâu, cô ấy đẩy cửa tầng hầm'],
  ['Chúng tôi hiện chưa có điều kiện ấy, bạn nói thật', 'Chúng tôi hiện chưa có điều kiện ấy, cô ấy nói thật'],
  ['tôi cần chút bảo đảm, bạn vừa nói vừa quay sang Lili', 'tôi cần chút bảo đảm, cô ấy vừa nói vừa quay sang Lili'],

  ['Hắn cười cong mắt, thân không tự chủ nghiêng sát bạn hơn', 'Hắn cười cong mắt, thân không tự chủ nghiêng sát cô ấy hơn'],
  ['Nhưng, hắn chuyển giọng, đẩy chiếc hộp bí ẩn về phía bạn', 'Nhưng, hắn chuyển giọng, đẩy chiếc hộp bí ẩn về phía cô ấy'],

  ['Thưa cô, giọng Karl vang bên tai bạn', 'Thưa cô, giọng Karl vang bên tai cô ấy'],
  ['như đang cảnh giới cho bạn', 'như đang cảnh giới cho cô ấy'],
  ['tiếp nối suy nghĩ của bạn trong phòng', 'tiếp nối suy nghĩ của cô ấy trong phòng'],

  ['làm lễ vỗ ngực không chê vào đâu với bạn, Sân khấu', 'làm lễ vỗ ngực không chê vào đâu với cô ấy, Sân khấu'],

  ['… Nghiền nát nó, hắn nói nhỏ, như với bạn, lại như với chính mình', '… Nghiền nát nó, hắn nói nhỏ, như với cô ấy, lại như với chính mình'],

  ['hắn liếc môi trường vẫn ồn ào xung quanh nói với bạn', 'hắn liếc môi trường vẫn ồn ào xung quanh nói với cô ấy'],
  ['hắn áp sát tai bạn', 'hắn áp sát tai cô ấy'],

  ['hắn nhìn bạn, ánh mắt vô cùng nghiêm túc', 'hắn nhìn cô ấy, ánh mắt vô cùng nghiêm túc'],
  ['kinh doanh.  Bạn vừa nói vừa đưa ánh mắt tới Tây Nhĩ Phàm', 'kinh doanh.  Cô ấy vừa nói vừa đưa ánh mắt tới Tây Nhĩ Phàm'],

  // Lâm nói với Karl (bạn → anh) — từng cụm ngắn
  ['của bạn không. Nhưng bạn nhìn rõ', 'của anh không. Nhưng anh nhìn rõ'],
  ['Bạn cũng không phải nam sủng gì cả.', 'Anh cũng không phải nam sủng gì cả.'],
  ['Bạn là người dẫn đường đưa tôi đến địa ngục. Bạn không hèn mọn.', 'Anh là người dẫn đường đưa tôi đến địa ngục. Anh không hèn mọn.'],
  ['không chỉ coi bạn là nam sủng', 'không chỉ coi anh là nam sủng'],
  ['bà đã vì bạn tìm kiếm phương pháp cho bạn tự do', 'bà đã vì anh tìm kiếm phương pháp cho anh tự do'],
  ['hành vi của bạn xuất phát', 'hành vi của anh xuất phát'],
  ['Mỗi câu bạn nói', 'Mỗi câu anh nói'],
  ['ý chí của chính bạn.', 'ý chí của chính anh.'],
  ['Bạn tự hỏi mình xem, bạn thực sự nghĩ gì về tôi?', 'Anh tự hỏi mình xem, anh thực sự nghĩ gì về tôi?'],
  ['Bạn có thực sự muốn quan hệ với tôi không? Bạn có tình cảm đặc biệt khác với tôi không?', 'Anh có thực sự muốn quan hệ với tôi không? Anh có tình cảm đặc biệt khác với tôi không?'],
  ['Nhưng nếu bạn cứ khăng khăng', 'Nhưng nếu anh cứ khăng khăng'],
  ['vậy tôi đưa nhiệm vụ đầu tiên cho bạn.', 'vậy tôi đưa nhiệm vụ đầu tiên cho anh.'],
  ['Tôi muốn quan hệ với bạn. Tôi muốn bạn ôm tôi', 'Tôi muốn quan hệ với anh. Tôi muốn anh ôm tôi'],
  ['Bạn cũng làm được không?', 'Anh cũng làm được không?'],
  ['…Karl, bạn biết tôi chỉ đang dọa bạn thôi', '…Karl, anh biết tôi chỉ đang dọa anh thôi'],
  ['dọa lui bạn, khiến bạn từ bỏ', 'dọa lui anh, khiến anh từ bỏ'],
  ['Nhưng tôi không ngờ bạn cởi quần áo', 'Nhưng tôi không ngờ anh cởi quần áo'],
  ['Thật sự thì, bạn không phải lâu rồi đã âm thầm có ý với tôi', 'Thật sự thì, anh không phải lâu rồi đã âm thầm có ý với tôi'],
  ['bạn đang nói tôi yếu hơn tổ tiên tôi sao?', 'anh đang nói tôi yếu hơn tổ tiên tôi sao?'],
  ['Hãy theo trái tim bạn, làm điều bạn muốn làm đi, trợ lý vàng', 'Hãy theo trái tim anh, làm điều anh muốn làm đi, trợ lý vàng'],
  ['Lựa chọn đầu tiên của bạn là muốn ôm tôi sao?', 'Lựa chọn đầu tiên của anh là muốn ôm tôi sao?'],
  ['Bây giờ bạn… muốn làm gì? Nói với tôi.', 'Bây giờ anh… muốn làm gì? Nói với tôi.'],
  ['mặt này của bạn không?', 'mặt này của anh không?'],
  ['ý nghĩa của bạn với bà tuyệt đối không chỉ như bạn nói', 'ý nghĩa của anh với bà tuyệt đối không chỉ như anh nói'],
  ['Bạn có biết công cụ không thường bảo dưỡng', 'Anh có biết công cụ không thường bảo dưỡng'],
  ['Bạn giúp tôi kiểm tra trước đi.', 'Anh giúp tôi kiểm tra trước đi.'],
  ['Bạn đọc toàn bộ nội dung thiệp mời cho tôi trước.', 'Anh đọc toàn bộ nội dung thiệp mời cho tôi trước.'],
  ['Bạn nói bạn chỉ là công cụ?', 'Anh nói anh chỉ là công cụ?'],

  // Chương có ngoặc lẫn — ngoài quote
  ['hơi thở nóng phả cực nguy hiểm lên cổ bạn:', 'hơi thở nóng phả cực nguy hiểm lên cổ cô ấy:'],
  ['yên tĩnh, bạn ngồi trên mép giường', 'yên tĩnh, cô ấy ngồi trên mép giường'],
  ['Vừa dứt lời, bạn muốn cắn đứt lưỡi', 'Vừa dứt lời, cô ấy muốn cắn đứt lưỡi'],
  ['chính bạn cũng không biết mình nghĩ gì', 'chính cô ấy cũng không biết mình nghĩ gì'],
  ['kích thích bạn trong phòng khách', 'kích thích cô ấy trong phòng khách'],
  ['tán dương của mẹ bạn trên bàn ăn', 'tán dương của mẹ cô ấy trên bàn ăn'],
];

s = protect(s);
for (const [a, b] of REPLACEMENTS) {
  const n = s.split(a).length - 1;
  s = s.split(a).join(b);
  if (n) console.log(`${n}× ${a.slice(0, 48)}…`);
}
s = unprotect(s);

fs.writeFileSync(filePath, s, 'utf8');
console.log('Xong fix_ban_mixed_quotes.');
