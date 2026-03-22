---
name: translate-chinese-novel-to-vietnamese
description: Translates novels from Simplified Chinese to Vietnamese, preserving character names in Hán Việt (Sino-Vietnamese) romanization and original text format. FULL TRANSLATION ONLY – no summarization, no condensation. Sau khi dịch, đoạn văn quá dài (>200 từ) phải được tách tự động tại cuối câu. Use when translating Chinese web novels, light novels, or fiction to Vietnamese.
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
- **TUYỆT ĐỐI KHÔNG TÓM TẮT**: bản dịch phải là **dịch đầy đủ (full translation)** 1:1 với văn bản gốc. Cấm: tóm tắt, diễn giải rút gọn, "kể lại", lược bỏ chi tiết, gom nhiều câu thành một câu, thay nội dung bằng kết luận, dùng "đại ý là…", "tóm lại…", "nói chung…".
- **DỊCH ĐỦ VĂN BẢN GỐC**: mỗi câu, mỗi đoạn, mỗi lời thoại trong bản gốc phải có bản dịch tương ứng; độ dài bản dịch phải tương xứng với bản gốc (không được ngắn bất thường).
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

- **Đoạn văn**:
  - Mỗi đoạn trong bản gốc tương ứng một đoạn trong bản dịch; không gộp hoặc tách tùy tiện.
  - **Tách đoạn khi quá dài (bắt buộc)**: nếu đoạn dịch ra dài hơn **khoảng 200 từ**, phải tách thành nhiều đoạn nhỏ hơn.
    - **Vị trí tách**: luôn tách **tại cuối câu** (sau dấu chấm, chấm than, chấm hỏi, hai chấm…), không cắt giữa câu.
    - **Mục tiêu**: mỗi đoạn sau khi tách khoảng 150–200 từ; tránh đoạn dài lê thê > 250 từ.
    - **Ưu tiên**: tách tại chỗ nghỉ tự nhiên (hết câu kể, hết ý nhỏ) để mạch văn không bị gãy.
  - Mục tiêu tổng thể: các đoạn văn có độ dài cân đối, dễ đọc, không có đoạn nào quá dài so với trung bình.
- **Xuống dòng / ngắt dòng**: giữ đúng vị trí (ví dụ: mỗi lời thoại một dòng thì bản dịch cũng một dòng một thoại).
- **Lời thoại (dialogue)** – bắt buộc, xuống dòng trước và sau:
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
- **Tự nhiên**: câu tiếng Việt mạch lạc, giàu nhịp điệu; tránh "dịch word-by-word" cứng nhắc. Chi tiết **thuần Việt, dễ hiểu** ở mục 3.5.
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

#### 3.4 Câu cảm thán: hạn chế «À», ưu tiên «A» / «á» theo ngữ cảnh

- **Không lạm dụng "À"** (có dấu huyền) cho mọi tiếng cảm thán hay hạt từ cuối câu trong gốc (啊, 呀, 哎, 唉, 哇…). "À" dễ nghe giọng **chậm, nhận ra, giải thích**; dùng nhiều sẽ làm thoại đồng điệu, thiếu nhịp kịch.
- **Khi nào giữ "À"**: chợt hiểu, vừa nhớ ra, giọng trầm/dịu, câu kiểu "À, ra là thế / À, ta biết rồi".
- **Ưu tiên "A"** (không dấu thanh): kêu lên bất ngờ, giật mình, đau, sợ, gọi vội, cảm thán mạnh, hoặc tiếng kêu ngắn đầu câu thoại; chọn **A** nếu ngữ cảnh là **vỡ òa / gấp / ồn ào** hơn là suy nghĩ chậm.
- **Ưu tiên "á"** (dấu sắc): tiếng kêu **ngắn, cắt, gấp**, mỉa mai nhẹ, hoặc vần điệu với câu sau (ví dụ nhấn mạnh cuối câu); chọn **á** khi âm hưởng **sắc, gọn**, không phải giọng trầm "À…".
- **Nguyên tắc**: mỗi lượt thoại/cảnh, **đọc thử**: nếu "À" nghe như đang **giảng giải** thay vì **phản ứng cảm xúc**, đổi sang **A** hoặc **á** cho sát tình huống.
- **Tiếng kêu «hà á» → «há á»**: khi dịch các cảm thán/cuối câu kiểu 啊呀、哈呀… ra tiếng Việt mà vô tình thành **hà á** (chữ đầu **huyền**), nếu đó là **tiếng kêu** (không phải từ "hà" có nghĩa như "sao", "gì"…), **chuẩn hóa thành há á** (chữ đầu **sắc**) cho đúng giọng cảm thán; tránh **hà á** trong thoại khi ý là kêu lên.

