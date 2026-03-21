# -*- coding: utf-8 -*-
import sys
with open(r'c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01\temp_ch35_50_source.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Extract from line 19 (index 18) to end of ch50 (before line 97, index 96)
# Lines 19-96 inclusive
content = ''.join(lines[18:96])
with open(r'c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01\ch38_50_extract_temp.txt', 'w', encoding='utf-8') as out:
    out.write(content)
print(f"Extracted {len(lines[18:96])} lines, {len(content)} chars")
