/* ==========================================================================
 * Google Publisher Tag (GPT) 통합 관리 스크립트 (Final Optimized)
 * ========================================================================== */
let   strParams         = new URLSearchParams(window.location.search);
const CDN_BASE          = (typeof G_CDN_URL !== 'undefined') ? G_CDN_URL : '';

// [설정] 광고 동작 방식 통합 제어
const AD_CONFIG = {
    selector       : '.js-ad_slot',   // 광고 영역을 찾을 CSS 선택자
    loadingMode    : 'immediate',     // 'lazy' (추천) or 'immediate'
    autoRefresh    : true,            // 자동 갱신 여부
    refreshInterval: 60000,           // 60초
    rootMargin     : '300px',         // Lazy Load 거리
    topBannerIds   : [],              // 예: ['top'] (상단 배너 ID 입력 필요)
    exclusions     : ['adult'],       // 차단 키워드 ['politics', 'religion', 'adult', 'gambling', 'weapons', 'drugs']
    path_prefix    : '/65120695/'     // 관리할 광고 단위 경로
};

// [설정] 노출 실패시 광고
const FALLBACK_CONFIG = {
    // 카카오 애드핏
    KAKAO: {
        '300x250': { type: 'kakao', id: "DAN-1MLxp5kL7yHdOvaG", w: "300", h: "250" },
        '320x100': { type: 'kakao', id: "DAN-plee2e7MvEJjwIiF", w: "320", h: "100" }
    },
    // WTG
    WTG: {
        'w2g-slot1': { type: 'wtg', domain: "m.ppomppu.co.kr", slot : "w2g-slot1", w: "336", h: "280" },
        'w2g-slot2': { type: 'wtg', domain: "m.ppomppu.co.kr", slot : "w2g-slot2", w: "336", h: "280" },
        'w2g-slot3': { type: 'wtg', domain: "m.ppomppu.co.kr", slot : "w2g-slot3", w: "336", h: "280" },
        'w2g-slot8': { type: 'wtg', domain: "m.ppomppu.co.kr", slot : "w2g-slot8", w: "336", h: "280" },
        'w2g-slot9': { type: 'wtg', domain: "m.ppomppu.co.kr", slot : "w2g-slot9", w: "320", h: "100" },
    },
    IFRAME: {
        '300x250': { type: 'string', content: '<iframe src="'+CDN_BASE+'/banner/kakao_ad_300x250.html?v=2" scrolling="no" frameborder="0" max-width="350px" height="250px"></iframe>' },
        '320x100': { type: 'string', content: '<iframe src="'+CDN_BASE+'/banner/kakao_ad_320x100.html?v=2" scrolling="no" frameborder="0" max-width="350px" height="100px"></iframe>' }
    }
};

const CookieManager = {
    // 쿠키 저장
    set: function(name, value, days = 1) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        // 보안을 위해 SameSite 설정 추가 (최신 브라우저 권장)
        document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
    },

    // 쿠키 가져오기
    get: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    // 쿠키 삭제
    remove: function(name) {
        this.set(name, "", -1);
    }
};


const adMap = {}; // 슬롯 관리용 객체

const urlAdParam = strParams.get("ad_test");
if (urlAdParam === "1") {
    CookieManager.set("ad_test_mode", "1", 7); // 7일간 유지
} else if (urlAdParam === "0") {
    CookieManager.remove("ad_test_mode");
}
const isAdTest = (urlAdParam === "1" || CookieManager.get("ad_test_mode") === "1");

