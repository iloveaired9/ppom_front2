document.getElementById('analyze-btn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Show loading state
  const btn = document.getElementById('analyze-btn');
  btn.disabled = true;
  btn.innerHTML = 'Analyzing...';

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: runCSSAudit
  }, (results) => {
    btn.disabled = false;
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> Run Audit Now';

    if (results && results[0] && results[0].result) {
      const { used, total, percentage } = results[0].result;
      updateUI(used, total, percentage);
    }
  });
});

function updateUI(used, total, percentage) {
  const percentEl = document.getElementById('coverage-percent');
  const barEl = document.getElementById('progress-bar');
  const usedEl = document.getElementById('used-rules');
  const totalEl = document.getElementById('total-rules');

  // Animate numbers
  animateValue(percentEl, 0, Math.round(percentage), 1000, '%');
  animateValue(usedEl, 0, used, 1000);
  animateValue(totalEl, 0, total, 1000);

  // Update bar
  barEl.style.width = `${percentage}%`;
}

function animateValue(obj, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// This function runs in the context of the web page
function runCSSAudit() {
  let totalRules = 0;
  let usedRules = 0;

  for (const sheet of document.styleSheets) {
    try {
      // Skip cross-origin stylesheets if no CORS
      if (!sheet.cssRules) continue;
      
      const rules = sheet.cssRules;
      for (const rule of rules) {
        if (rule.type === CSSRule.STYLE_RULE) {
          totalRules++;
          try {
            if (document.querySelector(rule.selectorText)) {
              usedRules++;
            }
          } catch (e) {
            // Some selectors might be invalid or not supported by querySelector
          }
        }
      }
    } catch (e) {
      console.warn('Could not access stylesheet:', sheet.href);
    }
  }

  return {
    used: usedRules,
    total: totalRules,
    percentage: totalRules > 0 ? (usedRules / totalRules) * 100 : 0
  };
}
