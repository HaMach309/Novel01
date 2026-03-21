import "dotenv/config";
import fs from "fs";
import path from "path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { chromium } from "playwright";
import { parseNovelMarkdown } from "./parse-novel-md.mjs";

/**
 * Đăng truyện lên Wattpad từ file Markdown (cùng phong cách chạy / log như GetNovel).
 * - IntelliJ: Run `upload-wattpad.mjs`, nhập đường dẫn .md khi được hỏi (nếu không truyền tham số / run-novel.json / NOVEL_MD_PATH).
 * - Wattpad thường đổi DOM — nếu lỗi selector: npx playwright codegen https://www.wattpad.com/myworks/new
 */
const CONFIG = {
  headless: process.env.HEADLESS === "1",
  slowMoMs: Number(process.env.SLOW_MO_MS || 60),
  navigationTimeoutMs: 90_000,
  tagText: process.env.WATTPAD_TAG || "hvan",
  loginUrl: "https://www.wattpad.com/login",
  newWorkUrl: "https://www.wattpad.com/myworks/new",
};

const REPORT_DIR = path.join(process.cwd(), "reports");
const RUN_NOVEL_JSON = "run-novel.json";

/** Đọc run-novel.json (cùng thư mục với khi chạy lệnh). Đường dẫn novelMd tương đối → resolve theo thư mục đó. */
function loadRunNovelJson() {
  const configPath = path.join(process.cwd(), RUN_NOVEL_JSON);
  if (!fs.existsSync(configPath)) return null;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (e) {
    throw new Error(`run-novel.json không hợp lệ: ${e.message}`);
  }
  const base = path.dirname(path.resolve(configPath));
  let novelMd = data.novelMd ?? data.novelPath ?? data.mdPath ?? "";
  novelMd = String(novelMd).trim();
  if (novelMd && !path.isAbsolute(novelMd)) {
    novelMd = path.resolve(base, novelMd);
  }
  return {
    novelMd: novelMd || null,
    tag: data.tag ?? data.wattpadTag,
    headless: data.headless,
    slowMoMs: data.slowMoMs,
  };
}

function isoNow() {
  return new Date().toISOString();
}

function sessionId() {
  return isoNow().replace(/[:.]/g, "-");
}

function reportLine(session, obj) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const file = path.join(REPORT_DIR, `upload-${session}.jsonl`);
  fs.appendFileSync(file, JSON.stringify({ t: isoNow(), ...obj }) + "\n", "utf8");
}

