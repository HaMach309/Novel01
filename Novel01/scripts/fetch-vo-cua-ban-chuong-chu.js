/**
 * Crawl nội dung "Chương chữ" từ truyenaudiofull.com
 * Mỗi chương: mở trang -> click "Chương chữ" -> lấy nội dung hiển thị -> ghi vào file .md
 *
 * Chạy: node scripts/fetch-vo-cua-ban-chuong-chu.js
 * Cần: npm install playwright
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://truyenaudiofull.com/story/vo-cua-ban-khong-khach-khi/view';
const OUTPUT_MD = path.join(__dirname, '..', 'VoCuaBanKhongKhachKhi.md');
const MAX_CHAPTERS = 60; // thử tối đa 60 chương, dừng khi không còn nội dung
const DELAY_MS = 1500;   // trì hoãn giữa các chương để tránh bị chặn

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getChapterText(page, chapNum) {
  const url = `${BASE_URL}?chap_num=${chapNum}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await sleep(3000); // chờ Nuxt hydrate và load component

  // Click button "Chương chữ"
  let clicked = false;
  try {
    const btn = page.getByText('Chương chữ', { exact: false }).first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    clicked = true;
  } catch (_) {
    try {
      await page.getByRole('button', { name: /Chương chữ/i }).first().click();
      clicked = true;
    } catch (_) {}
  }
  if (!clicked) {
    return { ok: false, text: null, error: 'Không tìm thấy button "Chương chữ"' };
  }

  await sleep(2000); // chờ drawer/panel "chương chữ" hiện ra

  // Sau khi click "Chương chữ" thường mở drawer/modal chứa đoạn văn (Ant Design: .ant-drawer-body)
  let text = '';
  const drawerSelectors = [
    '.ant-drawer-body',
    '.ant-drawer-content',
    '[class*="drawer"] [class*="body"]',
    '[class*="Drawer"]',
    '[role="dialog"]',
    '.modal-body',
    '[class*="chapter-content"]',
    '[class*="story-content"]',
    '[class*="transcript"]',
  ];
  for (const sel of drawerSelectors) {
    try {
      const el = page.locator(sel).first();
      await el.waitFor({ state: 'visible', timeout: 2000 });
      const t = await el.innerText();
      // Nội dung thật thường dài, có đoạn văn, không phải danh sách "Chương 1:", "Chương 2:"
      if (t && t.length > 300 && !/Chương 1:\s*Chương 2:/.test(t) && !/Danh sách chương|Nhảy chương/.test(t)) {
        text = t.trim();
        break;
      }
    } catch (_) {}
  }
  if (!text || text.length < 100) {
    // Fallback: lấy div nào có nhiều chữ nhất, loại trừ UI
    const skip = /Trang chủ|Danh sách chương|Nhảy chương|Chương chữ|Hẹn giờ tắt|Server 1|Giọng đọc|Báo Lỗi|Tìm kiếm|Lọc Truyện|Đăng ký|Đăng nhập|truyenaudiofull\.com|VIP\s*1x|00:00:00/;
    const divs = await page.locator('div').all();
    let best = '';
    for (const div of divs) {
      const t = await div.innerText().catch(() => '');
      if (t && t.length > 500 && t.length < 100000 && !skip.test(t) && !/^Chương \d+:\s*Chương \d+:/m.test(t)) {
        if (t.length > best.length) best = t;
      }
    }
    if (best) text = best.trim();
  }
  // Lọc bỏ dòng rác (menu, danh sách chương, nút bấm)
  if (text) {
    const junk = /^(Trang chủ|Vợ Của Bạn, Không Khách Khí Full|Chương \d+:\s*$|Danh sách chương|Nhảy chương|Chương chữ|Hẹn giờ tắt|Server 1|Giọng đọc|Báo Lỗi|Tìm kiếm|VIP|1x|00:00:00|Đóng\s*$)/m;
    const lines = text.split('\n').filter(l => {
      const t = l.trim();
      if (!t) return false;
      if (junk.test(t)) return false;
      if (/^Vợ Của Bạn.*Chương \d+:$/.test(t)) return false;
      if (/^Chương \d+\s*$/.test(t) && l.length < 30) return false;
      return true;
    });
    text = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }
  return { ok: !!text, text: text || null };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  const MD_HEAD = `# Vợ Của Bạn, Không Khách Khí

> **Nguồn:** https://truyenaudiofull.com/story/vo-cua-ban-khong-khach-khi  
> **Tên gốc (Hán-Việt):** Bằng Hữu Thê Bất Khách Khí  
> **Tên gốc tiếng Trung:** 朋友妻，不客气！  
> **Tác giả gốc:** 土豆球球 (Tǔdòu qiúqiú)  
> **Nguồn gốc tiếng Trung:** [晋江文学城](http://www.jjwxc.net/onebook.php?novelid=899837)

---

## Thông tin

- **Thể loại:** 3s, Sắc, Thịt, Cao H, audio Full
- **Link audio:** https://truyenaudiofull.com/story/vo-cua-ban-khong-khach-khi  
- **Cấu trúc chương:** \`.../view?chap_num={số_chương}\`

---

## Nội dung chương

`;

  let mdHeadDone = false;
  let totalOk = 0;
  let emptyCount = 0;

  for (let i = 1; i <= MAX_CHAPTERS; i++) {
    process.stdout.write(`Chương ${i}... `);
    try {
      const result = await getChapterText(page, i);
      if (result.ok && result.text) {
        if (!mdHeadDone) {
          fs.writeFileSync(OUTPUT_MD, MD_HEAD, 'utf8');
          mdHeadDone = true;
        }
        const block = `## Chương ${i}\n\n${result.text.trim()}\n\n---\n\n`;
        fs.appendFileSync(OUTPUT_MD, block, 'utf8');
        totalOk++;
        console.log('OK (' + result.text.length + ' ký tự)');
        emptyCount = 0;
      } else {
        console.log(result.error || 'Không có nội dung');
        emptyCount++;
        if (emptyCount >= 2) {
          console.log('Dừng: 2 chương liên tiếp không có nội dung.');
          break;
        }
      }
    } catch (e) {
      console.log('Lỗi:', e.message);
      emptyCount++;
    }
    await sleep(DELAY_MS);
  }

  await browser.close();

  if (totalOk === 0) {
    console.log('Không lấy được chương nào. Kiểm tra lại selector hoặc chạy browser headless: false để xem giao diện.');
    process.exit(1);
  }
  console.log('Đã ghi', totalOk, 'chương vào', OUTPUT_MD);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
