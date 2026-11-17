# Manual Test Plan — Sarrast Performance Optimizer

**Project**: `sarrast-performance-optimizer`  
**Version**: 1.2.3  
**Target**: Firefox Desktop + Firefox Android + Tampermonkey

---

## Pre-Test Setup

1. Install Firefox (Desktop) and Firefox (Android)
2. Install Tampermonkey extension on both
3. Install script from `dist/sarrast-performance-optimizer.user.js`
4. Open browser console (F12 on Desktop, remote debugging on Android)

---

## Test Cases

### TC-01: Script Injection & Basic Load
**Target**: Homepage (`https://sarrast.com/`)
**Steps**:
1. Navigate to homepage
2. Open DevTools → Elements → Search for `#sarrast-performance-optimizer`
3. Verify style element exists
4. Check console for `[SARRAST]` logs (if any)
**Expected**: Style element injected, no errors

### TC-02: Permanent Scroll-Effects Disable (v1.2.2+)
**Target**: Any page
**Steps**:
1. Navigate to homepage
2. Inspect `<html>` element
3. Verify class `sarrast-disable-scroll-effects` present
4. Scroll page vigorously
5. Verify `sarrast-scrolling` class does NOT appear
**Expected**: Permanent disable class present, no scroll-time toggle

### TC-03: Calm Motion Class
**Target**: Any page
**Steps**:
1. Navigate to homepage
2. Inspect `<html>` element
3. Verify class `sarrast-calm` present
**Expected**: Class present

### TC-04: Emergency Disable
**Target**: Any page with `?sarrastperf=off`
**Steps**:
1. Navigate to `https://sarrast.com/?sarrastperf=off`
2. Verify `#sarrast-performance-optimizer` style element does NOT exist
3. Verify no `sarrast-*` classes on `<html>`
**Expected**: Script completely disabled

### TC-05: Image Async Decoding
**Target**: Homepage / Series listing
**Steps**:
1. Navigate to homepage
2. Run in console: `Array.from(document.querySelectorAll('img')).filter(i => i.decoding === 'async').length`
**Expected**: Count > 0

### TC-06: Smart Lazy Loading
**Target**: Long page (series listing)
**Steps**:
1. Navigate to series listing
2. Scroll down
3. Run in console: Check images below fold have `loading="lazy"`, above fold have `loading="eager"`
**Expected**: Below-fold images lazy, above-fold eager

### TC-07: Large Image Content-Visibility
**Target**: Page with large images
**Steps**:
1. Find image > 800px rendered height
2. Inspect element
3. Verify class `sarrast-large-image` present
4. Verify `content-visibility: auto` in computed styles
**Expected**: Class and CSS applied

### TC-08: Reader Page - Comic Images
**Target**: Reader page (`/series/<series>/<chapter>/`)
**Steps**:
1. Navigate to a chapter page
2. Verify `body.rdr` class present
3. Inspect comic images (`.col .pg`)
4. Verify class `sarrast-reader-image` on tall images
4. Verify `content-visibility: auto` + `contain-intrinsic-size: auto 5000px`
**Expected**: Comic images optimized with 5000px intrinsic size

### TC-09: Reader Page - Translation Boxes
**Target**: Reader page
**Steps**:
1. Navigate to a chapter page
2. Inspect translation boxes (`.boxes .bx`)
3. Verify class `sarrast-box` present
4. Verify `content-visibility: auto` + intrinsic size matching box height
**Expected**: All translation boxes optimized

### TC-10: Hero Carousel Off-Screen Optimization
**Target**: Homepage
**Steps**:
1. Navigate to homepage
2. Inspect hero slides (`.hs-col`)
3. Scroll so some slides are off-screen
4. Verify off-screen slides have `sarrast-offscreen` class
5. Verify `content-visibility: auto` + `contain-intrinsic-size: auto 300px`
**Expected**: Off-screen slides optimized

### TC-11: Hero Carousel Autoplay Disabled
**Target**: Homepage
**Steps**:
1. Navigate to homepage
2. Wait 10 seconds
3. Verify carousel does NOT auto-advance
4. Check computed style on `.hs-col`: `animation: none`
**Expected**: No autoplay, animation disabled

### TC-12: Series Listing Card Optimization
**Target**: Series listing (`/series/`)
**Steps**:
1. Navigate to series listing
2. Inspect cards (`.card`)
3. Verify class `sarrast-card` present
4. Verify `content-visibility: auto` + `contain-intrinsic-size: auto 400px`
**Expected**: Cards optimized

### TC-13: Skeleton Placeholders
**Target**: Series listing with unloaded images
**Steps**:
1. Navigate to series listing (throttle network if needed)
2. Inspect cards without loaded images
3. Verify `sarrast-skeleton` class present
4. Verify shimmer animation visible
**Expected**: Skeletons shown for empty cards

