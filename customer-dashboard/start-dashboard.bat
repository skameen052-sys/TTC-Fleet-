@echo off
title TTC Fleet360 - localhost:5500 (keep this window open)
cd /d "%~dp0"
echo Starting TTC Fleet360 Customer Dashboard on http://localhost:5500/index.html
echo Keep this window open. Close it to stop the server.
echo.
start "" cmd /c "timeout /t 3 >nul & start "" http://localhost:5500/index.html"
where python >nul 2>nul && (python -m http.server 5500 & goto :end)
where py >nul 2>nul && (py -m http.server 5500 & goto :end)
where npx >nul 2>nul && (npx --yes serve -l 5500 . & goto :end)
echo Neither Python nor Node.js was found. Install one of them and run this file again.
:end
pause
