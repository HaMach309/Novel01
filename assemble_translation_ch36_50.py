# -*- coding: utf-8 -*-
"""Assemble translation_ch36_50_append.md from reference translations with fixes."""

import re

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Chapter titles per user
CHAPTER_TITLES = {
    36: "Tây Nhĩ Phàm đi hẹn (h)",
    37: "Thỏa thuận với A Tát Tạ Nhĩ",
    38: "Ác mộng của Tây Nhĩ Phàm",
    39: "Tin đồn phiền toái",
    40: "Che phủ dấu vết (h)",
    41: "Xoa bóp của Karl (h)",
    42: "Toàn thân mà lui",
    43: "Giải cứu nhân viên",
    44: "Ảo ảnh Lily Tư Á",
    45: "Ảo cảnh Vi O Lai Khả (h)",
    46: "Mê cung chìm đắm",
    47: "Bẫy của Vi O Lai Khả",
    48: "Vạn sự đã sẵn sàng",
    49: "Lời mời Mị Sắc Yêu Ảnh",
    50: "Chưa kết thúc đâu (h)",
}

def apply_fixes(text):
    """Apply all user-specified fixes."""
    # Chinese remnants
    text = text.replace("打响第一枪", "nổ phát súng đầu tiên")
    text = text.replace("不落空", "không thất lạc")
    text = text.replace("vô缝", "vô kẽ")
    text = text.replace("sẽ không rơi vào khoảng không", "sẽ không thất lạc")
    # Tử Hồng -> Tinh Hồng
    text = text.replace("【Tử Hồng Thánh Bôi】", "【Tinh Hồng Thánh Bôi】")
    text = text.replace("Tử Hồng Thánh Bôi", "Tinh Hồng Thánh Bôi")
    # Bạn -> Ngươi (in dialogue/address context - be careful)
    # Only replace when it's clearly "you" as in formal address
    text = re.sub(r'\bBạn\b', 'Ngươi', text)
    return text

def extract_ch36(content):
    """Extract Ch36 from translation_ch36_50_full.md"""
    start = content.find("## Chương 36")
    end = content.find("## Chương 37")
    if start == -1 or end == -1:
        return ""
    return content[start:end].strip()

def extract_ch37_39(content):
    """Extract Ch37, Ch38, Ch39 from translation_ch37_50_append.md"""
    parts = {}
    for n in [37, 38, 39]:
        start = content.find(f"## Chương {n}")
        if n < 39:
            end = content.find(f"## Chương {n+1}")
        else:
            end = content.find("---", content.find("## Chương 39") + 100)
            if end == -1:
                end = len(content)
        if start != -1:
            if end != -1 and end > start:
                parts[n] = content[start:end].strip()
            else:
                parts[n] = content[start:].strip()
    return parts

def extract_ch40_50(content):
    """Extract Ch40-50 from translation_ch40_50.md, in correct order (42 before 43)"""
    chapters = {}
    # Find chapter boundaries
    for n in range(40, 51):
        pattern = f"## Chương {n} "
        idx = content.find(pattern)
        if idx != -1:
            chapters[n] = idx
    
    # Sort by position to get order in file
    sorted_chaps = sorted(chapters.items(), key=lambda x: x[1])
    
    result = {}
    for i, (n, pos) in enumerate(sorted_chaps):
        if i + 1 < len(sorted_chaps):
            end = sorted_chaps[i + 1][1]
            result[n] = content[pos:end].strip()
        else:
            result[n] = content[pos:].strip()
    
    return result

def update_chapter_title(text, ch_num):
    """Update chapter title to user-specified format."""
    title = CHAPTER_TITLES.get(ch_num, "")
    if not title:
        return text
    # Replace ## Chương N – Old Title with ## Chương N – New Title
    pattern = rf'(## Chương {ch_num}\s*–\s*)[^\n]+'
    replacement = rf'\g<1>{title}'
    return re.sub(pattern, replacement, text, count=1)

def main():
    base = r"c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01"
    
    full = read_file(f"{base}/translation_ch36_50_full.md")
    append37 = read_file(f"{base}/translation_ch37_50_append.md")
    ch40_50 = read_file(f"{base}/translation_ch40_50.md")
    
    output_parts = []
    
    # Ch36
    ch36 = extract_ch36(full)
    ch36 = ch36.replace("Tây Nhĩ Phàm đi hẹn hò (h)", "Tây Nhĩ Phàm đi hẹn (h)")
    ch36 = apply_fixes(ch36)
    ch36 = update_chapter_title(ch36, 36)
    output_parts.append(ch36)
    
    # Ch37-39
    parts37_39 = extract_ch37_39(append37)
    for n in [37, 38, 39]:
        if n in parts37_39:
            text = parts37_39[n]
            text = apply_fixes(text)
            text = update_chapter_title(text, n)
            output_parts.append(text)
    
    # Ch40-50
    parts40_50 = extract_ch40_50(ch40_50)
    for n in range(40, 51):
        if n in parts40_50:
            text = parts40_50[n]
            text = apply_fixes(text)
            text = update_chapter_title(text, n)
            output_parts.append(text)
    
    # Join with double newlines between chapters
    final = "\n\n---\n\n".join(output_parts)
    
    write_file(f"{base}/translation_ch36_50_append.md", final)
    print("Created translation_ch36_50_append.md successfully")

if __name__ == "__main__":
    main()
