chrome.runtime.onInstalled.addListener(() => {
  console.log("Web Resource Traffic Analyzer Installed");
});

// Open side panel on action click
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Monitor network traffic
chrome.webRequest.onResponseStarted.addListener(
  (details) => {
    // Only process requests from tabs where the side panel might be active
    // Or filter by domain here if needed
    const entry = {
      request: {
        url: details.url
      },
      response: {
        _transferSize: 0, // webRequest doesn't easily give transfer size in MV3 without full body
        content: {
          mimeType: details.responseHeaders?.find(h => h.name.toLowerCase() === 'content-type')?.value || ''
        }
      },
      time: 0 // Duration not easily available in onResponseStarted
    };

    // Try to get content-length for size estimation
    const contentLength = details.responseHeaders?.find(h => h.name.toLowerCase() === 'content-length')?.value;
    if (contentLength) {
      entry.response.bodySize = parseInt(contentLength, 10);
    }

    // Send to side panel
    chrome.runtime.sendMessage({ action: 'network-entry', entry }).catch(() => {
      // Ignore errors if side panel is not open
    });
  },
  { urls: ["*://*.ppomppu.co.kr/*"] },
  ["responseHeaders"]
);

// Reset data on page navigation/refresh
chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0) { // Main frame only
    chrome.runtime.sendMessage({ action: 'reset-data' }).catch(() => {});
  }
}, { url: [{ hostSuffix: 'ppomppu.co.kr' }] });

// For extension communication if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    sendResponse({ status: 'ok' });
  }
});
