package com.novel;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Chương trình lấy truyện từ link m.xyushuwu4.com và xuất file .md theo quy tắc SKILL (lay-truyen-tu-link).
 * Chạy trong IntelliJ: Run 'LayTruyenFromLink', nhập link bộ truyện khi được hỏi.
 */
public class LayTruyenFromLink {

    private static final String BASE = "https://m.xyushuwu4.com";
    private static final int CONNECT_TIMEOUT_MS = 15_000;
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    /** Watermark / obfuscated URL spam chèn vào nội dung hoặc tiêu đề chương (site mirror). */
    private static final Pattern RE_EXCLUSIVE_PUBLISH_BLOCK = Pattern.compile("\\(独家发表，[^/]*/\\d+\\)");
    private static final Pattern RE_ASCII_DOMAIN_IN_PARENS = Pattern.compile(
            "\\([a-zA-Z0-9][a-zA-Z0-9.-]{0,100}\\.[a-zA-Z]{2,24}(/[^\\s)]*)?\\)");
    /**
     * Đoạn dạng obfuscated.host(yushuwum.com): hai cụm ngắn ngăn bởi dấu chấm ASCII + khoảng trắng + (domain Latin).
     * Giới hạn độ dài để tránh khớp nhầm đoạn văn tiếng Trung dài rồi URL.
     */
    private static final Pattern RE_DOT_OBFUSCATED_THEN_PAREN_ASCII_DOMAIN = Pattern.compile(
            "(?U)[^\\s(　]{1,60}\\.[^\\s(　]{1,60}\\s*\\([a-zA-Z0-9][a-zA-Z0-9.-]+\\.[a-zA-Z]{2,24}(/[^\\s)]*)?\\)");
    /** Tiêu đề chương / đầu dòng: tiền tố homoglyph kiểu Ⅾ@ℕмèǐα.čом */
    private static final Pattern RE_CHAPTER_HEAD_HOMOGLYPH = Pattern.compile(
            "^(?U)[\\s　]*Ⅾ@ℕмè[ǐiιı]α\\.čом\\s*", Pattern.MULTILINE);
    private static final Pattern RE_CHAPTER_HEAD_HOMOGLYPH2 = Pattern.compile(
            "^(?U)[\\s　]*Ⅾ@ℕмèια\\.čом\\s*", Pattern.MULTILINE);

    private static final Charset[] ENCODINGS = {
            Charset.forName("GBK"),
            Charset.forName("GB18030"),
            StandardCharsets.UTF_8
    };

