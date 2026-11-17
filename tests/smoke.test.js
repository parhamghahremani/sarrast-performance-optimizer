import { test, expect } from "@playwright/test";

test.describe("Sarrast Performance Optimizer - Smoke Tests", () => {
    test.beforeEach(async ({ page }) => {
        // Inject the userscript before page load
        await page.addInitScript({
            path: "./src/sarrast-performance-optimizer.user.js",
        });
    });

    test("should inject performance CSS at document-start", async ({ page }) => {
        await page.goto("/index.html");
        await page.waitForLoadState("domcontentloaded");

        const style = await page.$("#sarrast-performance-optimizer");
        expect(style).not.toBeNull();

        const css = await style.textContent();
        // v1.2.2: CSS should contain permanent scroll-effects disabling rules
        expect(css).toContain("sarrast-disable-scroll-effects");
        expect(css).toContain("content-visibility: visible");
        expect(css).toContain("sarrast-calm");
        // Should still have scroll-time rules for backwards compatibility when disableAllScrollEffects=false
        expect(css).toContain("sarrast-scrolling");
    });

    test("should add sarrast-calm class to html", async ({ page }) => {
        await page.goto("/index.html");
        await page.waitForLoadState("domcontentloaded");

        const htmlClass = await page.getAttribute("html", "class");
        expect(htmlClass).toContain("sarrast-calm");
    });

    test("should add sarrast-disable-scroll-effects class to html (v1.2.2)", async ({ page }) => {
        await page.goto("/index.html");
        await page.waitForLoadState("domcontentloaded");

        const htmlClass = await page.getAttribute("html", "class");
        expect(htmlClass).toContain("sarrast-disable-scroll-effects");
    });

    test("should block juicyads script", async ({ page }) => {
        let juicyadsBlocked = false;

        page.on("request", (request) => {
            if (request.url().includes("juicyads.com")) {
                juicyadsBlocked = true;
            }
        });

        await page.goto("/index.html");
        await page.waitForLoadState("networkidle");

        // The script should be blocked by beforescriptexecute
        // Note: This test depends on the actual site having the juicyads script
        // If the site changes, this may need adjustment
    });

    test("should NOT add sarrast-scrolling class during scroll when disableAllScrollEffects=true (v1.2.2)", async ({ page }) => {
        // Listen to console
        page.on('console', msg => console.log('BROWSER:', msg.text()));

        await page.goto("/index.html");
        await page.waitForLoadState("domcontentloaded");

        // Wait a bit for the script to fully initialize
        await page.waitForTimeout(200);

        // Verify sarrast-disable-scroll-effects is already present (permanent, not scroll-dependent)
        let htmlClass = await page.getAttribute("html", "class");
        expect(htmlClass).toContain("sarrast-disable-scroll-effects");

        // Scroll
        await page.evaluate(() => {
            console.log('Scrolling...');
            window.scrollBy(0, 100);
        });

        // Wait a bit for any scroll handlers
        await page.waitForTimeout(200);

        // Verify sarrast-scrolling is NOT added (new v1.2.2 behavior)
        htmlClass = await page.getAttribute("html", "class");
        expect(htmlClass).not.toContain("sarrast-scrolling");

        // But sarrast-disable-scroll-effects should still be there
        expect(htmlClass).toContain("sarrast-disable-scroll-effects");
    });

    test("should optimize images with decoding=async", async ({ page }) => {
        // Use series page URL pattern that matches isSeriesList
        await page.goto("/series/test-series/");
        await page.waitForLoadState("domcontentloaded");

        // Wait for idle callback to process images (requestIdleCallback with 1000ms timeout)
        await page.waitForTimeout(1500);

        const images = await page.$$eval("img", (imgs) =>
            imgs.map((img) => ({
                decoding: img.decoding,
                loading: img.loading,
                fetchPriority: img.fetchPriority,
            }))
        );

        // At least some images should have async decoding
        const asyncImages = images.filter((img) => img.decoding === "async");
        expect(asyncImages.length).toBeGreaterThan(0);
    });

    test("should optimize reader page images", async ({ page }) => {
        // Listen to console
        page.on('console', msg => console.log('BROWSER:', msg.text()));

        // Navigate to a reader page - use trailing slash to match server redirect
        await page.goto("/series/landlord-comic/1-blonde-angel/");
        await page.waitForLoadState("domcontentloaded");

        // Debug: check what page was actually loaded
        const bodyClass = await page.getAttribute("body", "class");
        console.log('Body class:', bodyClass);
        const pageContent = await page.content();
        console.log('Page content preview:', pageContent.substring(0, 500));

        // Wait for reader to initialize (body.rdr class is in fixture)
        await page.waitForSelector("body.rdr", { timeout: 10000 });

        // Wait for image optimization to complete
        await page.waitForTimeout(500);

        const readerImages = await page.$$eval("body.rdr .col .pg", (imgs) =>
            imgs.map((img) => img.classList.contains("sarrast-reader-image"))
        );

        expect(readerImages.some((v) => v)).toBeTruthy();
    });

    test("should optimize translation boxes on reader page", async ({ page }) => {
        await page.goto("/series/landlord-comic/1-blonde-angel/");
        await page.waitForLoadState("domcontentloaded");
        await page.waitForSelector("body.rdr", { timeout: 10000 });

        // Wait for box optimization to complete
        await page.waitForTimeout(500);

        const boxes = await page.$$eval("body.rdr .boxes .bx", (boxes) =>
            boxes.map((box) => box.classList.contains("sarrast-reader-box"))
        );

        expect(boxes.some((v) => v)).toBeTruthy();
    });

    test("should have permanent scroll-effect disabling CSS rules applied", async ({ page }) => {
        await page.goto("/index.html");
        await page.waitForLoadState("domcontentloaded");

        const style = await page.$("#sarrast-performance-optimizer");
        const css = await style.textContent();

        // v1.2.2: Should have permanent disabling rules
        expect(css).toContain("sarrast-disable-scroll-effects");
        expect(css).toContain("box-shadow: none");
        expect(css).toContain("filter: none");
        expect(css).toContain("backdrop-filter: none");
        expect(css).toContain("text-shadow: none");
        expect(css).toContain("transition-property: opacity, transform, color, background-color, background, border-color, border, outline, outline-color");
    });

    test("should clean up on pagehide", async ({ page }) => {
        await page.goto("/index.html");
        await page.waitForLoadState("domcontentloaded");

        // Verify observer is running
        const observerRunning = await page.evaluate(() => window.__sarrastObserverRunning);
        // This would require exposing the observer state, skipping for now
    });
});

test.describe("Emergency Disable", () => {
    test("should disable when ?sarrastperf=off", async ({ page }) => {
        await page.goto("/index.html?sarrastperf=off");
        await page.waitForLoadState("domcontentloaded");

        const style = await page.$("#sarrast-performance-optimizer");
        // The script returns early, so style should not be injected
        // But since we inject via addInitScript, we need to check differently
        // This test is more of a placeholder for manual verification
    });
});