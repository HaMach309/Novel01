/**
 * Tải lại chương có < CHAR_THRESHOLD ký tự trong fullTQ.md, cập nhật từ m.xyushuwu4.com
 * Chạy: node refresh_short_chapters.mjs
 */
import fs from "fs";
import https from "https";
import zlib from "zlib";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const iconv = require("iconv-lite");

const BOOK_BASE = "https://m.xyushuwu4.com/20/20124";
const FULL_TQ = "fullTQ.md";
const CHAR_THRESHOLD = 1000;
const DELAY_MS = 800;
const TIMEOUT_MS = 45000;

const CHAPTERS = [
  [9412177, "初至·全裸验身「一"], [9412178, "初至·全裸验身「二"], [9412179, "天生尤物"],
  [9412180, "初见夏侯空"], [9412181, "请教官大人破身「一」"], [9412182, "请教官大人破身「二」"],
  [9412183, "插入淌着处女血的娇穴"], [9412184, "其实，他舒爽得不行"], [9412185, "穴淌初精，破身礼成"],
  [9412186, "药柱堵精，饮避子汤"], [9412187, "且好生受着"], [9412188, "热帕烫穴，穿调教服"],
  [9412189, "与夏侯空同床共枕"], [9412190, "破处后的例行检查"], [9412191, "木势入穴，直插宫口"],
  [9412192, "夹不住木势的惩罚"], [9412193, "请大人赐小女初精"], [9412194, "器具量穴"],
  [9412195, "穴有多深"], [9412196, "塞进更粗的玉势·量穴宽"], [9412197, "夏侯空的内心"],
  [9412198, "自己把穴掰开"], [9412199, "查撞胞宫口"], [9412200, "赐精入穴·芳心踌躇"],
  [9412201, "揣度心思·穴喷初精"], [9412202, "夏侯空亲自按她"], [9412203, "不止同睡，还要玩弄她们的身子"],
  [9412204, "夏侯空没有摸她"], [9412205, "处女厅·验雏儿"], [9412206, "处女膜的玩法"],
  [9412207, "回春阁上下无一例外"], [9412208, "四王爷要的人"], [9412209, "一个高级差"],
  [9412210, "主动求欢"], [9412211, "她欠调教"], [9412212, "如何罚她"],
  [9412213, "用你的穴，把它含进去"], [9412214, "胞宫被他紧紧顶了上去"], [9412215, "穴涌浓浆，花苞被涂"],
  [9412216, "用他的精浆除阴"], [9412217, "亲眼目睹别人被调教"], [9412218, "干翻这朵小娇花"],
  [9412219, "在调教椅上被开穴"], [9412220, "你自己看，都鼓起来了"], [9412221, "缩阴调教·司以扬进来过吗"],
  [9412222, "怎么又夹紧了，放松"], [9412223, "以为是她的血"], [9412224, "躺下，腿张开"],
  [9412225, "紧穴的福祸·瞧着睡颜就想拥他入怀"], [9412226, "各怀心事"], [9412227, "抚平心弦·旋转插穴"],
  [9412228, "待她与别的女奴不同"], [9412229, "想多闻闻她的香味"], [9412230, "就是不开口求他操她"],
  [9412231, "她还太嫩"], [9412232, "求大人……插倪若"], [9412233, "插哪里？"],
  [9412234, "出调教部的条件"], [9412235, "全院的人都会去围观"], [9412236, "看见她漂亮奶子的瞬"],
  [9412237, "你平日里也是这般求"], [9412238, "小嫩洞里的大棒子"], [9798353, "为他留着"],
  [9798354, "第一次湿得这么快"], [9798355, "夹葡萄比试·用力捅小洞"], [9798356, "他又没能把持住"],
  [9798357, "他看她看得出了神"], [9944917, "宫口这么快就被操开了"], [9944918, "反正你也不是处了"],
  [9944919, "回春阁派人来寻你了"], [9944920, "他的宝贝·大人插深点"], [9944921, "戳入胞宫·别急，换个地方继续干你"],
  [9944922, "冒犯夏侯空·感觉……是欲仙欲死"], [9944923, "轻易为她提心吊胆·让我看看你恢复得如何"],
  [9944924, "【情人节番外 一 】夏侯空的情人节礼物"], [9944925, "【情人节番外 二 】跳蛋顶在宫口"],
  [9944926, "会让你舒服的·冰块PLAY"], [9944927, "这回直接用嘴"], [10086640, "含不进去就用手·她也会惦记他"],
  [10086641, "丰乳膏·穿乳环"], [10086642, "把夏侯空吹射的决胜招数"], [10165582, "晋升失败的惩罚"],
  [10165583, "你全吞下去了？"], [10165584, "是大人的……在操倪若的胞宫"], [10252467, "把她调到自己房中调教·晋升考官 严大人"],
  [10252468, "晋升考核一"], [10252469, "晋升考核三"], [10324742, "晋升考核四"], [10324743, "晋升考核五"],
  [10430880, "初女考核七"], [10430881, "司以扬摸你哪了？！"], [10430882, "提到他，吸得这么紧？"],
  [10524781, "合格的教官不该对女奴动情"], [10524782, "夏侯空送的生辰贺礼"], [10524783, "穴口盛不下的浓精流出·夏侯空会喜欢的"],
  [10654812, "夏侯空的迷魂汤·想要大人"], [10654813, "轻着呢·第一次被夏侯空操"], [10720109, "夏侯空编的瞎话"],
  [10720110, "湿女的任务·插了她五十下还不湿"], [11009558, "艰巨任务·被干到脚趾"], [11009559, "想舒服就快些出水"],
  [11341232, "新到一位人妇奴·邢露"], [11341233, "龙头钻胞宫·主动让他射进肚子里"], [11341234, "缠着夏侯空交欢·夫君"],
  [11425287, "当众被开后苞·他要为倪若赎身"], [11425288, "指望他会娶你?"], [11425289, "知道我是王爷，连叫床都不敢叫"],
  [11425290, "快像平日一样叫出来·明晚出逃"], [11425291, "我当然不会放你走"], [11481830, "最后一吻·出逃被"],
  [11481831, "何娇娇的陷害"], [11481832, "他被她耍得彻底"], [11481833, "活鱼塞穴·亲手处"],
  [11481834, "现在就成全你"], [11481835, "最难熬的刑罚"], [11903667, "穿乳环·想被哪个野男人破处？"],
  [11903668, "回来守着她·什么苦衷？"], [11903669, "觍着脸主动找她·全是贺礼"], [12116378, "夜空下的初吻·做我的女人"],
  [12116379, "花园欢爱·你又紧了"], [12116380, "何娇娇受刑(上)"], [12265506, "该算算你的账"],
  [12265507, "被操死的绝世尤物"], [12470352, "暂避榕城·把倪若送给四"], [12470353, "恼怒下的交欢·别再说离"],
  [12470354, "皇城巨变·两个月后"], [13349930, "废除处女调教部·与你不离不弃"], [13349931, "【结局上篇】安若郡主"],
  [13349932, "【结局下篇】你怀了？·终为一体，共赴韶华"], [13349933, "后记|番外、姐妹篇、未来开坑"],
  [17588658, "【婚后番外一】强行检查"], [17588659, "【婚后番外二】新秘药·这奶少了"], [17588660, "【婚后番外三】心病·因王爷而欢喜"],
  [17588661, "【婚后番外四】夏侯空见妻心"], [17588662, "【婚后番外五】领教过她的\"厉害\"·伺候他"], [17588663, "【婚后番外六】孕交|求欢·夫君轻点就好"],
  [17588664, "【婚后番外七】孕交|乖乖让他"], [17588665, "【婚后番外八】孕交|夫君插深点·轻撞孕宫口"],
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          "Accept-Encoding": "gzip, deflate",
        },
        timeout: TIMEOUT_MS,
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          let buf = Buffer.concat(chunks);
          const enc = (res.headers["content-encoding"] || "").toLowerCase();
          try {
            if (enc.includes("gzip") || (buf.length > 2 && buf[0] === 0x1f && buf[1] === 0x8b)) {
              buf = zlib.gunzipSync(buf);
            } else if (enc.includes("deflate")) {
              buf = zlib.inflateSync(buf);
            }
          } catch (_) {
            /* thử decode nguyên buffer */
          }
          let raw;
          try {
            raw = iconv.decode(buf, "gbk");
          } catch {
            raw = buf.toString("utf8");
          }
          resolve(raw);
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
    req.end();
  });
}

