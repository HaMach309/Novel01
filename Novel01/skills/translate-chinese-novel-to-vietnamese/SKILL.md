---
name: translate-chinese-novel-to-vietnamese
description: Translates novels from Simplified Chinese to Vietnamese, preserving character names in Hán Việt (Sino-Vietnamese) romanization and original text format. Use when translating Chinese web novels, light novels, or fiction to Vietnamese, or when the user asks for Chinese-to-Vietnamese novel translation with Hán Việt names.
---

# Dịch tiểu thuyết Trung–Việt (giữ tên Hán Việt và format gốc)

## Mục đích

Hướng dẫn dịch văn bản tiểu thuyết từ **tiếng Trung giản thể** sang **tiếng Việt**, đảm bảo:
- **Tên nhân vật**: luôn dùng **phiên âm Hán Việt** (không dùng pinyin hay phiên âm Latin khác).
- **Format**: giữ nguyên cấu trúc văn bản gốc (đoạn văn, xuống dòng, chương, tiêu đề, dialogue).
- **Đầu ra**: ưu tiên trả về **chỉ bản dịch tiếng Việt** (không kèm phân tích, checklist, hay ghi chú), trừ khi người dùng yêu cầu.

## Quy ước đầu ra (rất quan trọng)

- **Mặc định**: xuất **toàn bộ nội dung đã dịch sang tiếng Việt**, giữ đúng số đoạn và xuống dòng như bản gốc.
- **Tuyệt đối không để sót bất kỳ ký tự tiếng Trung nào** (kể cả trong ngoặc, chú thích, tiêu đề, lời thoại, tiếng kêu, onomatopoeia…).
- **Không thêm phần "Giải thích/Phân tích/Checklist"** trước hoặc sau bản dịch.
- **Không lặp lại nguyên văn tiếng Trung** trong phần trả lời, trừ khi người dùng yêu cầu "song ngữ" hoặc cần đối chiếu.
- Nếu người dùng đưa nhiều chương/đoạn: dịch **đầy đủ theo đúng thứ tự**, không lược bỏ.

## Quy tắc chính

### 1. Tên nhân vật – Hán Việt

- Mỗi tên Trung Quốc (2–4 chữ thường gặp) phải được chuyển sang **đọc Hán Việt** tương ứng.
- **Không** dùng: pinyin (Vương Tiểu Minh), bính âm, hay phiên âm kiểu Latin (Wang Xiaoming).
- **Dùng**: Hán Việt chuẩn (Vương Tiểu Minh → nếu gốc là 王小明 thì ra bản dịch chỉ còn "Vương Tiểu Minh", không giữ lại Hán tự; 李华 → Lý Hoa; 张伟 → Trương Vĩ).
- Nếu người dùng đã cung cấp bảng tên nhân vật (Hán ↔ Hán Việt), ưu tiên dùng bảng đó để nhất quán.
- Tên hiếm hoặc không chắc: tra từ điển Hán–Việt hoặc quy ước Hán Việt phổ biến; có thể thêm chú thích lần đầu xuất hiện nếu cần, **nhưng chú thích cũng phải hoàn toàn bằng tiếng Việt, không chứa Hán tự**.

### 2. Giữ nguyên format văn bản gốc

- **Đoạn văn**: mỗi đoạn trong bản gốc tương ứng một đoạn trong bản dịch; không gộp hoặc tách tùy tiện.
- **Xuống dòng / ngắt dòng**: giữ đúng vị trí (ví dụ: mỗi lời thoại một dòng thì bản dịch cũng một dòng một thoại).
- **Lời thoại (dialogue)** – bắt buộc:
  - **Trước mỗi lời thoại**: luôn xuống dòng (mỗi lời thoại bắt đầu ở một dòng mới).
  - **Sau mỗi lời thoại**: luôn xuống dòng (hết lời thoại thì xuống dòng rồi mới viết tiếp phần tường thuật/người nói khác).
  - Không dính lời thoại với đoạn văn kể trước hoặc sau trên cùng một dòng; mỗi lượt trích lời thoại là một dòng riêng, trước và sau đều có ngắt dòng.
- **Chương, hồi, quyển**: giữ cấu trúc. Mặc định chuẩn hóa:
  - `第N章` → `Chương N`
  - `第N回` → `Hồi N`
  - `第N卷` → `Quyển N`
  - Chữ số Trung (一, 二, 三…) → số Ả Rập (1, 2, 3…) trừ khi người dùng muốn giữ Hán số.
- **Tiêu đề chương**: dịch nội dung, giữ style (in đậm, in nghiêng) nếu bản gốc có.
- **Dấu câu**: dùng quy chuẩn tiếng Việt (dấu câu đặt trong ngoặc kép khi cần); không thay đổi cấu trúc câu một cách không cần thiết.

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
4. **Đối chiếu** bản dịch với bản gốc để đảm bảo không bỏ sót câu/đoạn và format khớp.

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

— Hôm nay Trương Vĩ có đến không?
```

**Tránh:**
- Dùng "Li Ming", "Zhang Wei" (pinyin) hoặc "Wang Xiaoming" thay cho Hán Việt.
- Gộp hai câu thành một đoạn dài không có xuống dòng như bản gốc.
- Đổi cấu trúc chương (ví dụ bỏ tiêu đề chương).

## Tóm tắt checklist

- [ ] Mọi tên nhân vật (và địa danh/tông phái nếu áp dụng) đã chuyển sang Hán Việt.
- [ ] Số đoạn, xuống dòng, chương/hồi giống bản gốc.
- [ ] Mỗi lời thoại xuống dòng trước và sau (một dòng riêng cho mỗi lượt trích lời thoại).
- [ ] Tiêu đề chương đã dịch và giữ style.
- [ ] Câu tiếng Việt tự nhiên, đúng thể loại và xưng hô.
