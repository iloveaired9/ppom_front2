# 📌 프로젝트명: Web Resource Traffic Analyzer (Chrome Extension)

## 1. 프로젝트 개요 (Overview)

본 프로젝트는 현재 활성화된 웹 페이지(예: `m.ppomppu.co.kr`)의 네트워크 리소스 로드 현황을 분석하는 크롬 익스텐션을 개발하는 것입니다.
주요 목적은 **확장자별 네트워크 요청 통계를 확인**하고, **가장 큰 트래픽을 유발하는 상위(Top) 리소스를 식별하여 성능 개선 포인트를 도출**하는 것입니다. 향후 기능 확장을 고려하여 비즈니스 로직과 UI 렌더링이 철저히 분리된 구조로 개발합니다.

## 2. 핵심 요구사항 (Core Requirements)

### 2.1. 기능적 요구사항 (Functional Requirements)

1. **네트워크 데이터 캡처 (Network Interception)**

   - `chrome.devtools.network` API를 사용하여 실제 브라우저 네트워크 탭과 동일한 수준의 정확한 리소스 데이터를 캡처합니다.
   - 대상 도메인(예: `ppomppu.co.kr`)을 필터링하는 기능을 제공합니다.
2. **확장자별 그룹화 및 통계 (Grouping & Aggregation)**

   - 수집된 리소스를 파일 확장자별(`css`, `js`, `png`, `jpg`, `gif`, `webp`, `document`, `fetch/xhr` 등)로 그룹화합니다.
   - 각 확장자별 **요청 횟수(Count)** 및 **총 파일 크기(Total Size, KB/MB 단위)**를 실시간으로 집계합니다.
3. **상세 내역 및 정렬 (Detail & Sorting)**

   - 확장자 그룹 클릭 시, 해당 그룹에 속한 개별 리소스 목록(URL, 파일명, 개별 크기, 응답 시간)을 표시합니다.
   - 파일 크기(Size) 및 응답 시간(Time) 기준으로 내림차순 정렬 기능을 제공합니다.
4. **TOP 트래픽 리소스 대시보드 (Top Traffic Dashboard)**

   - 확장자에 상관없이 가장 트래픽을 많이 소모하는 상위 10개(Top 10) 리소스를 별도 탭이나 패널 상단에 하이라이트하여 보여줍니다.

### 2.2. 확장성 및 아키텍처 요구사항 (Scalability & Architecture)

- **UI 형태:** Chrome DevTools Panel(개발자 도구 내 탭) 형태로 제작하여 분석 환경의 일관성을 유지합니다.
- **모듈형 설계 (Modular Design):**
  - `background.js`: 확장 프로그램의 생명주기 관리 및 익스텐션 설정 상태 유지.
  - `devtools.js`: DevTools 패널 생성 로직.
  - `panel.html / panel.js`: 실제 UI 렌더링.
  - `analyzer.js` (Core Logic): 수집된 HAR(HTTP Archive) 형식의 네트워크 데이터를 확장자별로 파싱하고 그룹화/정렬하는 순수 데이터 가공 로직.
- **UI 프레임워크:** 순수 Vanilla JS (ES Modules 활용) 또는 경량화된 형태(TailwindCSS 도입 등)로 작성하여 AI가 코드를 쉽게 리팩토링할 수 있도록 합니다.

## 3. 데이터 흐름 및 로직 설계 (Data Flow & Logic Design)

### 3.1. 데이터 모델 (Data Model)

수집 및 가공될 데이터의 핵심 구조는 다음과 같습니다.

```javascript
// Data Structure Example
const trafficData = {
  domain: "m.ppomppu.co.kr",
  totalSize: 5242880, // in bytes (5MB)
  groups: {
    "png": {
      count: 15,
      totalSize: 2048000, // 2MB
      items: [
        { url: "https://...", filename: "main_bg.png", size: 1500000, time: 120 }
      ]
    },
    "js": { /* ... */ },
    "css": { /* ... */ }
  },
  topResources: [
    // Top 10 items sorted by size globally
    { url: "https://...", type: "png", size: 1500000 }
  ]
};
```
