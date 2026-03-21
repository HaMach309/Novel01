# Fix UTF-8 mojibake (double-encoding) - when UTF-8 was read as Latin-1/CP1252
param([string]$FilePath = "translation_ch36_50_temp.md")
$fullPath = if ([System.IO.Path]::IsPathRooted($FilePath)) { $FilePath } else { Join-Path (Get-Location) $FilePath }
if (-not (Test-Path $fullPath)) { Write-Error "File not found: $fullPath"; exit 1 }
$utf8 = [System.Text.Encoding]::UTF8
$latin1 = [System.Text.Encoding]::GetEncoding(28591)
$bytes = [System.IO.File]::ReadAllBytes($fullPath)
$corrupted = $utf8.GetString($bytes)
$fixedBytes = $latin1.GetBytes($corrupted)
$fixed = $utf8.GetString($fixedBytes)
$backup = $fullPath + ".backup"
Copy-Item $fullPath $backup -Force
[System.IO.File]::WriteAllText($fullPath, $fixed, [System.Text.UTF8Encoding]::new($true))
Write-Host "Fixed. Backup: $backup"
