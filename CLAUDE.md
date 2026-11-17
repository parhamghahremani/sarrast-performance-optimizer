# Sarrast Performance Optimizer — Project Instructions

**Project**: `sarrast-performance-optimizer`  
**Canonical Name**: `sarrast-performance-optimizer`  
**Userscript File**: `src/sarrast-performance-optimizer.user.js` (built to `dist/` and `versions/`)  
**GitHub Repo**: `parhamghahremani/sarrast-performance-optimizer` (Private)  
**Current Version**: 1.2.3  
**Target**: Firefox Desktop + Firefox Android  
**Site**: `https://sarrast.com/*`, `https://www.sarrast.com/*`

---

## Quick Reference

| Aspect | Value |
|--------|-------|
| `@run-at` | `document-start` |
| `@grant` | `none` |
| `@match` | `https://sarrast.com/*`, `https://www.sarrast.com/*` |
| Build | `npm run build` → `dist/`, `versions/` |
| Lint | `npm run lint` |
| Test | `npm test` (Playwright) |
| Version bump | `npm run version:patch\|minor\|major` |

---

## Architecture Summary

Single-file userscript (IIFE) with these modules:

1. **Configuration** (`CONFIG` object) — 17 options controlling behavior
2. **Early CSS injection** — Style element with performance CSS (run-at document-start)
3. **Permanent scroll-effects disable** — `sarrast-disable-scroll-effects` class (v1.2.2+, default on)
4. **Legacy scroll-time optimization** — `sarrast-scrolling` class toggle (when disableAllScrollEffects=false)
5. **Calm motion** — `sarrast-calm` class reduces animations/transitions
6. **Image optimization** — `decoding=async`, smart lazy loading, `content-visibility` for large images
7. **Reader page optimization** — Comic images (3000-5000px) + translation overlay boxes (`.bx`)
8. **Homepage optimization** — Hero carousel off-screen slides + autoplay disable
9. **Series listing optimization** — Card grids with content-visibility + skeleton placeholders
10. **Iframe optimization** — Lazy loading for off-screen frames
11. **Ad blocking** — Juicyads script + ad network requests + CSS hiding
12. **Batch processing** — `requestIdleCallback` with configurable batch size
13. **MutationObserver** — Queues new images/iframes/boxes/hero slides/cards
14. **htmx SPA handling** — Re-optimizes after `htmx:afterSwap` and `htmx:load`
15. **Alpine.js compatibility** — Hero component patch to disable autoplay
16. **Cleanup** — Proper disconnect on `pagehide`

---

## Key Design Decisions

