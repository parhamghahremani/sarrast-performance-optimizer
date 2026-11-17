# Key Decisions — Sarrast Performance Optimizer

**Project**: `sarrast-performance-optimizer`  
**Format**: Decision | Rationale | Alternatives Considered | Date

---

## 1. Single-File IIFE Userscript (No Build Required for Core)

**Decision**: Core script is a single self-contained IIFE in `src/sarrast-performance-optimizer.user.js`. Build step (`npm run build`) only creates versioned archives and updates update URLs.

**Rationale**:
- Tampermonkey userscripts are traditionally single files
- No transpilation needed — modern Firefox supports all used APIs
- Zero dependencies = maximum compatibility, minimum attack surface
- Easy to inspect, debug, and install manually
- Build is optional convenience, not requirement

**Alternatives**: Webpack/Rollup bundle, TypeScript compilation, modular source with build
**Rejected Because**: Overkill for ~1000 lines of vanilla JS; adds complexity without benefit

**Date**: 2026-11-12 (v1.0.0)

---

## 2. `@run-at document-start` with Early CSS Injection

**Decision**: Inject performance CSS via `<style>` element at `document-start`, before `document.body` exists.

**Rationale**:
- `scroll-behavior: auto` and `scroll-snap-type: none` must apply before first paint
- Prevents layout shifts from snap points
- `will-change: auto` prevents unnecessary layer promotion from start
- Permanent scroll-effects disable must be active immediately

**Alternatives**: `@run-at document-end` with DOMContentLoaded, `@run-at document-idle`
**Rejected Because**: Too late — paint already happened, scroll snap already applied

**Date**: 2026-11-12 (v1.0.0)

---

## 3. Permanent Disable of Scroll-Only Effects (v1.2.2+)

**Decision**: Use `disableAllScrollEffects: true` (default) to permanently disable all scroll-only effects via static CSS (`html.sarrast-disable-scroll-effects *`), replacing scroll-time toggle entirely.

**Rationale**:
- Scroll-time toggle (v1.0.0-v1.2.1) caused flash when class removed
- Hybrid cancel+reflow (v1.2.2 attempt) still left perceptible flash
- Root cause: Site elements have transitions on expensive properties (box-shadow, filter)
- When effects are permanently disabled, they never exist to flash back in
- Zero flash possible, simpler implementation, better performance

**Alternatives**: Scroll-time toggle with longer delay, hybrid cancel+reflow, force reflow on scroll end
**Rejected Because**: All toggle-based approaches have timing-dependent flash risk

**Date**: 2026-11-13 (v1.2.2)

---

## 4. Aggressive Reader Page Optimization (Not Conservative)

**Decision**: Aggressively optimize reader pages (comic images + translation boxes) with massive intrinsic sizes (5000px for images, per-box calculated).

**Rationale**:
- Reader pages are primary content — user spends most time here
- Comic images are 3000-5000px tall — `content-visibility: auto` with 5000px intrinsic size prevents re-render
- Translation boxes (100+ per chapter) — individual intrinsic size prevents layout shift
- Unlike MT98 (conservative), Sarrast reader benefits from aggressive optimization

**Alternatives**: Conservative (no optimization), selective optimization, smaller intrinsic sizes
**Rejected Because**: Conservative misses major performance gains; smaller sizes cause re-render

**Date**: 2026-11-12 (v1.0.0), confirmed 2026-11-13 (v1.2.1)

---

## 5. `content-visibility: visible` for Below-Fold Sections (v1.2.1+)

**Decision**: Force `content-visibility: visible !important` on sections (`.sec`, `.shelf-s`, `#sched`, `#explore`) and reveal elements (`.rv`), with massive intrinsic sizes.

**Rationale**:
- `content-visibility: auto` allows browser to discard off-screen content
- On scroll back, full re-render causes visible delay/jank
- `visible` keeps content rendered in memory — zero re-render
- Trade-off: Higher memory usage, but instant display
- Pre-add `.in` class to reveal elements to skip animations

**Alternatives**: `content-visibility: auto` with larger intrinsic size, IntersectionObserver pre-rendering
**Rejected Because**: `auto` still allows discard; IO adds overhead

**Date**: 2026-11-13 (v1.2.1)

---

## 6. Hero Carousel: `animation: none` (Not `paused`)

