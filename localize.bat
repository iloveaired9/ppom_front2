@echo off
setlocal

set INPUT=%1
set OUTPUT=%2
set FLAG=%3

if "%INPUT%"=="" (
    echo Usage: localize.bat [input_file] [output_file] [-f]
    echo Example: localize.bat m_dark.html m_dark_skill.html
    echo Example: localize.bat m_dark.html m_dark_skill.html -f
    exit /b 1
)

if "%OUTPUT%"=="" (
    echo Usage: localize.bat [input_file] [output_file] [-f]
    echo Error: Output file name is required.
    exit /b 1
)

python .agents\skills\ppomppu_localization\scripts\mirror_site.py %INPUT% %OUTPUT% %FLAG%

endlocal
