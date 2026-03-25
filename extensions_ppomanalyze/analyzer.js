export class ResourceAnalyzer {
  constructor() {
    this.totalSize = 0;
    this.groups = {};
    this.topResources = [];
    this.domainFilter = "ppomppu.co.kr";
  }

  reset() {
    this.totalSize = 0;
    this.groups = {};
    this.topResources = [];
  }

  addEntry(entry) {
    const url = entry.request.url;
    // Allow any subdomain of ppomppu.co.kr
    if (this.domainFilter && !url.includes(this.domainFilter)) return;

    const size = entry.response.bodySize || entry.response._transferSize || 0;
    const time = entry.time || 0;
    const type = this.getExtension(url, entry.response.content.mimeType || '');

    this.totalSize += size;

    if (!this.groups[type]) {
      this.groups[type] = { count: 0, totalSize: 0, items: [] };
    }

    const item = {
      url: url,
      filename: url.split('/').pop() || url,
      size: size,
      time: time,
      type: type
    };

    this.groups[type].count++;
    this.groups[type].totalSize += size;
    this.groups[type].items.push(item);

    // Update Top 10
    this.topResources.push(item);
    this.topResources.sort((a, b) => b.size - a.size);
    if (this.topResources.length > 20) {
      this.topResources.pop();
    }
  }

  getExtension(url, mimeType) {
    const ext = url.split('.').pop().split(/[?#]/)[0].toLowerCase();
    
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'];
    if (imageExtensions.includes(ext)) return 'image';
    
    if (ext === 'js') return 'js';
    if (ext === 'css') return 'css';
    if (ext === 'html' || ext === 'php') return 'document';
    
    if (mimeType.includes('javascript')) return 'js';
    if (mimeType.includes('css')) return 'css';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('json') || mimeType.includes('xml')) return 'fetch/xhr';
    
    return 'other';
  }

  getStats(excludeCdn = false) {
    let filteredTotalSize = 0;
    let filteredGroups = {};
    let filteredResources = [];

    // Filter items first
    const allItems = Object.values(this.groups).flatMap(g => g.items);
    const filteredItems = allItems.filter(item => {
      const isCdn = item.url.replace(/^https?:\/\//, '').startsWith('cdn');
      if (excludeCdn) {
        return !isCdn;
      }
      return true;
    });

    // Reconstruct stats from filtered items
    filteredItems.forEach(item => {
      filteredTotalSize += item.size;
      if (!filteredGroups[item.type]) {
        filteredGroups[item.type] = { count: 0, totalSize: 0, items: [] };
      }
      filteredGroups[item.type].count++;
      filteredGroups[item.type].totalSize += item.size;
      filteredGroups[item.type].items.push(item);
      filteredResources.push(item);
    });

    return {
      totalSize: filteredTotalSize,
      groups: filteredGroups,
      topResources: filteredResources.sort((a, b) => b.size - a.size).slice(0, 100)
    };
  }
}
