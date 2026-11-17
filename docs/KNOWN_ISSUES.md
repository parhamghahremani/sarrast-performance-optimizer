# Known Issues — Sarrast Performance Optimizer

**Project**: `sarrast-performance-optimizer`  
**Version**: 1.2.3

---

## Confirmed Issues

| ID | Issue | Severity | Status | Workaround |
|----|-------|----------|--------|------------|
| KI-01 | Playwright tests need update for v1.2.2+ | Medium | Open | Tests check for legacy `sarrast-scrolling` CSS rules |
| KI-02 | `beforescriptexecute` only works in Firefox | Low | Known limitation | Ad script blocking Firefox-only; CSS/network layers cover other browsers |
| KI-03 | Fixtures may drift from live site structure | Medium | Ongoing | Manual testing catches discrepancies |
| KI-04 | `content-visibility` not supported in Safari | Medium | Known limitation | Graceful degradation — CSS ignored |
| KI-05 | Alpine.js version changes may break hero patch | Low | Monitoring | Patch uses generic `[x-data]` traversal |

---

## Issue Details

### KI-01: Playwright Tests Need Update for v1.2.2+
**Description**: Tests written for v1.2.1 expect legacy scroll-time CSS rules (`sarrast-scrolling` class in CSS). v1.2.2+ uses permanent disable (`sarrast-disable-scroll-effects`) and no longer includes scroll-time rules by default.

**Failing Assertions**:
- Line 23: `expect(css).toContain("sarrast-scrolling")` — not in CSS when `disableAllScrollEffects=true`
- Line 167: `transition-property` expects `outline, outline-color` but source only has `border`

**Fix Required**: Update tests to verify v1.2.2+ behavior (permanent disable classes, permanent CSS rules).

**Priority**: Medium — blocks CI confidence but not functionality.

---

### KI-02: `beforescriptexecute` Firefox-Only
**Description**: Juicyads script blocking uses `document.addEventListener('beforescriptexecute', ...)` which is Firefox-specific (non-standard).

**Impact**: In Chrome/Safari/Edge, the Juicyads script loads but is blocked by network interception and CSS hiding.

**Mitigation**: Three-layer defense (script + network + CSS) ensures coverage.

**Priority**: Low — defense in depth handles it.

---

### KI-03: Fixtures Drift from Live Site
**Description**: Playwright test fixtures (`tests/fixtures/`) are static HTML snapshots. Live sarrast.com may change structure (class names, DOM hierarchy, htmx endpoints).

**Impact**: Tests pass but script may not work on live site.

**Mitigation**: Manual testing on live site mandatory before release. Fixtures updated when discrepancies found.

**Priority**: Medium — ongoing maintenance.

---

### KI-04: `content-visibility` Safari Support
**Description**: Safari (desktop and iOS) does not support `content-visibility` or `contain-intrinsic-size` as of 2026.

**Impact**: Reader page optimizations (comic images, translation boxes, sections) have no effect in Safari.

**Mitigation**: CSS rules silently ignored — no breakage. Performance gains Firefox/Chrome only.

**Priority**: Medium — Safari users don't get optimization benefits.

---

### KI-05: Alpine.js Version Compatibility
**Description**: Hero carousel autoplay patch traverses `[x-data]` elements and forces `reduced: true` getter. Major Alpine.js version changes could break this.

**Impact**: Hero autoplay may not be disabled if Alpine internals change.

**Mitigation**: CSS `animation: none` provides first layer of defense. Patch is best-effort.

**Priority**: Low — monitor Alpine releases.

---

## Potential Issues (Unconfirmed)

| ID | Issue | Likelihood | Notes |
|----|-------|------------|-------|
| PI-01 | Site adds CSP blocking `'unsafe-inline'` styles | Low | Would require `@grant` + `GM_addStyle` |
| PI-02 | htmx replaced with different SPA framework | Low | Would need new event listeners |
| PI-03 | Translation boxes (`.bx`) restructured | Medium | Selector-based, easy to update |
| PI-04 | Comic image container (`.col .pg`) changed | Medium | Selector-based, easy to update |
| PI-05 | New ad networks bypass current blockers | Medium | Periodic cleanup + CSS catches most |

---

## Resolved Issues (Historical)

| ID | Issue | Version Fixed | Resolution |
|----|-------|---------------|------------|
| RI-01 | Scroll-end flash (transition flash) | v1.2.2 | Permanent disable of scroll-only effects |
| RI-02 | Hero carousel rapid cycling | v1.2.1 | `animation: none` + Alpine patch |
| RI-03 | Below-fold re-render on scroll back | v1.2.1 | `content-visibility: visible` + intrinsic size |
| RI-04 | Hero carousel infinite loop | v1.1.0 | `animation-play-state: paused` (superseded) |
| RI-05 | Aggressive scroll mode broke transitions | v1.2.0 | Surgical mode (transition-property restriction) |

---

## Monitoring Checklist (Per Release)

- [ ] Run Playwright tests (update if needed)
- [ ] Manual test: Firefox Desktop (homepage, series listing, reader)
- [ ] Manual test: Firefox Android (reader page scroll performance)
- [ ] Check console for errors on live site
- [ ] Verify ad blocking still works (network tab)
- [ ] Verify emergency disable works
- [ ] Check for new ad networks in network requests
- [ ] Verify Alpine hero patch still applies