function cleanExtracted(text) {
  if (!text?.trim()) return text;
  const out = [];
  for (const line of text.split("\n")) {
    const s = line.trim();
    if (!s) {
      out.push("");
      continue;
    }
    if (s.includes("是处女调教部") && (s.includes("最新更新") || s.includes("TXT全集阅读") || s.includes("手机阅读")))
      continue;
    if (/辣H最新更新|TXT全集阅读|新御书屋手机/.test(s)) continue;
    const cjk = (s.match(/[\u4e00-\u9fff]/g) || []).length;
    if (s.length > 8 && cjk < Math.max(2, s.length * 0.2)) continue;
    out.push(s);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function htmlToText(blockHtml) {
  let h = blockHtml.replace(/<br\s*\/?>/gi, "\n");
  h = h.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  h = h.replace(/<p[^>]*>/gi, "");
  h = h.replace(/<\/p>/gi, "\n");
  let text = h.replace(/<[^>]+>/g, "");
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&[a-z]+;/gi, " ");
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

function extractFullNovelcontent(html) {
  let idx = html.indexOf('id="novelcontent"');
  if (idx === -1) idx = html.indexOf("id='novelcontent'");
  if (idx === -1) idx = html.indexOf('class="novelcontent"');
  if (idx === -1) idx = html.indexOf("class='novelcontent'");
  if (idx === -1) return "";

  let start = html.indexOf(">", idx);
  if (start === -1) return "";
  start += 1;

  let end = html.length;
  for (const marker of ["上一章", "下章预告", "返回目录", "加入书签", "题外话：", "題外話："]) {
    const j = html.indexOf(marker, start);
    if (j !== -1 && j < end) end = j;
  }

  const block = html.slice(start, end);
  let text = htmlToText(block);
  if (!text) return "";

  const out = [];
  for (const line of text.split("\n")) {
    const s = line.trim();
    if (!s) {
      out.push("");
      continue;
    }
    if (/请到|肉圕箼|更多ぶ/.test(s)) continue;
    if (/^PS：|^PPS：/.test(s)) break;
    if (s === "chapter1();") continue;
    out.push(s);
  }
  return cleanExtracted(out.join("\n").trim());
}

function extractContent(html) {
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  const full = extractFullNovelcontent(html);
  if (full) return full;
  let text = html.replace(/<[^>]+>/g, "\n");
  text = text.replace(/&nbsp;/g, " ");
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 10);
  const out = [];
  for (const line of lines) {
    if (/上一章|下一章|回目录|加入书签|请到|肉圕箼|更多ぶ/.test(line)) break;
    if (/[\u4e00-\u9fff]/.test(line)) out.push(line);
  }
  return cleanExtracted(out.join("\n\n")) || "";
}

function splitFullTq(text) {
  const m0 = text.match(/^## 第1章/m);
  if (!m0) throw new Error("Không tìm thấy ## 第1章");
  const head = text.slice(0, m0.index);
  const rest = text.slice(m0.index);
  const pat = /^## 第(\d+)章([^\n]*)\n/gm;
  const matches = [...rest.matchAll(pat)];
  const meta = [];
  for (let i = 0; i < matches.length; i++) {
    const num = parseInt(matches[i][1], 10);
    const title = matches[i][2].trim();
    const s = matches[i].index;
    const e = i + 1 < matches.length ? matches[i + 1].index : rest.length;
    meta.push({ num, title, s, e });
  }
  return { head, rest, meta };
}

async function main() {
  const text = fs.readFileSync(FULL_TQ, "utf8");
  const { head, rest, meta } = splitFullTq(text);

  const short = meta.filter((m) => rest.slice(m.s, m.e).length < CHAR_THRESHOLD).map((m) => m.num);
  if (!short.length) {
    console.log("Không có chương dưới ngưỡng", CHAR_THRESHOLD);
    return;
  }
  console.log(`Tải lại ${short.length} chương (< ${CHAR_THRESHOLD} ký tự):`, short.join(", "));

  const updates = new Map();
  for (const n of short) {
    const [cid, title] = CHAPTERS[n - 1];
    const url = `${BOOK_BASE}/${cid}.html`;
    process.stdout.write(`  [${n}] ${url} ... `);
    let content = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const html = await fetchUrl(url);
        content = extractContent(html);
        break;
      } catch (e) {
        if (attempt === 2) content = `[Lỗi: ${e.message || e}]`;
        else await sleep(1500);
      }
    }
    await sleep(DELAY_MS);
    if (!content || content.length < 20) {
      console.log("bỏ qua (quá ngắn)");
      continue;
    }
    const block = `## 第${n}章 ${title}\n\n${content.trim()}\n\n---\n\n`;
    updates.set(n, block);
    console.log(`${content.length} ký tự`);
  }

  if (!updates.size) {
    console.log("Không cập nhật được chương nào.");
    return;
  }

  const pieces = [];
  for (const m of meta) {
    pieces.push(updates.has(m.num) ? updates.get(m.num) : rest.slice(m.s, m.e));
  }
  fs.writeFileSync(FULL_TQ, head + pieces.join(""), "utf8");
  console.log("Đã ghi", FULL_TQ);
}

main().catch(console.error);