### TC-14: Ad Blocking - Juicyads Script
**Target**: Any page with juicyads
**Steps**:
1. Navigate to homepage
2. Open Network tab
3. Filter for "juicyads"
4. Verify script from `js.juicyads.com` is blocked
**Expected**: Juicyads script blocked

### TC-15: Ad Blocking - Ad Slots Hidden
**Target**: Any page with ad slots
**Steps**:
1. Navigate to homepage
2. Inspect elements matching `[id*="ad"]`, `[class*="ad-slot"]`, `.juicyads`
3. Verify `display: none`, `visibility: hidden`, `opacity: 0`
**Expected**: Ad slots hidden

### TC-16: Below-Fold Acceleration - Section Intrinsic Size
**Target**: Homepage / Series listing
**Steps**:
1. Navigate to homepage
2. Inspect sections (`.sec`, `.shelf-s`, `#explore`, `#sched`)
3. Verify `contain-intrinsic-size: auto 5000px`
**Expected**: Large intrinsic size on sections

### TC-17: Reveal Elements (`.rv`) Forced Visible
**Target**: Pages with reveal elements
**Steps**:
1. Navigate to homepage
2. Inspect `.rv` elements
3. Verify `content-visibility: visible` + `contain-intrinsic-size: auto 800px`
3. Verify inline styles: `opacity: 1`, `transform: none`
**Expected**: Reveal elements forced to final state

### TC-18: SPA Navigation - htmx Re-optimization
**Target**: SPA navigation (click series link)
**Steps**:
1. Navigate to homepage
2. Click a series link (htmx navigation)
3. Wait for content swap
4. Verify new content optimized (images, cards, etc.)
**Expected**: New content automatically optimized

### TC-19: Resize/Orientation Re-optimization
**Target**: Any page
**Steps**:
1. Navigate to reader page
2. Resize browser window significantly
3. Verify content re-queued and optimized
**Expected**: Re-optimization triggered

### TC-20: Firefox Android - Scroll Performance
**Target**: Reader page on Firefox Android
**Steps**:
1. Open on Firefox Android
2. Navigate to chapter with 20+ images
3. Scroll rapidly (fling gestures)
4. Observe smoothness, no jank
**Expected**: Smooth scrolling, no visible flash

### TC-21: Firefox Android - Memory/CPU
**Target**: Long reader page
**Steps**:
1. Open reader page with 30+ images + 100+ boxes
2. Scroll through entire chapter
3. Monitor memory/CPU in remote debugging
**Expected**: Reasonable memory, no CPU spikes

### TC-22: Prefers Reduced Motion
**Target**: Any page (OS setting)
**Steps**:
1. Enable "Reduce motion" in OS settings (Windows: Settings > Accessibility > Visual effects > Animation effects OFF; Android: Developer options > Remove animations)
2. Reload page
3. Verify animations further reduced
**Expected**: Respects system setting

### TC-23: Console Error Free
**Target**: All pages
**Steps**:
1. Navigate through homepage, series listing, reader pages
2. Monitor console for errors
3. Filter for script-related errors
**Expected**: Zero errors from script

### TC-24: Cleanup on Navigation
**Target**: Navigate away from site
**Steps**:
1. Navigate to sarrast.com
2. Navigate to google.com
3. Verify no memory leaks (observer disconnected)
**Expected**: Clean unload

---

## Test Execution Checklist

| Test Case | Desktop Firefox | Firefox Android | Status |
|-----------|-----------------|-----------------|--------|
| TC-01 | ☐ | ☐ | |
| TC-02 | ☐ | ☐ | |
| TC-03 | ☐ | ☐ | |
| TC-04 | ☐ | ☐ | |
| TC-05 | ☐ | ☐ | |
| TC-06 | ☐ | ☐ | |
| TC-07 | ☐ | ☐ | |
| TC-08 | ☐ | ☐ | |
| TC-09 | ☐ | ☐ | |
| TC-10 | ☐ | ☐ | |
| TC-11 | ☐ | ☐ | |
| TC-12 | ☐ | ☐ | |
| TC-13 | ☐ | ☐ | |
| TC-14 | ☐ | ☐ | |
| TC-15 | ☐ | ☐ | |
| TC-16 | ☐ | ☐ | |
| TC-17 | ☐ | ☐ | |
| TC-18 | ☐ | ☐ | |
| TC-19 | ☐ | ☐ | |
| TC-20 | ☐ | ☐ | |
| TC-21 | ☐ | ☐ | |
| TC-22 | ☐ | ☐ | |
| TC-23 | ☐ | ☐ | |
| TC-24 | ☐ | ☐ | |

---

## Reporting Issues

For each failed test, record:
1. Test case ID
2. Environment (Desktop/Android, Firefox version)
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors (if any)
6. Screenshot/video if applicable

---

## Sign-Off

All tests must pass on **both** Firefox Desktop and Firefox Android before version release.