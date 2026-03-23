import re
import os
import argparse
import sys

class CSSOptimizerPro:
    def __init__(self, html_files, css_file, output_file, verbose=False):
        self.html_files = html_files
        self.css_file = css_file
        self.output_file = output_file
        self.verbose = verbose
        self.used_classes = set()
        self.used_ids = set()
        self.used_tags = {'html', 'body', 'div', 'span', 'p', 'a', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                         'img', 'header', 'footer', 'section', 'article', 'aside', 'nav', 'main', 'button', 
                         'input', 'textarea', 'label', 'form', 'table', 'tbody', 'thead', 'tr', 'td', 'th', 
                         'select', 'option', 'iframe', 'canvas', 'svg', 'path', 'circle', 'polyline', 'line'}

    def log(self, msg):
        if self.verbose:
            print(f"[LOG] {msg}")

    def extract_selectors_from_html(self):
        """Analyze all provided HTML files to collect unique classes and IDs."""
        for file_path in self.html_files:
            if not os.path.exists(file_path):
                print(f"Warning: File {file_path} not found. Skipping...")
                continue
            
            self.log(f"Analyzing {file_path}...")
            # Try UTF-8 first, then CP949
            content = ""
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except UnicodeDecodeError:
                with open(file_path, 'r', encoding='cp949') as f:
                    content = f.read()

            # Extract classes
            for match in re.finditer(r'class=["\'](.*?)["\']', content):
                for c in match.group(1).split():
                    self.used_classes.add(c)
            
            # Extract IDs
            for match in re.finditer(r'id=["\'](.*?)["\']', content):
                self.used_ids.add(match.group(1))
        
        self.log(f"Extracted {len(self.used_classes)} unique classes and {len(self.used_ids)} unique IDs.")

    def read_css(self):
        """Read CSS file with robust encoding detection."""
        if not os.path.exists(self.css_file):
            print(f"Error: CSS file {self.css_file} not found.")
            sys.exit(1)

        with open(self.css_file, 'rb') as f:
            raw_data = f.read()
            
        for enc in ['cp949', 'euc-kr', 'utf-8']:
            try:
                return raw_data.decode(enc)
            except UnicodeDecodeError:
                continue
        return raw_data.decode('utf-8', errors='replace')

    def process(self):
        self.extract_selectors_from_html()
        
        self.log(f"Reading CSS: {self.css_file}")
        content = self.read_css()
        
        # 1. Remove comments
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        
        # 2. Extract and filter rules
        # Match rule blocks including media queries (simplified nesting support)
        # Note: This regex handles simple non-nested rules. For @media, we keep it if any rule inside is kept.
        
        # First, preserve @media and other @-rules by finding blocks
        # This is a simplified approach: extract all blocks and filter.
        rules = re.findall(r'([^\{\}]+)\{([^\}]*)\}', content)
        
        minified_rules = []
        for selectors, body in rules:
            selectors_list = [s.strip() for s in selectors.split(',')]
            keep_rule = False
            
            for s in selectors_list:
                # Always keep global variables, root, and @-related selectors
                if any(x in s for x in [':root', '--', '@']):
                    keep_rule = True
                    break
                
                # Check classes
                for c in self.used_classes:
                    if f'.{c}' in s:
                        keep_rule = True
                        break
                if keep_rule: break
                
                # Check IDs
                for i in self.used_ids:
                    if f'#{i}' in s:
                        keep_rule = True
                        break
                if keep_rule: break
                
                # Check Tags
                for t in self.used_tags:
                    # Match tag precisely (start of line, space, or after combo selectors)
                    if re.search(rf'(^|[ \s#\.>+\~]){t}([ \s:\.>+\~,]|{{|$)', s):
                        keep_rule = True
                        break
                if keep_rule: break
            
            if keep_rule:
                clean_selectors = ','.join(selectors_list)
                clean_body = re.sub(r'\s+', ' ', body).strip()
                minified_rules.append(f"{clean_selectors}{{{clean_body}}}")

        # 3. Save to output
        with open(self.output_file, 'w', encoding='utf-8') as f:
            f.write("@charset \"UTF-8\";\n")
            f.write('\n'.join(minified_rules))
            
        print(f"Success! Optimized CSS saved to: {self.output_file}")
        print(f"Original size: {os.path.getsize(self.css_file) / 1024:.1f} KB")
        print(f"Optimized size: {os.path.getsize(self.output_file) / 1024:.1f} KB")

def main():
    parser = argparse.ArgumentParser(description="Professional CSS Optimizer - Prune unused styles based on HTML usage.")
    parser.add_argument("html", nargs="+", help="One or more HTML files to analyze.")
    parser.add_argument("--css", required=True, help="Path to the source CSS file (e.g., mobile.css).")
    parser.add_argument("--out", default="optimized.css", help="Path to save the optimized CSS (default: optimized.css).")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose logging.")

    args = parser.parse_args()
    
    optimizer = CSSOptimizerPro(args.html, args.css, args.out, args.verbose)
    optimizer.process()

if __name__ == "__main__":
    main()
