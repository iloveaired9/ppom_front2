// --- Tab Switching Logic ---
document.getElementById('tab-audit').addEventListener('click', () => switchTab('audit'));
document.getElementById('tab-merge').addEventListener('click', () => switchTab('merge'));

function switchTab(tab) {
  const isAudit = tab === 'audit';
  document.getElementById('content-audit').style.display = isAudit ? 'block' : 'none';
  document.getElementById('content-merge').style.display = isAudit ? 'none' : 'flex';
  document.getElementById('tab-audit').classList.toggle('active', isAudit);
  document.getElementById('tab-merge').classList.toggle('active', !isAudit);
  document.getElementById('tab-audit').style.color = isAudit ? 'var(--primary)' : 'var(--text-dim)';
  document.getElementById('tab-merge').style.color = isAudit ? 'var(--text-dim)' : 'var(--primary)';
  
  if (!isAudit) refreshHistoryList();
}


async function fetchWithEncoding(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Fetch failed');
  const buffer = await resp.arrayBuffer();
  const contentType = resp.headers.get('content-type') || '';
  const charsetMatch = contentType.match(/charset=([^;]+)/i);
  let charset = charsetMatch ? charsetMatch[1] : 'utf-8';
  
  if (!charsetMatch && (url.includes('ppomppu.co.kr') || url.includes('/assets/css/'))) {
    charset = 'euc-kr';
  }

  try {
    const decoder = new TextDecoder(charset);
    return decoder.decode(buffer);
  } catch (e) {
    return new TextDecoder('utf-8').decode(buffer);
  }
}

// --- Initialize: Fetch sheets on load ---
let lastScannedUrl = '';
let classifyScans = false;
document.addEventListener('DOMContentLoaded', () => {
  // Restore Auto Scan setting
  const autoScanCheckbox = document.getElementById('auto-scan-checkbox');
  if (autoScanCheckbox) {
    autoScanCheckbox.checked = localStorage.getItem('autoScanEnabled') === 'true';
    autoScanCheckbox.addEventListener('change', () => {
      localStorage.setItem('autoScanEnabled', autoScanCheckbox.checked);
    });
  }

  refreshSheetList();
  refreshHistoryList();
});

// Watch for tab updates for auto-scan
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    refreshSheetList();
  }
});

chrome.tabs.onActivated.addListener(() => {
  refreshSheetList();
});

document.getElementById('refresh-sheets-btn').addEventListener('click', refreshSheetList);

