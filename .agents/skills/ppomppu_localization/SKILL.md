# Skill: Ppomppu Mobile Localization (Upgraded)

This skill provides a generalized and robust workflow for localizing and fixing Korean encoding for various pages from `m.ppomppu.co.kr` (Home, List, Dark Mode, etc.).

## Description
Deeply localizes all external assets (scripts, CSS, images, iframes, fonts) into a self-contained local environment. It uses recursive scanning to ensure deep-linked resources are captured and robustly handles `euc-kr` to `utf-8` conversion with automatic meta tag updates.

## Core Components
- **Robust Encoding Handling**: Automatically detects `euc-kr` or `utf-8` source files, converts to UTF-8, and forces the `<meta charset="utf-8">` tag to prevent "mojibake".
- **Recursive CSS Scanning**: Extracts and downloads sub-resources (fonts, icons) from within CSS `url()` declarations.
- **Global Variable Overrides**: Redefines site-specific JS variables (`G_IMG_URL`, `G_CDN_URL`, etc.) to point to the local root.
- **Parameterized Execution**: Supports specifying input and output filenames via command line.
- **Structured Asset Storage**: Organizes third-party and CDN assets into a navigable `/_external/` directory.

## Usage
1. Place the targeted HTML file (e.g., `m_list.html`) in the project root.
2. Run the `mirror_site.py` script with the input and output filenames:
   ```bash
   python .agents/skills/ppomppu_localization/scripts/mirror_site.py input.html output_skill.html
   ```
3. Serve the project root using a web server:
   ```bash
   python -m http.server 8000
   ```
4. Access the localized page via `http://localhost:8000/output_skill.html`.

## Scripts
- `mirror_site.py`: The main transformation engine with recursive and encoding logic.
