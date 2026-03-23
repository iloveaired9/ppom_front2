import http.server
import socketserver
import subprocess
import os
import json
import glob
from urllib.parse import parse_qs

PORT = 8000
DIRECTORY = os.getcwd()

class AdminHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Serve admin page at /admin
        if self.path == '/admin' or self.path == '/admin/':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            with open('admin.html', 'rb') as f:
                self.wfile.write(f.read())
            return
        
        # API to list files starting with 'm'
        if self.path == '/api/files':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            files = glob.glob('m*.html')
            files.sort()
            self.wfile.write(json.dumps(files).encode('utf-8'))
            return

        # API to get file content
        if self.path.startswith('/api/file/'):
            filename = self.path[len('/api/file/'):]
            if os.path.exists(filename) and filename.startswith('m') and filename.endswith('.html'):
                self.send_response(200)
                self.send_header('Content-Type', 'text/plain; charset=utf-8')
                self.end_headers()
                try:
                    with open(filename, 'r', encoding='euc-kr', errors='ignore') as f:
                        content = f.read()
                    self.wfile.write(content.encode('utf-8'))
                except Exception as e:
                    self.wfile.write(f"Error reading file: {str(e)}".encode('utf-8'))
            else:
                self.send_response(404)
                self.end_headers()
            return
        
        return super().do_GET()

    def do_POST(self):
        if self.path == '/localize':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            params = parse_qs(post_data)
            
            html_content = params.get('html', [''])[0]
            output_name = params.get('output_name', ['result.html'])[0]

            if not html_content:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"No HTML content provided")
                return

            input_file = "admin_input.html"
            with open(input_file, "w", encoding="euc-kr", errors="ignore") as f:
                f.write(html_content)

            self.send_response(200)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.end_headers()

            try:
                process = subprocess.Popen(
                    ["cmd", "/c", "localize.bat", input_file, output_name],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    encoding='cp949',
                    errors='ignore',
                    bufsize=1
                )
                for line in process.stdout:
                    self.wfile.write(line.encode('utf-8'))
                    self.wfile.flush()
                process.wait()
                self.wfile.write(f"\n\n--- Success! Saved to {output_name} ---\n".encode('utf-8'))
            except Exception as e:
                self.wfile.write(f"Error: {str(e)}".encode('utf-8'))

        elif self.path == '/delete':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            params = parse_qs(post_data)
            filename = params.get('filename', [''])[0]

            if filename and os.path.exists(filename) and filename.startswith('m') and filename.endswith('.html'):
                try:
                    os.remove(filename)
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(b"File deleted successfully")
                except Exception as e:
                    self.send_response(500)
                    self.end_headers()
                    self.wfile.write(f"Error deleting file: {str(e)}".encode('utf-8'))
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Invalid filename or file not found")

        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), AdminHandler) as httpd:
        print(f"Server merged! Access Admin at http://localhost:{PORT}/admin")
        print(f"Static files served at http://localhost:{PORT}/")
        httpd.serve_forever()