async function refreshSheetList() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return;

  const currentUrl = tab.url.split('#')[0]; // Key for per-page settings
  const listContainer = document.getElementById('sheet-list');
  listContainer.innerHTML = '<div style="font-size: 11px; color: var(--text-dim);">Fetching sheets...</div>';

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        return Array.from(document.styleSheets).map(s => ({
          href: s.href || 'inline',
          id: s.href ? s.href.split('/').pop().split('?')[0] : 'inline',
          isProxy: !s.href || s.href.startsWith(window.location.origin) ? false : true
        }));
      }
    });

    if (results && results[0] && results[0].result) {
      listContainer.innerHTML = '';
      
      const globalSelected = localStorage.getItem('globalSelectedSheet');
      const sheets = results[0].result;
      const sizePromises = [];

      sheets.forEach((sheet, index) => {
        const div = document.createElement('div');
        div.style.display = 'flex'; div.style.alignItems = 'center'; div.style.gap = '8px';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `sheet-${index}`;
        checkbox.value = sheet.href;
        const filename = sheet.id === 'inline' ? 'inline' : sheet.id;
        checkbox.dataset.filename = filename;
        
        // GLOBAL PERSISTENCE: Match by filename
        checkbox.checked = (globalSelected === filename);
        
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            localStorage.setItem('globalSelectedSheet', checkbox.dataset.filename);
            // Uncheck others in UI
            Array.from(listContainer.querySelectorAll('input[type="checkbox"]')).forEach(other => {
              if (other !== checkbox) other.checked = false;
            });
          } else {
            // If user unchecks the only one, clear global selection? 
            // Better to keep it or clear it. Let's clear it if they explicitly uncheck.
            if (localStorage.getItem('globalSelectedSheet') === checkbox.dataset.filename) {
               localStorage.removeItem('globalSelectedSheet');
            }
          }
          updateHistoryTitle();
        });

        const label = document.createElement('label');
        label.htmlFor = `sheet-${index}`;
        label.style.fontSize = '12px'; label.style.color = '#cbd5e1';
        label.style.whiteSpace = 'nowrap'; label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis'; label.style.cursor = 'pointer';
        label.innerText = sheet.id + (sheet.isProxy ? ' (CORS)' : '') + ' (calculating...)';
        label.title = sheet.href;

        div.appendChild(checkbox);
        div.appendChild(label);
        listContainer.appendChild(div);

        checkbox.addEventListener('change', () => {
          updateHistoryTitle();
        });

        // Fetch size in background
        const p = (async () => {
          try {
            let size = 0;
            if (sheet.href === 'inline') {
              const [res] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => Array.from(document.querySelectorAll('style')).map(s => s.textContent).join('\n').length
              });
              size = res.result;
            } else {
              const cssText = await fetchWithEncoding(sheet.href);
              size = new TextEncoder().encode(cssText).length;
            }
            const sizeKB = (size / 1024).toFixed(1);
            const baseName = sheet.id === 'inline-style' ? 'inline' : sheet.id;
            label.innerText = baseName + 
                            (sheet.isProxy ? ' (CORS)' : '') + 
                            ` (${sizeKB} KB)`;
          } catch (e) {
            label.innerText = sheet.id + ' (N/A)';
          }
        })();
        sizePromises.push(p);
      });
      
      updateHistoryTitle();

      // Auto Scan Logic
      const autoScanCheckbox = document.getElementById('auto-scan-checkbox');
      if (autoScanCheckbox && autoScanCheckbox.checked && currentUrl !== lastScannedUrl) {
        Promise.all(sizePromises).then(() => {
          setTimeout(() => {
            // Re-check URL after delay
             chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
               if (tabs[0] && tabs[0].url.split('#')[0] === currentUrl && currentUrl !== lastScannedUrl) {
                 document.getElementById('analyze-btn').click();
                 lastScannedUrl = currentUrl;
               }
             });
          }, 1000); // 1s delay for settle
        });
      }
    }
  } catch (err) {
    listContainer.innerHTML = `<div style="color: var(--danger); font-size: 11px;">Error: ${err.message}</div>`;
  }
}

