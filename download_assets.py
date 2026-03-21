import os
import re
import urllib.request
import urllib.parse
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def download_and_replace(html_path):
    print(f"Processing {html_path}...")
    with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()

    BASE_URL = "https://m.ppomppu.co.kr"
    
    def get_local_path(url):
        # Only process if it's an external URL (http, https, //, or /)
        if not (url.startswith('http://') or url.startswith('https://') or url.startswith('//') or url.startswith('/')):
            return None
        
        # Skip if already a local path
        if url.startswith('./assets/'):
            return None
            
        print(f"Found URL: {url}")
        
        full_url = url
        if url.startswith('//'):
            full_url = 'https:' + url
        elif url.startswith('/'):
            full_url = BASE_URL + url
            
        parsed = urllib.parse.urlparse(full_url)
        path = parsed.path
        
        filename = os.path.basename(path)
        if not filename:
            filename = 'downloaded_file'
            
        ext = os.path.splitext(filename)[1].lower()
        if not ext:
            if 'js' in path or 'javascript' in path or 'js' in parsed.query: ext = '.js'
            elif 'css' in path: ext = '.css'
            else: ext = '.js'
            filename += ext
            
        if ext in ['.css']:
            folder = 'css'
        elif ext in ['.js']:
            folder = 'js'
        elif ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']:
            folder = 'images'
        else:
            folder = 'other'
            
        folder = os.path.join('assets', folder)
        os.makedirs(folder, exist_ok=True)
        
        domain = parsed.netloc.replace(':', '_').replace('.', '_')
        safe_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', filename)
        safe_name = f"{domain}_{safe_name}"
        file_path = os.path.join(folder, safe_name)
        
        try:
            if not os.path.exists(file_path):
                print(f"Downloading {full_url} to {file_path}")
                req = urllib.request.Request(full_url, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                    'Referer': 'https://m.ppomppu.co.kr/',
                    'Accept': '*/*'
                })
                with urllib.request.urlopen(req, timeout=10) as response, open(file_path, 'wb') as out_file:
                    out_file.write(response.read())
            return f"./assets/{os.path.basename(folder)}/{safe_name}"
        except Exception as e:
            print(f"Failed to download {full_url}: {e}")
            return None

    def tag_replacer(match):
        full_tag = match.group(0)
        url_match = re.search(r'(src|href|data-src)\s*=\s*([\'"])(.*?)\2', full_tag, re.IGNORECASE)
        if not url_match:
            return full_tag
            
        attr = url_match.group(1)
        url = url_match.group(3)
        local_path = get_local_path(url)
        if local_path:
            return full_tag[:url_match.start(3)] + local_path + full_tag[url_match.end(3):]
        return full_tag

    # Match <script>, <link>, <img>, <source>, <iframe>
    tag_pattern = re.compile(r'<(script|link|img|source|iframe)\b[^>]*>', re.IGNORECASE)
    new_html = tag_pattern.sub(tag_replacer, html)
    
    # Match style attributes with url()
    def style_replacer(match):
        full_tag = match.group(0)
        def url_replacer(url_match):
            m = url_match.group(1).strip("'\"")
            local_path = get_local_path(m)
            if local_path:
                return f'url({local_path})'
            return url_match.group(0)
            
        return re.sub(r'url\((.*?)\)', url_replacer, full_tag)
        
    style_pattern = re.compile(r'<[^>]+style\s*=\s*([\'"])(.*?)\1[^>]*>', re.IGNORECASE)
    new_html = style_pattern.sub(style_replacer, new_html)
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Done!")

if __name__ == '__main__':
    download_and_replace('m.html')
