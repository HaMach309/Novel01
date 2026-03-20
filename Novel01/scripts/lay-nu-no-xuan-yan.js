/**
 * Lấy truyện 女奴宣言 từ alicesw.org, xuất TuyenNgonNuNoTQ.md
 * Chạy: node scripts/lay-nu-no-xuan-yan.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE = 'https://alicesw.org';
const BOOK_ID = '48859';
const OUT_FILE = path.join(__dirname, '..', 'TuyenNgonNuNoTQ.md');

const CHAPTERS = [
  ['第一章 买处', 'a2229fd03eaed'],
  ['第二章 摊牌', '92317a2dd2962'],
  ['第三章 客人', 'ccf1307231906'],
  ['第四章 日常', '6ce7de2957c23'],
  ['第五章 凌虐', '9b6d56be1c259'],
  ['第六章 家访', 'f8748aa3d8144'],
  ['第七章 潮吹', '7c30c621e6c47'],
  ['第八章 谈判', '0975fc1643ad5'],
  ['第九章 女奴宣言', '0a6aca7194b39'],
  ['第十章 参观校园', '32b8298a49309'],
  ['第十一章 乔迁新喜', '2deb64488ea81'],
  ['第十二章 小猪认父', '3dee0422d4476'],
  ['第十三章 奶牛臣服', '327b0d9197126'],
  ['第十四章 亲子丼（一）', 'e04dbd95f566c'],
  ['第十五章 亲子丼（二）', '5cc8abcc94c0d'],
  ['第十六章 试衣间的快枪', '9e255a98ba97a'],
  ['第十七章 厕所中的欲望', 'e301366aea31d'],
  ['第十八章 大奶牛的日常', '29da197b44793'],
  ['第十九章 圣水调教', 'bf7cf12b54e8a'],
  ['第二十章 亲子丼（三）', 'b42499b2ed96a'],
  ['第二十一章 资金暴露', '0b980e5916a4e'],
  ['第二十二章 商议对策', 'e0d42f2a74892'],
  ['第二十三章 女错母罚', '6bd420ee6cc05'],
  ['第二十四章 肛塞轮换', 'dcd740cd87ede'],
  ['第二十五章 奶牛肛交', 'dcc247c6e356f'],
  ['第二十六章 灌肠喷射', 'e51b1f96a1aef'],
  ['第二十七章 女奴1UP', '73ba8eb1fab4a'],
  ['第二十八章 少女双飞', '0054bd504c094'],
  ['第二十九章 萌萌到访', '6733dc79038ea'],
  ['第三十章 灌肠游戏', '84a28a436ffd1'],
  ['第三十一章 乱交派对', '70ab64bcf6689'],
  ['第三十二章 新车试驾', 'e2b56543747a9'],
  ['第三十三章 同事偶遇', '3de9f3be6e81e'],
  ['第三十四章 茶楼密会', 'e9501436fc1f5'],
  ['第三十五章 强制高潮', 'e1f064bb57479'],
  ['第三十六章 压力面试', '3e8730a733ec4'],
  ['第三十七章 拉珠拔河', 'bed2caae595d8'],
  ['第三十八章 往日幽影', 'bc9e4eccbccd4'],
  ['第三十九章 鱼钩与鱼', '864d6913c2754'],
  ['第四十章 请君入瓮', 'c527ef54269e3'],
  ['第四十一章 前夫终局', '3a7d5b1e0df08'],
  ['第四十二章 日常与危机', '9188985ce3554'],
  ['第四十三章 困境与妥协', '0e16f981e0453'],
  ['第四十四章 挣扎与誓言', '4d65067eedb0d'],
  ['第四十五章 债务与母亲', 'dd38b37e040d2'],
  ['第四十六章 调教与服从', '787334db4ed3a'],
  ['第四十七章 约会与侵蚀', 'b074b22b9f5a7'],
  ['第四十八章 肉体的臣服', '7b16fbb7bb0f8'],
  ['第四十九章 奶牛与猴急', '658177f0bd13f'],
  ['第五十章 肛塞与灌肠', 'ace6e8e3672d8'],
  ['第五十一章 SPA与教学', '977d7ac2767a5'],
  ['第五十二章 复习与前戏', 'e604ab9f86520'],
  ['第五十三章 双飞与全貌', '8c7c29d54cec6'],
  ['第五十四章 体操与性爱', '732d8f7f0cf64'],
  ['第五十五章 解禁晨欢', 'f6971215e88e4'],
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0' },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      }
    );
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function extractContent(html, chapterTitle) {
  const match = html.match(/id="bookcontent"[^>]*>([\s\S]*?)<\/div>/i) || html.match(/class="bookcontent"[^>]*>([\s\S]*?)<\/div>/i);
  if (match) {
    let text = match[1]
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<p[^>]*>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    return text;
  }
  const start = html.indexOf(chapterTitle);
  if (start === -1) return null;
  let end = html.indexOf('### 作者感言', start);
  if (end === -1) end = html.indexOf('上一章', start);
  if (end === -1) end = html.length;
  let block = html.slice(start, end);
  block = block.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return block;
}

async function main() {
  let out = fs.readFileSync(OUT_FILE, 'utf8');
  const existingChapters = (out.match(/^## 第[\s\S]*?$/gm) || []).length;
  if (existingChapters >= 55) {
    console.log('File already has all 55 chapters.');
    return;
  }
  const startFrom = Math.max(0, existingChapters);
  console.log(`Fetching chapters ${startFrom + 1} to 55...`);
  for (let i = startFrom; i < CHAPTERS.length; i++) {
    const [title, id] = CHAPTERS[i];
    const url = `${BASE}/book/${BOOK_ID}/${id}.html`;
    try {
      const html = await fetchUrl(url);
      const content = extractContent(html, title);
      if (content) {
        out += `\n## ${title}\n\n${content}\n\n---\n\n`;
        console.log(`OK ${i + 1}/55 ${title}`);
      } else {
        out += `\n## ${title}\n\n[Nội dung chưa lấy được - ${url}]\n\n---\n\n`;
        console.log(`FAIL ${i + 1}/55 ${title} (no content)`);
      }
    } catch (e) {
      out += `\n## ${title}\n\n[Lỗi khi lấy: ${e.message}]\n\n---\n\n`;
      console.log(`ERR ${i + 1}/55 ${title}`, e.message);
    }
    fs.writeFileSync(OUT_FILE, out, 'utf8');
    await new Promise((r) => setTimeout(r, 300));
  }
  console.log('Done. Output:', OUT_FILE);
}

main().catch(console.error);
