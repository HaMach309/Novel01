---
name: translate-chinese-novel-to-vietnamese
description: Translates novels from Simplified Chinese to Vietnamese, preserving character names in Hán Việt (Sino-Vietnamese) romanization and original text format. FULL TRANSLATION ONLY – no summarization, no condensation. Sau khi dịch, đoạn văn quá dài (>200 từ) phải được tách tự động tại cuối câu. Ưu tiên lưu đúng định dạng tiếng Việt (hiển thị đúng dấu, không méo chữ). Use when translating Chinese web novels, light novels, or fiction to Vietnamese.
---

# Dịch tiểu thuyết Trung–Việt (giữ tên Hán Việt và format gốc)

## Mục đích

Hướng dẫn dịch văn bản tiểu thuyết từ **tiếng Trung giản thể** sang **tiếng Việt**, đảm bảo:
- **Tên nhân vật**: luôn dùng **phiên âm Hán Việt** (không dùng pinyin hay phiên âm Latin khác).
- **Format**: giữ nguyên cấu trúc văn bản gốc (đoạn văn, xuống dòng, chương, tiêu đề, dialogue).
- **Toàn văn, không tóm tắt**: mọi ý, câu, chi tiết có trong gốc đều phải có trong bản dịch (xem mục riêng bên dưới).
- **Đầu ra**: ưu tiên trả về **chỉ bản dịch tiếng Việt** (không kèm phân tích, checklist, hay ghi chú), trừ khi người dùng yêu cầu.

## Quy ước đầu ra (rất quan trọng)

- **Mặc định**: xuất **toàn bộ nội dung đã dịch sang tiếng Việt**, giữ đúng số đoạn và xuống dòng như bản gốc.
- **Tuyệt đối không để sót bất kỳ ký tự tiếng Trung nào** (kể cả trong ngoặc, chú thích, tiêu đề, lời thoại, tiếng kêu, onomatopoeia…).

### Cấm tóm tắt – bắt buộc dịch toàn bộ (không được vi phạm)

- **Định nghĩa “tóm tắt” (cấm)**: rút gọn, bỏ bớt, gộp nhiều câu/đoạn gốc thành ít câu hơn, thay cả đoạn kể bằng một câu “đại ý”, “sau đó…”, “rồi chuyện xảy ra như sau”, hoặc bỏ qua chi tiết vì cho là thừa, lặp, hoặc vì giới hạn độ dài phản hồi.
- **Bản dịch phải là full translation**: **mỗi** câu, **mỗi** ý kể, **mỗi** mảng tả, **mỗi** lời thoại, **mỗi** độc thoại và suy nghĩ nội tâm nhân vật, **mỗi** dòng phụ (kể cả lời tác giả, cảm ơn độc giả, hướng dẫn vote, chú thích cuối chương) trong phạm vi văn bản gốc được giao — đều phải có **bản tiếng Việt tương ứng**, không được thay bằng tóm lược.
- **Thứ tự và sự kiện**: giữ đúng trình tự gốc; không nhảy cóc, không gom nhiều sự kiện thành một câu tổng hợp nếu gốc tách riêng.
- **Số lượng & chi tiết cụ thể**: số tiền, số người, tên đồ vật, so sánh, lặp lại có chủ đích trong gốc — đều phải còn trong bản dịch, không được lược vì “dài”.
- **Được phép “cô đọng” chỉ ở mức câu tiếng Việt**: gọn hơn về ngữ pháp tiếng Việt **miễn là không làm mất** bất kỳ sự kiện, hình ảnh, cảm xúc, lời nói hay thông tin nào so với gốc. Việt hóa tự nhiên ≠ rút nội dung.
- **Cấm các kiểu diễn đạt thay thế tóm tắt**: “đại ý là…”, “tóm lại…”, “nói chung…”, “có thể hiểu rằng…”, “phần sau kể về việc…”, “(lược bỏ đoạn…)”, “(bỏ qua chi tiết)”.
- **Cấm** dùng bản dịch ngắn hơn gốc một cách **bất thường** (ví dụ nửa chương gốc thành vài câu). Nếu nghi ngờ đã rút gọn: **đối chiếu lại từng khối** với bản gốc trước khi xuất bản.
- **DỊCH ĐỦ VĂN BẢN GỐC** (nhắc lại): mỗi câu, mỗi đoạn, mỗi lời thoại trong bản gốc phải có bản dịch tương ứng; tổng độ dài nội dung dịch phải **tương xứng** với gốc (không được ngắn bất thường).
- **Không thêm phần "Giải thích/Phân tích/Checklist"** trước hoặc sau bản dịch.
- **Không lặp lại nguyên văn tiếng Trung** trong phần trả lời, trừ khi người dùng yêu cầu "song ngữ" hoặc cần đối chiếu.
- Nếu người dùng đưa nhiều chương/đoạn: dịch **đầy đủ theo đúng thứ tự**, không lược bỏ — **không** chỉ dịch “đoạn đầu” rồi tóm phần còn lại.

