# Development Guide — Sarrast Performance Optimizer

**Project**: `sarrast-performance-optimizer`  
**Version**: 1.2.3

---

## Project Structure

```
sarrast-performance-optimizer/
├── src/
│   └── sarrast-performance-optimizer.user.js    # Source userscript (EDIT THIS)
├── dist/
│   └── sarrast-performance-optimizer.user.js    # Build output (latest, auto-generated)
├── versions/
│   └── sarrast-performance-optimizer-v*.user.js # Versioned releases (auto-generated)
├── tests/
│   ├── smoke.test.js                            # Playwright smoke tests
│   └── fixtures/                                # Local test HTML fixtures
├── docs/                                        # Documentation
├── backups/                                     # Local backups (never committed)
├── .gitignore
├── .prettierrc
├── build.js
├── CHANGELOG.md
├── CLAUDE.md
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── playwright.config.cjs
├── PROJECT_STATUS.md
└── README.md
```

---

## Editing the Source

**Only edit**: `src/sarrast-performance-optimizer.user.js`

**Never edit directly**:
- `dist/sarrast-performance-optimizer.user.js` — build output
- `versions/sarrast-performance-optimizer-v*.user.js` — versioned archives

---

## Development Workflow

### 1. Make Changes
Edit `src/sarrast-performance-optimizer.user.js`

### 2. Lint & Format
```bash
npm run lint      # Check for issues
npm run format    # Auto-fix formatting
```

### 3. Test
```bash
npm test          # Run Playwright tests
```

### 4. Build (creates versioned release)
```bash
npm run build
```
This reads `@version` from source and creates:
- `versions/sarrast-performance-optimizer-v{version}.user.js`
- `dist/sarrast-performance-optimizer.user.js` (with updated `@downloadURL`/`@updateURL`)

### 5. Version Bump
```bash
npm run version:patch  # 1.2.3 → 1.2.4 (bug fixes)
npm run version:minor  # 1.2.3 → 1.3.0 (new features)
npm run version:major  # 1.2.3 → 2.0.0 (breaking changes)
```
This updates `package.json` version AND `@version` in source file.

### 6. Commit
```bash
git add .
git commit -m "type: description"
git tag vX.Y.Z
```

### 7. Backup
Create pre-change snapshot before major edits, full snapshot after stable milestone.

### 8. Manual Test
Test in real Firefox + Tampermonkey (Desktop and Android)

### 9. Push to GitHub (ONLY AFTER APPROVAL)
```bash
git push origin master --tags
```

---

## Code Style Rules

Enforced by ESLint + Prettier:

| Rule | Setting |
|------|---------|
| Indent | 4 spaces |
| Line endings | Unix (LF) |
| Quotes | Double |
| Semicolons | Required |
| Variables | `const` preferred, `no-var` |
| Unused vars | Warning (prefix `_` to ignore) |
| Console | Allowed |

**Key conventions from existing code**:
- 4-space indentation throughout
- JSDoc-style block comments for sections
- Inline comments for non-obvious logic
- `try/catch` for all DOM operations
- `passive: true` for all event listeners
- `once: true` for one-time listeners
- `WeakSet` for deduplication
- Config-driven thresholds (no magic numbers)
- Dynamic CSS building from CONFIG

---

## Testing Strategy

### Playwright Tests (Research Only)
```bash
npm test
```
Tests in `tests/smoke.test.js` verify:
- Script injection without errors
- Style element presence and CSS rules
- `sarrast-disable-scroll-effects` and `sarrast-calm` classes on `<html>`
- Image optimization (decoding=async)
- Reader page image/box optimization
- Emergency disable parameter
- Permanent scroll-effects disabling CSS rules

**Note**: These are NOT userscript runtime tests on the live site. They inject the script via `page.addInitScript()` in a controlled Playwright instance with local HTML fixtures. Final verification is always manual.

### Manual Test Checklist (MANUAL_TEST_PLAN.md)
See `docs/MANUAL_TEST_PLAN.md` for complete checklist.

---

## Backup Procedures

### Pre-Change Snapshot (Before Each Logical Batch)
```bash
# From project root
# Create timestamped ZIP excluding .git/, backups/, node_modules/, dist/, versions/, test-results/, playwright-report/
# Verify with Get-FileHash -Algorithm SHA256
# Record in backups/BACKUP_MANIFEST.md
```

