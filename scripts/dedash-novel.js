const fs = require("fs");
const path = require("path");

const file = path.join(
  __dirname,
  "..",
  "Truyện đã dịch",
  "ChangTraiThoKechVaCoNuongVietSub.md"
);

let t = fs.readFileSync(file, "utf8");

// Tiếng kêu trong ngoặc kép
t = t.replace(/"Ư——"/g, '"Ư…"');

// Gạch giữa câu (có khoảng trắng hai bên) → phẩy
t = t.replace(/ — /g, ", ");

// Dòng kết bằng gạch + xuống dòng (một lần xuống dòng, không nuốt dòng trống sau)
t = t.replace(/ —\r?\n/g, "…\n");

fs.writeFileSync(file, t, "utf8");

const left = (t.match(/—/g) || []).length;
console.log("Written:", file);
console.log("Remaining em-dash (U+2014):", left);
