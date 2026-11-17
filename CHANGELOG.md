# Changelog — Sarrast Performance Optimizer

All notable changes to this project will be documented in this format.

## [1.2.3] - 2026-11-14

### Added
- **Custom icon**: Added SVG-based `@icon` for Tampermonkey/GreaseMonkey UI display (distinct from MT98 icon)
- **Author metadata**: Added `@author parham` and updated `@namespace` to GitHub profile
- **GitHub URLs**: Updated `@downloadURL`, `@updateURL`, `@supportURL`, `@homepageURL` to point to `https://github.com/parhamghahremani/userscripts`

### Changed
- **Version bump**: 1.2.2 → 1.2.3 (patch for metadata/icon updates only, no functional changes)

---

## [1.2.2] - 2026-11-13

### Fixed
- **Scroll-end transition flash (complete fix - NEW APPROACH)**: The previous hybrid cancel + reflow approach (v1.2.2 attempt) still left a perceptible flash. **New in this v1.2.2**: Instead of trying to prevent flash at scroll-end, we COMPLETELY DISABLE all scroll-only effects permanently. "Scroll-only effects" = effects that only exist to provide visual feedback during/after scroll (expensive GPU transitions on box-shadow, filter, backdrop-filter, text-shadow). When `disableAllScrollEffects: true` (default), these effects are PERMANENTLY disabled via static CSS rules (not toggled during scroll), so flash CANNOT occur because the effects never exist to flash back in.

### Added
- **New CONFIG option**: `disableAllScrollEffects` (default `true`) — completely disables all scroll-only effects permanently via `sarrast-disable-scroll-effects` CSS class. This REPLACES the scroll-time optimization entirely (no more `sarrast-scrolling` class toggling, no timing issues, no hybrid cancel+reflow complexity).
- **New permanent CSS rules** (active when `disableAllScrollEffects: true`):
  - `html.sarrast-disable-scroll-effects *` — permanently restricts `transition-property` to cheap properties only (opacity, transform, color, background, border)
  - Permanently disables expensive GPU effects: `box-shadow: none`, `filter: none`, `backdrop-filter: none`, `text-shadow: none`
  - `html.sarrast-disable-scroll-effects .rv` — forces reveal elements to final state with no animation
  - `html.sarrast-disable-scroll-effects [class*="scroll"], [class*="animate"]` — kills transitions/animations on scroll/animate related classes

### Removed
- **Removed hybrid cancel + reflow technique** (from previous v1.2.2 attempt): `cancelScrollTransitions()`, `cancelledTransitionElements` WeakSet, `document.getAnimations()` scanning, force reflow via `offsetHeight`, double RAF restore
- **Removed CONFIG option**: `preventScrollEndFlash` (no longer needed)

### Changed
- **Scroll-end strategy**: Completely replaced. Instead of "wait longer + try to cancel transitions at scroll end", we now "permanently disable the effects that cause flash". Zero flash possible because effects never exist.
- **markScrolling()**: Now returns early (no-op) when `disableAllScrollEffects` is true — no `sarrast-scrolling` class toggling at all.
- **CSS architecture**: Added new permanent `sarrast-disable-scroll-effects` class that applies all expensive-effect disabling rules statically.

## [1.2.1] - 2026-11-13

### Fixed
- **Hero carousel rapid cycling**: Changed from `animation-play-state: paused` to `animation: none !important` on `.hs-col` and `.hd-dot.on i:after`. The paused state still allowed `animationend` to fire on state changes (hover/touch), causing rapid cycling. Also added Alpine component patch to force `reduced: true` in the hero component's `running` getter, ensuring autoplay is fully disabled at the component level.
- **Below-fold content re-rendering on scroll back**: The site uses `content-visibility: auto` which allows browser to discard rendered content. Fixed by forcing `content-visibility: visible !important` on all sections (`.sec`, `.shelf-s`, `#sched`, `#explore`) and reveal elements (`.rv`). Also pre-adds `.in` class to all `.rv` elements to skip reveal animations entirely. Trade-off: higher memory usage but zero re-render.
- **Scroll-end flash on shadows/filters**: Increased `scrollEndDelay` from 120ms to 300ms to handle fast fling gestures. Added `transition-property` restriction during scroll to only allow cheap transitions (opacity, transform, color, background, border) — this prevents expensive transitions (box-shadow, filter, backdrop-filter) from animating back in when scrolling stops.

