# Architecture — Sarrast Performance Optimizer

**Project**: `sarrast-performance-optimizer`  
**Version**: 1.2.3

---

## Overview

Single-file IIFE userscript (~1000 lines) with zero runtime dependencies. All logic self-contained in one closure.

```
┌─────────────────────────────────────────────────────────────────┐
│                    IIFE (Immediately Invoked)                   │
├─────────────────────────────────────────────────────────────────┤
│  1. CONFIG OBJECT          →  Central configuration (17 opts)  │
│  2. PAGE DETECTION         →  isReaderPage, isHomepage, etc.   │
│  3. EARLY CSS INJECTION    →  Style element at document-start  │
│  4. INITIAL CLASS APPLY    →  sarrast-disable-scroll-effects,  │
│                              sarrast-calm, sarrast-force-visible│
│  5. SCROLL HANDLER         →  markScrolling() (legacy only)    │
│  6. IDLE CALLBACK SCHEDULER → runWhenIdle()                    │
│  7. OPTIMIZATION MODULES   →  optimizeImage, Iframe, Box,      │
│                              HeroSlide, Card                    │
│  8. BATCH PROCESSOR        →  processQueues() (5 queues)       │
│  9. MUTATION OBSERVER      →  Observes body, queues new nodes  │
│ 10. SPA HANDLERS           →  htmx events, load, resize        │
│ 11. AD CLEANUP             →  setInterval (5s)                 │
│ 12. ALPINE PATCH           →  Hero component autoplay disable  │
│ 13. CLEANUP                →  pagehide listener                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Module Breakdown

### 1. Configuration (CONFIG)
- **Location**: Lines 50-116
- **Pattern**: Single const object with 17 options
- **Usage**: All modules read from CONFIG; feature flags control code paths

### 2. Page Detection
- **Location**: Lines 128-138
- **Variables**: `isReaderPage`, `isHomepage`, `isSeriesListing`
- **Logic**: Regex on `location.pathname`

### 3. Early CSS Injection
- **Location**: Lines 143-516
- **Pattern**: Dynamic CSS template literal built from CONFIG
- **Injection**: `document.documentElement.appendChild(style)` at document-start
- **CSS Sections**:
  - Base optimization (scroll-behavior, scroll-snap, will-change)
  - Permanent scroll-effects disable (v1.2.2+)
  - Legacy scroll-time surgical optimization
  - Calm motion / animation reduction
  - Hero carousel autoplay disable
  - Force content-visibility: visible
  - Large image optimization
  - Translation overlay boxes
  - Hero carousel off-screen
  - Card grid optimization
  - Iframe optimization
  - Below-fold acceleration (intrinsic size)
  - Reveal elements intrinsic size
  - Skeleton shimmer
  - Ad blocking

### 4. Initial Class Application
- **Location**: Lines 522-540
- **Function**: `applyInitialClasses()`
- **Classes Added**:
  - `sarrast-disable-scroll-effects` (if CONFIG.disableAllScrollEffects)
  - `sarrast-calm` (if CONFIG.calmMotion)
  - `sarrast-force-visible` on body (if CONFIG.forceContentVisibilityVisible)

### 5. Scroll Handler (Legacy)
- **Location**: Lines 549-569
- **Function**: `markScrolling()`
- **Behavior**: Returns early if `disableAllScrollEffects` is true
- **Mechanism**: Passive scroll listener → requestAnimationFrame → add class → timeout removal
- **Delay**: CONFIG.scrollEndDelay (300ms)

### 6. Idle Callback Scheduler
- **Location**: Lines 577-583
- **Function**: `runWhenIdle(callback, timeout)`
- **Primary**: `requestIdleCallback` with timeout
- **Fallback**: `setTimeout`

### 7. Optimization Modules
| Module | Function | Target | Key Logic |
|--------|----------|--------|-----------|
| Images | `optimizeImage()` | `img` | decoding=async, lazy/eager by viewport, large image class |
| Iframes | `optimizeIframe()` | `iframe` | lazy loading for off-screen |
| Boxes | `optimizeBox()` | `.bx` | Reader page only, intrinsic size per box |
| Hero Slides | `optimizeHeroSlide()` | `.hs-col` | Homepage only, off-screen detection |
| Cards | `optimizeCard()` | `.card` | Series listing only, skeleton for empty images |

### 8. Batch Processor
- **Location**: Lines 749-810
- **Queues**: `imageQueue`, `frameQueue`, `boxQueue`, `heroQueue`, `cardQueue`
- **Processing**: Round-robin across queues, max CONFIG.batchSize (100) per idle callback
- **Recursive**: Re-schedules itself if queues not empty

### 9. MutationObserver
- **Location**: Lines 818-887
- **Target**: `document.body` with `childList: true, subtree: true`
- **Filtering**: Direct match + `querySelectorAll` for subtree
- **Debouncing**: `mutationScheduled` flag → `runWhenIdle(processQueues)`

### 10. SPA Navigation Handlers
- **htmx**: `htmx:afterSwap`, `htmx:load` → `queueCurrentContent()` after 100ms
- **Full Load**: `window.load` → after 500ms
- **Resize**: Debounced 250ms → `queueCurrentContent()`

### 11. Ad Cleanup
- **Location**: Lines 943-954
- **Interval**: 5000ms
- **Selectors**: `[id*="ad"]`, `[class*="ad-slot"]`, `[class*="advertisement"]`, `.juicyads`, `[src*="juicyads"]`, `iframe[src*="ads"]`

### 12. Alpine Hero Patch
- **Location**: Lines 960-982
- **Mechanism**: `alpine:init` event → iterate `[x-data]` → force `reduced: true` getter
- **Purpose**: Disable autoplay at component level (not just CSS)

### 13. Cleanup
- **Location**: Lines 988-992
- **Event**: `pagehide` (once, passive)
- **Actions**: Clear scroll timer, cancel RAF, disconnect observer

---

## Data Flow

```
Page Load (document-start)
         │
         ▼
