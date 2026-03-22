---
name: translate-chinese-novel-to-vietnamese
description: Translates novels from Simplified Chinese to Vietnamese, preserving character names in Hán Việt (Sino-Vietnamese) romanization and original text format. FULL TRANSLATION ONLY – no summarization, no condensation. Sau khi dịch, tách đoạn tường thuật sao cho mỗi đoạn khoảng tối đa 3 câu (và không quá ~200 từ); tách tại cuối câu. Ưu tiên lưu đúng định dạng tiếng Việt (hiển thị đúng dấu, không méo chữ). Use when translating Chinese web novels, light novels, or fiction to Vietnamese.
---

# Dịch tiểu thuyết Trung–Việt (giữ tên Hán Việt và format gốc)

## Mục đích

Hướng dẫn dịch văn bản tiểu thuyết từ **tiếng Trung giản thể** sang **tiếng Việt**, đảm bảo:
- **Tên nhân vật**: luôn dùng **phiên âm Hán Việt** (không dùng pinyin hay phiên âm Latin khác).
- **Format**: giữ **chương, tiêu đề, thứ tự** và quy tắc **lời thoại** như gốc. **Đoạn văn tường thuật** có thể **tách thêm** so với gốc (mục 2) để mỗi đoạn không quá dài, không bỏ nội dung.
- **Toàn văn, không tóm tắt**: mọi ý, câu, chi tiết có trong gốc đều phải có trong bản dịch (xem mục riêng bên dưới).
- **Đầu ra**: ưu tiên trả về **chỉ bản dịch tiếng Việt** (không kèm phân tích, checklist, hay ghi chú), trừ khi người dùng yêu cầu.

## Quy ước đầu ra (rất quan trọng)

- **Mặc định**: xuất **toàn bộ nội dung đã dịch sang tiếng Việt**. **Chương/hồi/quyển** và thứ tự nội dung giữ như gốc. **Đoạn văn**: bản dịch **được phép nhiều đoạn hơn** gốc nếu cần để mỗi đoạn không quá dài (mục 2 — tách sau ~3 câu tường thuật), **không** được dùng tách đoạn để bỏ bớt câu hay nội dung.
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
  - **Không** gộp nhiều đoạn gốc thành một đoạn dịch ngắn (dễ làm mất nhịp hoặc tước nội dung). **Được phép** tách **một** đoạn gốc thành **nhiều** đoạn dịch để dễ đọc, miễn là **đủ câu, đủ ý**, thứ tự không đổi.
  - **Tách đoạn theo số câu (bắt buộc, ưu tiên)**: với **phần tường thuật** (câu kể không nằm trong lời thoại trong ngoặc kép), sau khi dịch xong, **xuống đoạn mới sau mỗi 3 câu** — tức mỗi đoạn tường thuật **tối đa 3 câu** kết thúc bằng dấu câu (`.`, `!`, `?`, `…` tùy câu). **Đếm câu trên bản dịch tiếng Việt**. Câu thứ 4 trở đi của cùng một khối kể → bắt đầu **đoạn mới** (sau dòng trống giữa các đoạn).
    - **Ví dụ**: 7 câu tường thuật liên tiếp → chia thành các đoạn 3 + 3 + 1 câu (hoặc 3 + 2 + 2 nếu tách sớm vì quá dài từ — xem ngay dưới).
  - **Trần độ dài theo từ (bổ sung)**: nếu **3 câu** mà đoạn vẫn **quá dài** (gần hoặc vượt **~200 từ**), **tách sớm hơn** (sau câu thứ 2 hoặc sau câu rất dài), vẫn **chỉ tách tại cuối câu**.
  - **Vị trí tách**: luôn **tại cuối câu** (sau `.` `!` `?` `…`), không cắt giữa câu.
  - **Lời thoại và dòng trống thoại**: **không** chèn tách đoạn **vào giữa** một lượt thoại trong `"..."` hoặc phá quy tắc **một dòng trống trước/sau** thoại. Tường thuật giữa các thoại vẫn áp dụng quy tắc **tối đa 3 câu** một đoạn; nếu một “câu” thoại kéo dài nhiều dòng trong ngoặc kép, **coi cả lượt thoại đó là một khối**, không đếm số câu bên trong ngoặc để chèn xuống dòng đoạn giữa chừng.
  - Mục tiêu tổng thể: đoạn **ngắn vừa phải**, không có khối tường thuật lê thê nhiều câu trong một đoạn.
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
- **Dấu câu**: dùng quy chuẩn tiếng Việt. **Lời thoại** luôn đặt dấu câu (chấm, hỏi, than…) **bên trong** cặp ngoặc kép thoại. Không thay đổi cấu trúc câu một cách không cần thiết. **Hạn chế dấu chấm phẩy (;)** trong bản dịch truyện, ưu tiên **dấu phẩy** hoặc **chấm câu** (xem mục 3.4).

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