#### 3.5 Thuần Việt, dễ hiểu: tránh câu «dịch từng chữ» gượng, khó đọc

- **Mục tiêu**: người đọc tiếng Việt **hiểu ngay**, không phải đoán nghĩa sau lớp từ ghép lạ hay câu cú giống Hán ngữ. Giữ **đủ nội dung gốc** nhưng **ưu tiên cách nói tự nhiên** trong cùng thể loại (cổ trang, hiện đại, ngôn tình, v.v.).
- **Đọc lại sau khi dịch**: nếu câu nghe như **máy dịch**, **không biết ai làm gì**, hoặc phải đọc hai lần mới hiểu → **viết lại** (vẫn không được lược bớt ý/ chi tiết trong gốc).
- **Tránh xếp chồng vế ngắn** chỉ bằng dấu phẩy khi tiếng Việt cần **liên kết rõ** (vì, nên, rồi thì, chẳng mấy chốc, trong lúc…), hoặc **tách thành hai câu** nếu một câu nhồi quá nhiều hành động/cảnh. **Không** dùng tách câu để tóm tắt.
- **Tránh calque gây lạ tai**: cụm kiểu *lơ đãng không kìm được*, *… không kìm được* dồn đầu câu trong khi ý là *vô thức / không tự chủ được / bất tri bất giác đã…*; chọn **một** cách diễn đạt thuần Việt sát tình huống thay vì ghép tính từ + phủ định theo văn phong Trung.
- **Động từ + tân ngữ**: đảm bảo **rõ chủ thể** (ai làm gì với ai/cái gì); tránh chuỗi động từ dính nhau không có chỗ dừng thở của câu tiếng Việt.
- **Từ ngữ nhạy cảm / cảnh thân mật**: ưu tiên **cách gọi và động từ** thông dụng trong tiếng Việt ở đúng **độ trần** của truyện (kín đáo hơn hoặc trực tiếp hơn tùy bản gốc), tránh **ghép từ sát Hán** hoặc từ hiếm khiến đoạn khó hiểu hoặc buồn cười ngoài ý muốn; có thể dùng **miêu tả hành động, cảm giác** rõ ràng thay vì một từ gượng.
- **Tính từ/cạnh từ**: tránh dịch sát từng tiếng Trung thành chuỗi tính từ cuối câu khó hiểu; ưu tiên **một cụm nghĩa** tự nhiên (ví dụ *cứng ngầu* → *cứng lên* / *cương cứng* / *cứng đơ* tùy ngữ cảnh, thống nhất trong truyện).

#### 3.6 Hạn chế dấu gạch (–, —, -)

- **Mục tiêu**: văn kể tiếng Việt dễ đọc, tránh nhịp “cắt ngang” do lạm dụng gạch giữa câu (đặc biệt gạch dài **—** kiểu văn xuôi nước ngoài hoặc bản dịch máy).
- **Trong câu tường thuật**: ưu tiên **dấu phẩy**, **chấm** (tách hai vế), **hai chấm**, **chấm lửng** (…), hoặc **viết lại thành hai câu** thay vì dùng gạch để nối ý, chen bổ ngữ, hoặc “đổi chủ đề giữa chừng”.
- **Không** dùng gạch thay cho dấu câu chuẩn khi có thể dùng phẩy/chấm cho đúng chính tả tiếng Việt.
- **Gạch nối `-` (ASCII)**: chỉ giữ khi **bắt buộc** theo cách viết thông dụng: từ ghép quốc tế/tên riêng có quy ước (nếu có), số và đơn vị (ví dụ kiểu `15-20`), hoặc khi người dùng/bản gốc đã thống nhất. Tránh tự thêm gạch nối từ vựng tiếng Việt nếu có thể viết một từ hoặc cụm tự nhiên.
- **Gạch em `—`**: không dùng để đánh dấu lời thoại (thoại dùng **ngoặc kép `"…"`** và xuống dòng trước/sau theo mục 2). Trong tường thuật, chỉ dùng `—` khi thật sự cần ngắt nhịp mạnh và không thể diễn đạt gọn bằng phẩy hoặc chấm; nếu phải dùng, **không** lặp nhiều lần trong cùng một đoạn.
- **Gạch en `–`**: hạn chế tương tự; ưu tiên diễn đạt bằng từ nối (*đến*, *tới*, *từ … đến …*) thay vì `–` giữa số hoặc từ nếu câu vẫn mạch lạc.