## Quy tắc chính

### 1. Tên nhân vật – Hán Việt

- Mỗi tên Trung Quốc (2–4 chữ thường gặp) phải được chuyển sang **đọc Hán Việt** tương ứng.
- **Không** dùng: pinyin (Vương Tiểu Minh), bính âm, hay phiên âm kiểu Latin (Wang Xiaoming).
- **Dùng**: Hán Việt chuẩn (Vương Tiểu Minh → nếu gốc là 王小明 thì ra bản dịch chỉ còn "Vương Tiểu Minh", không giữ lại Hán tự; 李华 → Lý Hoa; 张伟 → Trương Vĩ).
- Nếu người dùng đã cung cấp bảng tên nhân vật (Hán ↔ Hán Việt), ưu tiên dùng bảng đó để nhất quán.
- Tên hiếm hoặc không chắc: tra từ điển Hán–Việt hoặc quy ước Hán Việt phổ biến; có thể thêm chú thích lần đầu xuất hiện nếu cần, **nhưng chú thích cũng phải hoàn toàn bằng tiếng Việt, không chứa Hán tự**.

### 2. Giữ nguyên format văn bản gốc

- **Đoạn văn**:
  - Mỗi đoạn trong bản gốc tương ứng một đoạn trong bản dịch; không gộp hoặc tách tùy tiện.
  - **Tách đoạn khi quá dài (bắt buộc)**: nếu đoạn dịch ra dài hơn **khoảng 200 từ**, phải tách thành nhiều đoạn nhỏ hơn.
    - **Vị trí tách**: luôn tách **tại cuối câu** (sau dấu chấm, chấm than, chấm hỏi, hai chấm…), không cắt giữa câu.
    - **Mục tiêu**: mỗi đoạn sau khi tách khoảng 150–200 từ; tránh đoạn dài lê thê > 250 từ.
    - **Ưu tiên**: tách tại chỗ nghỉ tự nhiên (hết câu kể, hết ý nhỏ) để mạch văn không bị gãy.
  - Mục tiêu tổng thể: các đoạn văn có độ dài cân đối, dễ đọc, không có đoạn nào quá dài so với trung bình.
- **Xuống dòng / ngắt dòng**: giữ đúng vị trí (ví dụ: mỗi lời thoại một dòng thì bản dịch cũng một dòng một thoại).
- **Lời thoại (dialogue)** – bắt buộc:
  - **Dấu ngoặc kép**: toàn bộ nội dung mỗi lượt lời thoại phải được **bao trong dấu ngoặc kép** `"..."` (dấu `"` mở và `"` đóng; có thể dùng kiểu typographic **“...”** nhưng **nhất quán** trong cả bản dịch). Không dùng gạch đầu dòng `—` thay cho ngoặc kép trừ khi người dùng yêu cầu format khác.
  - **Dòng trống trước và sau mỗi lượt thoại**:
    - **Trước** lời thoại: luôn có **một dòng trống** (xuống dòng sau phần tường thuật hoặc sau lượt thoại trước đó), rồi mới đến dòng chứa câu thoại trong ngoặc kép.
    - **Sau** lời thoại: kết thúc bằng dấu đóng ngoặc kép và xuống dòng, rồi **một dòng trống** nữa rồi mới viết tiếp tường thuật hoặc lượt thoại tiếp theo.
  - Mỗi lượt thoại (một nhân vật nói một lần, hoặc một câu độc thoại) là **một dòng** (hoặc nhiều dòng nếu thoại dài xuống dòng đúng quy định truyện), nhưng vẫn nằm trong cùng một cặp ngoặc kép; không dính lời thoại trên cùng một dòng với lời dẫn trước/sau.
- **Chương, hồi, quyển**: giữ cấu trúc. Mặc định chuẩn hóa:
  - `第N章` → `Chương N`
  - `第N回` → `Hồi N`
  - `第N卷` → `Quyển N`
  - Chữ số Trung (一, 二, 三…) → số Ả Rập (1, 2, 3…) trừ khi người dùng muốn giữ Hán số.
- **Tiêu đề chương**: dịch nội dung, giữ style (in đậm, in nghiêng) nếu bản gốc có.
- **Dấu câu**: dùng quy chuẩn tiếng Việt; **lời thoại** luôn đặt dấu câu (chấm, hỏi, than…) **bên trong** cặp ngoặc kép thoại; không thay đổi cấu trúc câu một cách không cần thiết.

