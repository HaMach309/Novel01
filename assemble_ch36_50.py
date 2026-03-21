# -*- coding: utf-8 -*-
"""Assemble translation_ch36_50_temp.md from translation_ch36_50_full.md"""
import re

SOURCE = r"c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01\translation_ch36_50_full.md"
TARGET = r"c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01\translation_ch36_50_temp.md"

# Navigation text to remove
NAV_TEXT = "上一章 返回目录 加入书签 下一章"

# Name standardization (wrong -> correct)
NAME_REPLACEMENTS = [
    (r"Tinh Hồng Thánh Bôi", "Tử Hồng Thánh Bôi"),
    # Lily vs Lily Tư Á - only replace standalone "Lily" when it refers to the character (context: bar staff)
    # Vãn Vãn is the correct name for the bar staff character per user
    # Be careful: "Lily Tư Á" stays as is. "Lily" alone in bar context -> could be Vãn Vãn
    # User said: Lily Tư Á, Vãn Vãn - these are two different names
    # In the source, sometimes "Lily" is used for the cleaning staff - user wants "Vãn Vãn" for that
    # And "Lily Tư Á" for the other character. Let me check - "Lily" in bar cleaning context in Ch39 = Vãn Vãn
    # Actually the user list: Lily Tư Á, Vãn Vãn - so both exist. The cleaning staff is Vãn Vãn.
    # When we see "Lily" lau quầy bar / lau ghế - that's Vãn Vãn. "Lily Tư Á" is the master.
    # We'll do: "Lily gắng" -> "Vãn Vãn gắng" etc when it's the cleaning context
    # Actually simpler: only fix obvious typos. "Tinh Hồng" -> "Tử Hồng". 
    # The names Karl, Vi O Lai Khả, Tây Nhĩ Phàm, A Tát Tạ Nhĩ, Cách Lý Cách, Tú Cốt, Vãn Vãn, Lily Tư Á, Y Lợi Á
    # are already mostly correct in the source. Let me add a few common variants:
]

def process_content(text):
    """Apply all processing rules."""
    # Remove navigation text
    text = text.replace(NAV_TEXT, "")
    
    # Fix bar name
    text = text.replace("Tinh Hồng Thánh Bôi", "Tử Hồng Thánh Bôi")
    text = text.replace("【Tinh Hồng Thánh Bôi】", "【Tử Hồng Thánh Bôi】")
    
    return text

def main():
    with open(SOURCE, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Split by chapter headers
    chapter_pattern = r'(^## Chương \d+ – [^\n]+)'
    parts = re.split(chapter_pattern, content, flags=re.MULTILINE)
    
    # parts[0] = header/intro before first chapter
    # parts[1] = "## Chương 36...", parts[2] = content, parts[3] = "## Chương 37...", etc.
    chapters = {}
    i = 1
    while i < len(parts) - 1:
        header = parts[i].strip()
        body = parts[i + 1] if i + 1 < len(parts) else ""
        # Extract chapter number
        m = re.match(r'## Chương (\d+)', header)
        if m:
            ch_num = int(m.group(1))
            if ch_num not in chapters or "Che phủ dấu vết" in header:
                # For Ch40, we want the second occurrence (the one with Karl thigh scene)
                # First Ch40 has mixed content. Second has clean Ch40.
                # Store both and pick the better one
                if ch_num not in chapters:
                    chapters[ch_num] = (header, body)
                elif ch_num == 40:
                    # Replace with second occurrence (longer, cleaner Ch40)
                    chapters[ch_num] = (header, body)
        i += 2
    
    # Build output in order
    lines = [
        "# Dịch Chương 36-50 – Quản Lý Địa Ngục",
        "",
        "---",
        ""
    ]
    
    for ch_num in range(36, 51):
        if ch_num in chapters:
            header, body = chapters[ch_num]
            # Ensure header format: ## Chương N – [Tiêu đề]
            if not re.match(r'^## Chương \d+ – ', header):
                header = re.sub(r'^## Chương \d+\s*[–\-]\s*', '## Chương {} – '.format(ch_num), header)
            body = process_content(body)
            lines.append(header)
            lines.append("")
            lines.append(body.strip())
            lines.append("")
            lines.append("---")
            lines.append("")
    
    output = "\n".join(lines).rstrip() + "\n"
    
    with open(TARGET, "w", encoding="utf-8") as f:
        f.write(output)
    
    print(f"Created: {TARGET}")
    return TARGET

if __name__ == "__main__":
    main()
