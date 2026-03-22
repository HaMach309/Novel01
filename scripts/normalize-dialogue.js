/**
 * Chuẩn hóa thoại: dạng "..." và một dòng trống trước + sau mỗi thoại.
 * - Dòng bắt đầu bằng — (U+2014) + khoảng trắng → bỏ gạch, bọc ngoặc kép
 * - Mọi dòng thoại độc lập (trim bắt đầu " và kết thúc ")
 */
const fs = require("fs");
const path = require("path");

const file = path.join(
  __dirname,
  "..",
  "Truyện đã dịch",
  "ChangTraiThoKechVaCoNuongVietSub.md"
);

let text = fs.readFileSync(file, "utf8");

// 1) Thay thoại kiểu — ...
text = text.replace(/^— (.+)$/gm, '"$1"');

const lines = text.split(/\r?\n/);

function isDialogueLine(line) {
  const t = line.trim();
  if (t.length < 2) return false;
  if (!t.startsWith('"')) return false;
  if (!t.endsWith('"')) return false;
  return true;
}

const out = [];
for (const line of lines) {
  if (isDialogueLine(line)) {
    if (out.length > 0 && out[out.length - 1] !== "") {
      out.push("");
    }
    out.push(line);
    out.push("");
  } else {
    out.push(line);
  }
}

let result = out.join("\n");

// Gom nhiều dòng trống liên tiếp (3+) thành tối đa 2 — giữ một dòng trống giữa đoạn
result = result.replace(/\n{3,}/g, "\n\n");

// Xóa dòng trống thừa đầu file (nếu thoại mở đầu)
result = result.replace(/^\n+/, "");

fs.writeFileSync(file, result, "utf8");
console.log("Done:", file);
console.log("Lines out:", result.split("\n").length);