// --- Analyze Button ---
document.getElementById('analyze-btn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const selectedSheets = Array.from(document.querySelectorAll('#sheet-list input:checked')).map(i => ({
    href: i.value,
    filename: i.dataset.filename // Use robust filename from data attribute
  }));

  if (selectedSheets.length === 0) {
    alert('Please select at least one stylesheet to scan.');
    return;
  }

  const btn = document.getElementById('analyze-btn');
  btn.disabled = true;
  btn.innerHTML = 'Scanning...';
  
  const codeContainer = document.getElementById('used-css-code');
  codeContainer.textContent = '/* Fetching and analyzing CSS... */';

  try {
    const totalUsedGroups = {};
    let totalRulesCount = 0;
    let usedRulesCount = 0;

    for (const sheetInfo of selectedSheets) {
      const { href, filename } = sheetInfo;
      let cssText = "";
      let rules = [];

      if (href === 'inline') {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => Array.from(document.querySelectorAll('style')).map(s => s.textContent).join('\n')
        });
        cssText = results[0].result;
        const tempSheet = new CSSStyleSheet();
        await tempSheet.replace(cssText);
        rules = Array.from(tempSheet.cssRules);
      } else {
        try {
          cssText = await fetchWithEncoding(href);
          const tempSheet = new CSSStyleSheet();
          await tempSheet.replace(cssText);
          rules = Array.from(tempSheet.cssRules);
        } catch (e) {
          console.error('Failed to fetch/parse stylesheet:', href, e);
          continue; // Skip this sheet if fetching or parsing fails
        }
      }
      
      const selectorsToCheck = new Set();
      rules.forEach(rule => {
        if (rule.type === CSSRule.STYLE_RULE) selectorsToCheck.add(rule.selectorText);
        else if (rule.type === CSSRule.MEDIA_RULE) {
          Array.from(rule.cssRules).forEach(sr => {
            if (sr.type === CSSRule.STYLE_RULE) selectorsToCheck.add(sr.selectorText);
          });
        }
      });

      const checkResult = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (selectors) => {
          const matched = {};
          selectors.forEach(s => {
            try { matched[s] = document.querySelector(s) !== null; }
            catch(e) { matched[s] = false; }
          });
          return matched;
        },
        args: [Array.from(selectorsToCheck)]
      });

      const matchedMap = checkResult[0].result;
      const sheetUsedRules = [];

      rules.forEach(rule => {
        if (rule.type === CSSRule.STYLE_RULE) {
          totalRulesCount++;
          if (matchedMap[rule.selectorText]) {
            usedRulesCount++;
            sheetUsedRules.push(rule.cssText);
          }
        } else if (rule.type === CSSRule.MEDIA_RULE) {
          let hasMatch = false;
          let subRules = [];
          Array.from(rule.cssRules).forEach(sr => {
            if (sr.type === CSSRule.STYLE_RULE) {
              if (matchedMap[sr.selectorText]) {
                hasMatch = true;
                subRules.push(sr.cssText);
              }
            }
          });
          if (hasMatch) {
            sheetUsedRules.push(prettifyMediaRule(rule.conditionText, subRules));
          }
        }
      });

      if (sheetUsedRules.length > 0) {
        // Prettify individual style rules
        const formattedRules = sheetUsedRules.map(r => r.startsWith('@media') ? r : prettifyCSS(r));
        totalUsedGroups[filename] = formattedRules;
      }
    }

    await updateUI(usedRulesCount, totalRulesCount, totalRulesCount > 0 ? (usedRulesCount / totalRulesCount) * 100 : 0, totalUsedGroups);
    btn.disabled = false;
    btn.innerHTML = 'Scan CSS';
    
    const previewBtn = document.getElementById('preview-btn');
    previewBtn.style.display = 'block';
    previewBtn.innerText = 'Preview';
    previewBtn.dataset.state = 'original';
    previewBtn.dataset.currentHrefs = JSON.stringify(selectedSheets.map(s => s.href));
  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.innerHTML = 'Scan CSS';
    codeContainer.textContent = `/* Error: ${err.message} */`;
  }
});

// --- Preview Button ---
document.getElementById('preview-btn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const btn = document.getElementById('preview-btn');
  const isPreviewing = btn.dataset.state === 'preview';
  const usedCss = document.getElementById('used-css-code').textContent;
  const targetHrefs = JSON.parse(btn.dataset.currentHrefs || '[]');

  if (isPreviewing) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (hrefs) => {
        Array.from(document.styleSheets).forEach(s => {
          if (hrefs.includes(s.href || 'inline-style')) s.disabled = false;
        });
        document.getElementById('ppomcss-preview')?.remove();
        document.getElementById('ppomcss-preview-banner')?.remove();
      },
      args: [targetHrefs]
    });
    btn.innerText = 'Preview';
    btn.dataset.state = 'original';
    btn.style.background = 'var(--success)';
  } else {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (css, hrefs) => {
        Array.from(document.styleSheets).forEach(s => {
          if (hrefs.includes(s.href || 'inline-style')) s.disabled = true;
        });
        document.getElementById('ppomcss-preview')?.remove();
        document.getElementById('ppomcss-preview-banner')?.remove();
        const style = document.createElement('style');
        style.id = 'ppomcss-preview';
        style.textContent = css;
        document.head.appendChild(style);
        const banner = document.createElement('div');
        banner.id = 'ppomcss-preview-banner';
        banner.innerHTML = `<div style="position: fixed; top: 0; left: 0; right: 0; background: #10b981; color: white; padding: 10px; text-align: center; font-family: sans-serif; font-weight: bold; font-size: 14px; z-index: 1000000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">PpomCSS Audit: Optimized CSS Preview Active ✅ <span style="font-weight: normal; font-size: 12px; margin-left: 10px;">(Original scanned styles disabled)</span></div>`;
        document.body.prepend(banner);
      },
      args: [usedCss, targetHrefs]
    });
    btn.innerText = 'Restore';
    btn.dataset.state = 'preview';
    btn.style.background = '#ef4444';
  }
});