### Added
- **New CONFIG options**:
  | Option | Default | Description |
  |--------|---------|-------------|
  | `disableHeroAutoplay` | `true` | Fully disable hero carousel autoplay (animation: none) |
  | `forceContentVisibilityVisible` | `true` | Use content-visibility: visible instead of auto |
  | `disableExpensiveTransitionsDuringScroll` | `true` | Restrict transition-property during scroll |
- **Alpine hero component patch**: Forces `reduced: true` getter to stop autoplay at component level.

### Changed
- **Hero carousel strategy**: Now uses `animation: none` (complete stop) instead of `animation-play-state: paused`. More reliable, no rapid cycling.
- **Below-fold retention**: Switched from `content-visibility: auto` + massive intrinsic-size to `content-visibility: visible` + pre-added `.in` class on reveal elements. Zero re-render guarantee.
- **Scroll-end delay**: Increased from 120ms to 300ms for better mobile fling handling.
- **Scroll-time surgical mode**: Now also restricts `transition-property` to cheap properties only during scroll.

## [1.2.0] - 2026-11-12

### Fixed
- **Scroll-time CSS flash on scroll end**: Changed from aggressive mode (disabling ALL transitions/transforms/opacity) to **surgical mode** — only disables expensive GPU effects during scroll: `backdrop-filter`, `filter`, `box-shadow`, `text-shadow`. Preserves `transition`, `transform`, `opacity` to eliminate the visible "flash" when scrolling stops.
- **Below-fold content re-rendering on scroll back**: The site uses `content-visibility: auto` with small intrinsic sizes (420-1500px). When sections scroll off-screen, browser discards rendered content. On scroll back, full re-render causes visible delay. Fixed by:
  - Massive `contain-intrinsic-size: 5000px` for all sections (`.sec`, `.shelf-s`, `#sched`, `#explore`)
  - Preserves reveal elements (`.rv` system) with `800px` intrinsic size
  - Content stays rendered in memory, instant display on scroll back

