# Configuration and Permissions — Sarrast Performance Optimizer

**Project**: `sarrast-performance-optimizer`  
**Version**: 1.2.3

---

## Userscript Metadata

```javascript
// ==UserScript==
// @name         Sarrast Performance Optimizer
// @namespace    https://github.com/parhamghahremani
// @version      1.2.3
// @description  Performance and scrolling optimization for Sarrast (Manhwa/Comic reader)
// @author       parham
// @match        https://sarrast.com/*
// @match        https://www.sarrast.com/*
// @run-at       document-start
// @grant        none
// @icon         data:image/svg+xml;base64,...
// @downloadURL  https://github.com/parhamghahremani/userscripts/raw/main/sarrast-performance-optimizer/versions/sarrast-performance-optimizer-v1.2.3.user.js
// @updateURL    https://github.com/parhamghahremani/userscripts/raw/main/sarrast-performance-optimizer/versions/sarrast-performance-optimizer-v1.2.3.user.js
// @supportURL   https://github.com/parhamghahremani/userscripts/issues
// @homepageURL  https://github.com/parhamghahremani/userscripts/tree/main/sarrast-performance-optimizer
// @license      MIT
// ==/UserScript==
```

### Metadata Explanation

| Field | Value | Purpose |
|-------|-------|---------|
| `@name` | Sarrast Performance Optimizer | Display name in Tampermonkey |
| `@namespace` | https://github.com/parhamghahremani | Unique identifier for script |
| `@version` | 1.2.3 | Semantic version (must match source, package.json, Git tag) |
| `@description` | Performance and scrolling optimization... | Short description in UI |
| `@author` | parham | Author attribution |
| `@match` | https://sarrast.com/* | URL patterns where script runs |
| `@match` | https://www.sarrast.com/* | www subdomain |
| `@run-at` | document-start | Inject before DOM construction (critical for CSS) |
| `@grant` | none | No GM APIs — CSP compatible, no permission prompts |
| `@icon` | data:image/svg+xml;base64,... | Custom icon for Tampermonkey UI |
| `@downloadURL` | .../versions/...-v1.2.3.user.js | Versioned download URL for updates |
| `@updateURL` | .../versions/...-v1.2.3.user.js | Versioned update check URL |
| `@supportURL` | .../issues | Issue tracker link |
| `@homepageURL` | .../tree/main/... | Project homepage |
| `@license` | MIT | License identifier |

---

## Permissions Analysis

### @grant none — Zero Permissions Required

| Aspect | Status | Details |
|--------|--------|---------|
| `GM_*` APIs | ❌ Not used | No `GM_addStyle`, `GM_xmlhttpRequest`, `GM_getValue`, etc. |
| Cross-origin requests | ❌ Not used | No `@require`, no external resources |
| Storage access | ❌ Not used | No `localStorage`/`sessionStorage` via GM |
| Clipboard | ❌ Not used | No clipboard APIs |
| Notifications | ❌ Not used | No `GM_notification` |
| Downloads | ❌ Not used | No `GM_download` |

**Result**: Script runs in strict CSP environments without permission prompts.

### CSP Compatibility

All CSS is **inlined** in the injected `<style>` element:
- No external stylesheets
- No `GM_addStyle` (which can be blocked by CSP)
- No `@require` for external libraries
- No inline event handlers (uses `addEventListener`)

**Compatible with**: Strict CSP policies including `script-src 'self'`, `style-src 'self' 'unsafe-inline'`

---

## CONFIG Object (Runtime Configuration)

Located at top of IIFE (lines 50-116 in source). All options are `const` — modify source to change defaults.

### Complete CONFIG Table

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `optimizeImages` | boolean | `true` | Enable async decode + conditional lazy loading for images |
| `optimizeLargeImages` | boolean | `true` | Enable content-visibility for large images |
| `largeImageHeight` | number | `800` | Min rendered height (px) for content-visibility (general pages) |
| `lazyDistance` | number | `1.5` | Viewport multiplier for lazy-loading trigger (below-fold) |
| `scrollEndDelay` | number | `300` | ms to keep `sarrast-scrolling` class after scroll ends (legacy) |
| `idleDelay` | number | `300` | ms timeout for `requestIdleCallback` fallback |
| `batchSize` | number | `100` | Max nodes processed per idle callback |
| `blockAds` | boolean | `true` | Block third-party ad scripts and hide ad slots |
| `calmMotion` | boolean | `true` | Reduce all animations/transitions |
| `optimizeReaderBoxes` | boolean | `true` | Optimize translation overlay boxes (.bx) on reader pages |
| `readerImageThreshold` | number | `2000` | Min rendered height (px) for reader image content-visibility |
| `disableHeroAutoplay` | boolean | `true` | Fully disable hero carousel autoplay (animation: none) |
| `forceContentVisibilityVisible` | boolean | `true` | Use content-visibility: visible instead of auto |
| `disableExpensiveTransitionsDuringScroll` | boolean | `true` | Restrict transition-property during scroll (legacy mode) |
| `accelerateBelowFold` | boolean | `true` | Below-fold loading acceleration |
| `increaseIntrinsicSize` | boolean | `true` | Boost contain-intrinsic-size for sections |
| `intrinsicSize` | number | `5000` | New intrinsic size for sections (px) |
| `addSkeletons` | boolean | `true` | Add shimmer skeleton to empty cards |
| `disableAllScrollEffects` | boolean | `true` | **v1.2.2+** Permanently disable all scroll-only effects |

