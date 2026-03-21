# Hướng dẫn chạy chương trình lấy truyện (m.xyushuwu4.com)

## Yêu cầu

- **JDK 11** trở lên
- **Maven** (hoặc dùng Maven wrapper / IntelliJ tích hợp)
- Mạng để truy cập https://m.xyushuwu4.com

## Chạy trong IntelliJ IDEA

1. **Mở project**: File → Open → chọn thư mục **GetNovel** (chứa `pom.xml`).
2. **Đợi Maven import**: IntelliJ sẽ nhận diện Maven và tải dependency (Jsoup).
3. **Chạy**:
   - Mở file `src/main/java/com/novel/LayTruyenFromLink.java`
   - Chuột phải vào class hoặc vào `main` → **Run 'LayTruyenFromLink.main()'**
4. **Nhập link** khi chương trình hỏi, ví dụ:
   ```
   https://m.xyushuwu4.com/book/33338/?_d_id=55ec740bdb21e28b1709199c782e5b
   ```
5. File kết quả sẽ được ghi trong thư mục **GetNovel**, tên dạng `{TênAnToàn}TQ.md` (theo quy tắc trong `.cursor/skills/lay-truyen-tu-link/SKILL.md`).
6. Sau mỗi chương, chương trình **in log ra màn hình** (thành công / thất bại, số ký tự, đường dẫn file).
7. Thêm file báo cáo **`{TênAnToàn}TQ-report.md`**: bảng số ký tự từng chương, tổng hợp thành công/thất bại.

## Chạy bằng dòng lệnh

```bash
cd GetNovel
mvn compile exec:java -Dexec.args="https://m.xyushuwu4.com/book/33338/"
```

Hoặc nhập link khi chạy (không truyền tham số):

```bash
cd GetNovel
mvn compile exec:java
# Sau đó nhập link khi được hỏi
```

## Tham số (tùy chọn)

- **Tham số 1**: Link bộ truyện (bắt buộc nếu không nhập tay).
- **Tham số 2**: Tên file output (không có `.md`). Nếu bỏ qua, tên file sẽ được tạo từ tên truyện.

Ví dụ tên file theo SKILL: `ChuMonTuHoTQ.md` (tên dịch tiếng Việt, viết liền, hoa chữ cái đầu + `TQ`).

## Cấu trúc file xuất ra

Theo đúng quy tắc trong **lay-truyen-tu-link** SKILL:

- Tiêu đề: `# {Tên gốc tiếng Trung}`
- Nguồn: `> 来源: {link}`
- Phần **内容简介**: thể loại, số chương, văn án/giới thiệu
- Các chương: `## 第N章 {tiêu đề}` + nội dung chương

File là văn bản tiếng Trung nguyên tác, không dịch sang tiếng Việt trong bước này.

## Log và báo cáo

- **Console:** mỗi chương một dòng, ví dụ: `[Chương 1] THÀNH CÔNG — đã ghi nội dung chương vào file: ... (12345 ký tự)` hoặc `THẤT BẠI` kèm lý do.
- **`*TQ-report.md`:** thời gian chạy, link nguồn, tổng chương thành công, tổng ký tự, bảng chi tiết (chương, tiêu đề, trạng thái, số ký tự, URL).