- **v1.2.2+**: Permanent disable of scroll-only effects (`disableAllScrollEffects: true`) — zero flash because effects never exist to flash back in
- **v1.2.1**: Hero carousel fix (`animation: none` instead of `paused`), below-fold retention (`content-visibility: visible`), scroll-end delay 300ms
- **Reader pages**: Aggressive optimization (unlike MT98's conservative approach) — comic images and translation boxes are primary content
- **htmx/Alpine integration**: Native event listeners + MutationObserver for SPA navigation
- **No GM APIs**: `@grant none` for CSP compatibility
- **WeakSet tracking**: Prevents re-processing and memory leaks

---

## Configuration (CONFIG object)

| Option | Default | Description |
|--------|---------|-------------|
| `optimizeImages` | `true` | Async decode + conditional lazy loading |
| `optimizeLargeImages` | `true` | `content-visibility: auto` for large images |
| `largeImageHeight` | `800` | Min rendered height (px) for content-visibility (general) |
| `lazyDistance` | `1.5` | Viewport multiplier for lazy-loading trigger |
| `scrollEndDelay` | `300` | ms to keep `sarrast-scrolling` class after scroll ends |
| `idleDelay` | `300` | ms timeout for `requestIdleCallback` |
| `batchSize` | `100` | Max nodes processed per idle callback |
| `blockAds` | `true` | Block third-party ad scripts and hide ad slots |
| `calmMotion` | `true` | Reduce all animations/transitions |
| `optimizeReaderBoxes` | `true` | Optimize translation overlay boxes (.bx) on reader pages |
| `readerImageThreshold` | `2000` | Min rendered height (px) for reader image content-visibility |
| `disableHeroAutoplay` | `true` | Fully disable hero carousel autoplay (animation: none) |
| `forceContentVisibilityVisible` | `true` | Use content-visibility: visible instead of auto |
| `disableExpensiveTransitionsDuringScroll` | `true` | Restrict transition-property during scroll (legacy) |
| `accelerateBelowFold` | `true` | Below-fold loading acceleration |
| `increaseIntrinsicSize` | `true` | Boost contain-intrinsic-size for sections |
| `intrinsicSize` | `5000` | New intrinsic size for sections (px) |
| `addSkeletons` | `true` | Add shimmer skeleton to empty cards |
| `disableAllScrollEffects` | `true` | **NEW v1.2.2** Permanently disable all scroll-only effects |

---

## Development Commands

```bash
# From project root: D:\Desktop\project\scripts\sarrast-performance-optimizer

# Install deps
npm install

# Lint source
npm run lint

# Format source
npm run format

# Run Playwright tests
npm test

# Build versioned release
npm run build

# Version bumps (updates package.json + src/@version)
npm run version:patch  # 1.2.3 → 1.2.4
npm run version:minor  # 1.2.3 → 1.3.0
npm run version:major  # 1.2.3 → 2.0.0
```

---

## Build Process

`build.js` reads `@version` from source, creates:
- `versions/sarrast-performance-optimizer-v{version}.user.js` — versioned archive
- `dist/sarrast-performance-optimizer.user.js` — latest with updated `@downloadURL`/`@updateURL` pointing to versioned file

**Never edit `dist/` or `versions/` directly** — they are build outputs.

---

## Testing

- **Playwright tests** in `tests/smoke.test.js` — run with `npm test`
- Tests use local fixtures served via `serve` on port 8081
- **Final verification always manual** in real Firefox + Tampermonkey (Desktop + Android)

---

## Git Workflow

```bash
# Always use explicit path
cd "D:\Desktop\project\scripts\sarrast-performance-optimizer"

# Check status
git status

# Stage changes
git add .

# Commit with conventional message
git commit -m "type: description"

# Tag stable versions
git tag v1.2.3

# Push (ONLY after manual review + explicit approval)
git push origin master --tags
```

---

## Backup Protocol

Pre-change snapshot before each logical batch:
```bash
# Create timestamped snapshot (exclude .git/, backups/, node_modules/, dist/, versions/)
# Verify with Get-FileHash -Algorithm SHA256
# Record in backups/BACKUP_MANIFEST.md
```

---

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | User-facing: install, usage, config, version |
| `CHANGELOG.md` | Versioned history |
| `PROJECT_STATUS.md` | Current state, version, backups, next steps |
| `docs/SPECIFICATION.md` | Requirements, acceptance criteria |
| `docs/ARCHITECTURE.md` | Module breakdown, data flow |
| `docs/DEVELOPMENT_GUIDE.md` | Editing, build, maintenance, release |
| `docs/CONFIGURATION_AND_PERMISSIONS.md` | Metadata, grants, CONFIG details |
| `docs/COMPATIBILITY.md` | Verified browsers, unverified areas |
| `docs/MANUAL_TEST_PLAN.md` | User test checklist |
| `docs/DEVELOPMENT_LOG.md` | Milestones, diagnosed issues |
| `docs/DECISIONS.md` | Key technical decisions + rationale |
| `docs/KNOWN_ISSUES.md` | Confirmed defects, workarounds |
| `docs/REFERENCES.md` | Official docs, research sources |

---

## Constraints & Rules

1. **Never modify sibling projects** — Only touch `sarrast-performance-optimizer/`
2. **Source of truth** = `src/sarrast-performance-optimizer.user.js`
3. **Version consistency**: `@version` in source = `package.json` = Git tag = CHANGELOG
4. **Private GitHub repo** — Never make public without explicit permission
5. **Sync only after approval** — Push after manual test + user go-ahead
6. **Persian communication** — All user messages in Persian; code/docs in English
7. **No automated test suites** — Playwright for research only; user tests manually

---

## Current Status (2026-11-17)

- **Version**: 1.2.3 (stable)
- **Git**: Initialized, first commit pending
- **GitHub**: Private repo to be created at `parhamghahremani/sarrast-performance-optimizer`
- **Documentation**: Being created in this session
- **Backups**: Directory structure created, first snapshot pending
- **Next**: Initial commit, documentation completion, backup verification, GitHub push