function adlogger(...args){
    const now = new Date();
    const timeString = `[${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
    if (isAdTest) console.log(`%c${timeString}[AD]`, "color: #4285F4; font-weight: bold;", ...args);
}

// -------------------------------------------------------------
// [기능] 광고 로드 및 타이머 시작
// -------------------------------------------------------------
function loadAdAndStartTimer(slot, divId) {
    googletag.cmd.push(function() {
        // 1. 광고 로드
        googletag.pubads().refresh([slot]);
        adlogger(`GPT Load: ${divId}`);

        // 2. 자동 갱신 (옵션)
        if (AD_CONFIG.autoRefresh) {
            // 기존 인터벌이 있다면 제거 (중복 실행 방지)
            if (slot._refreshInterval) clearInterval(slot._refreshInterval);
            
            slot._refreshInterval = setInterval(function() {
                // 탭이 활성화 상태일 때만 갱신 (리소스 절약)
                if (!document.hidden) {
                    googletag.pubads().refresh([slot]);
                    adlogger(`Auto Refresh: ${divId}`);
                }
            }, AD_CONFIG.refreshInterval);
        }
    });
}

// -------------------------------------------------------------
// [GPT] 초기 설정 및 서비스 시작
// -------------------------------------------------------------
googletag.cmd.push(function() {

    // [이벤트] 렌더링 종료 리스너 (성공/실패 감지)
    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
        const slotId = event.slot.getSlotElementId();

        if (event.isEmpty) {
            adlogger(`광고 미게재 (Empty): ${slotId}`);
            // UI 렌더링 충돌 방지를 위해 다음 프레임에 실행
            requestAnimationFrame(() => {
                displayFallbackAd(slotId);
            });
        } else {
            adlogger(`광고 게재 성공: ${slotId}`);
        }
    });

    // Lazy Loading을 위해 초기 로드 방지
    googletag.pubads().disableInitialLoad();

    // 타겟팅 및 보호 설정
    if( (typeof G_BBS_NO !== 'undefined') ){
        if (AD_CONFIG.exclusions && AD_CONFIG.exclusions.length > 0) {
            AD_CONFIG.exclusions.forEach(topic => {
                googletag.pubads().setCategoryExclusion(topic);
            });
            adlogger(`Excluded Categories: ${AD_CONFIG.exclusions}`);
        }

        googletag.pubads().setPrivacySettings({
            childDirectedTreatment: false,
            underAgeOfConsent: false,
            nonPersonalizedAds: false
        });
    }
    
    // 광고를 컨테이너 중앙에 배치
    // googletag.pubads().setCentering(true);

    // SRA 및 서비스 활성화
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});

// -------------------------------------------------------------
// [DOM] 로딩 전략 실행 (DOMContentLoaded)
// -------------------------------------------------------------
function onDomReady(fn) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn);
    } else {
        fn();
    }
}

onDomReady(function () {
    googletag.cmd.push(function () {
        const adDivs = document.querySelectorAll(AD_CONFIG.selector);
        adlogger("DOMContentLoaded");

        // 0. display 실행
        adDivs.forEach(div => {
            if (div.id) {
                googletag.display(div.id);
                adlogger(div.id);
            }
        });

        // 1. 슬롯 매핑 (이미 defineSlot이 실행되어 있어야 함)
        googletag.pubads().getSlots().forEach(slot => {
            if (slot.getAdUnitPath().startsWith(AD_CONFIG.path_prefix)) {
                adMap[slot.getSlotElementId()] = slot;
            }
        });
        adlogger(`Mapped Slots: ${Object.keys(adMap).length}`);

        // 2. 모드에 따른 로딩
        if (AD_CONFIG.loadingMode === "immediate") {
            // [모드 A] 전체 즉시 로딩
            Object.keys(adMap).forEach(divId => {
                loadAdAndStartTimer(adMap[divId], divId);
            });
        } else {
            // [모드 B] Lazy Loading

            // A. 상단 배너 즉시 로드
            AD_CONFIG.topBannerIds.forEach(id => {
                if (adMap[id]) {
                    loadAdAndStartTimer(adMap[id], id);
                    delete adMap[id]; // 관찰 대상에서 제외
                }
            });

            // B. 나머지 Observer 관찰
            const adObserver = new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const divId = entry.target.id;
                            const slot = adMap[divId];
                            if (slot) {
                                loadAdAndStartTimer(slot, divId);
                                delete adMap[divId]; // 중복 로드 방지
                                adObserver.unobserve(entry.target);
                            }
                        }
                    });
                },
                { rootMargin: AD_CONFIG.rootMargin }
            );

            // 관찰 대상 설정
            const lazyAdDivs = document.querySelectorAll(AD_CONFIG.selector);
            lazyAdDivs.forEach(ad => {
                // 아직 로드되지 않은 슬롯만 관찰
                if (adMap[ad.id]) {
                    adlogger(`Observing: ${ad.id}`);
                    adObserver.observe(ad);
                }
            });
        }
    });
});

// -------------------------------------------------------------
// [Fallback] 대체 광고 노출 로직
// -------------------------------------------------------------
function displayFallbackAd(slotId) {
    if (typeof slotId !== "string" || !slotId) return;

    const isGuest = (typeof G_IS_GUEST !== "undefined") && G_IS_GUEST;

    const fallbackSlots = {
        'm_view_f': () => {
            return isGuest ? FALLBACK_CONFIG.WTG['w2g-slot3']: FALLBACK_CONFIG.WTG['w2g-slot3'];
        },
        'm_main2_f'      : () => FALLBACK_CONFIG.KAKAO['320x100'],
        'm_comment2_f'   : () => FALLBACK_CONFIG.IFRAME['320x100'],
        'm_bottom'       : () => FALLBACK_CONFIG.KAKAO['300x250'],
        'm_view_bottom_f': () => FALLBACK_CONFIG.IFRAME['300x250'],
    };

    const matchedKey = Object.keys(fallbackSlots).find(key => slotId.includes(key));

    if (matchedKey && typeof fallbackSlots[matchedKey] === 'function') {
        const adData = fallbackSlots[matchedKey]();
        injectFallbackAd(slotId, adData);
    } else {
        adlogger(`Fallback config not found for: ${slotId}`);
    }
}

/**
 * 해당 슬롯의 자동 갱신 타이머를 찾아 중지시키는 함수
 */
function stopAutoRefresh(slotId) {
    // 1. adMap에 남아있다면 거기서 찾기
    let slot = adMap[slotId];

    // 2. adMap에 없다면(이미 로드되어 삭제된 경우), GPT 전체 슬롯 목록에서 검색
    if (!slot) {
        slot = googletag.pubads().getSlots().find(s => s.getSlotElementId() === slotId);
    }

    // 3. 슬롯을 찾았고, 타이머가 돌고 있다면 정지
    if (slot && slot._refreshInterval) {
        clearInterval(slot._refreshInterval);
        slot._refreshInterval = null; // 재실행 방지
        adlogger(`[Stop] Refresh Disabled for Fallback: ${slotId}`);
    }
}


/**
 * [기능] 통합 대체 광고 주입 함수
 */
function injectFallbackAd(slotId, adData) {
    const targetElement = document.getElementById(slotId);
    if (!targetElement || !adData) return;

    // 광고 유형에 따른 처리
    switch (adData.type) {
        case 'string': // 기존 iframe 문자열 방식
            targetElement.innerHTML = adData.content;
            adlogger(`string Ad Injected: ${slotId}[${adData.content}]`);
            break;        
        case 'kakao':
            renderKakaoAd(targetElement, adData);
            break;
        case 'wtg':
            stopAutoRefresh(slotId);
            renderWtgAd(targetElement, adData);
            break;
        default:
            adlogger(`Unknown Ad Type: ${adData.type}`);
    }
}

/**
 * [플랫폼 전용] 카카오 애드핏 렌더링
 */
function renderKakaoAd(targetElement, adData) {
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', adData.id);
    ins.setAttribute('data-ad-width', adData.w);
    ins.setAttribute('data-ad-height', adData.h);

    targetElement.innerHTML = '';
    targetElement.appendChild(ins);

    // 스크립트 로드
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    document.head.appendChild(script);

    adlogger(`Kakao Ad Injected: ${adData.id}`);
}

/**
 * [플랫폼 전용] WTG 대체 광고 주입기
 */
function renderWtgAd(targetElement, adData) {
    if (!targetElement) return false;
    
    const domain = adData.domain;
    const slot   = adData.slot;

    if (targetElement.querySelector(`#${slot}-cnt`)) return false;

    const originalSource = `
    <div id="${slot}-cnt">
        <script>
            (function () {
                var domain = '${domain}';
                var slot = '${slot}';
                var d = document, w = window, parent = null;
                if (typeof d.currentScript !== 'undefined' && d.currentScript) {
                    parent = d.currentScript.parentElement;
                } else {
                    parent = document.getElementById(slot + '-cnt');
                }
                d.addEventListener('wtgLoaded', function (e) {
                    if (w.w2g && typeof w.w2g.single === 'function') {
                        w.w2g.single(domain, slot, parent);
                    }
                }, false);
                if (typeof w.w2gLoaded === 'undefined') { w.w2gLoaded = 0; }
                if (w.w2gLoaded < 1 && typeof w.w2g === 'undefined') {
                    var element = d.createElement('script');
                    element.type = 'text/javascript';
                    element.async = true;
                    element.src = 'https://lib.wtg-ads.com/lib.single.wtg.min.js';
                    var head = d.head || d.getElementsByTagName('head')[0];
                    head.appendChild(element);
                    w.w2gLoaded++;
                }
                if (typeof w.w2g !== 'undefined' && typeof w.w2g.single === 'function') {
                    w.w2g.single(domain, slot, parent);
                }
            })();
        <\/script>
    </div>`;

    const range = document.createRange();
    range.selectNode(targetElement); 
    const fragment = range.createContextualFragment(originalSource);
    
    targetElement.replaceChildren(fragment);
    adlogger(`WTG Ad Injected: ${slot}`);
    return true;
}