### Feature Flag Interactions

```
disableAllScrollEffects = true (default)
    │
    ├─► Adds sarrast-disable-scroll-effects class at load
    ├─► markScrolling() returns early (no sarrast-scrolling toggle)
    ├─► CSS: permanent expensive-effect disabling rules applied
    └─► scrollEndDelay, disableExpensiveTransitionsDuringScroll IGNORED

disableAllScrollEffects = false (legacy mode)
    │
    ├─► No sarrast-disable-scroll-effects class
    ├─► markScrolling() toggles sarrast-scrolling during scroll
    ├─► If disableExpensiveTransitionsDuringScroll = true:
    │     CSS: surgical scroll-time rules (transition-property restriction)
    └─► Else:
          CSS: aggressive scroll-time rules (transition: none, animation: none)
```

### Per-Page Configuration Behavior

| Page Type | Detection | Optimizations Applied |
|-----------|-----------|----------------------|
| Reader (`/series/*/*`, `/reader`) | `isReaderPage` | Aggressive: comic images (5000px intrinsic), translation boxes, force visible |
| Homepage (`/`) | `isHomepage` | Hero carousel off-screen + autoplay disable |
| Series Listing (`/series`, `/search`) | `isSeriesListing` | Card grids + skeletons |
| Other pages | None of above | General: images, iframes, ad blocking, calm motion |

---

## Browser API Usage

| API | Used For | Fallback |
|-----|----------|----------|
| `document.createElement('style')` | CSS injection | — |
| `document.documentElement.appendChild()` | DOM insertion | DOMContentLoaded listener |
| `element.classList.add/remove/contains` | Class management | — |
| `element.getBoundingClientRect()` | Viewport calculations | try/catch silent fail |
| `window.innerHeight` / `documentElement.clientHeight` | Viewport height | fallback 800px |
| `requestIdleCallback` | Batch processing | `setTimeout(300ms)` |
| `requestAnimationFrame` | Scroll handler | — |
| `MutationObserver` | Dynamic content detection | — |
| `WeakSet` | Deduplication | — |
| `element.matches()` | Element filtering | — |
| `element.querySelectorAll()` | Subtree filtering | — |
| `img.decoding = 'async'` | Async image decode | try/catch |
| `img.loading = 'lazy'/'eager'` | Lazy loading control | try/catch |
| `img.fetchPriority` | Fetch priority hint | try/catch (feature detect) |
| `iframe.loading = 'lazy'` | Iframe lazy loading | try/catch |
| `beforescriptexecute` | Ad script blocking | — |
| `fetch`/`XMLHttpRequest`/`navigator.sendBeacon` interception | Ad network blocking | — |
| `pagehide` event | Cleanup | — |
| `htmx:afterSwap`, `htmx:load` | SPA re-optimization | — |
| `alpine:init` event | Hero component patch | — |

---

## Tampermonkey-Specific Behavior

### Update Check
- Tampermonkey checks `@updateURL` periodically
- Returns script content → compares `@version`
- If newer, prompts user to update
- Versioned URL ensures cache busting

### Installation
- User clicks `@downloadURL` → Tampermonkey installs
- Script stored in Tampermonkey's local storage
- Runs automatically on matched URLs

### Compatibility
| Userscript Manager | Supported |
|-------------------|-----------|
| Tampermonkey | ✅ Full |
| Greasemonkey 4+ | ✅ Full |
| Violentmonkey | ✅ Full |
| Userscripts (Safari) | ⚠️ Untested |

---

## Version Alignment Requirements

**All four must match exactly:**

| Location | Expected Value |
|----------|----------------|
| `src/sarrast-performance-optimizer.user.js` (`@version`) | 1.2.3 |
| `package.json` (`version`) | 1.2.3 |
| `CHANGELOG.md` (latest entry) | 1.2.3 |
| Git tag | v1.2.3 |

**Build process enforces this**: `npm run version:patch|minor|major` updates both `package.json` AND source `@version` simultaneously.