**Decision**: Use `animation: none !important` on `.hs-col` and `.hd-dot.on i:after` + Alpine component patch (`reduced: true` getter).

**Rationale**:
- `animation-play-state: paused` (v1.1.0) still fired `animationend` on hover/touch → rapid cycling
- `animation: none` completely stops animation at CSS level
- Alpine patch ensures component-level `running` getter returns false
- Two-layer defense: CSS + component logic

**Alternatives**: `animation-play-state: paused`, remove animation via JS, pause via Alpine only
**Rejected Because**: `paused` fires `animationend`; JS removal fragile; Alpine-only incomplete

**Date**: 2026-11-13 (v1.2.1)

---

## 7. `@grant none` — No GM APIs

**Decision**: Use `@grant none`, no `GM_*` APIs, no `@require`, no external resources.

**Rationale**:
- Maximum compatibility (CSP, all userscript managers)
- No permission prompts in Tampermonkey
- No external dependencies to fail or be blocked
- All functionality achievable with standard Web APIs

**Alternatives**: `GM_addStyle`, `GM_xmlhttpRequest`, `@require` for libraries
**Rejected Because**: Unnecessary; native APIs sufficient

**Date**: 2026-11-12 (v1.0.0)

---

## 8. `WeakSet` for Deduplication (Not Map/Set)

**Decision**: Track processed elements with `WeakSet` instead of `Set` or `Map`.

**Rationale**:
- `WeakSet` doesn't prevent garbage collection
- Elements removed from DOM automatically cleaned up
- No memory leak on long pages with dynamic content (SPA navigation)
- O(1) lookup, minimal overhead

**Alternatives**: `Set` with manual cleanup, `Map` with timestamps, `data-` attributes on elements
**Rejected Because**: `Set` leaks; `Map` overkill; DOM attributes pollute page

**Date**: 2026-11-12 (v1.0.0)

---

## 9. `requestIdleCallback` for Batch Processing (with setTimeout Fallback)

**Decision**: Process queued elements in idle callbacks, batch size 100, fallback to `setTimeout(300ms)`.

**Rationale**:
- Non-blocking: yields to main thread for scrolling/input
- Batch size limits frame time impact
- Fallback ensures work happens even without idle time
- Recursive scheduling processes full queue over multiple frames

**Alternatives**: `setInterval`, `requestAnimationFrame`, process all at once, Web Worker
**Rejected Because**: Interval/RAF not for idle work; all-at-once blocks; Worker can't access DOM

**Date**: 2026-11-12 (v1.0.0)

---

## 10. MutationObserver on `document.body` (Subtree)

**Decision**: Observe `document.body` with `childList: true, subtree: true` for new content.

**Rationale**:
- Catches all dynamic content (htmx swaps, Alpine reactivity, lazy-loaded images)
- Filters to only relevant selectors — minimal callback work
- Queues for batch processor, doesn't process inline
- `WeakSet` prevents re-processing

**Alternatives**: Observe specific containers, `IntersectionObserver`, periodic `querySelectorAll`
**Rejected Because**: Specific containers miss new areas; IO wrong tool; polling wasteful

**Date**: 2026-11-12 (v1.0.0)

---

## 11. htmx + Alpine.js Integration (Not Generic SPA)

**Decision**: Explicitly listen to `htmx:afterSwap`, `htmx:load`, and `alpine:init` events.

**Rationale**:
- Sarrast uses htmx for SPA navigation + Alpine.js for components
- Generic `popstate`/`pushState` interception misses htmx swaps
- Alpine component patch needed for hero autoplay (component-level control)
- Direct event listeners are reliable and lightweight

**Alternatives**: Override `history.pushState`, `MutationObserver` only, polling
**Rejected Because**: `pushState` override breaks htmx; MO misses component init; polling wasteful

**Date**: 2026-11-12 (v1.0.0)

---

## 12. Ad Blocking via Multiple Layers

**Decision**: Three-layer ad blocking: `beforescriptexecute` (JS), fetch/XHR/beacon interception (network), CSS hiding (DOM).

**Rationale**:
- `beforescriptexecute` (Firefox only) stops Juicyads script before execution
- Network interception catches ad requests from other scripts
- CSS hiding catches any slots that slip through
- Periodic cleanup (5s) catches dynamically inserted ads
- Defense in depth

