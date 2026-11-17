# Compatibility — Sarrast Performance Optimizer

**Project**: `sarrast-performance-optimizer`  
**Version**: 1.2.3

---

## Browser Support

| Browser | Desktop | Android | Status |
|---------|---------|---------|--------|
| Firefox | ✅ Tested | ✅ **Primary target** | Verified via Playwright + Manual |
| Chrome/Chromium | ✅ Compatible | ✅ Compatible | Untested |
| Safari/WebKit | ✅ Compatible | ✅ Compatible | Untested |
| Edge | ✅ Compatible | ✅ Compatible | Untested |
| Samsung Internet | ❓ Unknown | ❓ Unknown | Untested |

**Note**: Firefox Android is the primary development target due to stricter GPU constraints.

---

## Userscript Manager Support

| Manager | Version | Status | Notes |
|---------|---------|--------|-------|
| Tampermonkey | Latest | ✅ **Recommended** | Full support, update checks work |
| Greasemonkey | 4.x+ | ✅ Compatible | `@grant none` supported |
| Violentmonkey | Latest | ✅ Compatible | Full support |
| Userscripts (iOS Safari) | — | ❓ Untested | May have limitations |

---

## API Compatibility

### Used Web APIs (with support)

| API | Chrome | Firefox | Safari | Edge | Notes |
|-----|--------|---------|--------|------|-------|
| `requestIdleCallback` | ✅ 47+ | ✅ 55+ | ❌ | ✅ 79+ | Fallback: `setTimeout` |
| `requestAnimationFrame` | ✅ 10+ | ✅ 5+ | ✅ 6+ | ✅ 12+ | — |
| `MutationObserver` | ✅ 18+ | ✅ 14+ | ✅ 7+ | ✅ 12+ | — |
| `WeakSet` | ✅ 36+ | ✅ 34+ | ✅ 9+ | ✅ 12+ | — |
| `element.matches()` | ✅ 34+ | ✅ 34+ | ✅ 7+ | ✅ 12+ | — |
| `element.closest()` | ✅ 41+ | ✅ 35+ | ✅ 9+ | ✅ 15+ | Not used directly |
| `img.decoding` | ✅ 65+ | ✅ 61+ | ✅ 14.1+ | ✅ 79+ | `async` value |
| `img.loading` | ✅ 77+ | ✅ 75+ | ✅ 15.4+ | ✅ 79+ | `lazy`/`eager` |
| `img.fetchPriority` | ✅ 101+ | ✅ 101+ | ✅ 16+ | ✅ 101+ | Feature detected |
| `iframe.loading` | ✅ 77+ | ✅ 75+ | ✅ 15.4+ | ✅ 79+ | `lazy` value |
| `content-visibility` | ✅ 85+ | ✅ 115+ | ❌ | ✅ 85+ | `auto`/`visible` |
| `contain-intrinsic-size` | ✅ 83+ | ✅ 115+ | ❌ | ✅ 83+ | — |
| `beforescriptexecute` | ❌ | ✅ | ❌ | ❌ | Firefox only — ad blocking |
| `pagehide` | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ | — |
| `URLSearchParams` | ✅ 49+ | ✅ 44+ | ✅ 10+ | ✅ 17+ | — |

### Firefox-Specific APIs

- **`beforescriptexecute`**: Used for Juicyads script blocking. **Firefox only** — silently does nothing in other browsers.

### Polyfills/Workarounds

| Feature | Fallback |
|---------|----------|
| `requestIdleCallback` | `setTimeout(callback, 300)` |
| `img.fetchPriority` | Feature detected: `if ("fetchPriority" in img)` |
| `content-visibility` | Graceful degradation — browser ignores unknown CSS |
| `contain-intrinsic-size` | Graceful degradation — browser ignores unknown CSS |

---

## Site-Specific Compatibility

### sarrast.com Structure (as of v1.2.3)

