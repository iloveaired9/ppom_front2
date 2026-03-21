import os
import re
import urllib.request
import urllib.parse
import ssl
import sys
import argparse

# Bypass SSL verification for legacy/CDN assets
ssl._create_default_https_context = ssl._create_unverified_context

BASE_URL = "https://m.ppomppu.co.kr/"
EXTERNAL_DIR = "_external"

# Track downloaded assets to avoid duplicates and redundant network calls IN THE SAME SESSION
downloaded_assets = set()

def download_asset(url, base_url=BASE_URL, force=False):
    """
    Downloads an asset and returns its local path relative to the root.
    Handles recursive scanning for CSS.
    
    Refined logic:
    - Skip PHP files.
    - Check if file exists (skip images unless force=True).
    - Always download JS/CSS.
    """
    if not url or url.startswith('data:') or url.startswith('javascript:') or url.startswith('#'):
        return url
    
    # Handle protocol-relative URLs
    if url.startswith('//'):
        url = 'https:' + url
    
    full_url = urllib.parse.urljoin(base_url, url)
    parsed = urllib.parse.urlparse(full_url)
    
    # --- SKIP PHP ---
    # Many Ppomppu links point to bbs_view.php?id=... which leads to infinite recursion
    if '.php' in parsed.path.lower():
        # print(f"  [Skip] PHP dynamic page: {full_url}")
        return full_url
    
    # Generate a structured local path in _external/[domain]/[path]
    domain_folder = parsed.netloc.replace(':', '_').replace('.', '_')
    path_parts = [EXTERNAL_DIR, domain_folder] + [p for p in parsed.path.strip('/').split('/') if p]
    
    # If path is empty, default to index.html
    if not parsed.path or parsed.path.endswith('/'):
        path_parts.append("index.html")
    
    local_path = os.path.join(*path_parts)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    
    is_css = local_path.lower().endswith('.css')
    
    # --- SMART DOWNLOAD ---
    # If file exists and not CSS, skip unless forced
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        if is_css:
            # Always download CSS to ensure recursive scanning of URLs
            pass 
        elif not force:
            print(f"  [Cached] {local_path}")
            return f"/{local_path.replace(os.sep, '/')}"

    if full_url not in downloaded_assets:
        try:
            print(f"  [Download] {full_url} -> {local_path}")
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': base_url
            }
            req = urllib.request.Request(full_url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as response:
                content = response.read()
                
                # Recursive CSS scanning
                if local_path.lower().endswith('.css'):
                    try:
                        css_text = content.decode('utf-8', errors='ignore')
                        def css_url_replacer(match):
                            u = match.group(1).strip("'\" ")
                            # Resolve URL relative to the CSS file itself
                            new_rel_url = download_asset(u, full_url, force=force)
                            return f"url('{new_rel_url.lstrip('/')}')"
                        
                        new_css_text = re.sub(r'url\((.*?)\)', css_url_replacer, css_text, flags=re.I)
                        content = new_css_text.encode('utf-8')
                    except Exception as css_err:
                        print(f"    [CSS Error] Failed to scan {full_url}: {css_err}")
                
                with open(local_path, 'wb') as f:
                    f.write(content)
            downloaded_assets.add(full_url)
        except Exception as e:
            print(f"  [Error] Failed to download {full_url}: {e}")
            return url # Fallback to remote if download fails
            
    return f"/{local_path.replace(os.sep, '/')}"

def localize_html(input_file, output_file, force=False):
    print(f"Localizing {input_file} -> {output_file} (Force: {force})...")
    
    # 1. Robust Encoding Detection & Reading
    html = None
    try:
        with open(input_file, 'r', encoding='euc-kr') as f:
            html = f.read()
        print("  [Meta] Read as EUC-KR")
    except:
        with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()
        print("  [Meta] Read as UTF-8 (fallback)")

    if not html:
        print("  [Critical] Failed to read HTML file.")
        return

    # 2. Unify to UTF-8 and fix Meta tags
    html = re.sub(r'charset=euc-kr', 'charset=utf-8', html, flags=re.I)

    # 3. Replace Global URL Variables (Ppomppu specific)
    domains = [
        'https://m.ppomppu.co.kr', '//m.ppomppu.co.kr',
        'https://www.ppomppu.co.kr', '//www.ppomppu.co.kr',
        '//static.ppomppu.co.kr', '//img.ppomppu.co.kr', '//cdn2.ppomppu.co.kr',
        '//cdn3.ppomppu.co.kr', 'https://memo.ppomppu.co.kr', 'https://s.ppomppu.co.kr'
    ]
    for d in domains:
        html = html.replace(f'"{d}"', '""').replace(f"'{d}'", "''")
        html = html.replace(f'"{d}/"', '"/"').replace(f"'{d}/'", "'/'")
        html = html.replace(f'var G_STATIC_URL = "{d}"', 'var G_STATIC_URL = ""')
        html = html.replace(f'var G_IMG_URL = "{d}"', 'var G_IMG_URL = ""')

    # 4. Handle HTML tags (src, href, data-src)
    def tag_replacer(match):
        tag_full = match.group(0)
        attr_name = match.group(1)
        url = match.group(2)
        
        if url.startswith('#') or url.startswith('javascript:'):
            return tag_full
            
        new_url = download_asset(url, force=force)
        return tag_full.replace(url, new_url)

    html = re.sub(r'<(?:script|img|link|source|iframe|embed|area|a)[^>]+\b(src|href|data-src)=["\'](.*?)["\']', tag_replacer, html, flags=re.I)

    # 5. Handle Inline Style Tags
    def inline_style_replacer(match):
        content = match.group(1)
        def css_url_replacer(m):
            u = m.group(1).strip("'\" ")
            new_u = download_asset(u, force=force)
            return f"url('{new_u}')"
        new_content = re.sub(r'url\((.*?)\)', css_url_replacer, content, flags=re.I)
        return f"<style>{new_content}</style>"
    
    html = re.sub(r'<style[^>]*>(.*?)</style>', inline_style_replacer, html, flags=re.S | re.I)

    # 6. Final Path Cleanup
    html = html.replace('\\', '/')
    html = html.replace('//_external', '/_external')

    # 7. Write Output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"Success! Localized file saved to {output_file}")

def main():
    parser = argparse.ArgumentParser(description="Ppomppu Site Localization Skill - Refined")
    parser.add_argument("input", help="Input HTML file")
    parser.add_argument("output", help="Output localized HTML file")
    parser.add_argument("-f", "--force", action="store_true", help="Force re-download of existing assets (except JS/CSS which are always downloaded)")
    
    if len(sys.argv) < 2:
        parser.print_help()
        return

    args = parser.parse_args()
    localize_html(args.input, args.output, force=args.force)

if __name__ == "__main__":
    main()