function stripQuotes(s) {
  return String(s || "").trim().replace(/^["']|["']$/g, "");
}

async function promptNovelMdPath() {
  const rl = readline.createInterface({ input, output });
  try {
    const line = await rl.question(
      "Nhập đường dẫn file .md (vd: C:\\Novel01\\Truyện đã dịch\\TenTruyen.md): "
    );
    return stripQuotes(line);
  } finally {
    rl.close();
  }
}

function normalizeMdPath(c) {
  const t = stripQuotes(c);
  if (!t) return "";
  return path.isAbsolute(t) ? t : path.resolve(process.cwd(), t);
}

/**
 * Thứ tự ưu tiên giống GetNovel: tham số dòng lệnh → cấu hình → biến môi trường → hỏi trên console.
 */
async function resolveNovelMdPath(fromFile) {
  if (process.argv[2]) {
    const p = normalizeMdPath(process.argv[2]);
    if (!fs.existsSync(p)) {
      console.error(`Không tìm thấy file: ${p}`);
      process.exit(1);
    }
    return p;
  }
  if (fromFile?.novelMd) {
    const p = fromFile.novelMd;
    if (!fs.existsSync(p)) {
      console.error(`File trong run-novel.json không tồn tại: ${p}`);
      process.exit(1);
    }
    return p;
  }
  if (process.env.NOVEL_MD_PATH?.trim()) {
    const p = normalizeMdPath(process.env.NOVEL_MD_PATH);
    if (!fs.existsSync(p)) {
      console.error(`NOVEL_MD_PATH không trỏ tới file tồn tại: ${p}`);
      process.exit(1);
    }
    return p;
  }
  const prompted = await promptNovelMdPath();
  if (!prompted) {
    console.error("Đường dẫn file .md không được để trống.");
    process.exit(1);
  }
  const p = normalizeMdPath(prompted);
  if (!fs.existsSync(p)) {
    console.error(`Không tìm thấy file: ${p}`);
    process.exit(1);
  }
  return p;
}

function mdTableCell(s) {
  return String(s ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function writeMarkdownReport(session, meta) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const out = path.join(REPORT_DIR, `upload-${session}-report.md`);
  const lines = [];
  lines.push("# Báo cáo đăng truyện Wattpad (UpNovel)");
  lines.push("");
  lines.push(`- **Thời gian bắt đầu:** ${meta.startedAt}`);
  lines.push(`- **Thời gian kết thúc:** ${isoNow()}`);
  lines.push(`- **File nguồn .md:** \`${meta.mdPath}\``);
  lines.push(`- **Tiêu đề truyện:** ${mdTableCell(meta.novelTitle)}`);
  lines.push(`- **Trạng thái tổng:** ${meta.completed ? "Hoàn tất" : "Lỗi / dở dang"}`);
  if (meta.errorMessage) lines.push(`- **Lỗi:** ${mdTableCell(meta.errorMessage)}`);
  const ok = meta.chapterResults.filter((r) => r.ok).length;
  lines.push(`- **Chương lưu thành công:** ${ok} / ${meta.totalChapters}`);
  lines.push("");
  lines.push("| Chương | Tiêu đề | Trạng thái | Số ký tự |");
  lines.push("|--------|---------|------------|----------|");
  for (const r of meta.chapterResults) {
    const st = r.ok ? "THÀNH CÔNG" : "THẤT BẠI";
    const extra = r.ok ? "" : ` — ${mdTableCell(r.error || "")}`;
    lines.push(
      `| ${r.index} | ${mdTableCell(r.title)} | ${st}${extra} | ${r.chars} |`
    );
  }
  lines.push("");
  lines.push(`- Log chi tiết (JSONL): \`reports/upload-${session}.jsonl\``);
  if (meta.screenshot) lines.push(`- Ảnh lỗi: \`${meta.screenshot}\``);
  fs.writeFileSync(out, lines.join("\n"), "utf8");
  console.log(`Đã ghi báo cáo: ${out}`);
}

async function tryClickCookieBanner(page) {
  const candidates = [
    page.getByRole("button", { name: /accept all cookies|accept all|chấp nhận|đồng ý tất cả|agree/i }),
    page.getByRole("button", { name: /only necessary|chỉ cần thiết/i }),
  ];
  for (const loc of candidates) {
    const vis = await loc.first().isVisible().catch(() => false);
    if (vis) {
      await loc.first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(400);
      return;
    }
  }
}

/** `root` có thể là Page hoặc Frame (Playwright). */
async function firstVisibleLocator(root, selectors) {
  for (const sel of selectors) {
    const loc = root.locator(sel).first();
    const ok = await loc.isVisible().catch(() => false);
    if (ok) return loc;
  }
  return null;
}

function isLoginLikeUrl(href) {
  return /login|sign[-_]?in|\/auth|oauth|authentication|firebase|identitytoolkit|accounts\.google/i.test(
    href || ""
  );
}

async function extractLoginErrorMessage(page) {
  const locators = [
    page.locator('[role="alert"]').first(),
    page.locator("[class*='error']").first(),
    page.locator("[data-testid*='error']").first(),
  ];
  for (const loc of locators) {
    const t = await loc.innerText({ timeout: 800 }).catch(() => null);
    if (t?.trim()) return t.trim().replace(/\s+/g, " ").slice(0, 400);
  }
  return null;
}

/** Form đôi khi nằm trong iframe (Firebase / SSO). */
async function resolveLoginRoot(page, userSelectors) {
  const hasForm = async (root) => {
    const u = await firstVisibleLocator(root, userSelectors);
    const p = root.locator('input[type="password"]').first();
    return Boolean(u && (await p.isVisible().catch(() => false)));
  };
  if (await hasForm(page)) return page;
  for (const frame of page.frames()) {
    if (frame === page.mainFrame()) continue;
    if (await hasForm(frame)) return frame;
  }
  return page;
}

async function submitLoginCredentials(loginRoot, passLoc, page) {
  const tryClick = async (loc) => {
    if (await loc.isVisible().catch(() => false)) {
      await loc.click({ timeout: 15_000 });
      return true;
    }
    return false;
  };

  if (await tryClick(loginRoot.locator('button[type="submit"]').first())) return;
  if (await tryClick(loginRoot.getByRole("button", { name: /^đăng nhập$|^log in$|^sign in$/i }).first()))
    return;

  const ambiguous = loginRoot.getByRole("button", { name: /đăng nhập|log in|sign in|tiếp tục|continue/i });
  const n = await ambiguous.count().catch(() => 0);
  for (let i = n - 1; i >= 0; i--) {
    const b = ambiguous.nth(i);
    const label = (await b.innerText().catch(() => "")).toLowerCase();
    if (/facebook|google|apple|fb\.com|gmail|email|thiết bị|device|qr|mã/i.test(label)) continue;
    if (await tryClick(b)) return;
  }

  await passLoc.press("Enter");
  await page.waitForTimeout(1500);
}

async function fillVisibleFirst(page, selectors, text) {
  const loc = await firstVisibleLocator(page, selectors);
  if (!loc) throw new Error(`Không tìm thấy ô nhập với selector: ${selectors.join(" | ")}`);
  await loc.click({ timeout: 5000 });
  await loc.fill("");
  await loc.fill(text);
  return loc;
}

/**
 * Sau đăng nhập, Wattpad đôi khi mở tab mới và đóng tab login — tham chiếu Playwright `page` cũ thành invalid.
 * Lấy lại tab còn mở cuối cùng, hoặc báo lỗi rõ ràng.
 */
async function attachToLivePage(context, page) {
  if (!page.isClosed()) {
    return page;
  }
  const live = context.pages().filter((p) => !p.isClosed());
  if (live.length === 0) {
    throw new Error(
      "Trình duyệt hoặc tất cả tab đã đóng sau đăng nhập. " +
        "Không đóng cửa sổ Chromium do Playwright khi đang chạy; nếu Wattpad mở tab mới, giữ tab đó mở."
    );
  }
  const newest = live[live.length - 1];
  await newest.bringToFront().catch(() => {});
  return newest;
}

async function clickLoginWithEmailIfPresent(page) {
  const name =
    /đăng nhập với email|log in with email|sign in with email|login with email|email đăng nhập/i;
  const btn = page.getByRole("button", { name }).first();
  const link = page.getByRole("link", { name }).first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click({ timeout: 15_000 });
    await page.waitForTimeout(600);
    return;
  }
  if (await link.isVisible().catch(() => false)) {
    await link.click({ timeout: 15_000 });
    await page.waitForTimeout(600);
    return;
  }
  const fallback = page.getByText(name).first();
  if (await fallback.isVisible().catch(() => false)) {
    await fallback.click({ timeout: 15_000 });
    await page.waitForTimeout(600);
  }
}

async function login(page, user, pass) {
  await page.goto(CONFIG.loginUrl, {
    waitUntil: "domcontentloaded",
    timeout: CONFIG.navigationTimeoutMs,
  });
  await page.waitForLoadState("networkidle", { timeout: 25_000 }).catch(() => {});
  await tryClickCookieBanner(page);
  await clickLoginWithEmailIfPresent(page);
  await page.waitForTimeout(400);

  const userSelectors = [
    'input[name="username"]',
    'input[name="email"]',
    'input#authentication-username',
    'input#login-username',
    'input[type="email"]',
    'input[autocomplete="username"]',
    "input[data-testid=username]",
    'input[autocomplete="email"]',
  ];
  const loginRoot = await resolveLoginRoot(page, userSelectors);
  const userLoc = await firstVisibleLocator(loginRoot, userSelectors);
  if (!userLoc) {
    throw new Error(
      "Không tìm thấy ô email/username (kể cả trong iframe). Mở Wattpad login trong trình duyệt thường và kiểm tra giao diện."
    );
  }
  await userLoc.click({ timeout: 5000 });
  await userLoc.fill("");
  await userLoc.fill(user);

  const passLoc = loginRoot.locator('input[type="password"]').first();
  await passLoc.waitFor({ state: "visible", timeout: 25_000 });
  await passLoc.fill("");
  await passLoc.fill(pass);
  await page.waitForTimeout(200);

  await submitLoginCredentials(loginRoot, passLoc, page);

  try {
    await page.waitForURL((u) => !isLoginLikeUrl(u.href), { timeout: 120_000 });
  } catch {
    /* chờ thêm bước xác minh / load chậm */
  }

  await page.waitForTimeout(1500);
  if (isLoginLikeUrl(page.url())) {
    const hint = await extractLoginErrorMessage(page);
    throw new Error(
      "Đăng nhập chưa thành công — vẫn đang ở trang/URL đăng nhập. " +
        (hint ? `Thông báo trên trang: ${hint} ` : "") +
        "Kiểm tra WATTPAD_USERNAME / WATTPAD_PASSWORD trong .env (email đăng nhập đúng, mật khẩu không có dấu cách thừa). " +
        "Nếu Wattpad yêu cầu CAPTCHA, xác minh email, hoặc 2FA: hãy đăng nhập tay một lần trong cửa sổ Chromium này đến khi vào được trang chủ, rồi (tuỳ chọn) lưu storage hoặc chạy lại script sau khi phiên đã mở."
    );
  }
}

async function openNewStoryFlow(page) {
  await page.goto(CONFIG.newWorkUrl, {
    waitUntil: "domcontentloaded",
    timeout: CONFIG.navigationTimeoutMs,
  });
  await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});
  await tryClickCookieBanner(page);

  // Một số giao diện có nút "Bỏ qua" ngay trên màn hình tạo mới.
  await tryClickOrangeSkipButton(page, 5_000).catch(() => {});

  const writeNew = page.getByRole("link", {
    name: /viết một truyện mới|write a new story|create|new story/i,
  });
  const writeBtn = page.getByRole("button", {
    name: /viết một truyện mới|write a new story|new story/i,
  });
  if (await writeNew.first().isVisible().catch(() => false)) await writeNew.first().click();
  else if (await writeBtn.first().isVisible().catch(() => false)) await writeBtn.first().click();

  await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});
  await page.waitForTimeout(800);

  // Try lần nữa sau khi chuyển sang bước wizard.
  await tryClickOrangeSkipButton(page, 8_000).catch(() => {});
}