### 3. Phong cách dịch

- **Văn phong cổ trang (mặc định)**: ưu tiên giọng văn cổ trang/kiếm hiệp/tiên hiệp; dùng xưng hô, kính ngữ và từ ngữ mang sắc thái cổ phong; tránh văn nói hiện đại (kiểu "ok", "đỉnh", "ủa", "thật sự luôn", "bạn/ tôi" thân mật đời thường…) trừ khi bối cảnh hiện đại.
- **Tự nhiên**: câu tiếng Việt mạch lạc, giàu nhịp điệu; tránh "dịch word-by-word" cứng nhắc.
- **Thể loại**: tùy thể loại (kiếm hiệp, tiên hiệp, ngôn tình, đô thị…) điều chỉnh từ vựng và giọng điệu, nhưng nếu là cổ trang thì luôn giữ "cổ phong" xuyên suốt.
- **Thành ngữ / điển cố**: ưu tiên dịch nghĩa sang tiếng Việt tương đương; nếu giữ Hán Việt (điển cố) thì có thể chú thích ngắn lần đầu.
- **Thuật ngữ đặc thù** (tu luyện, cảnh giới, pháp bảo…): giữ thuật ngữ đã quen dùng trong cộng đồng dịch Việt hoặc thống nhất trong bảng thuật ngữ nếu có.

#### 3.1 Quy ước xưng hô cổ trang (ưu tiên theo ngữ cảnh)

- **Ngôi thứ nhất**:
  - Tự xưng trang trọng/nam: "ta", "bản tọa", "bản quân", "bổn vương" (khi là vương gia), "trẫm" (khi là hoàng đế)
  - Tự xưng nữ/phi tần: "bổn cung"
  - Tự xưng cung kính: "tiểu nhân", "tại hạ", "vãn bối", "đệ tử", "nô tài" (tùy thân phận)
- **Ngôi thứ hai**:
  - Gọi bề trên: "ngài", "đại nhân", "sư phụ", "sư tôn", "bệ hạ", "điện hạ", "vương gia"
  - Gọi ngang hàng/khinh miệt: "ngươi", "các ngươi", "hắn/ả" (tùy thái độ)
- **Đại từ thường gặp trong Trung văn**:
  - `你/您` → "ngươi/ngài" (dựa vào kính ngữ)
  - `我` → "ta/tại hạ/tiểu nhân/đệ tử/…" (dựa vào thân phận)
  - `他/她` → "hắn/ả/nàng" (nữ thường ưu tiên "nàng" nếu hợp giọng cổ phong)
  - `我们` → "chúng ta/bọn ta"
- **Nguyên tắc chọn xưng hô**:
  - Ưu tiên **thân phận + quan hệ + sắc thái** (kính/cợt/giận) hơn là cố định một cặp "tôi/bạn".
  - Khi thoại qua lại, cố giữ cặp xưng hô nhất quán trong một cảnh; đổi xưng hô chỉ khi có dụng ý (tỏ kính, trở mặt, trêu chọc…).

#### 3.2 Từ ngữ cổ phong nên ưu tiên (khi phù hợp)

- **Hư từ/nhịp câu**: "chẳng", "hẵng", "ắt hẳn", "há", "nào dám", "chỉ e", "bèn", "liền", "đành", "vả lại"
- **Động tác/thái độ**: "khẽ", "nhíu mày", "lạnh nhạt", "trầm giọng", "cười nhạt", "phất tay áo"
- **Gọi người/đối tượng**: "các hạ", "huynh/đệ", "tỷ/muội", "công tử", "cô nương", "lão gia", "phu nhân"

#### 3.3 Tránh hiện đại hóa trái bối cảnh

- Tránh các từ hiện đại khi bối cảnh cổ trang: "thanh toán", "tài khoản", "app", "đăng nhập", "deal", "deadline", "chill", "stress", "idol", "fan"… (trừ khi truyện cố ý xuyên không/hiện đại).

## Quy trình khi dịch