    public static void main(String[] args) throws IOException {
        String bookUrl = args.length > 0 ? args[0] : readLine("Nhập link bộ truyện (vd: https://m.xyushuwu4.com/book/33338/): ");
        if (bookUrl == null || bookUrl.isBlank()) {
            System.err.println("Link không được để trống.");
            return;
        }
        bookUrl = bookUrl.trim().split("\\?")[0];
        if (!bookUrl.endsWith("/")) bookUrl += "/";

        String outputFileName = args.length > 1 ? args[1] : null; // Tùy chọn: tên file output (không có .md)

        try {
            run(bookUrl, outputFileName);
        } catch (Exception e) {
            System.err.println("Lỗi: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static String readLine(String prompt) {
        System.out.print(prompt);
        try {
            return new java.io.BufferedReader(new java.io.InputStreamReader(System.in, StandardCharsets.UTF_8)).readLine();
        } catch (IOException e) {
            return "";
        }
    }

    private static void run(String bookUrl, String outputFileName) throws IOException {
        // 1. Parse book ID
        Matcher m = Pattern.compile("book/(\\d+)").matcher(bookUrl);
        if (!m.find()) {
            throw new IllegalArgumentException("Link không hợp lệ. Cần dạng: " + BASE + "/book/33338/");
        }
        int bookId = Integer.parseInt(m.group(1));
        int pathPrefix = bookId / 1000;
        String catalogBase = BASE + "/" + pathPrefix + "/" + bookId + "/";

        System.out.println("Đang lấy thông tin sách: " + bookUrl);

        // 2. Fetch book page
        Document bookDoc = fetchDocument(bookUrl);
        String title = extractText(bookDoc, "h3");
        if (title == null || title.isEmpty()) title = extractText(bookDoc, "h1");
        if (title == null || title.isEmpty()) title = "未知";

        String author = "";
        Elements authorLinks = bookDoc.select("a[href*=/author/]");
        if (!authorLinks.isEmpty()) author = authorLinks.first().text().trim();

        String category = "";
        for (Element e : bookDoc.select("p, div, span")) {
            String t = e.text();
            if (t != null && t.startsWith("类型：")) {
                category = t.replaceFirst("类型：", "").trim();
                break;
            }
        }

        String intro = "";
        for (Element e : bookDoc.select("p, div")) {
            String t = e.ownText();
            if (t != null && (t.contains("简介") || t.contains("本书简介"))) continue;
            if (t != null && t.length() > 20 && !t.contains("作者") && !t.contains("类型")) {
                intro = t.trim();
                break;
            }
        }
        if (intro.isEmpty()) {
            Element introBlock = bookDoc.selectFirst(".intro, .description, [class*=intro], [class*=desc]");
            if (introBlock != null) intro = introBlock.text().trim();
        }
        if (intro.isEmpty()) {
            String full = bookDoc.text();
            int idx = full.indexOf("本书简介");
            if (idx >= 0) {
                int start = full.indexOf("金陵", idx);
                if (start < 0) start = idx + "本书简介".length();
                int end = full.indexOf("最新章节", start);
                if (end < 0) end = full.indexOf("从头阅读", start);
                if (end < 0) end = full.length();
                intro = full.substring(start, Math.min(end, start + 500)).trim();
            }
        }

        String updateTime = "";
        for (Element e : bookDoc.select("p, div, span")) {
            String t = e.text();
            if (t != null && t.startsWith("更新时间：")) {
                updateTime = t.replaceFirst("更新时间：", "").trim();
                break;
            }
        }

        // 3. Lấy danh sách chương (正序 = thứ tự từ chương 1)
        List<ChapterRef> chapters = collectChapters(catalogBase, pathPrefix, bookId);
        System.out.println("Tìm thấy " + chapters.size() + " chương.");

        // 4. Tên file: theo SKILL = TênDịchTiếngViệt + TQ.md (nếu không truyền thì dùng tên an toàn từ title)
        String safeName = outputFileName != null && !outputFileName.isBlank()
                ? sanitizeFileName(outputFileName)
                : toSafeFileName(title);
        String outPath = safeName + "TQ.md";
        Path filePath = Path.of(outPath).toAbsolutePath().normalize();
        String reportPath = safeName + "TQ-report.md";
        Path reportFilePath = Path.of(reportPath).toAbsolutePath().normalize();

        List<ChapterReportRow> reportRows = new ArrayList<>();

        // 5. Ghi file theo cấu trúc SKILL
        try (PrintWriter w = new PrintWriter(new OutputStreamWriter(Files.newOutputStream(filePath), StandardCharsets.UTF_8))) {
            w.println("# " + title);
            w.println();
            w.println("> 来源: " + bookUrl);
            w.println();
            w.println("---");
            w.println();
            w.println("## 内容简介");
            w.println();
            w.println(title);
            w.println();
            w.println("类别：" + category);
            w.println("字数：（网站未提供）");
            w.println("章节：" + chapters.size());
            w.println("状态：" + (updateTime.isEmpty() ? "未知" : "连载中/完本"));
            w.println();
            w.println("### 内容简介");
            w.println();
            w.println(intro.isEmpty() ? "（暂无）" : intro);
            w.println();
            w.println("---");
            w.println();

            int chapterIndex = 1;
            for (ChapterRef ch : chapters) {
                ChapterFetchResult fetch = fetchChapterContentDetailed(ch.url);
                String content = fetch.content;
                int charCount = fetch.contentCharCount;

                w.println("## 第" + chapterIndex + "章 " + sanitizeScrapedText(ch.title.trim()));
                w.println();
                w.println(content);
                w.println();
                w.println("---");
                w.println();
                w.flush();

                reportRows.add(new ChapterReportRow(chapterIndex, ch.title, ch.url, fetch.success, charCount, fetch.failureReason));

                if (fetch.success) {
                    System.out.printf("[Chương %d] THÀNH CÔNG — đã ghi nội dung chương vào file: %s (%d ký tự)%n",
                            chapterIndex, filePath, charCount);
                } else {
                    System.out.printf("[Chương %d] THẤT BẠI — %s — đã ghi placeholder vào file: %s (0 ký tự nội dung thật)%n",
                            chapterIndex, fetch.failureReason != null ? fetch.failureReason : "không rõ", filePath);
                }

                chapterIndex++;
            }
        }

        writeReportMarkdown(reportFilePath, bookUrl, title, author, filePath, chapters.size(), reportRows);

        System.out.println();
        System.out.println("Đã ghi xong truyện: " + filePath);
        System.out.println("Đã ghi xong báo cáo: " + reportFilePath);
    }

    private static void writeReportMarkdown(Path reportPath, String bookUrl, String title, String author,
                                            Path novelPath, int totalChapters, List<ChapterReportRow> rows) throws IOException {
        int ok = 0;
        long sumChars = 0;
        for (ChapterReportRow r : rows) {
            if (r.success) {
                ok++;
                sumChars += r.charCount;
            }
        }
        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        try (PrintWriter r = new PrintWriter(new OutputStreamWriter(Files.newOutputStream(reportPath), StandardCharsets.UTF_8))) {
            r.println("# " + title);
            r.println();
            r.println("## Báo cáo lấy truyện");
            r.println();
            r.println("- **Thời gian:** " + time);
            r.println("- **Tên truyện (中文):** " + title);
            if (author != null && !author.isEmpty()) r.println("- **Tác giả:** " + author);
            r.println("- **Nguồn:** " + bookUrl);
            r.println("- **File truyện:** `" + novelPath + "`");
            r.println("- **Tổng số chương:** " + totalChapters);
            r.println("- **Chương lấy thành công:** " + ok + " / " + totalChapters);
            r.println("- **Tổng số ký tự nội dung (các chương thành công):** " + sumChars);
            r.println();
            r.println("---");
            r.println();
            r.println("## Chi tiết từng chương");
            r.println();
            r.println("| Chương | Tiêu đề | Trạng thái | Số ký tự | URL |");
            r.println("|--------|---------|------------|----------|-----|");
            for (ChapterReportRow row : rows) {
                String status = row.success ? "Thành công" : "Thất bại";
                String reason = row.failureReason != null && !row.failureReason.isEmpty()
                        ? " (" + escapeMdCell(row.failureReason) + ")" : "";
                r.printf("| %d | %s | %s%s | %d | %s |%n",
                        row.index,
                        escapeMdCell(row.chapterTitle),
                        status,
                        reason,
                        row.charCount,
                        row.chapterUrl);
            }
        }
    }

    /** Tránh phá bảng markdown (thay | và xuống dòng). */
    private static String escapeMdCell(String s) {
        if (s == null) return "";
        return s.replace("|", "\\|").replace("\n", " ").replace("\r", "").trim();
    }

    private static String extractText(Document doc, String selector) {
        Element el = doc.selectFirst(selector);
        return el != null ? el.text().trim() : "";
    }

    /**
     * Loại bỏ watermark / URL tẩy chay (Unicode homoglyph, khối 独家发表, (domain.com) sau obfuscated…).
     */
    private static String sanitizeScrapedText(String text) {
        if (text == null || text.isEmpty()) return text;
        String s = text;
        for (int pass = 0; pass < 8; pass++) {
            String next = RE_EXCLUSIVE_PUBLISH_BLOCK.matcher(s).replaceAll("");
            next = RE_DOT_OBFUSCATED_THEN_PAREN_ASCII_DOMAIN.matcher(next).replaceAll("");
            next = RE_ASCII_DOMAIN_IN_PARENS.matcher(next).replaceAll("");
            next = RE_CHAPTER_HEAD_HOMOGLYPH.matcher(next).replaceAll("");
            next = RE_CHAPTER_HEAD_HOMOGLYPH2.matcher(next).replaceAll("");
            next = next.replaceAll("(?U)Ⅾ@ℕмè[ǐiιı]α\\.čом\\s*", "");
            next = next.replaceAll("(?U)Ⅾ@ℕмèια\\.čом\\s*", "");
            if (next.equals(s)) break;
            s = next;
        }
        return normalizeChapterWhitespace(s);
    }

    private static String normalizeChapterWhitespace(String s) {
        if (s == null || s.isEmpty()) return s;
        String[] lines = s.split("\n", -1);
        StringBuilder sb = new StringBuilder();
        for (String line : lines) {
            String t = line.replaceAll("[ \\t\\u00A0]+", " ").trim();
            if (sb.length() > 0) sb.append('\n');
            sb.append(t);
        }
        return sb.toString().replaceAll("\n{3,}", "\n\n").trim();
    }

    private static List<ChapterRef> collectChapters(String catalogBase, int pathPrefix, int bookId) throws IOException {
        Map<String, ChapterRef> ordered = new LinkedHashMap<>();
        int maxPage = 1;
        int page = 1;
        // Trang mục lục: 33/33338_1/, 33/33338_2/, ... (正序)
        while (true) {
            String pageUrl = BASE + "/" + pathPrefix + "/" + bookId + "_" + page + "/";
            Document doc;
            try {
                doc = fetchDocument(pageUrl);
            } catch (IOException e) {
                if (page == 1) throw e;
                break;
            }
            // Lấy tổng số trang từ "第1/31页"
            if (page == 1) {
                Matcher matcher = Pattern.compile("第\\d+/(\\d+)页").matcher(doc.text());
                if (matcher.find()) maxPage = Integer.parseInt(matcher.group(1));
            }
            Elements links = doc.select("a[href*=" + bookId + "/][href$=.html]");
            int added = 0;
            for (Element a : links) {
                String href = a.attr("abs:href");
                if (href == null || href.isEmpty()) href = BASE + a.attr("href").replaceFirst("^/", "");
                String title = a.text().trim();
                if (title.isEmpty() || title.length() > 150) continue;
                ordered.putIfAbsent(href, new ChapterRef(href, title));
                added++;
            }
            if (added == 0 && page > 1) break;
            if (page >= maxPage) break;
            page++;
            if (page > 500) break;
        }

        List<ChapterRef> list = new ArrayList<>(ordered.values());
        Collections.reverse(list); // Trang web xếp mới nhất trước, đảo lại để đọc từ chương 1
        return list;
    }

    private static ChapterFetchResult fetchChapterContentDetailed(String chapterUrl) {
        try {
            Document doc = fetchDocument(chapterUrl);
            Element content = doc.getElementById("novelcontent");
            if (content == null) content = doc.selectFirst(".novelcontent, #content, .content, [id*=content]");
            if (content == null) {
                Element main = doc.selectFirst("main, article, .chapter-content");
                if (main != null) content = main;
            }
            if (content != null) {
                String html = content.html();
                html = html.replaceAll("<br\\s*/?>", "\n");
                String text = sanitizeScrapedText(Jsoup.parse(html).text().trim());
                int n = text.codePointCount(0, text.length());
                return new ChapterFetchResult(true, text, n, null);
            }
            String msg = "Không tìm thấy khối nội dung (novelcontent)";
            return new ChapterFetchResult(false, "[Nội dung chưa lấy được - " + chapterUrl + "]", 0, msg);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return new ChapterFetchResult(false, "[Lỗi khi lấy: " + msg + "]", 0, msg);
        }
    }

    private static Document fetchDocument(String url) throws IOException {
        IOException last = null;
        for (Charset cs : ENCODINGS) {
            try {
                byte[] bytes = Jsoup.connect(url)
                        .userAgent(USER_AGENT)
                        .timeout(CONNECT_TIMEOUT_MS)
                        .ignoreContentType(true)
                        .execute()
                        .bodyAsBytes();
                return Jsoup.parse(new String(bytes, cs), url);
            } catch (IOException e) {
                last = e;
            }
        }
        if (last != null) throw last;
        throw new IOException("Could not fetch " + url);
    }

    private static String sanitizeFileName(String s) {
        return s.replaceAll("[\\\\/:*?\"<>|\\s]+", "").trim();
    }

    private static String toSafeFileName(String chineseTitle) {
        if (chineseTitle == null || chineseTitle.isEmpty()) return "Truyen";
        String s = chineseTitle.replaceAll("[\\\\/:*?\"<>|\\s]+", "").trim();
        return s.isEmpty() ? "Truyen" : s;
    }

    private static class ChapterRef {
        final String url;
        final String title;

        ChapterRef(String url, String title) {
            this.url = url;
            this.title = title;
        }
    }

    private static class ChapterFetchResult {
        final boolean success;
        final String content;
        final int contentCharCount;
        final String failureReason;

        ChapterFetchResult(boolean success, String content, int contentCharCount, String failureReason) {
            this.success = success;
            this.content = content;
            this.contentCharCount = contentCharCount;
            this.failureReason = failureReason;
        }
    }

    private static class ChapterReportRow {
        final int index;
        final String chapterTitle;
        final String chapterUrl;
        final boolean success;
        final int charCount;
        final String failureReason;

        ChapterReportRow(int index, String chapterTitle, String chapterUrl, boolean success, int charCount, String failureReason) {
            this.index = index;
            this.chapterTitle = chapterTitle;
            this.chapterUrl = chapterUrl;
            this.success = success;
            this.charCount = charCount;
            this.failureReason = failureReason;
        }
    }
}
