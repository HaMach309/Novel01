@echo off
chcp 65001 >nul
set "RUN_DIR=%~dp0"
cd /d "%RUN_DIR%"

where node >nul 2>&1
if errorlevel 1 (
    echo [Lỗi] Chưa tìm thấy Node.js. Cài từ https://nodejs.org rồi chạy lại file này.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo Đang chạy npm install...
    call npm install
    if errorlevel 1 (
        echo npm install thất bại.
        pause
        exit /b 1
    )
)

if not exist ".env" (
    if exist ".env.example" (
        copy /Y ".env.example" ".env" >nul
        echo Đã tạo .env từ .env.example — mở .env và điền WATTPAD_USERNAME, WATTPAD_PASSWORD.
    ) else (
        echo Tạo file .env với WATTPAD_USERNAME và WATTPAD_PASSWORD.
    )
    pause
    exit /b 1
)

if not exist "run-novel.json" (
    echo [Gợi ý] Chưa có run-novel.json — chương trình sẽ hỏi đường dẫn file .md khi chạy.
    echo         Hoặc copy run-novel.example.json -^> run-novel.json để không phải gõ tay.
    echo.
)

echo Đảm bảo Chromium cho Playwright...
call npx playwright install chromium

echo Đang chạy upload...
node upload-wattpad.mjs
set "EXITCODE=%ERRORLEVEL%"
echo.
if not "%EXITCODE%"=="0" echo Kết thúc có lỗi (mã %EXITCODE%^).
pause
exit /b %EXITCODE%
