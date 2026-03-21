# -*- coding: utf-8 -*-
"""
Dịch lại chương 1-52 từ nguồn tiếng Trung, thay thế nội dung bị lỗi encoding trong VietSub.
Sử dụng deep-translator (Google Translate) - cần: pip install deep-translator
"""

import re
import os
import time

# Đường dẫn
BASE = r"c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01"
TQ_PATH = os.path.join(BASE, "Truyện chưa dịch", "QuanLyDiaNguc（nph）TQ.md")
VN_PATH = os.path.join(BASE, "Truyện đã dịch", "QuanLyDiaNguc（nph）VietSub.md")
OUT_TRANSLATION = os.path.join(BASE, "quanlydianguc_ch1_52_vn_translated.md")

# Mapping tên nhân vật (giữ nguyên hoặc chuyển)
NAMES = {
    '卡尔': 'Karl',
    '维奥莱卡': 'Vi O Lai Khả',
    '莉莉丝娅': 'Lily Tư Á',
    '西尔凡': 'Tây Nhĩ Phàm',
    '伊利亚': 'Y Lợi Á',
    '格雷戈': 'Cách Lý Cách',
    '锈骨': 'Tú Cốt',
    '晚晚': 'Vãn Vãn',
    '阿萨谢尔': 'A Tát Tạ Nhĩ',
    '艾瑞克': 'Eric',
    '李女士': 'bà Lý',
    '林老先生': 'ông Lâm',
    '猩红圣杯': 'Chén Thánh Đỏ Thẫm',
    '绯色魅影': 'Ảo Ảnh Màu Đỏ',
}

NAV_PATTERN = re.compile(r'上一章\s*返回目录\s*加入书签\s*下一章')

# Tiêu đề chương TQ -> VN (số thứ tự trong file TQ là 第N章, nội dung thực tế khác)
CHAPTER_TITLES_CN = {}  # Sẽ lấy từ nội dung

def remove_nav(text):
    return NAV_PATTERN.sub('', text)

def extract_chapters_tq(content):
    """Trích chương 1-52 từ file TQ. Format: ## 第N章 ... --- """
    pattern = r'## 第(\d+)章\s+([^\n]+)\n(.*?)(?=\n---\n|\Z)'
    matches = re.findall(pattern, content, re.DOTALL)
    chapters = {}
    for num_str, title_cn, body in matches:
        n = int(num_str)
        if 1 <= n <= 52:
            body_clean = remove_nav(body.strip())
            chapters[n] = {'title_cn': title_cn.strip(), 'body': body_clean}
    return chapters

def apply_name_mapping(text):
    for cn, vn in NAMES.items():
        text = text.replace(cn, vn)
    return text

def translate_chunk(text, translator):
    """Dịch một đoạn (tối đa ~4500 ký tự cho Google)"""
    if not text.strip():
        return ""
    try:
        # Chia thành các đoạn nhỏ nếu quá dài
        max_len = 4500
        if len(text) <= max_len:
            result = translator.translate(text)
            return result or text
        parts = []
        while text:
            chunk = text[:max_len]
            # Cố gắng cắt tại ranh giới câu
            last_period = chunk.rfind('。')
            if last_period > max_len // 2:
                chunk = text[:last_period + 1]
                text = text[last_period + 1:]
            else:
                text = text[max_len:]
            t = translator.translate(chunk)
            parts.append(t or chunk)
            time.sleep(0.3)  # Tránh rate limit
        return ''.join(parts)
    except Exception as e:
        print(f"  Lỗi dịch: {e}")
        return text

