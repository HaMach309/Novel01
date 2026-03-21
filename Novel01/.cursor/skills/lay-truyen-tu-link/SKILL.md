---
name: lay-truyen-tu-link
description: Lấy thông tin truyện từ link: văn án, giới thiệu, nội dung các chương tiếng Trung. Xuất kết quả vào file .md với tên = bản dịch tiếng Việt (viết liền, viết hoa chữ cái đầu) + TQ. VD: MotGiotCungKhongDuocRoiTQ.md
---

# Lấy truyện từ link và xuất file tiếng Trung

## Mục đích

Khi người dùng cung cấp **link truyện** (爱丽丝书屋, xyushuwu4, 海棠搜书, 新御书屋…), thực hiện:

1. **Lấy thông tin truyện**: văn án (文案), giới thiệu (内容简介), tác giả, số chương, trạng thái
2. **Lấy nội dung từng chương** tiếng Trung
3. **Xuất ra file .md** với tên theo quy ước

---

## 1. Quy ước đặt tên file

**Format:** `{TênDịchTiếngViệt}TQ.md`

- **Tên dịch**: Dịch tên truyện từ tiếng Trung sang tiếng Việt
- **Viết liền**: Không dấu cách
- **Viết hoa chữ cái đầu** mỗi từ
- **Thêm**: `TQ` ở cuối (trước `.md`)

**Ví dụ:**

| Tên gốc | Tên dịch | Tên file |
|---------|----------|----------|
| 一滴都不许漏！ | Một giọt cũng không được rơi | `MotGiotCungKhongDuocRoiTQ.md` |
| 处女调教部（回春阁） | Bộ điều giáo xử nữ（Hồi Xuân Các） | `BoDieuGiaoXuNuHoiXuanCacTQ.md` |
| 淫束道具专家 | Chuyên gia đạo cụ dục thúc | `ChuyenGiaDaoCuDucThucTQ.md` |

---

## 2. Cấu trúc file xuất ra

```markdown
# {Tên gốc tiếng Trung}

> 来源: {link gốc}

---

## 内容简介

{Tên truyện}

类别：{thể loại}
字数：{số chữ}
章节：{số chương}
状态：{trạng thái}

### 内容简介

{văn án / giới thiệu đầy đủ}

---

## 第1章 {tiêu đề chương 1}

{nội dung chương 1}

---

## 第2章 {tiêu đề chương 2}

{nội dung chương 2}

---

...
```

---

## 3. Nguồn và cách lấy

### 3.1 爱丽丝书屋 (alicesw.org / alicesw.com)

- **Trang truyện**: `https://alicesw.org/novel/{id}.html`
- **Trang chương**: `https://alicesw.org/other/chapters/id/{id}.html`
- **Trích xuất**:
  - 文案/简介: từ `content简介` hoặc `内容简介` trong trang truyện
  - Danh sách chương: từ trang chapters, mỗi mục có link `alicesw.org/book/{book_id}/{chapter_id}.html`
  - Nội dung chương: fetch từ trang chapter, lấy nội dung trong `id="bookcontent"` hoặc `class="bookcontent"`

### 3.2 xyushuwu4 (m.xyushuwu4.com)

- **Trang chương**: `{BASE}/{chapter_id}.html`
- **Trích xuất**: từ `id="novelcontent"` hoặc `class="novelcontent"`
- **Encoding**: thường dùng GBK/GB18030

### 3.3 海棠搜书 (haitangsoshu.org)

- **Trang truyện**: `https://www.haitangsoshu.org/book/{id}/`
- **Catalog**: `https://www.haitangsoshu.org/book/{id}/catalog/`
- **Lưu ý**: Có thể khóa chương (猪猪) — cần kiểm tra trước khi lấy

### 3.4 新御书屋 (u9mm.com)

- **Trang truyện**: `https://www.u9mm.com/read/{id}/`
- **Catalog**: thường trong trang truyện hoặc `/novel/list/{id}/`

---

## 4. Quy trình thực hiện

1. **Phân tích link**: Xác định nền tảng (alicesw, xyushuwu4, haitangsoshu, u9mm…)
2. **Lấy thông tin truyện**: Tên, tác giả, văn án, số chương, link
3. **Lấy danh sách chương**: Từ trang catalog/chapters
4. **Lấy nội dung từng chương**: Fetch từng URL, trích nội dung
5. **Đặt tên file**: Dịch tên → Viết liền, viết hoa chữ cái đầu + TQ
6. **Ghi file**: Xuất theo cấu trúc mục 2

---

## 5. Xử lý lỗi

- **Chương không lấy được**: Ghi `[Lỗi khi lấy: {e}]` hoặc `[Nội dung chưa lấy được - {url}]`
- **Encoding**: Thử `gbk`, `gb18030`, `utf-8` khi decode HTML
- **Chương bị khóa**: Bỏ qua hoặc ghi `[Chương bị khóa]` nếu không truy cập được

---

## 6. Bảng dịch tên thường gặp (tham khảo)

| 中文 | Tên file (phần trước TQ) |
|------|---------------------------|
| 一滴都不许漏 | MotGiotCungKhongDuocRoi |
| 处女调教部 | BoDieuGiaoXuNu |
| 回春阁 | HoiXuanCac |
| 淫束道具专家 | ChuyenGiaDaoCuDucThuc |
| 女奴宣言 | TuyenNgonNuNo |
| 催眠带来的性福生活 | CuocSongHanhPhucTuThoiMien |

---

## 7. Lưu ý

- File xuất ra là **chỉ văn bản tiếng Trung** (nguyên tác), không dịch sang tiếng Việt trong bước này
- Nếu sau đó cần dịch, dùng skill `translate-chinese-novel-to-vietnamese` với file `*TQ.md` làm input