/** Chờ form tạo truyện (wizard Wattpad) hiện ô nhập — DOM hay đổi nên kết hợp nhiều dấu hiệu. */
async function waitForStoryMetadataUi(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
  await page.waitForTimeout(500);

  const deadline = Date.now() + 55_000;
  while (Date.now() < deadline) {
    const labeled = await page
      .getByLabel(/^(tiêu đề|tên truyện|title|story title)$/i)
      .first()
      .isVisible()
      .catch(() => false);
    const titled = await firstVisibleLocator(page, [
      'input[name="title"]',
      'textarea[name="title"]',
      '[data-testid="story-title"] input',
      'input[placeholder*="tiêu đề" i]',
      'input[placeholder*="story title" i]',
      'input[placeholder*="add a title" i]',
    ]);
    if (labeled || titled) {
      await page.waitForTimeout(400);
      return;
    }
    await page.waitForTimeout(400);
  }
  throw new Error(
    "Không thấy form nhập tiêu đề truyện sau khi mở trang tạo truyện. Kiểm tra đã đăng nhập và URL có chứa phần tạo truyện mới."
  );
}

async function fillInputIfFound(loc, text) {
  if (!loc) return false;
  const ok = await loc.isVisible().catch(() => false);
  if (!ok) return false;
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  await loc.click({ timeout: 8000 });
  await loc.fill("");
  await loc.fill(text);
  return true;
}