┌────────────────────────┐
│ Inject CSS Style       │ ──► Immediate paint-time optimizations
│ Apply Initial Classes  │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ DOMContentLoaded       │
│ startObserver()        │ ──► Observe body for dynamic content
│ queueCurrentContent()  │ ──► Initial batch processing
└────────┬───────────────┘
         │
         ▼
    ┌────┴────┐
    │         │
    ▼         ▼
Scroll     MutationObserver
Events     (added nodes)
    │         │
    │         ▼
    │    Queue relevant
    │    elements
    │         │
    └────┬────┘
         ▼
    ┌────────────────┐
    │ processQueues() │ ◄─── runWhenIdle (requestIdleCallback)
    │ (batch 100)     │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │ Optimization   │
    │ Functions      │
    │ (Image, Box,   │
    │  Hero, Card,   │
    │  Iframe)       │
    └────────────────┘
```

---

## State Management

| State | Type | Purpose |
|-------|------|---------|
| `processedImages` | WeakSet | Deduplicate image processing |
| `processedFrames` | WeakSet | Deduplicate iframe processing |
| `processedBoxes` | WeakSet | Deduplicate box processing |
| `processedHeroSlides` | WeakSet | Deduplicate hero slide processing |
| `processedCards` | WeakSet | Deduplicate card processing |
| `imageQueue` | Array | Pending images for batch processing |
| `frameQueue` | Array | Pending iframes |
| `boxQueue` | Array | Pending boxes |
| `heroQueue` | Array | Pending hero slides |
| `cardQueue` | Array | Pending cards |
| `processing` | Boolean | Prevent concurrent batch processing |
| `mutationScheduled` | Boolean | Debounce MutationObserver callbacks |
| `scrollTimer` | Timer ID | Scroll-end delay timeout |
| `scrollFrame` | RAF ID | Scroll animation frame |
| `resizeTimer` | Timer ID | Resize debounce |

---

## CSS Class Architecture

### Applied to `<html>`:
| Class | Condition | Purpose |
|-------|-----------|---------|
| `sarrast-disable-scroll-effects` | CONFIG.disableAllScrollEffects (default true) | Permanent disable of scroll-only effects |
| `sarrast-calm` | CONFIG.calmMotion (default true) | Reduce animations/transitions |
| `sarrast-scrolling` | Legacy mode + active scroll | Temporary disable during scroll |

### Applied to `<body>`:
| Class | Condition | Purpose |
|-------|-----------|---------|
| `sarrast-force-visible` | CONFIG.forceContentVisibilityVisible | Force content-visibility: visible |

### Applied to Elements:
| Class | Element | Purpose |
|-------|---------|---------|
| `sarrast-large-image` | `img` | Large image optimization |
| `sarrast-reader-image` | `.col .pg` | Reader page comic images |
| `sarrast-box` | `.bx` | Translation overlay boxes |
| `sarrast-offscreen` | `.hs-col` | Hero carousel off-screen slides |
| `sarrast-card` | `.card` | Series listing cards |
| `sarrast-skeleton` | `.card` | Skeleton placeholder for empty cards |
| `sarrast-lazy-frame` | `iframe` | Off-screen iframe optimization |

---

## Key Patterns

### 1. WeakSet for Deduplication
```javascript
const processedImages = new WeakSet();
function optimizeImage(img) {
    if (processedImages.has(img)) return;
    processedImages.add(img);
    // ... processing
}
```
- Allows GC of removed elements
- O(1) lookup
- No memory leak on long pages

### 2. try/catch for All DOM Operations
```javascript
try {
    img.decoding = "async";
} catch {}
```
- Prevents script crash on edge cases
- Geometry errors (`getBoundingClientRect`) caught silently

### 3. Passive + Once Event Listeners
```javascript
window.addEventListener("scroll", markScrolling, { passive: true });
window.addEventListener("pagehide", cleanup, { once: true, passive: true });
```
- `passive: true` — no scroll blocking
- `once: true` — automatic cleanup

### 4. Conditional CSS Building
```javascript
if (CONFIG.disableAllScrollEffects) {
    css += permanentDisableCSS;
} else if (CONFIG.disableExpensiveTransitionsDuringScroll) {
    css += surgicalScrollCSS;
} else {
    css += aggressiveScrollCSS;
}
```
- Feature flags control CSS output
- No dead code in injected stylesheet

### 5. Round-Robin Batch Processing
```javascript
while (imageQueue.length && processed < batchSize) { ... }
while (frameQueue.length && processed < batchSize) { ... }
// ... all queues
```
- Fair processing across element types
- Prevents one type starving others

---

## Integration Points

### htmx (Sarrast uses htmx for SPA)
- `htmx:afterSwap` — content swapped, re-optimize
- `htmx:load` — new content loaded, re-optimize

### Alpine.js (Hero carousel)
- `alpine:init` event — patch hero component
- Forces `reduced: true` getter on component data

### Site's Reveal System (`.rv` elements)
- Site uses IntersectionObserver for scroll-reveal
- Script forces `.in` class + inline styles to skip animations
- `content-visibility: visible` prevents discard

---

## Performance Characteristics

| Metric | Value |
|--------|-------|
| Startup CSS size | ~15 KB (compressed ~3 KB) |
| Initial JS execution | < 5 ms |
| Batch size per idle callback | 100 nodes |
| Idle callback timeout | 300 ms |
| MutationObserver debounce | Immediate (via runWhenIdle) |
| Resize debounce | 250 ms |
| Ad cleanup interval | 5000 ms |
| Scroll-end delay | 300 ms |

---

## Error Handling Strategy

1. **Graceful degradation** — Each optimization module independent
2. **Silent failures** — try/catch around all DOM operations
3. **No external dependencies** — Zero fetch/XHR in runtime
4. **No GM APIs** — `@grant none` ensures CSP compatibility
5. **Emergency disable** — `?sarrastperf=off` kills script instantly

---

## Version Evolution (Architecture Changes)

| Version | Architectural Change |
|---------|---------------------|
| v1.0.0 | Initial architecture with scroll-time toggle |
| v1.1.0 | Added below-fold acceleration, skeletons, hero pause |
| v1.2.0 | Surgical scroll optimization (transition-property restriction), 5000px intrinsic size |
| v1.2.1 | `animation: none` for hero, `content-visibility: visible`, 300ms delay |
| v1.2.2 | **Major**: Permanent disable scroll effects (replaces scroll-time toggle) |
| v1.2.3 | Metadata/icon updates only |