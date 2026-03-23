@echo off
setlocal enabledelayedexpansion

echo ======================================================
echo  Ppomppu Mobile CSS Optimizer (Auto-Run)
echo ======================================================

echo [1/2] Collecting HTML templates (m_*.html)...
set "HTML_FILES="
for %%f in (m*.html) do (
    if not "%%f"=="m_ppom_dark_min.html" (
        set "HTML_FILES=!HTML_FILES! %%f"
    )
)

if "%HTML_FILES%"=="" (
    echo Error: No m*.html templates found.
    pause
    exit /b 1
)

echo Detected Files: %HTML_FILES%
echo.

echo [2/2] Executing css_optimizer_pro.py...
python css_optimizer_pro.py %HTML_FILES% --css analysis/main_mobile.css --out analysis/main_mobile_min.css -v

echo.
echo ======================================================
echo  Optimization Complete! Result: analysis/main_mobile_min.css
echo ======================================================
pause