#### 3.1.1 Cách chỉ người thứ ba (tránh “người đàn bà này” cứng nhắc)

- **Vấn đề**: Dịch word-by-word từ gốc (ví dụ 这个女人 / 此人 / 这女子…) dễ ra các cụm **lạnh, văn nói** kiểu “người đàn bà này”, “người phụ nữ này”, “con nhỏ này” trong bối cảnh cổ trang — nên **chỉnh theo ngữ cảnh** sang cách gọi tự nhiên, đúng tuổi, địa vị và quan hệ.
- **Nguyên tắc**: Không máy móc lặp “người + giới tính + này/đó”; ưu tiên **danh xưng phù hợp** (kính, trung tính, khinh…) và **đại từ chỉ định** (“nàng”, “ả ấy”, “vị ấy”…) khi câu vẫn rõ chủ thể.
- **Nữ, theo ngữ cảnh** (chọn một, nhất quán trong cảnh):
  - Thiếu nữ / chưa chồng, giọng trung tính hoặc kính: **“cô nương ấy”**, **“thiếu nữ ấy”**, **“cô gái ấy”**; khi cần sắc thái tiểu thư, trang trọng: **“cố nương ấy”** (hoặc “vị cố nương ấy” nếu cần rõ kính ngữ).
  - Đã có chồng, chủ mẫu, thế gia: **“phu nhân ấy”**, **“mệnh phụ ấy”**, hoặc **“bà ấy”** khi ngữ cảnh đời thường, không cần nhấn địa vị.
  - Trung niên / lớn tuổi: **“bà ấy”**, **“lão phu nhân ấy”**, **“bà lão ấy”** tùy mức kính và bối cảnh.
  - Khi gốc mang sắc **khinh miệt, mỉa mai**: có thể giữ hoặc cố ý **thô** hơn (“ả đàn bà đó”, “con đàn bà đó”…) — **không** ép sang “cố nương” nếu làm mất thái độ lời kể.
- **Nam và người khác**: Tương tự, tránh “người đàn ông này” máy móc; ưu tiên **“vị ấy”**, **“lão gia ấy”**, **“công tử ấy”**, **“hắn”** / **“gã ấy”** (khinh)… theo tuổi và thái độ.
- **Đối chiếu gốc**: Nếu gốc nhấn **trẻ** (少女 / 丫头), **đã chồng** (妇人 / 夫人), **già** (老妇…) — phản ánh đúng vào cách gọi tiếng Việt tương ứng, không gộp chung một kiểu “người phụ nữ”.

#### 3.2 Từ ngữ cổ phong nên ưu tiên (khi phù hợp)

- **Hư từ/nhịp câu**: "chẳng", "hẵng", "ắt hẳn", "há", "nào dám", "chỉ e", "bèn", "liền", "đành", "vả lại"
- **Động tác/thái độ**: "khẽ", "nhíu mày", "lạnh nhạt", "trầm giọng", "cười nhạt", "phất tay áo"
- **Gọi người/đối tượng**: "các hạ", "huynh/đệ", "tỷ/muội", "công tử", "cô nương", "lão gia", "phu nhân"

#### 3.3 Tránh hiện đại hóa trái bối cảnh

- Tránh các từ hiện đại khi bối cảnh cổ trang: "thanh toán", "tài khoản", "app", "đăng nhập", "deal", "deadline", "chill", "stress", "idol", "fan"… (trừ khi truyện cố ý xuyên không/hiện đại).

#### 3.4 Dấu chấm phẩy (;) — hạn chế, ưu tiên dấu phẩy hoặc chấm

- **Mục tiêu**: Văn truyện tiếng Việt thường **mượt, gần lời kể** hơn khi giảm dấu chấm phẩy, thay bằng **dấu phẩy** (nối vế trong cùng một nhịp) hoặc **dấu chấm** (tách ý, nhịp nghỉ rõ).
- **Hạn chế**: Không lạm dụng `;` để nối hai câu độc lập hoặc chuỗi ý dài — dễ tạo cảm giác văn bản hành chính, cứng.
- **Cách xử lý**:
  - Hai vế cùng một câu, cần ngắt nhẹ → **dấu phẩy** hoặc **bỏ dấu** khi vẫn rõ nghĩa (theo chuẩn tiếng Việt).
  - Hai ý đủ dài hoặc cần nhịp nghỉ → **chấm câu** (hoặc xuống câu mới trong thoại/tường thuật).
  - **Giữ `;` chỉ khi thật cần**: danh sách/khoa học, hoặc chỗ tách rõ mà phẩy gây mơ hồ (hiếm trong truyện).
- **Khi đọc lại bản dịch**: rà các chỗ có `;`, tự hỏi có thể đổi thành **`,`** hoặc **`.`** mà không làm sai nghĩa gốc không — nếu được thì đổi.

## Quy trình khi dịch