1. **Đọc qua** đoạn/chương gốc để nắm ngữ cảnh và nhân vật.
2. **Xác định tên riêng** (người, địa danh, tông phái…) và liệt kê phiên âm Hán Việt sẽ dùng; nếu có bảng tên sẵn thì áp dụng.
3. **Dịch từng đoạn** theo đúng thứ tự và format (đoạn, dòng, chương).
4. **Kiểm tra “dịch đủ nội dung — không tóm tắt”** (bắt buộc, làm ngay sau khi dịch xong):
   - **Đối chiếu theo cấu trúc**: mỗi đoạn/khối nội dung trong bản gốc phải có một đoạn/khối tương ứng trong bản dịch (không được thiếu đoạn, thiếu lời thoại, thiếu tiêu đề).
   - **Đếm/quét theo trục thời gian văn bản**: lướt song song gốc và dịch; mỗi lần gốc có câu mới (kể, thoại, tả) thì bản dịch phải có câu tương ứng — không được “nhảy cóc” một khúc dài.
   - **Rà soát các “điểm hay bị rơi”**: tiêu đề chương/hồi, phụ đề, lời thoại ngắn, câu cảm thán/tiếng kêu, nội dung trong ngoặc, chú thích, ký hiệu phân cách cảnh (`——`, `***`, `……`), thơ/ca từ, lời tác giả cuối chương.
   - **Dấu hiệu tóm tắt — bắt buộc sửa trước khi nộp**: bản dịch ngắn bất thường so với gốc; nhiều câu gốc bị gộp thành một câu tổng kết; thiếu hẳn một đoạn hoặc một lượt thoại; xuất hiện “đại ý là…/tóm lại…/nói chung…/sau đó… (mơ hồ thay cho chi tiết gốc)”; tự thêm suy luận hoặc kết luận không có trong gốc.
5. **Tách đoạn nếu quá dài** (bắt buộc): rà soát từng đoạn; nếu đoạn > ~200 từ thì tách tại cuối câu thành nhiều đoạn nhỏ hơn (mục 2). **Lưu ý**: tách đoạn chỉ để dễ đọc, **không** được dùng như cơ hội bỏ bớt câu gốc.
6. **Chỉ khi đã đạt kiểm tra trên** (đặc biệt là mục 4) mới xuất bản dịch làm đầu ra.

### 7. Lưu kết quả – đúng định dạng tiếng Việt (ưu tiên)

- **Mục tiêu**: Bản dịch khi lưu ra file phải **hiển thị đúng tiếng Việt có dấu**, không bị méo chữ, lỗi ký tự (?, �, dính chữ…).
- **Cách thực hiện**: Chọn phương thức lưu đảm bảo định dạng tiếng Việt được giữ nguyên (encoding hỗ trợ đầy đủ ký tự tiếng Việt).
- **Tránh**: Lưu bằng ASCII, ANSI hay encoding không hỗ trợ dấu tiếng Việt – sẽ làm lỗi hiển thị.

## Ví dụ nhanh

**Gốc (giản thể):**
```
第一章 开始
李明看着窗外，心想：张伟今天会来吗？
```

**Dịch (đúng, chỉ bản dịch):**
```
Chương 1  Bắt đầu

Lý Minh nhìn ra ngoài cửa sổ, trong lòng nghĩ:

"Hôm nay Trương Vĩ có đến không?"

```

**Tránh:**
- Dùng "Li Ming", "Zhang Wei" (pinyin) hoặc "Wang Xiaoming" thay cho Hán Việt.
- Gộp hai câu thành một đoạn dài không có xuống dòng như bản gốc.
- Đổi cấu trúc chương (ví dụ bỏ tiêu đề chương).
- **Mọi hình thức tóm tắt hoặc rút gọn nội dung gốc**: bản dịch phải **đủ** so với gốc về số lượng ý/câu/chi tiết; không lược bỏ, không thay bằng câu tổng quát, không “kể lại ngắn”.

## Checklist kiểm tra (trước khi coi là xong)

- [ ] Mọi tên nhân vật (và địa danh/tông phái nếu áp dụng) đã chuyển sang Hán Việt.
- [ ] Số đoạn, xuống dòng, chương/hồi giống bản gốc.
- [ ] Đoạn văn quá dài (>200 từ) đã được tách tại cuối câu thành nhiều đoạn nhỏ hơn.
- [ ] Mỗi lời thoại bọc trong `"..."` (hoặc “...” nhất quán), có **dòng trống** trước và sau mỗi lượt thoại.
- [ ] Tiêu đề chương đã dịch và giữ style.
- [ ] **Không tóm tắt**: đã đối chiếu gốc–dịch; không thiếu đoạn/câu/thoại; không gộp nhiều câu gốc thành một câu tổng kết; không có “đại ý/tóm lại/nói chung” thay cho văn gốc; độ dài và mật độ nội dung tương xứng bản gốc.
- [ ] Đã rà các phần dễ sót (ngoặc, chú thích, tiếng kêu, ký hiệu phân cảnh, thơ/ca từ).
- [ ] Câu tiếng Việt tự nhiên, đúng thể loại và xưng hô.
- [ ] File kết quả được lưu **đúng định dạng tiếng Việt** (hiển thị đúng dấu, không méo chữ).