def main(test_limit=None):
    """test_limit: nếu set (vd 2), chỉ dịch 2 chương đầu để test."""
    print("Đang đọc nguồn tiếng Trung...")
    with open(TQ_PATH, 'r', encoding='utf-8') as f:
        tq_content = f.read()

    chapters = extract_chapters_tq(tq_content)
    print(f"Đã trích {len(chapters)} chương (1-52)")

    try:
        from deep_translator import GoogleTranslator
    except ImportError:
        print("Cần cài: pip install deep-translator")
        return

    translator = GoogleTranslator(source='zh-CN', target='vi')

    vn_chapters = []
    end_ch = (test_limit + 1) if test_limit else 53
    for n in range(1, end_ch):
        if n not in chapters:
            print(f"Chương {n} không có trong nguồn")
            continue
        ch = chapters[n]
        title_cn = ch['title_cn']
        body = ch['body']

        print(f"Đang dịch Chương {n}: {title_cn[:40]}...")

        # Dịch tiêu đề
        title_vn = translate_chunk(title_cn, translator)
        time.sleep(0.2)

        # Dịch nội dung theo chunk 4000 ký tự
        body_vn_parts = []
        pos = 0
        while pos < len(body):
            chunk = body[pos:pos+4000]
            # Cắt tại câu gần cuối
            for sep in ['。', '！', '？', '\n']:
                idx = chunk.rfind(sep)
                if idx > 2000:
                    chunk = body[pos:pos+idx+1]
                    pos += idx + 1
                    break
            else:
                pos += len(chunk)
            t = translate_chunk(chunk, translator)
            body_vn_parts.append(t)
            time.sleep(0.25)
        body_vn = ''.join(body_vn_parts)
        body_vn = apply_name_mapping(body_vn)

        vn_chapters.append({
            'num': n,
            'title': title_vn,
            'body': body_vn
        })
        print(f"  Xong Ch {n}")

    # Ghi file dịch
    with open(OUT_TRANSLATION, 'w', encoding='utf-8') as f:
        for ch in vn_chapters:
            f.write(f"## Chương {ch['num']} – {ch['title']}\n\n")
            f.write(ch['body'])
            f.write("\n\n---\n\n")

    print(f"\nĐã lưu bản dịch: {OUT_TRANSLATION}")

    # Merge vào file VietSub (chỉ khi dịch đủ 52 chương)
    if not test_limit and os.path.exists(OUT_TRANSLATION):
        merge_into_vietsub(OUT_TRANSLATION, VN_PATH)

def merge_into_vietsub(translated_path, vn_path):
    """Thay thế chương 1-52 trong VietSub bằng bản dịch mới."""
    print("\nĐang merge vào file VietSub...")

    with open(translated_path, 'r', encoding='utf-8') as f:
        new_content = f.read()

    with open(vn_path, 'r', encoding='utf-8', errors='replace') as f:
        full_content = f.read()

    # Header = từ đầu đến trước ## Ch??ng 1 (gồm cả ---)
    idx_first = full_content.find('## Ch')
    if idx_first > 0:
        # Lùi lại để lấy cả ---\n\n
        before = full_content[:idx_first].rstrip()
        if before.endswith('---'):
            header = before + "\n\n"
        else:
            header = full_content[:idx_first]
    else:
        header = full_content[:2000]

    # Tìm bắt đầu Chương 53
    ch53_match = re.search(r'\n## Chương 53\s*[–\-]', full_content)
    if not ch53_match:
        ch53_match = re.search(r'\n## Ch[^\n]*53[^\n]*\n', full_content)
    ch53_start = ch53_match.start() + 1 if ch53_match else -1

    if ch53_start > 0:
        tail = full_content[ch53_start:]
    else:
        tail = ""

    result = header + new_content.rstrip()
    if tail:
        if not result.endswith('\n\n'):
            result += "\n\n"
        result += "---\n\n" + tail

    backup_path = vn_path + ".before_merge"
    with open(backup_path, 'w', encoding='utf-8', errors='replace') as f:
        f.write(full_content)
    print(f"Backup: {backup_path}")

    with open(vn_path, 'w', encoding='utf-8') as f:
        f.write(result)

    print("Đã merge xong! File VietSub đã được cập nhật.")

if __name__ == '__main__':
    import sys
    test_limit = 2 if '--test' in sys.argv else None
    if test_limit:
        print(f"Chế độ test: chỉ dịch {test_limit} chương đầu")
    main(test_limit=test_limit)