/**
 * Tiêu đề: ưu tiên ô một dòng (input) hoặc textarea name=title — không dùng textarea mô tả
 * (placeholder chữ "title" dễ trùng và khiến nhầm sang ô mô tả).
 */
async function fillStoryTitleField(page, title) {
  const inputSelectors = [
    'input[name="title"]',
    'input[name="storyTitle"]',
    '[data-testid="story-title"] input',
    'input#story-title',
    'input[aria-label*="tiêu đề" i]',
    'input[aria-label*="tiêu đề" i]',
    'input[placeholder*="tiêu đề" i]',
    'input[placeholder*="story title" i]',
    'input[placeholder*="add a title" i]',
    'input[placeholder*="your story title" i]',
    'input[placeholder*="title" i]',
    'input[name*="title" i]',
  ];
  const inp = await firstVisibleLocator(page, inputSelectors);
  if (inp) {
    await inp.scrollIntoViewIfNeeded().catch(() => {});
    await inp.click({ timeout: 8000 });
    await inp.fill("");
    await inp.fill(title);
    const after = await inp.inputValue().catch(() => null);
    console.log(`[DEBUG] title_fill_inputValue="${after ?? ""}"`);
    return;
  }

  const titleTextarea = await firstVisibleLocator(page, [
    'textarea[name="title"]',
    'textarea#story-title',
    '[data-testid="story-title"] textarea',
    'textarea[aria-label*="tiêu đề" i]',
    'textarea[placeholder*="tiêu đề" i]',
    'textarea[placeholder*="story title" i]',
  ]);
  if (titleTextarea) {
    await titleTextarea.scrollIntoViewIfNeeded().catch(() => {});
    await titleTextarea.click({ timeout: 8000 });
    await titleTextarea.fill("");
    await titleTextarea.fill(title);
    const after = await titleTextarea.inputValue().catch(() => null);
    console.log(`[DEBUG] title_fill_textareaValue="${after ?? ""}"`);
    return;
  }

  const labelNarrow = page
    .getByLabel(/^(tiêu đề|tên truyện|title|story title)$/i)
    .filter({
      hasNot: page.locator(
        'textarea[name*="description" i], textarea[name="description"], textarea[aria-label*="description" i], textarea[placeholder*="description" i], [data-testid*="story-description" i] textarea'
      ),
    })
    .first();
  if (await fillInputIfFound(labelNarrow, title)) {
    const after = await labelNarrow.inputValue().catch(() => null);
    console.log(`[DEBUG] title_fill_labelValue="${after ?? ""}"`);
    return;
  }

  throw new Error(
    "Không tìm thấy ô nhập tiêu đề (input/textarea name=title). Kiểm tra giao diện Wattpad hoặc chạy codegen."
  );
}

