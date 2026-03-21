# UpNovel — hỗ trợ đăng truyện Wattpad từ Markdown

Script dùng [Playwright](https://playwright.dev/) để mở trình duyệt, đăng nhập Wattpad, điền metadata truyện (tiêu đề, mô tả nếu có trong .md, tag) và lần lượt tạo từng chương theo nội dung file `.md`. **Không** tự chọn thể loại trên Wattpad (bạn chọn tay trên web nếu cần).

**Phong cách chạy giống GetNovel:** Run trong IntelliJ hoặc `npm start` → nhập đường dẫn `.md` khi được hỏi (nếu không truyền tham số / `run-novel.json` / `NOVEL_MD_PATH`); mỗi chương in `THÀNH CÔNG` / `THẤT BẠI`; có **`reports/upload-<id-lần-chạy>-report.md`**.

## Cảnh báo quan trọng

1. **Điều khoản Wattpad**: Tự động hóa (bot) có thể vi phạm [Điều khoản](https://www.wattpad.com/terms) / chính sách của Wattpad và dẫn tới khóa tài khoản. Bạn tự chịu trách nhiệm khi sử dụng.
2. **Nội dung & bản quyền**: Chỉ đăng nội dung bạn có quyền phân phối; nội dung người lớn có thể không được phép hoặc bị giới hạn theo quy tắc Wattpad theo từng khu vực.
3. **Bảo mật**: **Không** nhúng mật khẩu vào mã nguồn. Dùng file `.env` cục bộ và **đổi mật khẩu** nếu từng chia sẻ công khai.

## Chuẩn bị

**Lệnh `npm` phải chạy trong thư mục có `package.json` của UpNovel.** Nếu đang ở `Novel01` (thư mục cha), dùng một trong hai cách:

```bash
cd UpNovel
npm install
npx playwright install chromium
```

Hoặc từ thư mục cha `Novel01`:

```bash
npm run upnovel:install
npm run upnovel:browser
```

Sau đó chạy tool: `npm run upnovel` (từ `Novel01`) hoặc `cd UpNovel` rồi `npm start`.

Tạo file `.env` từ `.env.example` và điền `WATTPAD_USERNAME`, `WATTPAD_PASSWORD`.

## Chạy trong IntelliJ IDEA

1. File → Open → thư mục **UpNovel** (có `package.json`).
2. Terminal: `npm install`, `npx playwright install chromium` (lần đầu).
3. Run: mở `upload-wattpad.mjs` → chuột phải → **Run** (Working directory = `UpNovel`).
4. Nếu không có tham số / `run-novel.json` / `NOVEL_MD_PATH`, nhập đường dẫn đầy đủ tới file `.md` trong console, ví dụ:  
   `C:\...\Novel01\Truyện đã dịch\TenTruyen.md`

## Chạy nhanh (khác)

- **`npm start`** — giống trên (hỏi đường dẫn `.md` nếu cần).
- **`Chạy-Wattpad.bat`** (Windows) — tự `npm install` / Chromium; không bắt buộc có `run-novel.json`.
- Sao chép **`run-novel.example.json`** → **`run-novel.json`**, sửa `novelMd` (tuỳ chọn; có thể chỉnh `tag`, `headless`, `slowMoMs`). File `run-novel.json` cục bộ nằm trong `.gitignore`.

## Định dạng Markdown

- Dòng `# Tiêu đề` → tiêu đề truyện.
- Sau `### Nội dung giới thiệu` → nội dung mô tả đến dòng `---` ngay trước `## Chương 1`.
- Mỗi chương bắt đầu bằng `## Chương N ...`; dòng trùng tiêu đề ngay sau heading sẽ được bỏ khỏi thân chương.

## Tham số & cấu hình (ưu tiên từ trên xuống)

| Nguồn | Mô tả |
|--------|--------|
| Tham số 1 khi chạy | `node upload-wattpad.mjs "C:\path\novel.md"` |
| `run-novel.json` | `novelMd`, `tag`, `headless`, `slowMoMs` |
| `.env` | `NOVEL_MD_PATH`, `WATTPAD_TAG`, `HEADLESS=1`, `SLOW_MO_MS` |

Không đặt mật khẩu Wattpad trong JSON — chỉ trong `.env`.

Tuỳ chọn môi trường:

- `HEADLESS=1` — chạy không giao diện (khó gỡ lỗi hơn).
- `SLOW_MO_MS=120` — làm chậm thao tác (dễ quan sát).
- `WATTPAD_TAG=tag1` — mặc định `hvan` nếu không đặt.

## Báo cáo (log)

- **Console:** mỗi chương một dòng `THÀNH CÔNG` / `THẤT BẠI` (tương tự GetNovel).
- **`reports/upload-<id-lần-chạy>-report.md`:** bảng chương, trạng thái, số ký tự.
- **`reports/upload-<id-lần-chạy>.jsonl`:** sự kiện chi tiết (`chapter_saved`, …).

## Gỡ lỗi khi Wattpad đổi giao diện

Nếu script báo không tìm thấy ô nhập:

1. Chạy `npx playwright codegen https://www.wattpad.com/myworks/new` (đã đăng nhập) để xem selector mới.
2. Sửa các mảng selector trong `upload-wattpad.mjs` (hàm `fillStoryMetadata`, `fillChapter`, v.v.).

Ảnh lỗi (nếu có) được lưu `reports/<session>-error.png`.
