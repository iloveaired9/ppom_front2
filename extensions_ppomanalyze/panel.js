import { ResourceAnalyzer } from './analyzer.js';

const analyzer = new ResourceAnalyzer();

// --- UI Elements ---
const totalSizeEl = document.getElementById('total-traffic');
const totalCountEl = document.getElementById('total-count');
const extensionsTableBody = document.querySelector('#extensions-table tbody');
const topListTableBody = document.querySelector('#top-list-table tbody');
const clearBtn = document.getElementById('clear-btn');
const cdnFilterCheckbox = document.getElementById('cdn-filter');

let typeFilter = null; // Filter for "Details"

// --- Tab Logic ---
const tabs = document.querySelectorAll('.tab');
function switchTab(target) {
    tabs.forEach(t => t.classList.remove('active'));
    tabs.forEach(t => {
        if (t.dataset.tab === target) t.classList.add('active');
    });
    
    document.getElementById('view-dashboard').style.display = target === 'dashboard' ? 'grid' : 'none';
    document.getElementById('view-extensions').style.display = target === 'extensions' ? 'flex' : 'none';
    document.getElementById('view-top-list').style.display = target === 'top-list' ? 'flex' : 'none';
    
    updateUI();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.dataset.tab !== 'top-list') typeFilter = null; // Clear filter if manually switching away
    switchTab(tab.dataset.tab);
  });
});

// --- Message Handling ---
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'network-entry') {
    analyzer.addEntry(message.entry);
    updateUI();
  } else if (message.action === 'reset-data') {
    analyzer.reset();
    updateUI();
  }
});

// Load saved filter state
chrome.storage.local.get(['excludeCdn'], (result) => {
    if (result.excludeCdn !== undefined) {
        cdnFilterCheckbox.checked = result.excludeCdn;
        updateUI();
    }
});

cdnFilterCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ excludeCdn: cdnFilterCheckbox.checked });
    updateUI();
});

// --- Functions ---
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

let currentSort = 'size'; // 'size' or 'time'

function updateUI() {
  const stats = analyzer.getStats(cdnFilterCheckbox.checked);
  
  const totalCount = Object.values(stats.groups).reduce((acc, g) => acc + g.count, 0);
  const totalSizeStr = formatSize(stats.totalSize);

  // Dashboard
  totalSizeEl.innerText = totalSizeStr;
  totalCountEl.innerText = totalCount;

  // Summaries on other tabs
  const summaryText = `Total: ${totalSizeStr} / ${totalCount} Requests`;
  const extSummary = document.getElementById('extensions-summary');
  const reqSummary = document.getElementById('requests-summary');
  if (extSummary) extSummary.innerText = summaryText;
  if (reqSummary) reqSummary.innerText = summaryText;

  // Extensions Table
  extensionsTableBody.innerHTML = '';
  Object.entries(stats.groups).sort((a,b) => b[1].totalSize - a[1].totalSize).forEach(([type, data]) => {
    const percentage = stats.totalSize > 0 ? ((data.totalSize / stats.totalSize) * 100).toFixed(1) : 0;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><span class="type-badge type-${type}">${type}</span></td>
      <td style="color: var(--text-dim); font-size: 11px;">${percentage}%</td>
      <td>${data.count}</td>
      <td>${formatSize(data.totalSize)}</td>
      <td class="details-link" data-type="${type}" style="color: var(--primary); cursor: pointer; font-weight: 600;">Details</td>
    `;
    
    row.querySelector('.details-link').onclick = () => {
        typeFilter = type;
        switchTab('top-list');
    };
    
    extensionsTableBody.appendChild(row);
  });

  // Top List Table
  topListTableBody.innerHTML = '';
  // Apply type filter if set from "Details"
  let displayResources = typeFilter 
    ? stats.topResources.filter(r => r.type === typeFilter)
    : stats.topResources;

  const sortedResources = [...displayResources].sort((a, b) => {
    let valA = a[currentSort];
    let valB = b[currentSort];
    
    // Custom handling for Extension
    if (currentSort === 'ext') {
        const getExt = (url) => url.split('.').pop().split(/[?#]/)[0].toLowerCase().substring(0, 5);
        valA = getExt(a.url);
        valB = getExt(b.url);
    }
    
    if (typeof valA === 'string') {
        return valB.localeCompare(valA); // Default to Desc for strings too
    }
    return valB - valA; // Descending
  });

  sortedResources.forEach(item => {
    const ext = item.url.split('.').pop().split(/[?#]/)[0].toLowerCase().substring(0, 5);
    const percentage = stats.totalSize > 0 ? ((item.size / stats.totalSize) * 100).toFixed(1) : 0;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td title="${item.url}" style="display: flex; align-items: center;">
        <span class="filename" style="overflow: hidden; text-overflow: ellipsis; flex: 1;">${item.filename}</span>
        <button class="copy-btn" title="Copy URL">Copy</button>
      </td>
      <td style="color: var(--text-dim); font-size: 11px;">${percentage}%</td>
      <td style="color: var(--text-dim); opacity: 0.8;">.${ext}</td>
      <td><span class="type-badge type-${item.type}">${item.type}</span></td>
      <td>${formatSize(item.size)}</td>
      <td>${Math.round(item.time)}ms</td>
    `;
    
    const copyBtn = row.querySelector('.copy-btn');
    copyBtn.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(item.url);
        copyBtn.innerText = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.innerText = 'Copy';
            copyBtn.classList.remove('copied');
        }, 1500);
    };
    
    topListTableBody.appendChild(row);
  });
}

// Add simplistic sort toggle
const headers = document.querySelectorAll('#top-list-table th');
const sortMap = { 1: 'size', 2: 'ext', 3: 'type', 4: 'size', 5: 'time' };

headers.forEach((th, index) => {
    if (index === 0) return; // Skip Filename
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
        const sortKey = sortMap[index];
        if (sortKey) {
            currentSort = sortKey;
            updateUI();
        }
    });
});

clearBtn.addEventListener('click', () => {
  analyzer.reset();
  updateUI();
});

// Update UI periodically if needed, though listeners handle most updates
setInterval(updateUI, 2000);