/** Mô tả: luôn clear ô mô tả (kể cả khi description rỗng) để tránh Wattpad tự điền title. */
async function fillStoryDescriptionField(page, description, titleForGuard) {
  const descriptionTrim = description?.trim() ?? "";

  async function looksLikeTitleField(loc) {
    const name = await loc.getAttribute("name").catch(() => null);
    const aria = await loc.getAttribute("aria-label").catch(() => null);
    const placeholder = await loc.getAttribute("placeholder").catch(() => null);
    const hint = `${name ?? ""} ${aria ?? ""} ${placeholder ?? ""}`.toLowerCase();
    return /(title|tiêu đề|tên truyện|story title)/i.test(hint);
  }

  const descriptionSelectors = [
    'textarea[name="description"]',
    'textarea[name="storyDescription"]',
    '[data-testid="story-description"] textarea',
    '[data-testid*="description" i] textarea',
    'textarea[aria-label*="mô tả" i]',
    'textarea[aria-label*="description" i]',
    'textarea[placeholder*="mô tả" i]',
    'textarea[placeholder*="description" i]',
    'textarea[placeholder*="giới thiệu" i]',
    'textarea[placeholder*="synopsis" i]',
    'textarea[placeholder*="tell readers" i]',
    'textarea[placeholder*="what is your story" i]',
  ];
  for (const sel of descriptionSelectors) {
    const loc = page.locator(sel).first();
    const visible = await loc.isVisible().catch(() => false);
    if (!visible) continue;
    if (await looksLikeTitleField(loc)) continue;

    await loc.scrollIntoViewIfNeeded().catch(() => {});
    await loc.click({ timeout: 8000 });
    await loc.fill("");
    if (descriptionTrim) await loc.fill(descriptionTrim);
    return;
  }

  const descLabel = page.getByLabel(/^(mô tả|description|giới thiệu|synopsis)$/i).first();
  if (await descLabel.isVisible().catch(() => false)) {
    if (!(await looksLikeTitleField(descLabel))) {
      await descLabel.scrollIntoViewIfNeeded().catch(() => {});
      await descLabel.click({ timeout: 8000 });
      await descLabel.fill("");
      if (descriptionTrim) await descLabel.fill(descriptionTrim);
    }
  }
}

