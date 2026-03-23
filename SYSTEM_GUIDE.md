# Ppomppu Mobile Localizer Admin - System Documentation (v1.0)

This document provides an overview of the localized Ppomppu mobile project and its admin system.

## 1. Overview
The project is designed to synchronize, localize, and preview the Ppomppu mobile website locally. It features a unified server that handles both static file serving and a web-based administration interface for running the localization scripts.

## 2. Key Features
- **Unified Server**: A Python-based server (`admin_server.py`) serving both the website and the admin panel on port **8000**.
- **Admin Interface (`/admin`)**: 
  - **Sidebar Management**: Lists all `m*.html` files in the root directory.
  - **File Preview & Content Loading**: Load existing templates into the text editor or open them in a new tab for preview.
  - **Real-time Localization**: Executes the `localize.bat` script through the web UI and streams output logs in real-time.
  - **File Deletion**: Allows safe removal of localized files with a confirmation prompt.
- **Dark Mode Support**: The localization process automatically applies dark mode enhancements.

## 3. Project Structure
- `admin_server.py`: The core backend handling routing and subprocess execution.
- `admin.html`: The premium-designed frontend for the management console.
- `localize.bat`: The original batch script used to download assets and modify HTML.
- `m.html`: The primary source file.
- `m*.html`: Various localized and themed versions (e.g., `m2.html`, `m_ppom_dark.html`).

## 4. How to Use

### Starting the Server
Run the following command in the project root:
```bash
python admin_server.py
```

### Accessing the System
- **Static Preview**: [http://localhost:8000](http://localhost:8000)
- **Admin Management**: [http://localhost:8000/admin](http://localhost:8000/admin)

### Localizing a Page
1. Open the **Admin Management** page.
2. Select an existing template (e.g., `m.html`) from the sidebar or paste raw HTML into the editor.
3. Enter the desired **Output Filename** (e.g., `m_new_localized.html`).
4. Click **Run Localize**.
5. Monitor the real-time logs in the output console.
6. Once finished, click **View Generated File** to preview the result.

## 5. Technical Details
- **Backend Architecture**: Built with Python's `http.server` for high portability without external dependencies.
- **Frontend Design**: Uses Vanilla CSS with a high-contrast dark theme for professional use. Responsive layout with a dedicated sidebar and code editor.
- **API Endpoints**:
  - `GET /api/files`: Returns a JSON list of all `m*.html` files.
  - `GET /api/file/{name}`: Reads and returns the content of the specified file.
  - `POST /localize`: Saves editor content and triggers `localize.bat`.
  - `POST /delete`: Safely removes a specified file from the filesystem.

---
*Documentation generated on 2026-03-23*
