# Development Log — Sarrast Performance Optimizer

**Project**: `sarrast-performance-optimizer`  
**Format**: Date | Version | Milestone / Issue / Fix

---

## 2026-11-12 | v1.0.0 | Initial Release
- Complete userscript for Sarrast performance optimization
- Scroll-time optimization with `sarrast-scrolling` class
- Image optimization: async decode, lazy loading, content-visibility
- Reader page aggressive optimization (comic images + translation boxes)
- Homepage hero carousel optimization
- Series listing card optimization
- Ad blocking (Juicyads + network + CSS)
- Animation reduction (`sarrast-calm`)
- Batch processing via requestIdleCallback
- MutationObserver for dynamic content
- htmx SPA navigation handling
- Emergency disable (`?sarrastperf=off`)
- Cleanup on pagehide

## 2026-11-12 | v1.1.0 | Below-Fold Acceleration & Hero Fix
- **Added**: Below-fold loading acceleration (`accelerateBelowFold`)
  - Forces Alpine initialization for sections within 2 viewports
  - Preloads card images within 2 viewports
  - Increases section intrinsic size to 2000px
  - Adds skeleton shimmer placeholders
- **Fixed**: Hero carousel infinite loop
  - Changed from `animation-duration: 0.001ms` + `iteration-count: 1` (fired `animationend` immediately)
  - To `animation-play-state: paused` on `.hs-col` and `.hd-dot.on i:after`
- **Added CONFIG options**: `accelerateBelowFold`, `lazyXMargin`, `preloadDistance`, `increaseIntrinsicSize`, `intrinsicSize` (2000), `addSkeletons`
- **Changed**: Calm motion strategy — pauses autoplay instead of zeroing duration globally

## 2026-11-12 | v1.2.0 | Surgical Scroll Optimization & Massive Intrinsic Size
- **Fixed**: Scroll-time CSS flash on scroll end
  - Changed from aggressive mode (disabling ALL transitions/transforms/opacity)
  - To **surgical mode** — only disables expensive GPU effects: `backdrop-filter`, `filter`, `box-shadow`, `text-shadow`
  - Preserves `transition`, `transform`, `opacity` to eliminate flash
- **Fixed**: Below-fold content re-rendering on scroll back
  - Site uses `content-visibility: auto` with small intrinsic sizes (420-1500px)
  - Browser discards rendered content when off-screen
  - **Fix**: Massive `contain-intrinsic-size: 5000px` for all sections
  - Preserves reveal elements (`.rv`) with 800px intrinsic size
- **Added**: `surgicalScrollOptimization` config (default true)
- **Changed**: Intrinsic size from 2000px to 5000px
- **Added**: Reveal system preservation

## 2026-11-13 | v1.2.1 | Hero Carousel Complete Fix + Zero Re-render
- **Fixed**: Hero carousel rapid cycling
  - `animation-play-state: paused` still allowed `animationend` to fire on state changes
  - **Fix**: `animation: none !important` on `.hs-col` and `.hd-dot.on i:after`
  - Added Alpine component patch to force `reduced: true` getter
- **Fixed**: Below-fold content re-rendering on scroll back
  - `content-visibility: auto` allows browser to discard content
  - **Fix**: Force `content-visibility: visible !important` on all sections (`.sec`, `.shelf-s`, `#sched`, `#explore`) and reveal elements (`.rv`)
  - Pre-add `.in` class to all `.rv` elements to skip reveal animations
  - Trade-off: Higher memory usage but zero re-render
- **Fixed**: Scroll-end flash on shadows/filters
  - Increased `scrollEndDelay` from 120ms to 300ms for mobile fling
  - Added `transition-property` restriction during scroll
- **Added CONFIG options**: `disableHeroAutoplay`, `forceContentVisibilityVisible`, `disableExpensiveTransitionsDuringScroll`
- **Changed**: Hero strategy — `animation: none` (complete stop) instead of paused
- **Changed**: Below-fold retention — `content-visibility: visible` + pre-added `.in` class
- **Changed**: Scroll-end delay 120ms → 300ms

## 2026-11-13 | v1.2.2 | Complete Scroll-End Flash Fix (New Approach)
- **Root Cause**: Hybrid cancel+reflow approach still left perceptible flash
  - Site elements have transitions like `transition: box-shadow 0.3s, opacity 0.2s`
  - During scroll: forced `transition-property: cheap props only` + `box-shadow: none`
  - Scroll stops: class removed → original transition takes effect → box-shadow animates back → **FLASH**
- **New Strategy**: COMPLETELY DISABLE all scroll-only effects permanently
  - "Scroll-only effects" = effects that only exist for visual feedback during/after scroll
  - When permanently disabled, effects never exist to flash back in
- **Added**: `disableAllScrollEffects: true` (default) config option
- **Added**: Permanent CSS rules (`html.sarrast-disable-scroll-effects *`):
  - Permanently restricts `transition-property` to cheap properties
  - Permanently disables: `box-shadow`, `filter`, `backdrop-filter`, `text-shadow`
  - Forces `.rv` to final state with no animation
  - Kills transitions/animations on `[class*="scroll"]`, `[class*="animate"]`, `[class*="reveal"]`, `[class*="fade"]`, `[class*="slide"]`
- **Removed**: Hybrid cancel+reflow technique (`cancelScrollTransitions`, `cancelledTransitionElements`, `document.getAnimations()`, force reflow, double RAF)
- **Removed**: `preventScrollEndFlash` config (no longer needed)
- **Changed**: `markScrolling()` returns early when `disableAllScrollEffects` true
- **Result**: Zero flash possible, simpler implementation, better performance

## 2026-11-14 | v1.2.3 | Metadata & Icon Update
- **Added**: Custom SVG icon (distinct from MT98 icon) as base64 data URI
- **Added**: `@author parham` metadata
- **Updated**: `@namespace` to GitHub profile
- **Updated**: All GitHub URLs to point to `https://github.com/parhamghahremani/userscripts`
- **Version bump**: 1.2.2 → 1.2.3 (patch for metadata/icon only, no functional changes)

## 2026-11-17 | v1.2.3 | Project Setup & Documentation
- Initialized Git repository
- Created comprehensive documentation (13 files in docs/)
- Created CLAUDE.md, PROJECT_STATUS.md
- Set up backup directory structure
- Added version bump scripts to package.json
- Fixed Playwright config (ES module → CommonJS)
- Identified test updates needed for v1.2.2+ compatibility