async function clickOrangeSkipButtonOnly(page) {
  const deadline = Date.now() + 25_000;
  while (Date.now() < deadline) {
    const btn = await findOrangeSkipButton(page);
    if (btn) {
      await btn.waitFor({ state: "visible", timeout: 5_000 }).catch(() => {});

      await btn.scrollIntoViewIfNeeded().catch(() => {});
      await btn.click({ timeout: 10_000 }).catch(() => {});
      return;
    }
    await page.waitForTimeout(300);
  }
  throw new Error("Không tìm thấy nút 'Bỏ qua' màu cam.");
}

async function tryClickOrangeSkipButton(page, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const btn = await findOrangeSkipButton(page);
    if (btn) {
      await btn.scrollIntoViewIfNeeded().catch(() => {});
      await btn.click({ timeout: 8_000 }).catch(() => {});
      return true;
    }
    await page.waitForTimeout(250);
  }
  return false;
}

function looksLikeOrangeBackground(color) {
  if (!color || typeof color !== "string") return false;
  const c = color.toLowerCase().trim();

  // Màu bạn xác nhận: #ff6122
  const ORANGE_HEX = "#ff6122";
  const ORANGE_RGB = { r: 255, g: 97, b: 34 };

  if (c === ORANGE_HEX) return true;

  // Playwright/computedStyle thường trả dạng rgb(...) hoặc rgba(...)
  const m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,|\))/i);
  if (!m) return false;

  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);

  return r === ORANGE_RGB.r && g === ORANGE_RGB.g && b === ORANGE_RGB.b;
}

async function findOrangeSkipButton(page) {
  const skipRx = /bỏ qua|bo qua|skip/i;
  const candidates = page.getByRole("button", { name: skipRx });
  const count = await candidates.count().catch(() => 0);

  // Duyệt từng button, lấy computed backgroundColor để phân biệt 2 nút "Bỏ qua".
  for (let i = 0; i < count; i++) {
    const loc = candidates.nth(i);
    const visible = await loc.isVisible().catch(() => false);
    if (!visible) continue;

    const bg = await loc.evaluate((el) => getComputedStyle(el).backgroundColor).catch(() => null);
    if (looksLikeOrangeBackground(bg)) return loc;
  }

  // Nếu không match được màu cam, vẫn click fallback button "Bỏ qua" đầu tiên nhìn thấy.
  const fallback = candidates.first();
  if (await fallback.isVisible().catch(() => false)) return fallback;
  return null;
}

async function fillStoryMetadata(page, novel) {
  await waitForStoryMetadataUi(page);

  // BỎ QUA việc nhập "Tiêu đề" (user muốn tự nhập / hoặc không muốn script đụng ô này).
  // Chỉ điền/xóa "Mô tả" và gắn tag.
  await fillStoryDescriptionField(page, novel.description, novel.title);
  await page.waitForTimeout(350);

  await typeTags(page, CONFIG.tagText);
  await page.waitForTimeout(350);

  // Wattpad đôi khi tự động copy "tiêu đề" sang mô tả khi validate/chuyển bước.
  // Re-clear/re-fill ngay trước khi nhấn Tab để tránh trường hợp mô tả bị dính tiêu đề.
  await fillStoryDescriptionField(page, novel.description, novel.title);
  await page.waitForTimeout(250);

  /* Blur ô nhập để Wattpad validate và hiện / bật nút Tiếp tục */
  await page.keyboard.press("Tab");
  await page.waitForTimeout(500);
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(300);
  await clickOrangeSkipButtonOnly(page);
}