## Quy trình khi dịch

1. **Đọc qua** đoạn/chương gốc để nắm ngữ cảnh và nhân vật.
2. **Xác định tên riêng** (người, địa danh, tông phái…) và liệt kê phiên âm Hán Việt sẽ dùng; nếu có bảng tên sẵn thì áp dụng.
3. **Dịch từng đoạn** theo đúng thứ tự và format (đoạn, dòng, chương).
4. **Kiểm tra “dịch đủ nội dung” ngay sau khi dịch** (bắt buộc, để tránh dịch kiểu tóm tắt):
   - **Đối chiếu theo cấu trúc**: mỗi đoạn/khối nội dung trong bản gốc phải có một đoạn/khối tương ứng trong bản dịch (không được thiếu đoạn, thiếu lời thoại, thiếu tiêu đề).
   - **Rà soát các “điểm hay bị rơi”**: tiêu đề chương/hồi, phụ đề, lời thoại ngắn, câu cảm thán/tiếng kêu, nội dung trong ngoặc, chú thích, ký hiệu phân cách cảnh (`——`, `***`, `……`), thơ/ca từ.
   - **Dấu hiệu tóm tắt cần sửa ngay**: bản dịch ngắn bất thường so với gốc, nhiều câu gốc gộp thành 1 câu tổng kết, xuất hiện các câu kiểu “đại ý là…/tóm lại…/nói chung…”, hoặc tự thêm suy luận không có trong gốc.
5. **Tách đoạn nếu quá dài** (bắt buộc): rà soát từng đoạn; nếu đoạn > ~200 từ thì tách tại cuối câu thành nhiều đoạn nhỏ hơn (mục 2).
6. **Thuần Việt** (bắt buộc): đọc lại bản dịch, sửa các câu gượng/khó hiểu theo mục 3.5; đồng thời rà dấu gạch (3.6), thay bằng phẩy, chấm hoặc tách câu khi có thể. **Không** được dùng bước này để rút gọn nội dung gốc.
7. **Chỉ khi đã đạt kiểm tra trên** mới xuất bản dịch làm đầu ra.

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
- **Tóm tắt hoặc rút gọn**: bản dịch phải đủ độ dài, không lược bỏ nội dung gốc.

## Tóm tắt checklist

- [ ] Mọi tên nhân vật (và địa danh/tông phái nếu áp dụng) đã chuyển sang Hán Việt.
- [ ] Số đoạn, xuống dòng, chương/hồi giống bản gốc.
- [ ] Đoạn văn quá dài (>200 từ) đã được tách tại cuối câu thành nhiều đoạn nhỏ hơn.
- [ ] Mỗi lời thoại xuống dòng trước và sau (một dòng riêng cho mỗi lượt trích lời thoại).
- [ ] Tiêu đề chương đã dịch và giữ style.
- [ ] Không có dấu hiệu tóm tắt: không lược bỏ, không “đại ý/tóm lại/nói chung”, không gom đoạn làm ngắn nội dung; độ dài bản dịch tương xứng với bản gốc.
- [ ] Đã rà các phần dễ sót (ngoặc, chú thích, tiếng kêu, ký hiệu phân cảnh, thơ/ca từ).
- [ ] Câu tiếng Việt tự nhiên, đúng thể loại và xưng hô.
- [ ] Đã rà **thuần Việt** (mục 3.5): không câu máy dịch, đủ rõ chủ thể/hành động, không xếp vế ngắt quãng khó đọc khi có thể viết lại mạch lạc, vẫn đủ nội dung gốc.
- [ ] Câu cảm thán: không lạm dụng "À"; đã cân nhắc "A" / "á" theo ngữ cảnh; tiếng kêu **há á** không viết nhầm **hà á** (mục 3.4).
- [ ] Không lạm dụng dấu gạch (–, —, -) trong tường thuật; thoại dùng `"…"` chứ không dùng gạch đầu dòng (mục 3.6).