1. **Đọc qua** đoạn/chương gốc để nắm ngữ cảnh và nhân vật.
2. **Xác định tên riêng** (người, địa danh, tông phái…) và liệt kê phiên âm Hán Việt sẽ dùng; nếu có bảng tên sẵn thì áp dụng.
3. **Dịch từng đoạn** theo đúng thứ tự và format (đoạn, dòng, chương).
4. **Kiểm tra “dịch đủ nội dung — không tóm tắt”** (bắt buộc, làm ngay sau khi dịch xong):
   - **Đối chiếu theo cấu trúc**: mỗi **khối nội dung** trong bản gốc (kể, thoại, tiêu đề…) phải có **bản tiếng Việt đầy đủ**; **một đoạn gốc** có thể thành **nhiều đoạn dịch** nếu đã tách theo mục 2, nhưng **không** được thiếu câu, thiếu lời thoại, thiếu tiêu đề.
   - **Đếm/quét theo trục thời gian văn bản**: lướt song song gốc và dịch; mỗi lần gốc có câu mới (kể, thoại, tả) thì bản dịch phải có câu tương ứng — không được “nhảy cóc” một khúc dài.
   - **Rà soát các “điểm hay bị rơi”**: tiêu đề chương/hồi, phụ đề, lời thoại ngắn, câu cảm thán/tiếng kêu, nội dung trong ngoặc, chú thích, ký hiệu phân cách cảnh (`——`, `***`, `……`), thơ/ca từ, lời tác giả cuối chương.
   - **Dấu hiệu tóm tắt — bắt buộc sửa trước khi nộp**: bản dịch ngắn bất thường so với gốc; nhiều câu gốc bị gộp thành một câu tổng kết; thiếu hẳn một đoạn hoặc một lượt thoại; xuất hiện “đại ý là…/tóm lại…/nói chung…/sau đó… (mơ hồ thay cho chi tiết gốc)”; tự thêm suy luận hoặc kết luận không có trong gốc.
5. **Tách đoạn** (bắt buộc): rà soát **tường thuật** — mỗi đoạn **tối đa khoảng 3 câu** (mục 2); nếu vẫn gần/vượt **~200 từ** thì tách sớm hơn, luôn **tại cuối câu**. **Lưu ý**: tách đoạn chỉ để dễ đọc, **không** được dùng như cơ hội bỏ bớt câu gốc.
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
- Gộp **nội dung** hoặc bỏ xuống dòng khiến khối tường thuật **quá dài** so với quy tắc (mục 2: khoảng 3 câu một đoạn). (Được phép **nhiều đoạn hơn** gốc để tách hợp lý.)
- Đổi cấu trúc chương (ví dụ bỏ tiêu đề chương).
- **Mọi hình thức tóm tắt hoặc rút gọn nội dung gốc**: bản dịch phải **đủ** so với gốc về số lượng ý/câu/chi tiết; không lược bỏ, không thay bằng câu tổng quát, không “kể lại ngắn”.

## Checklist kiểm tra (trước khi coi là xong)

- [ ] Mọi tên nhân vật (và địa danh/tông phái nếu áp dụng) đã chuyển sang Hán Việt.
- [ ] Chương/hồi/quyển và thứ tự nội dung đúng bản gốc. Đoạn văn: **tường thuật** đã tách sao cho **khoảng tối đa 3 câu một đoạn** (có thể nhiều đoạn hơn gốc), không để khối kể lê thê.
- [ ] Đoạn tường thuật **không** quá ~200 từ (nếu 3 câu mà vẫn dài thì đã tách sớm hơn), luôn tách tại cuối câu.
- [ ] Mỗi lời thoại bọc trong `"..."` (hoặc “...” nhất quán), có **dòng trống** trước và sau mỗi lượt thoại.
- [ ] Tiêu đề chương đã dịch và giữ style.
- [ ] **Không tóm tắt**: đã đối chiếu gốc–dịch; không thiếu đoạn/câu/thoại; không gộp nhiều câu gốc thành một câu tổng kết; không có “đại ý/tóm lại/nói chung” thay cho văn gốc; độ dài và mật độ nội dung tương xứng bản gốc.
- [ ] Đã rà các phần dễ sót (ngoặc, chú thích, tiếng kêu, ký hiệu phân cảnh, thơ/ca từ).
- [ ] Câu tiếng Việt tự nhiên, đúng thể loại và xưng hô. Chỉ người thứ ba không cứng nhắc (“người đàn bà này” → đã chọn “cố nương/cô gái/bà ấy…” theo ngữ cảnh mục 3.1.1).
- [ ] Đã hạn chế dấu chấm phẩy (`;`), ưu tiên dấu phẩy hoặc chấm (mục 3.4).
- [ ] File kết quả được lưu **đúng định dạng tiếng Việt** (hiển thị đúng dấu, không méo chữ).