### Added
- **New CONFIG option**: `surgicalScrollOptimization` (default `true`) — enables surgical scroll-time optimization. Set to `false` for legacy aggressive mode.
- **Reveal system preservation**: `.rv` elements (site's scroll-reveal) now get intrinsic size to prevent re-render.

### Changed
- **Scroll-time optimization**: Now surgical by default. Legacy mode available via config.
- **Below-fold intrinsic size**: Increased from 2000px to 5000px (`intrinsicSize` config) to fully cover tall sections.
- **CONFIG table updated** with new options.

## [1.1.0] - 2026-11-12

### Fixed
- **Hero carousel infinite loop**: Fixed `calmMotion` breaking hero autoplay by changing from `animation-duration: 0.001ms` + `iteration-count: 1` (which fires `animationend` immediately) to `animation-play-state: paused` on `.hs-col` and `.hd-dot.on i:after`. This pauses autoplay without breaking the `tick()` handler that relies on `animationend`.

### Added
- **Below-fold section loading acceleration** (`accelerateBelowFold`):
  - Forces Alpine.js initialization for sections within 2 viewports (`preloadDistance`)
  - Preloads card images within 2 viewports by triggering `data-src` → `src` early
  - Increases `contain-intrinsic-size` for sections (`.sec`, `.shelf-s`, `#sched`, `#explore`) to 2000px to prevent layout shift
  - Adds skeleton placeholders (shimmer animation) to cards without loaded images
  - Re-applies on htmx navigation, resize, and full page load
- **New CONFIG options**:
  | Option | Default | Description |
  |--------|---------|-------------|
  | `accelerateBelowFold` | `true` | Enable below-fold loading acceleration |
  | `lazyXMargin` | `300` | Target rootMargin for lazy-x observer (script forces init instead) |
  | `preloadDistance` | `2` | Viewport multiplier for early image preload |
  | `increaseIntrinsicSize` | `true` | Boost contain-intrinsic-size for sections |
  | `intrinsicSize` | `2000` | New intrinsic size for sections (px) |
  | `addSkeletons` | `true` | Add shimmer skeleton to empty cards |

### Changed
- **Calm motion strategy**: Now pauses autoplay animations instead of zeroing duration globally. Transitions still reduced to 0.001ms (safe). Respects `prefers-reduced-motion` media query.
- **Hero carousel**: Off-screen slides still get `content-visibility`, but autoplay is paused via `animation-play-state: paused` when `calmMotion` enabled.

## [1.0.0] - 2026-11-12

### Added
- **Complete userscript** for Sarrast (sarrast.com) performance optimization
- **Scroll-time optimization**: `sarrast-scrolling` class toggles off shadows, filters, backdrop-filters during scroll
- **Image optimization**: `decoding="async"`, conditional `loading="lazy"` + `fetchPriority="low"` for below-fold images
- **Large image optimization**: `content-visibility: auto` with `contain-intrinsic-size` for images ≥800px rendered height
- **Reader page optimization**: Special handling for comic images (3000-5000px) with `content-visibility` and 2000px intrinsic size
- **Translation overlay optimization**: `content-visibility` for `.bx` boxes (100+ per chapter) with calculated intrinsic sizes
- **Hero carousel optimization**: Off-screen slides get `content-visibility` on homepage
- **Card grid optimization**: Series listing cards get `content-visibility`
- **Iframe optimization**: Lazy-loading + content-visibility for off-screen iframes
- **Ad blocking**: Blocks juicyads script, fetch/XHR/beacon to ad domains, hides ad slots and iframes
- **Animation reduction**: `sarrast-calm` class reduces all animations/transitions to 0.001ms
- **Batch DOM processing**: `requestIdleCallback` with configurable batch size (100 nodes/pass)
- **MutationObserver**: Efficiently queues new images/iframes/boxes for optimization
- **htmx SPA navigation handling**: Re-optimizes content after `htmx:afterSwap` and `htmx:load`
- **Reader page detection**: Aggressive optimization for `/series/*/*` reading pages
- **Homepage detection**: Hero carousel specific optimizations
- **Series listing detection**: Card grid optimizations
- **Emergency disable**: `?sarrastperf=off` URL parameter
- **Cleanup on pagehide**: Properly disconnects observers, clears timers, removes event listeners
- **Resize/orientation handling**: Re-queues content on viewport change
- **Periodic ad cleanup**: Cleans up dynamically inserted ad slots every 5 seconds

### Configuration (CONFIG object)
| Option | Default | Description |
|--------|---------|-------------|
| `optimizeImages` | `true` | Enable image async decode + lazy loading |
| `optimizeLargeImages` | `true` | Enable content-visibility for large images |
| `largeImageHeight` | `800` | Min rendered height (px) for content-visibility (general) |
| `lazyDistance` | `1.5` | Viewport multiplier for lazy-loading trigger |
| `scrollEndDelay` | `120` | ms to keep `sarrast-scrolling` class after scroll ends |
| `idleDelay` | `300` | ms timeout for `requestIdleCallback` |
| `batchSize` | `100` | Max nodes processed per idle callback |
| `blockAds` | `true` | Block third-party ad scripts and hide ad slots |
| `calmMotion` | `true` | Reduce all animations/transitions |
| `optimizeReaderBoxes` | `true` | Optimize translation overlay boxes (.bx) on reader pages |
| `readerImageThreshold` | `2000` | Min rendered height (px) for reader image content-visibility |

### Technical Details
- **@run-at**: `document-start` — CSS injected before paint
- **@grant**: `none` — no GM APIs required, CSP compatible
- **Passive listeners**: scroll, resize, load, pagehide
- **WeakSet tracking**: Prevents re-processing elements
- **Firefox Android focus**: Optimized for mobile GPU constraints
- **htmx integration**: Listens to `htmx:afterSwap` and `htmx:load`
- **Alpine.js compatibility**: MutationObserver catches reactive DOM changes
- **Reader page structure**: Handles `.col .pg` images and `.boxes .bx` overlays

---

## Versioning Rules
- **Patch** (x.y.Z): Bug fixes, timing tweaks, selector adjustments
- **Minor** (x.Y.z): New optimization techniques, config schema changes
- **Major** (X.y.z): Breaking architecture changes, @match domain changes