// --- UI Update & Auto-Save History ---
async function updateUI(used, total, percentage, cssGroups) {
  const roundedPercent = Math.round(percentage);
  document.getElementById('coverage-percent').innerText = `${roundedPercent}%`;
  document.getElementById('progress-bar').style.width = `${roundedPercent}%`;
  document.getElementById('used-rules').innerText = used;
  document.getElementById('total-rules').innerText = total;
  
  const codeContainer = document.getElementById('used-css-code');
  if (!cssGroups || Object.keys(cssGroups).length === 0) {
    codeContainer.textContent = '/* No usable styles found in selected sheets. */';
    document.getElementById('copy-btn').style.display = 'none';
    document.getElementById('save-history-btn').style.display = 'none';
    return;
  }

  let fullCode = '';
  for (const [filename, rules] of Object.entries(cssGroups)) {
    fullCode += `/* Source: ${filename} */\n`;
    fullCode += rules.join('\n\n');
    fullCode += '\n\n';
  }
  
  codeContainer.textContent = fullCode.trim();
  document.getElementById('copy-btn').style.display = 'block';

  // --- Auto-Save History for All Scanned Sheets ---
  const saveBtn = document.getElementById('save-history-btn');
  const allExtractedRules = [];
  for (const rules of Object.values(cssGroups)) {
    allExtractedRules.push(...rules);
  }
  
  if (allExtractedRules.length > 0) {
    saveBtn.style.display = 'block';
    saveBtn.dataset.groups = JSON.stringify(cssGroups);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab.url).pathname + new URL(tab.url).search;
    const history = JSON.parse(localStorage.getItem('auditHistory') || '[]');
    const existingIdx = history.findIndex(i => i.url === url);
    
    const rulesText = allExtractedRules.join('\n\n');
    const sizeKB = (new TextEncoder().encode(rulesText).length / 1024).toFixed(1);

    const item = {
      id: Date.now(),
      url: url,
      timestamp: new Date().toLocaleString(),
      rules: allExtractedRules, // Store flattened for display
      groups: cssGroups, // Store grouped for structured merge
      percentage: roundedPercent,
      size: `${sizeKB} KB`
    };

    if (existingIdx > -1) history[existingIdx] = item;
    else history.push(item);

    localStorage.setItem('auditHistory', JSON.stringify(history));

    // Update button text with cumulative count for THIS file
    const currentFn = localStorage.getItem('globalSelectedSheet');
    const sameFileScans = history.filter(i => i.groups && i.groups[currentFn]);
    saveBtn.innerText = `Saved (Total ${sameFileScans.length} pages)`;
    saveBtn.style.color = '#10b981';
  } else {
    saveBtn.style.display = 'none';
  }
}

function updateHistoryTitle() {
  const checked = document.querySelector('#sheet-list input:checked');
  const titleEl = document.getElementById('history-title');
  if (titleEl) {
    if (checked) {
      titleEl.innerText = `Saved Scans (${checked.dataset.filename})`;
    } else {
      titleEl.innerText = 'Saved Scans (All Files)';
    }
  }
}

function prettifyCSS(css) {
  return css
    .replace(/\{\s*/g, ' {\n    ')
    .replace(/;\s*/g, ';\n    ')
    .replace(/\s*\}\s*/g, '\n}\n')
    .replace(/\n\s*\n\}/g, '\n}') // Cleanup extra line before closing
    .replace(/\n\s*;\n/g, ';\n')     // Cleanup redundant semi newlines
    .replace(/;\s*\n\s*\}/g, ';\n}') // One last cleanup for closing brace
    .trim();
}

function prettifyMediaRule(mediaText, subRules) {
  // Prettify media blocks specifically
  const inner = subRules.map(r => '    ' + prettifyCSS(r).replace(/\n/g, '\n    ')).join('\n\n');
  return `@media ${mediaText} {\n${inner}\n}`;
}

