(function(window, document) {
  const AD_LIB_URL = 'https://lib.wtg-ads.com/lib.single.wtg.min.js';
  let w2gLoadedCount = 0;
  let loadPromise = null;
  const slotQueue = [];

  // 라이브러리 로드 (한 번만)
  function loadAdLibrary() {
    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = AD_LIB_URL;
      script.onload = () => {
        w2gLoadedCount++;
        resolve();
      };
      script.onerror = () => reject(new Error('WTG ad lib failed to load'));
      document.head.appendChild(script);
    });

    return loadPromise;
  }

  // 슬롯 초기화: viewability 감지 후 라이브러리 로드 → 광고 호출
  function initSlot(el) {
    const domain = el.dataset.domain;
    const slot   = el.dataset.slot;
    console.log("domain=>", domain, " slot=>",slot);
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(el);
          loadAdLibrary()
            .then(() => {
              if (window.w2g && typeof window.w2g.single === 'function') {
                window.w2g.single(domain, slot, el);
                // 광고 로드 성공 콜백
                el.dispatchEvent(new CustomEvent('adLoaded', { detail: { slot } }));
              }
            })
            .catch(err => {
              console.error('Ad lib load error:', err);
              el.dispatchEvent(new CustomEvent('adError', { detail: { slot, error: err }}));
            });
        }
      });
    }, { rootMargin: '200px' }); // viewport 기준 200px 전 로드 시작

    io.observe(el);
  }

  // DOM 준비 시 모든 슬롯 예약
  function scanSlots() {
    document.querySelectorAll('.w2g-slot').forEach(el => {
      slotQueue.push(el);
    });
    slotQueue.forEach(initSlot);
  }

  // 광고 리프레시 함수 (예: 60초마다)
  function refreshAds(intervalSec = 60) {
    setInterval(() => {
      slotQueue.forEach(el => {
        const domain = el.dataset.domain;
        const slot   = el.dataset.slot;
        if (window.w2g && typeof window.w2g.single === 'function') {
          window.w2g.single(domain, slot, el);
          el.dispatchEvent(new CustomEvent('adRefreshed', { detail: { slot } }));
        }
      });
    }, intervalSec * 1000);
  }

  // 이벤트 리스너 예시
  document.addEventListener('adLoaded', e => {
    console.log(`Ad loaded for slot: ${e.detail.slot}`);
  });
  document.addEventListener('adError', e => {
    console.warn(`Ad error on slot: ${e.detail.slot}`, e.detail.error);
  });
  document.addEventListener('adRefreshed', e => {
    console.log(`Ad refreshed for slot: ${e.detail.slot}`);
  });

  // 초기 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanSlots);
  } else {
    scanSlots();
  }
  // 원하면 자동 새로고침 활성화
  // refreshAds(60);

})(window, document);