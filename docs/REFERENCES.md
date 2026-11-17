# References — Sarrast Performance Optimizer

**Project**: `sarrast-performance-optimizer`  
**Version**: 1.2.3

---

## Official Documentation

### Web APIs
- **MDN `content-visibility`**: https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility
- **MDN `contain-intrinsic-size`**: https://developer.mozilla.org/en-US/docs/Web/CSS/contain-intrinsic-size
- **MDN `requestIdleCallback`**: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
- **MDN `MutationObserver`**: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
- **MDN `WeakSet`**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet
- **MDN `beforescriptexecute`**: https://developer.mozilla.org/en-US/docs/Web/API/Document/beforescriptexecute_event
- **MDN `pagehide`**: https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
- **MDN `img.decoding`**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#decoding
- **MDN `img.loading`**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#loading
- **MDN `img.fetchPriority`**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#fetchpriority
- **MDN `prefers-reduced-motion`**: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

### Firefox Android Performance
- **Firefox Android Performance Guide**: https://developer.mozilla.org/en-US/docs/Web/Performance/Firefox_Android
- **Firefox Android GPU Compositor**: https://developer.mozilla.org/en-US/docs/Mozilla/Gecko/GPU_Compositing

### Userscript Standards
- **Tampermonkey Documentation**: https://www.tampermonkey.net/documentation.php
- **Greasemonkey API Reference**: https://wiki.greasespot.net/API_Reference
- **Violentmonkey Docs**: https://violentmonkey.github.io/
- **Userscript Metadata Block**: https://wiki.greasespot.net/Metadata_Block

---

## Framework Documentation (Sarrast Uses)

### htmx
- **htmx Reference**: https://htmx.org/docs/
- **htmx Events**: https://htmx.org/docs/#events
  - `htmx:afterSwap` — After content swapped
  - `htmx:load` — New content loaded

### Alpine.js
- **Alpine.js Documentation**: https://alpinejs.dev/
- **Alpine Events**: https://alpinejs.dev/globals/alpine-events
  - `alpine:init` — Before component initialization
- **Component Internals**: `$data`, `__x.getUnobservedData()`

---

## Performance Research

### CSS Containment
- **CSS Containment Spec**: https://drafts.csswg.org/css-contain/
- **content-visibility Explainer**: https://github.com/WICG/content-visibility
- **contain-intrinsic-size Explainer**: https://github.com/WICG/contain-intrinsic-size

### Idle Callbacks
- **requestIdleCallback Spec**: https://w3c.github.io/requestidlecallback/
- **Scheduling Best Practices**: https://web.dev/articles/optimize-long-tasks

### Scroll Performance
- **Passive Event Listeners**: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
- **Scroll-linked Animations**: https://drafts.csswg.org/scroll-animations-1/
- **GPU Compositing**: https://developer.chrome.com/docs/rendering/stick-to-compositor-only-properties/

---

## Related Projects

### MT98 Performance Optimizer
- **Repo**: `parhamghahremani/mt98-performance-optimizer`
- **Differences**: Conservative reader page handling, no htmx/Alpine, scroll-time toggle (not permanent disable)

### Instagram Bulk Select
- **Repo**: `parhamghahremani/instagram-select-comments`
- **Differences**: Interaction automation, checkbox clicking, menu UI

### Shahvani Ultra Lite
- **Repo**: `parhamghahremani/shahvani-ultra-lite`
- **Differences**: Feature-rich, multiple modes, different target site

---

## Research Documents (Internal)

### RESEARCH_SCROLL_EFFECTS.md
Internal research on scroll-only effects flash problem and v1.2.2 solution.
- Root cause analysis of transition flash
- Categories of scroll-only effects on sarrast.com
- Decision to permanently disable vs. toggle

---

## Version History Sources

| Version | Date | Source |
|---------|------|--------|
| 1.0.0 | 2026-11-12 | Initial development |
| 1.1.0 | 2026-11-12 | Below-fold acceleration |
| 1.2.0 | 2026-11-12 | Surgical scroll optimization |
| 1.2.1 | 2026-11-13 | Hero fix, zero re-render |
| 1.2.2 | 2026-11-13 | Permanent scroll-effects disable |
| 1.2.3 | 2026-11-14 | Metadata/icon update |

---

## Tools & Versions Used

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥18.0.0 | Build, lint, test |
| npm | ≥9.0.0 | Package management |
| ESLint | ^8.55.0 | Linting |
| Prettier | ^3.1.0 | Formatting |
| Playwright | ^1.40.0 | Automated testing |
| serve | ^14.2.0 | Test fixture server |
| Firefox | Latest | Primary target browser |
| Tampermonkey | Latest | Userscript manager |

---

## Useful Commands

```bash
# Development
npm install              # Install dependencies
npm run lint             # Check code style
npm run format           # Auto-format
npm test                 # Run Playwright tests
npm run build            # Create versioned release

# Version management
npm run version:patch    # 1.2.3 → 1.2.4
npm run version:minor    # 1.2.3 → 1.3.0
npm run version:major    # 1.2.3 → 2.0.0

# Git
git add . && git commit -m "type: description"
git tag v1.2.3
git push origin master --tags

# Backup (PowerShell)
Get-FileHash -Algorithm SHA256 "path\to\backup.zip"
```