// --- History List Rendering ---
function refreshHistoryList() {
  const history = JSON.parse(localStorage.getItem('auditHistory') || '[]');
  const list = document.getElementById('history-list');
  if (!list) return;
  list.innerHTML = '';

  if (history.length === 0) {
    list.innerHTML = '<div style="font-size: 12px; color: var(--text-dim);">No saved scans yet.</div>';
    return;
  }

  // Group by filename
  const groups = {};
  history.forEach(item => {
    // If it has 'groups' object (the new structure)
    if (item.groups) {
      Object.keys(item.groups).forEach(fn => {
        if (!groups[fn]) groups[fn] = [];
        groups[fn].push(item);
      });
    } else if (item.rules) {
      // Legacy flattened rules
      if (!groups['legacy']) groups['legacy'] = [];
      groups['legacy'].push(item);
    }
  });
  
  Object.entries(groups).forEach(([filename, items]) => {
    // Group Header
    const header = document.createElement('div');
    header.className = 'group-header';
    header.style.fontSize = '11px';
    header.style.fontWeight = '600';
    header.style.color = 'var(--primary)';
    header.style.marginTop = '12px';
    header.style.marginBottom = '6px';
    header.style.paddingLeft = '4px';
    header.style.borderLeft = '2px solid var(--primary)';
    header.innerText = `${filename.toUpperCase()} (${items.length} pages)`;
    list.appendChild(header);

    items.forEach(item => renderHistoryItem(item, list));
  });

  document.querySelectorAll('.delete-history-btn').forEach(btn => {
    btn.onclick = (e) => {
      const id = parseInt(e.target.dataset.id);
      const updatedHistory = JSON.parse(localStorage.getItem('auditHistory') || '[]').filter(i => i.id !== id);
      localStorage.setItem('auditHistory', JSON.stringify(updatedHistory));
      refreshHistoryList();
    };
  });
}

// --- History & Merge Buttons ---
document.getElementById('clear-history-btn')?.addEventListener('click', () => {
  if (confirm('Clear all saved scans?')) {
    localStorage.setItem('auditHistory', '[]');
    refreshHistoryList();
  }
});

document.getElementById('merge-btn')?.addEventListener('click', () => {
  const history = JSON.parse(localStorage.getItem('auditHistory') || '[]');
  if (history.length === 0) {
    alert('No history to merge.');
    return;
  }

  // Deduplicate and group by filename across all history items
  const mergedGroups = {}; // filename -> Set(rules)

  history.forEach(item => {
    // Handle both new 'groups' structure and old 'rules' structure
    if (item.groups) {
      for (const [filename, rules] of Object.entries(item.groups)) {
        if (!mergedGroups[filename]) mergedGroups[filename] = new Set();
        rules.forEach(r => mergedGroups[filename].add(r.trim()));
      }
    } else if (item.rules) {
      // Fallback for old history items: put in 'legacy' group
      if (!mergedGroups['legacy']) mergedGroups['legacy'] = new Set();
      item.rules.forEach(r => mergedGroups['legacy'].add(r.trim()));
    }
  });

  let mergedCode = '';
  for (const [filename, rulesSet] of Object.entries(mergedGroups)) {
    const rulesArray = Array.from(rulesSet);
    if (rulesArray.length > 0) {
      mergedCode += `/* Source: ${filename} (merged from history) */\n`;
      mergedCode += rulesArray.join('\n\n');
      mergedCode += '\n\n';
    }
  }

  const mergedCodeContainer = document.getElementById('merged-css-code');
  mergedCodeContainer.textContent = mergedCode.trim() || '/* No rules to merge */';
  
  if (mergedCode) {
    const sizeKB = (new TextEncoder().encode(mergedCode).length / 1024).toFixed(1);
    const pageCount = history.length;
    const ruleCount = Object.values(mergedGroups).reduce((acc, set) => acc + set.size, 0);
    const titleEl = document.querySelector('#content-merge .section-title');
    if (titleEl) titleEl.innerText = `Merged Result (${sizeKB} KB, ${pageCount} pages, ${ruleCount} rules)`;

    const copyBtn = document.getElementById('merge-copy-btn');
    if (copyBtn) copyBtn.style.display = 'block';

    navigator.clipboard.writeText(mergedCode.trim());
    const mergeBtn = document.getElementById('merge-btn');
    mergeBtn.innerText = 'Merged & Copied!';
    setTimeout(() => { mergeBtn.innerText = 'Merge & Deduplicate'; }, 2000);
  }
});