async function typeTags(page, tag) {
  if (!tag?.trim()) return;
  const filled =
    (await fillInputIfFound(
      page.getByLabel(/tag|thẻ|hashtag|từ khóa/i).first(),
      tag.trim()
    )) ||
    (await fillInputIfFound(page.getByPlaceholder(/tag|thẻ|add a tag|từ khóa/i).first(), tag.trim()));
  if (filled) {
    await page.keyboard.press("Enter");
    return;
  }
  const tagSelectors = [
    'input[placeholder*="tag" i]',
    'input[name*="tag" i]',
    '[data-testid="tag-input"] input',
    '[data-testid*="tag" i] input',
  ];
  const loc = await firstVisibleLocator(page, tagSelectors);
  if (!loc) return;
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  await loc.click({ timeout: 5000 });
  await loc.fill(tag.trim());
  await page.keyboard.press("Enter");
}

async function fillChapter(page, chapter, { isFirst }) {
  const chapterTitleSelectors = [
    'input[name="partTitle"]',
    'input[name="chapterTitle"]',
    'input[placeholder*="part" i]',
    'input[placeholder*="chapter" i]',
    'input[placeholder*="Chương" i]',
    '[data-testid="part-title"] input',
    // Editor dạng rich text (sau khi "Bỏ qua" cam)
    'h2#story-title[contenteditable="true"]',
    'h2#story-title',
    '[id="story-title"][contenteditable="true"]',
    'h2[contenteditable="true"][id*="story-title" i]',
  ];

  await page.waitForTimeout(isFirst ? 800 : 400);

  const titleLoc = await firstVisibleLocator(page, chapterTitleSelectors);
  if (!titleLoc) {
    throw new Error(`Không tìm thấy ô nhập tiêu đề chương (selectors: ${chapterTitleSelectors.join(" | ")})`);
  }

  await titleLoc.scrollIntoViewIfNeeded().catch(() => {});
  await titleLoc.click({ timeout: 5000 });

  const tag = await titleLoc.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
  const contentEditable = await titleLoc.getAttribute("contenteditable").catch(() => null);

  const mod = process.platform === "darwin" ? "Meta" : "Control";
  if (tag === "input" || tag === "textarea") {
    await titleLoc.fill("");
    await titleLoc.fill(chapter.title);
  } else if (contentEditable === "true" || contentEditable === "") {
    // contenteditable/h2 -> dọn hết rồi chèn text
    await page.keyboard.press(`${mod}+A`);
    await page.keyboard.press("Backspace");
    await page.keyboard.insertText(chapter.title);
  } else {
    // Fallback: thử insertText
    await page.keyboard.insertText(chapter.title);
  }

  const bodySelectors = [
    // Ưu tiên đúng node bạn mô tả
    'p[style=""]',
    '[contenteditable="true"]',
    'div[role="textbox"]',
    'textarea[name="body"]',
    '[data-testid="editor"] [contenteditable="true"]',
  ];
  const bodyEl = await firstVisibleLocator(page, bodySelectors);
  if (!bodyEl) throw new Error("Không tìm thấy vùng nhập nội dung chương (editor).");

  await bodyEl.scrollIntoViewIfNeeded().catch(() => {});
  await bodyEl.click({ timeout: 5000 });
  await page.keyboard.press(`${mod}+A`);
  await page.keyboard.press("Backspace");

  const bodyTag = await bodyEl.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
  if (bodyTag === "textarea") {
    await bodyEl.fill(chapter.body);
  } else {
    await page.keyboard.insertText(chapter.body);
  }

  const saveBtn = page.getByRole("button", { name: /lưu|save/i }).first();
  await saveBtn.click({ timeout: 60_000 });

  await page.waitForTimeout(1200);
}

async function clickNewChapter(page) {
  const btn = page.getByRole("button", {
    name: /chương mới|new part|new chapter|thêm chương|add part/i,
  });
  await btn.first().click({ timeout: 60_000 });
}