### Post-Stable Snapshot (After Milestone)
```bash
# Full project snapshot (same exclusions)
# Create standalone release ZIP (source + config + docs, no .git/backups/node_modules)
# Create Git bundle: git bundle create backups/git-bundles/sarrast-vX.Y.Z.bundle --all
# Verify bundle: git bundle verify backups/git-bundles/sarrast-vX.Y.Z.bundle
# Compute checksums, record in manifest
```

---

## Release Process

1. Ensure all tests pass (`npm test`)
2. Lint clean (`npm run lint`)
3. Version bump appropriate level (`npm run version:patch|minor|major`)
4. Build (`npm run build`) — creates versioned files
5. Update CHANGELOG.md with new version entry
6. Commit + tag: `git commit -am "chore: release vX.Y.Z" && git tag vX.Y.Z`
7. Create backups (full snapshot + release ZIP + git bundle)
8. Present to user for manual Firefox/Tampermonkey testing
9. **Wait for explicit user approval**
10. Push: `git push origin master --tags`

---

## Debugging Tips

### Console Logging
Add temporary logs with `[SARRAST]` prefix:
```javascript
console.log("[SARRAST] Debug message", data);
```

### Inspect Injected Style
```javascript
document.getElementById("sarrast-performance-optimizer")?.sheet?.cssRules
```

### Check Applied Classes
```javascript
document.documentElement.classList.contains("sarrast-disable-scroll-effects")
document.documentElement.classList.contains("sarrast-calm")
document.documentElement.classList.contains("sarrast-scrolling")
```

### Verify Image Attributes
```javascript
Array.from(document.querySelectorAll("img")).map(img => ({
    src: img.src,
    decoding: img.decoding,
    loading: img.loading,
    fetchPriority: img.fetchPriority,
    class: img.className
}))
```

### Verify Reader Page Elements
```javascript
Array.from(document.querySelectorAll(".col .pg")).map(img => ({
    class: img.className,
    style: img.style.cssText
}))
Array.from(document.querySelectorAll(".boxes .bx")).map(box => ({
    class: box.className,
    style: box.style.cssText
}))
```

### Emergency Disable
Add `?sarrastperf=off` to URL to completely disable script.

---

## Common Tasks

### Add New CONFIG Option
1. Add to `CONFIG` object with default
2. Add JSDoc comment explaining purpose
3. Update CSS building logic if needed
4. Update `docs/CONFIGURATION_AND_PERMISSIONS.md`
5. Update `docs/SPECIFICATION.md` if behavior changes

### Modify CSS Rules
Edit the `css` template literal in the style injection section. Remember:
- CSS is injected at `document-start`
- Use `!important` for overrides
- Test on actual Sarrast pages

### Adjust Viewport Thresholds
Modify `CONFIG.lazyDistance`, `CONFIG.largeImageHeight`, `CONFIG.readerImageThreshold`, or logic in `optimizeImage()`/`optimizeBox()`.

### Add New Match Pattern
Update `@match` in metadata block AND verify in `package.json` homepage/URLs if needed.

### Update Test Fixtures
Edit files in `tests/fixtures/` to match current site structure.

---

## Troubleshooting

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| Images disappear on reader | Over-aggressive `content-visibility` | Check `readerImageThreshold`, `intrinsicSize` |
| Layout shifts | `contain-intrinsic-size` not set or wrong | Verify `optimizeLoadedImage()` sets correct height |
| Scroll flash | `sarrast-scrolling` class timing | Use `disableAllScrollEffects: true` (default) |
| Hero carousel still autoplays | Alpine patch not applied | Check `alpine:init` event, Alpine version |
| Ad slots not hidden | CSS selectors outdated | Update ad blocking selectors in CSS |
| Script not running | `@match` mismatch or `@run-at` issue | Verify URL pattern, check Tampermonkey console |
| CSP errors | `@grant` not `none` or external resources | Keep `@grant none`, inline all CSS |
| Playwright tests fail | Fixture structure changed | Update selectors in tests/fixtures |
| `requestIdleCallback` not firing | Browser doesn't support | Fallback to `setTimeout` works |

---

## References

- Tampermonkey docs: https://www.tampermonkey.net/documentation.php
- MDN `content-visibility`: https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility
- MDN `requestIdleCallback`: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
- Firefox Android performance: https://developer.mozilla.org/en-US/docs/Web/Performance/Firefox_Android
- htmx docs: https://htmx.org/
- Alpine.js docs: https://alpinejs.dev/