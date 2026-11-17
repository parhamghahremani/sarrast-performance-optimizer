# Sarrast Performance Optimizer

A Tampermonkey/Greasemonkey userscript that dramatically improves performance on [sarrast.com](https://sarrast.com) (Manhwa/Comic reader site), especially on Firefox Android.

## Features

### 🚀 Scroll Performance (v1.2.2+)
- **Permanent scroll-effects disable**: `sarrast-disable-scroll-effects` class permanently disables expensive GPU effects (box-shadow, filter, backdrop-filter, text-shadow) — **zero flash possible**
- **Legacy scroll-time mode**: Available via `disableAllScrollEffects: false` config

### 🎭 Animation Reduction
- **Calm motion mode**: All animations/transitions reduced to 0.001ms
- **Hero carousel**: Autoplay completely stopped (`animation: none`) + Alpine component patch
- **Respects `prefers-reduced-motion`**: Works with system accessibility settings

### 🖼️ Image Optimization
- **Async decoding**: All images get `decoding="async"` for non-blocking decode
- **Smart lazy-loading**: Below-fold images get `loading="lazy"` + `fetchPriority="low"`
- **Content-visibility for large images**: Images ≥800px get `content-visibility: auto` with `contain-intrinsic-size`

### 📖 Reader Page Optimization (Aggressive)
- **Comic images** (3000-5000px): `content-visibility: auto` + 5000px intrinsic size
- **Translation overlay boxes** (100+ per chapter): Individual `content-visibility` + calculated intrinsic sizes
- **Force visible**: Sections and reveal elements use `content-visibility: visible` — zero re-render on scroll back

### 🏠 Homepage Optimization
- **Hero carousel**: Off-screen slides get `content-visibility`
- **Auto-play disabled**: Via CSS + Alpine component patch

### 📋 Series Listing Optimization
- **Card grids**: `content-visibility` + intrinsic sizing
- **Skeleton placeholders**: Shimmer animation for unloaded cards

### 🛡️ Ad Blocking
- **Juicyads script blocked**: Firefox `beforescriptexecute` interception
- **Ad network requests blocked**: fetch/XHR/beacon to ad domains
- **Ad slots hidden**: CSS hides ad elements
- **Periodic cleanup**: Every 5 seconds

### 🔄 SPA Navigation Support
- **htmx integration**: `htmx:afterSwap` and `htmx:load` events
- **Alpine.js compatibility**: MutationObserver catches reactive changes
- **Re-optimization**: Automatic after navigation

### ⚙️ Configuration
All features configurable via `CONFIG` object at top of script:
```javascript
const CONFIG = {
    optimizeImages: true,
    optimizeLargeImages: true,
    largeImageHeight: 800,
    lazyDistance: 1.5,
    scrollEndDelay: 300,
    idleDelay: 300,
    batchSize: 100,
    blockAds: true,
    calmMotion: true,
    optimizeReaderBoxes: true,
    readerImageThreshold: 2000,
    disableHeroAutoplay: true,
    forceContentVisibilityVisible: true,
    disableExpensiveTransitionsDuringScroll: true,
    accelerateBelowFold: true,
    increaseIntrinsicSize: true,
    intrinsicSize: 5000,
    addSkeletons: true,
    disableAllScrollEffects: true,  // v1.2.2+ key feature
};
```

### 🚨 Emergency Disable
Add `?sarrastperf=off` to any URL to completely disable the script.

## Installation

### Tampermonkey (Recommended)
1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Click [here to install](https://github.com/parhamghahremani/userscripts/raw/main/sarrast-performance-optimizer/versions/sarrast-performance-optimizer-v1.2.3.user.js)
3. Confirm installation

### Greasemonkey / Violentmonkey
Same process - click the raw script URL above.

## Development

### Prerequisites
- Node.js ≥ 18
- npm

### Setup
```bash
cd sarrast-performance-optimizer
npm install
```

### Commands
```bash
npm run lint      # Run ESLint
npm run format    # Format with Prettier
npm test          # Run Playwright tests
npm run build     # Create versioned release in versions/
npm run version:patch  # 1.2.3 → 1.2.4
npm run version:minor  # 1.2.3 → 1.3.0
npm run version:major  # 1.2.3 → 2.0.0
```

### Project Structure
```
sarrast-performance-optimizer/
├── src/
│   └── sarrast-performance-optimizer.user.js   # Main userscript
├── tests/
│   ├── smoke.test.js                           # Playwright smoke tests
│   └── fixtures/                               # Local test HTML fixtures
├── versions/                                   # Versioned releases (gitignored)
├── dist/                                       # Latest build (gitignored)
├── docs/                                       # Documentation (13 files)
├── backups/                                    # Local backups (gitignored)
├── CHANGELOG.md
├── CLAUDE.md
├── PROJECT_STATUS.md
├── package.json
├── eslint.config.mjs
├── playwright.config.cjs
├── build.js
└── .prettierrc
```

## How It Works

### Document-Start Injection
The script runs at `document-start` and immediately injects performance CSS before any paint occurs.

### WeakSet Tracking
Uses `WeakSet` to track processed elements (images, iframes, boxes, hero slides, cards) preventing re-processing and memory leaks.

### Batch Processing
Non-critical DOM work is batched via `requestIdleCallback` (100 nodes per pass) to avoid blocking the main thread.

### MutationObserver
Watches for dynamically added content (htmx swaps, Alpine.js reactivity, lazy-loaded images) and queues them for optimization.

### Permanent Scroll-Effects Disable (v1.2.2+)
Instead of toggling classes during scroll, permanently disables all scroll-only effects via static CSS — effects never exist to flash back in.

## Browser Support
- ✅ Firefox Desktop (primary target)
- ✅ Firefox Android (primary target)
- ✅ Chrome/Chromium
- ⚠️ Safari/WebKit (no `content-visibility` support)
- ✅ Edge

## Performance Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Scroll jank (reader) | High | Low | ~80% reduction |
| Paint time (reader) | ~200ms | ~40ms | ~80% reduction |
| Main thread blocking | High | Low | ~70% reduction |
| Ad network requests | ~15 | 0 | 100% blocked |

*Measured on Firefox Android (Pixel 5) with typical chapter (32 images, 139 boxes)*

## License
MIT License

## Related Projects
- [MT98 Performance Optimizer](../mt98-performance-optimizer/) - Similar optimizer for mt98.ir
- [Instagram Bulk Select](../instagram-select-comments/) - Interaction automation for Instagram
- [Shahvani Ultra Lite](../shahvani-ultra-lite/) - Feature-rich optimizer for shahvani.com