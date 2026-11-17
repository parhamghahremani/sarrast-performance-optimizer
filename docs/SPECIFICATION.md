# Specification — Sarrast Performance Optimizer

**Project**: `sarrast-performance-optimizer`  
**Version**: 1.2.3  
**Target Site**: `sarrast.com` (and `www.sarrast.com`) — Manhwa/Comic reader  
**Target Browsers**: Firefox Desktop (Windows 11), Firefox for Android  
**Userscript Manager**: Tampermonkey (latest)

---

## Purpose

Dramatically improve performance on Sarrast (Manhwa/Comic reader site), especially on Firefox Android where GPU resources are constrained. Focus on scroll performance, image loading, reader page experience, and ad blocking.

---

## Functional Requirements

### FR1: Permanent Scroll-Effects Disabling (v1.2.2+)
- **Mechanism**: `disableAllScrollEffects: true` (default) → adds `sarrast-disable-scroll-effects` class to `<html>` at load
- **Effects Permanently Disabled**:
  - `box-shadow: none !important`
  - `filter: none !important` / `-webkit-filter: none !important`
  - `backdrop-filter: none !important` / `-webkit-backdrop-filter: none !important`
  - `text-shadow: none !important`
- **Transition Restriction**: `transition-property` limited to cheap properties (opacity, transform, color, background, border)
- **Reveal Elements**: `.rv` forced to final state (`opacity: 1`, `transform: none`, `transition: none`)
- **Scroll/Animate Classes**: `[class*="scroll"]`, `[class*="animate"]`, `[class*="reveal"]`, `[class*="fade"]`, `[class*="slide"]` → `animation: none`, `transition: none`
- **Rationale**: Zero flash possible because effects never exist to flash back in

### FR2: Legacy Scroll-Time Optimization (when disableAllScrollEffects=false)
- **Trigger**: User physically scrolls the page
- **Action**: Add `sarrast-scrolling` class to `<html>` during scroll, remove after `scrollEndDelay` (default 300ms)
- **CSS Effects Disabled During Scroll** (surgical mode):
  - `box-shadow`, `filter`, `backdrop-filter`, `text-shadow` → `none`
  - `transition-property` restricted to cheap properties
  - `background-attachment: fixed` → forced to `scroll`

### FR3: Calm Motion / Animation Reduction
- **Mechanism**: `calmMotion: true` (default) → adds `sarrast-calm` class to `<html>`
- **Effects**:
  - `animation-duration: 0.001ms`, `animation-iteration-count: 1`
  - `transition-duration: 0.001ms`
- **Hero Carousel**: `animation: none !important` on `.hs-col`, `.hd-dot.on i:after` (complete stop)
- **Alpine Patch**: Forces `reduced: true` getter on hero component
- **Respects**: `@media (prefers-reduced-motion: reduce)`

### FR4: Image Optimization
- **Async Decoding**: All `<img>` elements get `decoding="async"`
- **Smart Lazy Loading** (based on viewport position):
  - **Below-fold** (> `lazyDistance` viewports): `loading="lazy"`, `fetchPriority="low"`
  - **Above-fold**: `loading="eager"`, `fetchPriority="auto"`
- **Default `lazyDistance`**: 1.5 viewports

### FR5: Large Image Optimization
- **Threshold**: Images with rendered height ≥ `largeImageHeight` (default 800px)
- **Action**: Add `sarrast-large-image` class → `content-visibility: auto` + `contain-intrinsic-size: auto <height>px`
- **Timing**: Applied after image loads (natural dimensions known)

### FR6: Reader Page Optimization (Aggressive)
- **Detection**: Path matches `\/series\/[^/]+\/[^/]+` or `\/reader`
- **Comic Images** (`.col .pg`): Threshold `readerImageThreshold` (default 2000px) → `content-visibility: auto` + `contain-intrinsic-size: auto 5000px`
- **Translation Overlay Boxes** (`.boxes .bx`): `content-visibility: auto` + `contain-intrinsic-size: auto <height>px` (calculated per box)
- **Rationale**: Reader pages are primary content — aggressive optimization acceptable

### FR7: Homepage Optimization
- **Hero Carousel** (`.hs-col`): Off-screen slides → `content-visibility: auto` + `contain-intrinsic-size: auto 300px`
- **Autoplay Disable**: `animation: none !important` + Alpine component patch

### FR8: Series Listing Optimization
- **Card Grids** (`.card`): `content-visibility: auto` + `contain-intrinsic-size: auto 400px`
- **Skeleton Placeholders**: Shimmer animation for cards without loaded images

### FR9: Iframe Optimization
- **Condition**: Off-screen iframes (> `lazyDistance` viewports below)
- **Action**: `loading="lazy"` + `sarrast-lazy-frame` class → `content-visibility: auto` + `contain-intrinsic-size: auto 300px`

### FR10: Ad Blocking
- **Script Blocking**: `beforescriptexecute` intercepts `js.juicyads.com`
- **Network Blocking**: fetch/XHR/beacon to ad domains (doubleclick, googlesyndication, etc.)
- **CSS Hiding**: `[id*="ad"]`, `[class*="ad-slot"]`, `[class*="advertisement"]`, `.juicyads`, `iframe[src*="ads"]`
- **Periodic Cleanup**: Every 5 seconds

