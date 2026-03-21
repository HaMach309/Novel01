/**
 * Thay nội dung các chương ngắn bằng bản từ nguồn (file patches/N.txt).
 * Chạy: node apply_short_patches.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const FULL = path.join(ROOT, "fullTQ.md");
const PATCH_DIR = path.join(ROOT, "patches");

const TITLES = {
  1: "初至·全裸验身「一",
  2: "初至·全裸验身「二",
  9: "穴淌初精，破身礼成",
  10: "药柱堵精，饮避子汤",
  17: "请大人赐小女初精",
  18: "器具量穴",
  22: "自己把穴掰开",
  25: "揣度心思·穴喷初精",
  26: "夏侯空亲自按她",
  33: "一个高级差",
  34: "主动求欢",
  39: "穴涌浓浆，花苞被涂",
  42: "干翻这朵小娇花",
  47: "以为是她的血",
  50: "各怀心事",
  55: "她还太嫩",
  56: "求大人……插倪若",
  60: "看见她漂亮奶子的瞬",
  61: "你平日里也是这般求",
};

const NUMS = Object.keys(TITLES).map(Number).sort((a, b) => a - b);

let text = fs.readFileSync(FULL, "utf8");

for (const n of NUMS) {
  const pfile = path.join(PATCH_DIR, `${n}.txt`);
  if (!fs.existsSync(pfile)) {
    console.error("Thiếu file:", pfile);
    process.exit(1);
  }
  const body = fs.readFileSync(pfile, "utf8").trim();
  const next = n + 1;
  const re = new RegExp(
    `## 第${n}章[^\\r\\n]*(?:\\r?\\n){2}([\\s\\S]*?)(?:\\r?\\n)+---(?:\\r?\\n)+## 第${next}章`
  );
  if (!re.test(text)) {
    console.error("Không khớp chương", n);
    process.exit(1);
  }
  const title = TITLES[n];
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  text = text.replace(
    re,
    `## 第${n}章 ${title}${nl}${nl}${body}${nl}${nl}---${nl}${nl}## 第${next}章`
  );
  console.log("Đã vá chương", n, body.length, "ký tự");
}

fs.writeFileSync(FULL, text, "utf8");
console.log("Xong:", FULL);
