# Research: Scroll-Only Effects on sarrast.com for v1.2.2

## Problem Statement
The "flash" issue occurs when scrolling stops and the `sarrast-scrolling` class is removed. Elements with transitions on expensive GPU properties (box-shadow, filter, backdrop-filter, text-shadow) animate back in, causing a visible flash. The v1.2.2 hybrid approach (force reflow + temporary transition: none + double RAF) still leaves a perceptible flash.

## Root Cause Analysis

### Categories of Scroll-Only Effects on sarrast.com

| Effect Type | Selectors | Trigger | Current Handling | Flash Risk |
|-------------|-----------|---------|------------------|------------|
| **Expensive GPU transitions** | `transition: box-shadow`, `transition: filter`, `transition: backdrop-filter`, `transition: text-shadow` | Site's own CSS | Disabled during scroll via `html.sarrast-scrolling * { transition-property: cheap props only }` | HIGH - animates back in on class removal |
| **Hero carousel autoplay** | `.hs-col`, `.hd-dot.on i:after` | Alpine component `running` getter | `animation: none !important` + Alpine `reduced: true` patch | FIXED in v1.2.1 |
| **Reveal animations (scroll-triggered)** | `.rv` elements with opacity/transform transitions | Site's IntersectionObserver | Force `.in` class + `transition: none !important` + `opacity: 1` + `transform: none` | FIXED in v1.2.1 |
| **Content-visibility auto discard** | `.sec`, `.shelf-s`, `#sched`, `#explore` with small intrinsic size | Browser's content-visibility | `content-visibility: visible` + massive intrinsic size (5000px) | FIXED in v1.2.1 |
| **Site's scroll-linked animations** | Elements with `transition` on scroll-affected properties | Native scroll + CSS | Surgical scroll optimization only disables during scroll | HIGH - this is the remaining flash source |

## The Core Issue
The site has elements with transitions like:
```css
.some-element {
    transition: box-shadow 0.3s ease, opacity 0.2s ease;
}
```

During scroll, our CSS forces:
```css
html.sarrast-scrolling * {
    transition-property: opacity, transform, color, background-color, background, border-color, border, outline, outline-color !important;
    box-shadow: none !important;
}
```

When scroll stops (after 300ms), `sarrast-scrolling` is removed → the original `transition: box-shadow 0.3s` takes effect → box-shadow animates from `none` back to its original value → **FLASH**

## Solution: NEW v1.2.2 Strategy - COMPLETELY DISABLE Scroll-Only Effects

Instead of trying to prevent the flash at scroll-end, we **permanently disable** all effects that are only visible before/after scroll (i.e., effects that are "scroll-only").

### What "Scroll-Only Effects" Means
Effects that:
1. Are triggered by scroll state changes (scroll start/stop)
2. Only exist to provide visual feedback during/after scroll
3. Provide no functional value when static
4. Cause UX degradation when they flash

### Implementation Plan

#### 1. New CONFIG Option
```javascript
// Disable ALL scroll-only effects permanently (not just during scroll)
// This eliminates flash because the effects never exist to flash back in
disableAllScrollEffects: true,
```

#### 2. Permanent CSS Rules (Always Active, Not Just During Scroll)
```css
/* When disableAllScrollEffects is true, these rules are ALWAYS applied */
html.sarrast-disable-scroll-effects *,
html.sarrast-disable-scroll-effects *::before,
html.sarrast-disable-scroll-effects *::after {
    /* Permanently disable expensive GPU transition properties */
    transition-property: opacity, transform, color, background-color, background, border-color, border, outline, outline-color !important;
    
    /* Force expensive effects to their final/initial state - no transition */
    box-shadow: none !important;
    filter: none !important;
    -webkit-filter: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    text-shadow: none !important;
    
    /* Prevent layer promotion */
    will-change: auto !important;
}
```

#### 3. Also Target Specific Known Scroll-Only Patterns
```css
/* Site's reveal system - already handled but make it permanent */
html.sarrast-disable-scroll-effects .rv {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
}

/* Any element with scroll-triggered class changes */
html.sarrast-disable-scroll-effects [class*="scroll"],
html.sarrast-disable-scroll-effects [class*="animate"] {
    transition: none !important;
    animation: none !important;
}
```

#### 4. This replaces the scroll-time optimization entirely when enabled
- No more `sarrast-scrolling` class toggling
- No more `scrollEndDelay` timing issues
- No more hybrid cancel + reflow complexity
- Effects are **permanently gone** → zero flash possible

## Trade-offs

| Aspect | Current (v1.2.1/v1.2.2) | New v1.2.2 (disableAllScrollEffects) |
|--------|------------------------|-------------------------------------|
| Flash | Partial/None (hybrid helps but not perfect) | **Zero - effects never exist** |
| Visual feedback during scroll | Some cheap transitions preserved | Only opacity/transform/color transitions |
| Box-shadow/filter animations | Work when not scrolling | **Permanently disabled** |
| Implementation complexity | High (hybrid cancel + RAF) | Low (static CSS) |
| Memory/performance | Good | Better (no class toggling) |

## Affected Elements on sarrast.com (Based on Fixtures & Research)

1. **Hero carousel** - Already fully disabled via `animation: none`
2. **Reveal elements (`.rv`)** - Already forced to final state via `.in` class + inline styles
3. **Section containers (`.sec`, `.shelf-s`, etc.)** - Already `content-visibility: visible`
4. **Site's custom scroll-triggered transitions** - The remaining source of flash
5. **Any third-party widgets with scroll animations** - Will be caught by blanket rule

## Migration Path
1. Keep existing surgical scroll optimization as default (backwards compatible)
2. Add `disableAllScrollEffects: true` as new aggressive option
3. When enabled, apply permanent CSS rules instead of scroll-time toggling
4. Update documentation to recommend this for users experiencing flash

## Testing Strategy
1. Verify `disableAllScrollEffects` CSS is injected when enabled
2. Verify no `sarrast-scrolling` class toggling occurs when enabled
3. Verify expensive transitions are permanently disabled
4. Verify cheap transitions (opacity, transform) still work
5. Run existing Playwright tests with new config option