**Alternatives**: Single layer (CSS only, or network only)
**Rejected Because**: Single layer has gaps (CSS doesn't stop requests, network doesn't hide slots)

**Date**: 2026-11-12 (v1.0.0)

---

## 13. Emergency Disable via URL Parameter

**Decision**: Check `?sarrastperf=off` at script start, exit immediately if present.

**Rationale**:
- User-controllable without Tampermonkey UI
- Works for debugging, comparison, emergency
- No storage, no UI, zero overhead when not used
- Simple, reliable, shareable via URL

**Alternatives**: Tampermonkey menu command, localStorage flag, cookie
**Rejected Because**: Requires UI interaction; storage adds complexity

**Date**: 2026-11-12 (v1.0.0)

---

## 14. Cleanup on `pagehide` (Not `unload`/`beforeunload`)

**Decision**: Use `pagehide` (once, passive) for cleanup: clear timers, cancel RAF, disconnect observer.

**Rationale**:
- `pagehide` fires on navigation, bfcache entry, close
- `unload` prevents bfcache (bad for performance)
- `beforeunload` for confirmation dialogs only
- Passive + once = minimal overhead

**Alternatives**: `unload`, `beforeunload`, `visibilitychange`
**Rejected Because**: `unload` kills bfcache; `visibilitychange` fires on tab switch

**Date**: 2026-11-12 (v1.0.0)

---

## 15. Versioned Releases in `versions/` + `dist/` Latest

**Decision**: Build script creates `versions/sarrast-performance-optimizer-v{version}.user.js` and `dist/sarrast-performance-optimizer.user.js` with versioned URLs.

**Rationale**:
- Tampermonkey `@updateURL`/`@downloadURL` need stable versioned URLs
- `dist/` always points to latest for manual installs
- `versions/` provides immutable history
- Build reads `@version` from source — single source of truth

**Alternatives**: GitHub Releases only, no versioned files, CDN
**Rejected Because**: GitHub Releases not raw URLs; no versioned = cache issues

**Date**: 2026-11-12 (v1.0.0), retained

---

## 16. Private GitHub Repo per Script

**Decision**: Each userscript gets its own private GitHub repo under `parhamghahremani/<script-name>`.

**Rationale**:
- Isolation: one script's history/issues don't pollute another
- Granular access control (future collaborators)
- Clear release/tags per script
- Matches canonical naming convention

**Alternatives**: Monorepo `parhamghahremani/userscripts` with subfolders
**Rejected Because**: Monorepo mixes concerns; CI/CD complex; tag naming conflicts

**Date**: 2026-11-17 (Project setup)

---

## 17. Local Backups Inside Project (Not Git)

**Decision**: Backup directories (`backups/`) inside each project, excluded from Git.

**Rationale**:
- Backups include build outputs, node_modules, untracked work
- Git is for source history; backups are for disaster recovery
- Per-project isolation matches repo structure
- Never auto-deleted — user controls retention

**Alternatives**: Git tags only, external backup tool, cloud sync
**Rejected Because**: Git doesn't track untracked/ignored; external tools add dependency

**Date**: 2026-11-17 (Project setup)

---

## 18. Playwright Tests with Local Fixtures (Not Live Site)

**Decision**: Tests use local HTML fixtures served via `serve`, not live sarrast.com.

**Rationale**:
- Deterministic, fast, no network dependency
- Live site changes break tests unpredictably
- Fixtures model key page structures (homepage, reader, series listing)
- CI-friendly

**Alternatives**: Test against live site, snapshot testing
**Rejected Because**: Live site flaky; snapshots brittle

**Date**: 2026-11-12 (v1.0.0)

---

## 19. Firefox Android as Primary Target

**Decision**: Optimize primarily for Firefox Android; desktop is secondary.

**Rationale**:
- Mobile GPU constraints stricter — if works mobile, works desktop
- Firefox Android has unique performance characteristics (GPU memory, compositor)
- `content-visibility` support critical — Firefox 115+ on Android
- User's primary use case is mobile reading

**Alternatives**: Desktop-first, equal priority
**Rejected Because**: Desktop-first misses mobile bottlenecks

**Date**: 2026-11-12 (v1.0.0)