document.getElementById('classify-btn')?.addEventListener('click', () => {
  showSummaryModal();
});

document.getElementById('close-modal-btn')?.addEventListener('click', () => {
  const modal = document.getElementById('classify-modal');
  if (modal) modal.style.display = 'none';
});

function showSummaryModal() {
  const history = JSON.parse(localStorage.getItem('auditHistory') || '[]');
  const modal = document.getElementById('classify-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  content.innerHTML = '';
  modal.style.display = 'flex';

  if (history.length === 0) {
    content.innerHTML = '<div style="color: #64748b;">No data to summarize.</div>';
    return;
  }

  // Filename -> Board ID -> Summary
  const summary = {};
  history.forEach(item => {
    const filenames = item.groups ? Object.keys(item.groups) : ['legacy'];
    filenames.forEach(fn => {
      if (!summary[fn]) summary[fn] = {};
      
      const urlString = item.url.startsWith('http') ? item.url : `http://example.com${item.url}`;
      const urlObj = new URL(urlString);
      const bid = urlObj.searchParams.get('id') || 'Global/Common';
      
      if (!summary[fn][bid]) {
        summary[fn][bid] = { count: 0, totalRules: 0, totalSize: 0, urls: [] };
      }
      summary[fn][bid].count++;
      summary[fn][bid].totalRules += (item.rules || []).length;
      summary[fn][bid].totalSize += parseFloat((item.size || '0').replace(' KB', ''));
      summary[fn][bid].urls.push(item.url);
    });
  });

  Object.entries(summary).forEach(([fn, boards]) => {
    const fnHeader = document.createElement('div');
    fnHeader.style.color = 'var(--primary)';
    fnHeader.style.fontWeight = '700';
    fnHeader.style.fontSize = '13px';
    fnHeader.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    fnHeader.style.paddingBottom = '4px';
    fnHeader.style.marginTop = '8px';
    fnHeader.innerText = fn.toUpperCase();
    content.appendChild(fnHeader);

    Object.entries(boards).forEach(([bid, stats]) => {
      const bDiv = document.createElement('div');
      bDiv.style.background = 'rgba(255,255,255,0.02)';
      bDiv.style.padding = '10px';
      bDiv.style.borderRadius = '6px';
      bDiv.style.fontSize = '12px';
      bDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="color: #94a3b8; font-weight: 600;">Board ID: ${bid}</span>
          <span style="background: rgba(30, 64, 175, 0.4); color: #60a5fa; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
            ${stats.count} scans
          </span>
        </div>
        <div style="color: #64748b; font-size: 11px;">
          Total Extracted: ${stats.totalRules} rules (${stats.totalSize.toFixed(1)} KB)
        </div>
      `;
      content.appendChild(bDiv);
    });
  });
}

document.getElementById('merge-copy-btn')?.addEventListener('click', () => {
  const code = document.getElementById('merged-css-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const copyBtn = document.getElementById('merge-copy-btn');
    const originalText = copyBtn.innerText;
    copyBtn.innerText = 'Copied!';
    setTimeout(() => { copyBtn.innerText = originalText; }, 2000);
  });
});

document.getElementById('copy-btn').addEventListener('click', () => {
  const code = document.getElementById('used-css-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const copyBtn = document.getElementById('copy-btn');
    const originalText = copyBtn.innerText;
    copyBtn.innerText = 'Copied!';
    setTimeout(() => { copyBtn.innerText = originalText; }, 2000);
  });
});

// Manual Save Button (Optional status helper)
document.getElementById('save-history-btn')?.addEventListener('click', () => {
  switchTab('merge');
});