async function main() {
  const startedAt = isoNow();
  let fromFile = null;
  try {
    fromFile = loadRunNovelJson();
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  if (fromFile) {
    if (fromFile.tag != null && String(fromFile.tag).trim() !== "") {
      CONFIG.tagText = String(fromFile.tag).trim();
    }
    if (typeof fromFile.headless === "boolean") {
      CONFIG.headless = fromFile.headless;
    }
    if (typeof fromFile.slowMoMs === "number" && !Number.isNaN(fromFile.slowMoMs)) {
      CONFIG.slowMoMs = fromFile.slowMoMs;
    }
  }

  const mdPath = await resolveNovelMdPath(fromFile);

  const user = process.env.WATTPAD_USERNAME;
  const pass = process.env.WATTPAD_PASSWORD;
  if (!user || !pass) {
    console.error("Đặt WATTPAD_USERNAME và WATTPAD_PASSWORD trong file .env (xem .env.example).");
    process.exit(1);
  }

  const raw = fs.readFileSync(mdPath, "utf8");
  const novel = parseNovelMarkdown(raw);
  if (!novel.chapters.length) {
    console.error("Không parse được chương nào. Kiểm tra heading ## Chương 1 ... trong file .md.");
    process.exit(1);
  }

  console.log(`Đã đọc: "${novel.title}" — ${novel.chapters.length} chương (file: ${mdPath}).`);
  const descFirstLine = novel.description.split(/\r?\n/).find((l) => l.trim().length > 0) ?? "";
  console.log(`[DEBUG] title="${novel.title}"`);
  console.log(`[DEBUG] descFirstLine="${descFirstLine}"`);

  const sid = sessionId();
  const reportMeta = {
    startedAt,
    mdPath,
    novelTitle: novel.title,
    chapterResults: [],
    totalChapters: novel.chapters.length,
    completed: false,
    errorMessage: null,
    screenshot: null,
  };

  reportLine(sid, {
    event: "parsed",
    mdPath,
    title: novel.title,
    introChars: novel.description.length,
    chapters: novel.chapters.length,
  });

  const browser = await chromium.launch({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMoMs,
  });
  const context = await browser.newContext({
    locale: "vi-VN",
    viewport: { width: 1280, height: 900 },
  });
  let page = await context.newPage();

  try {
    console.log("Đang đăng nhập Wattpad...");
    await login(page, user, pass);
    page = await attachToLivePage(context, page);
    reportLine(sid, { event: "login_ok" });

    await openNewStoryFlow(page);
    await fillStoryMetadata(page, novel);
    reportLine(sid, { event: "metadata_submitted", title: novel.title });
    console.log("Đã gửi tiêu đề / giới thiệu / thẻ. Bắt đầu lưu từng chương…");

    for (let i = 0; i < novel.chapters.length; i++) {
      const ch = novel.chapters[i];
      try {
        await fillChapter(page, ch, { isFirst: i === 0 });
        reportMeta.chapterResults.push({
          index: i + 1,
          title: ch.title,
          chars: ch.body.length,
          ok: true,
        });
        console.log(
          `[Chương ${i + 1}] THÀNH CÔNG — đã lưu trên Wattpad: ${ch.title} (${ch.body.length} ký tự)`
        );
        reportLine(sid, {
          event: "chapter_saved",
          index: i + 1,
          total: novel.chapters.length,
          chapterTitle: ch.title,
          bodyChars: ch.body.length,
        });

        if (i < novel.chapters.length - 1) {
          await clickNewChapter(page);
          reportLine(sid, { event: "new_chapter_clicked", afterIndex: i + 1 });
        }
      } catch (chErr) {
        const msg = String(chErr?.message || chErr);
        reportMeta.chapterResults.push({
          index: i + 1,
          title: ch.title,
          chars: 0,
          ok: false,
          error: msg,
        });
        console.error(`[Chương ${i + 1}] THẤT BẠI — ${msg} — ${ch.title}`);
        throw chErr;
      }
    }

    reportMeta.completed = true;
    reportLine(sid, { event: "completed_all_chapters" });
    console.log("Hoàn tất tất cả chương. Kiểm tra lại trên Wattpad.");
  } catch (err) {
    reportMeta.errorMessage = String(err?.message || err);
    const shot = path.join(REPORT_DIR, `${sid}-error.png`);
    await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
    reportMeta.screenshot = shot;
    reportLine(sid, {
      event: "fatal_error",
      message: reportMeta.errorMessage,
      screenshot: shot,
    });
    throw err;
  } finally {
    await browser.close().catch(() => {});
    writeMarkdownReport(sid, reportMeta);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