| Page Type | Path Pattern | Key Selectors | Status |
|-----------|--------------|---------------|--------|
| Homepage | `/` | `.hs-col`, `.hd-dot`, `.sec`, `.shelf-s`, `#explore`, `#sched` | ✅ Tested via fixtures |
| Series Listing | `/series`, `/search` | `.card`, `.card img` | ✅ Tested via fixtures |
| Reader | `/series/*/*`, `/reader` | `body.rdr`, `.col .pg`, `.boxes .bx` | ✅ Tested via fixtures |

### Known Site Changes That Would Break Script

| Change | Impact | Mitigation |
|--------|--------|------------|
| Remove `body.rdr` class from reader | Reader page detection fails | Update `isReaderPage` regex |
| Rename `.col .pg` for comic images | Reader image optimization fails | Update selector in `optimizeLoadedImage` |
| Rename `.boxes .bx` for translations | Box optimization fails | Update selector in `optimizeBox` |
| Remove `htmx:afterSwap`/`htmx:load` | SPA re-optimization fails | Add alternative detection |
| Change Alpine component structure | Hero autoplay patch fails | Update Alpine patch logic |
| Add CSP blocking `unsafe-inline` styles | CSS injection fails | Would need `GM_addStyle` (requires `@grant`) |

---

## CSP Compatibility Matrix

| CSP Policy | Compatible | Workaround |
|------------|------------|------------|
| `script-src 'self'` | ✅ | Script is inline |
| `style-src 'self' 'unsafe-inline'` | ✅ | Inline `<style>` element |
| `style-src 'self'` (no unsafe-inline) | ❌ | Would need `GM_addStyle` + `@grant` |
| `connect-src 'self'` | ✅ | No network requests |
| `img-src *` | ✅ | Only modifies existing images |
| `frame-src 'self'` | ✅ | Only modifies existing iframes |

**Current**: Works with typical CSP allowing `'unsafe-inline'` for styles.

---

## Mobile-Specific Considerations (Firefox Android)

| Constraint | Handling |
|------------|----------|
| GPU memory limited | Permanent disable of expensive effects (box-shadow, filter, backdrop-filter) |
| Touch scrolling momentum | 300ms scroll-end delay handles fling |
| Viewport height varies | Uses `window.innerHeight` with fallback |
| `content-visibility` support | Firefox 115+ — ✅ Available |
| `requestIdleCallback` | Firefox 55+ — ✅ Available |
| Battery optimization | Batch processing yields to main thread |
| Background tab kill | `pagehide` cleanup preserves state |

---

## Version Compatibility

| Script Version | Minimum Firefox | Minimum Chrome | Notes |
|----------------|-----------------|----------------|-------|
| 1.0.0 | 55 | 65 | Basic `content-visibility` not used |
| 1.1.0 | 55 | 65 | Added intrinsic size |
| 1.2.0 | 85 | 85 | `content-visibility: auto` requires Firefox 115+ |
| 1.2.1 | 85 | 85 | `content-visibility: visible` |
| 1.2.2+ | 85 | 85 | Permanent disable scroll effects |

---

## Testing Matrix

| Test Environment | Automated (Playwright) | Manual |
|------------------|------------------------|--------|
| Firefox Desktop (Windows) | ✅ Chromium/Firefox/WebKit projects | ✅ Required |
| Firefox Android | ❌ Not in CI | ✅ **Required** |
| Chrome Desktop | ✅ Chromium project | ❓ Optional |
| Safari | ✅ WebKit project | ❓ Optional |

**Note**: Playwright tests use local HTML fixtures, not live site. Manual testing on live site is mandatory.

---

## Known Limitations

1. **No Safari `content-visibility` support** — CSS rules silently ignored
2. **No `beforescriptexecute` outside Firefox** — Juicyads script blocking Firefox-only
3. **Fixtures may drift from live site** — Manual testing catches discrepancies
4. **No automated visual regression** — Scroll flash, layout shifts require manual verification
5. **Alpine.js version changes** — Hero patch may break with major Alpine updates