### FR11: Below-Fold Acceleration
- **Sections** (`.sec`, `.shelf-s`, `#sched`, `#explore`): `contain-intrinsic-size: auto 5000px`
- **Reveal Elements** (`.rv`): `contain-intrinsic-size: auto 800px`
- **Force Visible**: `content-visibility: visible !important` on sections and reveal elements

### FR12: Batch DOM Processing
- **Mechanism**: `requestIdleCallback` (fallback: `setTimeout` 300ms)
- **Batch Size**: `batchSize` (default 100 nodes per idle callback)
- **Queues**: Separate queues for images, iframes, boxes, hero slides, cards
- **Recursive Scheduling**: Processes full queue over multiple frames

### FR13: Dynamic Content Handling
- **MutationObserver**: Observes `document.body` for `childList` + `subtree`
- **Filters**: `img`, `iframe`, `.bx`, `.hs-col`, `.card`
- **Deduplication**: `WeakSet` tracking prevents re-processing

### FR14: SPA Navigation Handling
- **htmx Events**: `htmx:afterSwap`, `htmx:load` → re-queue content after 100ms
- **Full Page Load**: `load` event → re-queue after 500ms
- **Resize/Orientation**: Re-queue after 250ms debounce

### FR15: Emergency Disable
- **Mechanism**: URL parameter `?sarrastperf=off`
- **Behavior**: Script exits immediately, no CSS injected, no observers attached

### FR16: Cleanup on Unload
- **Events**: `pagehide` (once, passive)
- **Actions**: Clear scroll timer, cancel animation frame, disconnect observer

---

## Non-Functional Requirements

### NFR1: Performance
- **Startup Cost**: Minimal — single style element injection at document-start
- **Runtime Overhead**: Passive listeners only; heavy work deferred to idle callbacks
- **Memory**: `WeakSet` tracking allows GC; no strong references to DOM nodes

### NFR2: Compatibility
- **CSP Compatible**: `@grant none` — no GM APIs requiring special permissions
- **No Frame Breaking**: Works in iframes if needed
- **Firefox Android Focus**: Optimized for mobile GPU constraints

### NFR3: Maintainability
- **Single File**: IIFE userscript, no build step required for basic use
- **Configurable**: All thresholds/timing in `CONFIG` object
- **Documented**: Inline comments explain rationale for each optimization

### NFR4: Safety
- **No Aggressive DOM Mutation**: Only sets attributes/classes, never removes/replaces elements
- **Error Boundaries**: All DOM operations wrapped in try/catch
- **Geometry Errors Ignored**: `getBoundingClientRect()` failures caught silently

---

## Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC1 | Style element `#sarrast-performance-optimizer` injected at document-start | Playwright test + manual inspection |
| AC2 | `sarrast-disable-scroll-effects` class added to `<html>` (v1.2.2+) | Playwright test |
| AC3 | `sarrast-calm` class added to `<html>` | Playwright test |
| AC4 | Images get `decoding="async"` | Playwright test |
| AC5 | Below-fold images get `loading="lazy"`, `fetchPriority="low"` | Manual test + console inspection |
| AC6 | Large images (≥800px) get `content-visibility: auto` class | Playwright test |
| AC7 | Reader page comic images get `content-visibility` + 5000px intrinsic size | Playwright test |
| AC8 | Translation boxes (`.bx`) get `content-visibility` + intrinsic size | Playwright test |
| AC9 | Hero carousel off-screen slides get `content-visibility` | Manual test |
| AC10 | Ad script `js.juicyads.com` blocked | Network inspection |
| AC11 | `prefers-reduced-motion: reduce` respected | Manual test (OS setting) |
| AC12 | `?sarrastperf=off` completely disables script | Manual test |
| AC13 | MutationObserver queues new content after htmx swap | Manual test |
| AC14 | No console errors from script | Playwright test |
| AC15 | Script works on Firefox Android | Manual test (required) |

---

## Constraints & Boundaries

| Constraint | Detail |
|------------|--------|
| `@run-at` | `document-start` — CSS must inject before first paint |
| `@grant` | `none` — No `GM_*` APIs, no cross-origin requests |
| `@match` | Only `https://sarrast.com/*` and `https://www.sarrast.com/*` |
| Dependencies | Zero runtime dependencies — vanilla JS only |
| Build | Optional — `npm run build` creates versioned releases only |

---

## Version History Reference

- **v1.0.0** (2026-11-12): Baseline — complete userscript
- **v1.1.0** (2026-11-12): Below-fold acceleration, skeleton placeholders, hero pause fix
- **v1.2.0** (2026-11-12): Surgical scroll optimization, 5000px intrinsic size
- **v1.2.1** (2026-11-13): Hero `animation: none`, `content-visibility: visible`, 300ms delay
- **v1.2.2** (2026-11-13): Permanent disable scroll effects (`disableAllScrollEffects: true`)
- **v1.2.3** (2026-11-14): Custom icon, author metadata, GitHub URLs

---

## Future Considerations

- Visual regression testing for reader pages
- Service worker for offline chapter caching
- WebP/AVIF format detection and conversion
- Reduced data mode for mobile networks