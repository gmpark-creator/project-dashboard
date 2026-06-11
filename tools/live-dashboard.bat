@echo off
chcp 65001 >nul
title 프로젝트 대시보드 - 라이브 중계
cd /d "%~dp0.."

if not exist "node_modules\live-server\live-server.js" (
    echo [최초 1회] live-server 설치 중... 잠시만 기다려 주세요.
    call npm install --no-audit --no-fund
)

echo.
echo  ============================================================
echo   프로젝트 대시보드 라이브 중계
echo  ------------------------------------------------------------
echo   - 브라우저가 자동으로 열립니다 (http://127.0.0.1:5500)
echo   - Claude가 파일을 고치는 순간 화면이 스스로 새로고침됩니다
echo   - 끄려면 이 창을 닫으세요 (대시보드 데이터에는 영향 없음)
echo  ============================================================
echo.

node "tools\live-dashboard.js"

pause
