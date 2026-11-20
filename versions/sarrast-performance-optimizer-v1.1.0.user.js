// ==UserScript==
// @name         Sarrast Performance Optimizer
// @namespace    https://sarrast.com/
// @version      1.1.0
// @description  Performance and scrolling optimization for Sarrast (Manhwa/Comic reader)
// @match        https://sarrast.com/*
// @match        https://www.sarrast.com/*
// @run-at       document-start
// @grant        none
// @downloadURL  https://github.com/yourhandle/userscripts/raw/main/sarrast-performance-optimizer/versions/sarrast-performance-optimizer-v1.1.0.user.js
// @updateURL    https://github.com/yourhandle/userscripts/raw/main/sarrast-performance-optimizer/versions/sarrast-performance-optimizer-v1.1.0.user.js
// @supportURL   https://github.com/yourhandle/userscripts/issues
// @homepageURL  https://github.com/yourhandle/userscripts/tree/main/sarrast-performance-optimizer
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    /*
     * ================================================================
     * SARRAST PERFORMANCE OPTIMIZER v1.1.0
     * ================================================================
     *
     * Designed primarily for Firefox Android.
     *
     * Main goals:
     *   1. Reduce paint/compositing cost during scroll.
     *   2. Reduce scroll-time visual effects (shadows, filters, backdrop-filter).
     *   3. Optimize very long comic images (5000px+) with content-visibility.
     *   4. Batch-process translation overlay boxes (139+ per chapter).
     *   5. Lazy-load off-screen images with proper viewport margins.
     *   6. Block third-party ad scripts (juicyads) and ad slots.
     *   7. Reduce animation overhead (pause, don't zero duration).
     *   8. Handle htmx SPA navigation and Alpine.js reactivity.
     *   9. Accelerate below-fold section loading (reduce lazy-x margin, preload).
     *
     * The script intentionally avoids aggressive DOM manipulation.
     */

    /* ---------------------------------------------------------------
     * Configuration
     * --------------------------------------------------------------- */

    const CONFIG = {
        // Enable image optimizations on normal pages.
        optimizeImages: true,

        // Enable content-visibility for large images (reader pages: 3000-5000px).
        optimizeLargeImages: true,

        // Minimum rendered height for an image to receive
        // content-visibility optimization.
        largeImageHeight: 800,

        // Images farther than this amount below the viewport
        // may be converted to lazy-loading.
        lazyDistance: 1.5,

        // How long the temporary "scrolling" state remains active.
        scrollEndDelay: 120,

        // Delay for non-critical DOM optimization work.
        idleDelay: 300,

        // Maximum number of nodes processed during one idle pass.
        batchSize: 100,

        // Block third-party ad scripts and ad slots.
        blockAds: true,

        // Reduce animations and transitions (pause instead of zeroing).
        calmMotion: true,

        // Reader-specific: optimize translation overlay boxes (.bx).
        optimizeReaderBoxes: true,

        // Reader-specific: threshold for content-visibility on reader images.
        readerImageThreshold: 2000,

        // Below-fold section loading acceleration.
        accelerateBelowFold: true,
        // Reduce lazy-x observer rootMargin from 600px to this value.
        lazyXMargin: 300,
        // Preload images within this many viewports distance.
        preloadDistance: 2,
        // Increase contain-intrinsic-size for sections.
        increaseIntrinsicSize: true,
        intrinsicSize: 2000,
        // Add skeleton placeholders to empty cards.
        addSkeletons: true,
    };

    /* ---------------------------------------------------------------
     * Safety / page detection
     * --------------------------------------------------------------- */

    // Manual emergency disable:
    // Add ?sarrastperf=off to the URL.
    if (new URLSearchParams(location.search).get("sarrastperf") === "off") {
        return;
    }

    /*
     * Reader pages are the heaviest - they have 30+ images at 3000-5000px each
     * plus 100+ translation overlay boxes. We optimize these aggressively.
     */
    const isReader = /\/series\/[^/]+\/[^/]+$/i.test(location.pathname);

    /*
     * Homepage has hero carousel with heavy strips and animations.
     */
    const isHome = location.pathname === "/" || location.pathname === "";

    /*
     * Series listing pages have card grids.
     */
    const isSeriesList = /\/series(?:\/.*)?$/i.test(location.pathname) && !isReader;

    const shouldOptimizeImages = CONFIG.optimizeImages;
    const shouldOptimizeLargeImages = CONFIG.optimizeLargeImages;
    const shouldBlockAds = CONFIG.blockAds;
    const shouldCalmMotion = CONFIG.calmMotion;
    const shouldAccelerateBelowFold = CONFIG.accelerateBelowFold;

    /* ---------------------------------------------------------------
     * Early performance CSS (injected at document-start)
     * --------------------------------------------------------------- */

    const style = document.createElement("style");
    style.id = "sarrast-performance-optimizer";

    // Build CSS dynamically based on config and page type
    let css = `
        /*
         * ------------------------------------------------------------
         * Base optimization
         * ------------------------------------------------------------
         */

        html {
            scroll-behavior: auto !important;
            scroll-snap-type: none !important;
        }

        *,
        *::before,
        *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            animation-iteration-count: 1 !important;

            transition-duration: 0s !important;
            transition-delay: 0s !important;

            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;

            background-attachment: scroll !important;

            /*
             * Prevent websites from unnecessarily forcing many
             * elements into separate compositor layers.
             */
            will-change: auto !important;
        }

        html,
        body {
            scroll-snap-type: none !important;
        }


        /*
         * ------------------------------------------------------------
         * Scroll-time optimization
         * ------------------------------------------------------------
         *
         * These properties are only enabled while the user is
         * physically scrolling.
         *
         * Shadows, text shadows and filters can be surprisingly
         * expensive on mobile GPUs when a large page is moving.
         */

        html.sarrast-scrolling *,
        html.sarrast-scrolling *::before,
        html.sarrast-scrolling *::after {
            box-shadow: none !important;
            text-shadow: none !important;

            filter: none !important;
            -webkit-filter: none !important;

            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;

            background-attachment: scroll !important;
        }


        /*
         * ------------------------------------------------------------
         * Image rendering
         * ------------------------------------------------------------
         */

        img {
            /*
             * Let Firefox perform image decoding asynchronously
             * where possible.
             */
            image-rendering: auto !important;
        }


        /*
         * ------------------------------------------------------------
         * Large-image optimization (general)
         * ------------------------------------------------------------
         */

        img.sarrast-large-image {
            content-visibility: auto !important;

            /*
             * This fallback is only used until Firefox remembers the
             * image's actual rendered size.
             */
            contain-intrinsic-size: auto 800px !important;
        }


        /*
         * ------------------------------------------------------------
         * Reader page: comic images (very tall: 3000-5000px)
         * ------------------------------------------------------------
         */

        body.rdr .col .pg.sarrast-reader-image {
            content-visibility: auto !important;
            contain-intrinsic-size: auto 2000px !important;
        }


        /*
         * ------------------------------------------------------------
         * Reader page: translation overlay boxes (.bx)
         * ------------------------------------------------------------
         *
         * These are absolutely positioned text overlays. There can be
         * 100+ per chapter. We give them content-visibility so the
         * browser can skip painting off-screen ones.
         */

        body.rdr .boxes .bx.sarrast-reader-box {
            content-visibility: auto !important;
            contain-intrinsic-size: 200px 100px !important;
        }


        /*
         * ------------------------------------------------------------
         * Hero carousel optimization (homepage)
         * ------------------------------------------------------------
         */

        .hero-s:not(.act) .hero-strip,
        .hero-s:not(.act) .hero-bg {
            content-visibility: auto !important;
            contain-intrinsic-size: auto 300px !important;
        }


        /*
         * ------------------------------------------------------------
         * Card grid optimization (series listings)
         * ------------------------------------------------------------
         */

        .shelf .card.sarrast-card {
            content-visibility: auto !important;
            contain-intrinsic-size: auto 280px !important;
        }


        /*
         * ------------------------------------------------------------
         * Iframe optimization (ads, embeds)
         * ------------------------------------------------------------
         */

        iframe.sarrast-lazy-frame {
            content-visibility: auto !important;
            contain-intrinsic-size: auto 300px !important;
        }


        /*
         * ------------------------------------------------------------
         * Ad blocking - hide ad slots
         * ------------------------------------------------------------
         */

        .ad-slot,
        .ad-in,
        .ad-w,
        [data-ad-slot],
        [data-ad-client],
        ins.adsbygoogle,
        #google_ads_iframe_*,
        iframe[src*="juicyads"],
        iframe[src*="doubleclick"],
        iframe[src*="googlesyndication"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
        }
    `;

    // Add calm motion CSS if enabled - PAUSE animations instead of zeroing duration
    if (shouldCalmMotion) {
        css += `
            /*
             * ------------------------------------------------------------
             * Calm motion - pause animations/transitions instead of zeroing
             * ------------------------------------------------------------
             *
             * Zeroing animation-duration breaks hero carousel (tick() relies on
             * animationend). Instead we pause autoplay animations and respect
             * prefers-reduced-motion.
             */

            /* Global transition reduction (safe) */
            html.sarrast-calm *,
            html.sarrast-calm *::before,
            html.sarrast-calm *::after {
                transition-duration: 0.001ms !important;
                scroll-behavior: auto !important;
            }

            /* Pause hero carousel autoplay - the main fix */
            html.sarrast-calm .hs-col {
                animation-play-state: paused !important;
            }

            /* Pause hero dot fillbar animation */
            html.sarrast-calm .hd-dot.on i:after {
                animation-play-state: paused !important;
            }

            /* Pause home-glow transitions */
            html.sarrast-calm .home-glow i {
                transition-duration: 0.001ms !important;
            }

            /* Respect site's prefers-reduced-motion (already sets animation: none on .hs-col) */
            @media (prefers-reduced-motion: reduce) {
                html.sarrast-calm .hs-col {
                    animation: none !important;
                }
                html.sarrast-calm .hd-dot.on i:after {
                    animation: none !important;
                }
            }

            /* Splash screen animations */
            html.sarrast-calm #splash .sp-mark,
            html.sarrast-calm #splash .sp-bar i {
                animation: none !important;
            }
            html.sarrast-calm #splash .sp-bar i {
                width: 100% !important;
            }
        `;
    }

    // Below-fold acceleration CSS
    if (shouldAccelerateBelowFold) {
        css += `
            /*
             * ------------------------------------------------------------
             * Below-fold section acceleration
             * ------------------------------------------------------------
             *
             * Increase intrinsic sizes so layout doesn't shift when
             * content-visibility skips off-screen sections.
             * Reduce lazy-x observer margin via script (see accelerateBelowFold()).
             */

            .sec,
            .shelf-s,
            #sched,
            #explore {
                contain-intrinsic-size: auto ${CONFIG.intrinsicSize}px !important;
            }

            /* Skeleton placeholder for cards without loaded images */
            .card .cv.sarrast-skeleton::before {
                content: "";
                position: absolute;
                inset: 0;
                border-radius: 14px;
                background: linear-gradient(90deg, var(--s2) 25%, var(--s3) 50%, var(--s2) 75%);
                background-size: 200% 100%;
                animation: shim 1.3s linear infinite;
                z-index: 0;
                pointer-events: none;
            }

            @keyframes shim {
                to { background-position: -200% 0; }
            }
        `;
    }

    style.textContent = css;

    /*
     * document.documentElement normally exists at document-start.
     * If not, wait until it becomes available.
     */
    if (document.documentElement) {
        document.documentElement.appendChild(style);
    } else {
        document.addEventListener(
            "DOMContentLoaded",
            () => document.documentElement.appendChild(style),
            { once: true }
        );
    }

    // Apply calm motion class immediately if enabled
    if (shouldCalmMotion) {
        document.documentElement.classList.add("sarrast-calm");
    }

    /* ---------------------------------------------------------------
     * Ad blocking - early script interception
     * --------------------------------------------------------------- */

    if (shouldBlockAds) {
        // Block juicyads script before it loads
        const juicyadsSrc = "https://js.juicyads.com/jp.php";
        try {
            document.addEventListener(
                "beforescriptexecute",
                (e) => {
                    const script = e.target;
                    if (script && script.src && script.src.startsWith(juicyadsSrc)) {
                        e.preventDefault();
                        script.remove();
                    }
                },
                true
            );
        } catch (_) {}

        // Block fetch/XHR to ad domains
        const adDomains = [
            "juicyads.com",
            "doubleclick.net",
            "googlesyndication.com",
            "googleadservices.com",
            "adnxs.com",
            "taboola.com",
            "outbrain.com",
        ];

        const originalFetch = window.fetch;
        window.fetch = function (input, init) {
            let url = "";
            try {
                url = typeof input === "string" ? input : input?.url || "";
            } catch (_) {}
            if (url && adDomains.some((d) => url.includes(d))) {
                return Promise.reject(new TypeError("Blocked by Sarrast Optimizer"));
            }
            return originalFetch.apply(this, arguments);
        };

        // Block XHR
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (typeof url === "string" && adDomains.some((d) => url.includes(d))) {
                this.abort();
                return;
            }
            return originalXHROpen.apply(this, arguments);
        };

        // Block navigator.sendBeacon to ad domains
        const originalSendBeacon = navigator.sendBeacon.bind(navigator);
        navigator.sendBeacon = function (url, data) {
            if (typeof url === "string" && adDomains.some((d) => url.includes(d))) {
                return true; // Pretend success
            }
            return originalSendBeacon(url, data);
        };
    }

    /* ---------------------------------------------------------------
     * Scrolling state management
     * --------------------------------------------------------------- */

    let scrollTimer = 0;
    let scrollFrame = 0;

    function markScrolling() {
        if (scrollFrame) {
            return;
        }

        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = 0;

            document.documentElement.classList.add("sarrast-scrolling");

            clearTimeout(scrollTimer);

            scrollTimer = setTimeout(() => {
                document.documentElement.classList.remove("sarrast-scrolling");
            }, CONFIG.scrollEndDelay);
        });
    }

    /*
     * Passive listener:
     * this is important because the browser does not need to wait
     * for JavaScript before performing the scroll.
     */
    window.addEventListener("scroll", markScrolling, { passive: true });

    /* ---------------------------------------------------------------
     * Utility: schedule non-critical work
     * --------------------------------------------------------------- */

    function runWhenIdle(callback, timeout = CONFIG.idleDelay) {
        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(callback, {
                timeout,
            });
        } else {
            setTimeout(callback, timeout);
        }
    }

    /* ---------------------------------------------------------------
     * Image optimization
     * --------------------------------------------------------------- */

    const processedImages = new WeakSet();
    const processedFrames = new WeakSet();

    function isReaderImage(img) {
        return (
            document.body?.classList.contains("rdr") &&
            img.classList.contains("pg")
        );
    }

    function isHeroStrip(img) {
        return img.closest?.(".hero-strip") !== null;
    }

    function isCardImage(img) {
        return img.closest?.(".shelf .card .cv") !== null;
    }

    function optimizeImage(img) {
        if (!(img instanceof HTMLImageElement)) {
            return;
        }

        if (processedImages.has(img)) {
            return;
        }

        processedImages.add(img);

        /*
         * Firefox can decode the image asynchronously.
         */
        try {
            img.decoding = "async";
        } catch {
            // Ignore unsupported implementations.
        }

        const isReaderImg = isReaderImage(img);
        const isHero = isHeroStrip(img);
        const isCard = isCardImage(img);

        /*
         * Large image optimization:
         * - General pages: images >= 800px rendered height
         * - Reader pages: images >= 2000px (they're 3000-5000px)
         * - Hero strips: very tall, optimize aggressively
         */
        const largeImageThreshold = isReaderImg
            ? CONFIG.readerImageThreshold
            : CONFIG.largeImageHeight;

        if (shouldOptimizeLargeImages) {
            if (img.complete) {
                optimizeLoadedImage(img, largeImageThreshold, isReaderImg, isHero);
            } else {
                img.addEventListener(
                    "load",
                    () => optimizeLoadedImage(img, largeImageThreshold, isReaderImg, isHero),
                    {
                        once: true,
                        passive: true,
                    }
                );
            }
        }

        /*
         * Lazy loading for off-screen images.
         * We only use lazy loading for images which are clearly
         * below the initial viewport.
         *
         * For reader pages, the site already uses IntersectionObserver
         * with rootMargin: "250% 0px". We reduce this by not adding
         * loading="lazy" to images that already have data-src (site's lazy).
         */
        if (shouldOptimizeImages && !isReaderImg && !img.hasAttribute("data-src") && !img.hasAttribute("data-hsrc")) {
            try {
                const rect = img.getBoundingClientRect();

                const viewportHeight =
                    window.innerHeight || document.documentElement.clientHeight || 800;

                if (rect.top > viewportHeight * CONFIG.lazyDistance) {
                    img.loading = "lazy";

                    /*
                     * Give the browser a lower scheduling priority
                     * for images that are well below the viewport.
                     */
                    if ("fetchPriority" in img) {
                        img.fetchPriority = "low";
                    }
                }
            } catch {
                // Ignore geometry errors.
            }
        }

        // Mark for CSS targeting
        if (isReaderImg) {
            img.classList.add("sarrast-reader-image");
        } else if (isHero) {
            img.classList.add("sarrast-hero-image");
        } else if (isCard) {
            img.classList.add("sarrast-card-image");
            img.closest(".card")?.classList.add("sarrast-card");
        }
    }

    function optimizeLoadedImage(img, threshold, isReaderImg = false, isHero = false) {
        if (!(img instanceof HTMLImageElement)) {
            return;
        }

        if (!img.naturalWidth || !img.naturalHeight) {
            return;
        }

        try {
            const rect = img.getBoundingClientRect();
            const renderedHeight = rect.height;

            if (renderedHeight >= threshold) {
                if (isReaderImg) {
                    img.classList.add("sarrast-reader-image");
                } else if (isHero) {
                    img.classList.add("sarrast-hero-image");
                } else {
                    img.classList.add("sarrast-large-image");
                }

                /*
                 * Remember the actual rendered size.
                 *
                 * This greatly reduces the possibility of layout
                 * shifts when Firefox skips an off-screen image.
                 */
                if (renderedHeight > 0) {
                    img.style.setProperty(
                        "contain-intrinsic-size",
                        `auto ${Math.ceil(renderedHeight)}px`,
                        "important"
                    );
                }
            }
        } catch {
            // Ignore geometry errors.
        }
    }

    /* ---------------------------------------------------------------
     * Iframe optimization
     * --------------------------------------------------------------- */

    function optimizeIframe(frame) {
        if (!(frame instanceof HTMLIFrameElement)) {
            return;
        }

        if (processedFrames.has(frame)) {
            return;
        }

        processedFrames.add(frame);

        /*
         * Do not interfere with visible frames.
         * Only defer clearly off-screen frames.
         */
        try {
            const rect = frame.getBoundingClientRect();

            const viewportHeight =
                window.innerHeight || document.documentElement.clientHeight || 800;

            if (rect.top > viewportHeight * CONFIG.lazyDistance) {
                frame.loading = "lazy";
                frame.classList.add("sarrast-lazy-frame");
            }
        } catch {
            // Ignore geometry errors.
        }
    }

    /* ---------------------------------------------------------------
     * Reader page: translation overlay boxes (.bx) optimization
     * --------------------------------------------------------------- */

    const processedBoxes = new WeakSet();

    function optimizeReaderBoxes(root = document) {
        if (!CONFIG.optimizeReaderBoxes) return;

        const boxes = root.querySelectorAll?.("body.rdr .boxes .bx");
        if (!boxes?.length) return;

        for (const box of boxes) {
            if (processedBoxes.has(box)) continue;
            processedBoxes.add(box);

            box.classList.add("sarrast-reader-box");

            // Set intrinsic size based on box dimensions
            try {
                const style = box.style;
                const width = parseFloat(style.getPropertyValue("--ex")) - parseFloat(style.getPropertyValue("--x"));
                const height = parseFloat(style.getPropertyValue("--ey")) - parseFloat(style.getPropertyValue("--y"));
                if (width > 0 && height > 0) {
                    box.style.setProperty("contain-intrinsic-size", `${Math.ceil(width)}px ${Math.ceil(height)}px`, "important");
                } else {
                    box.style.setProperty("contain-intrinsic-size", "200px 100px", "important");
                }
            } catch (_) {
                box.style.setProperty("contain-intrinsic-size", "200px 100px", "important");
            }
        }
    }

    /* ---------------------------------------------------------------
     * Below-fold section loading acceleration
     * --------------------------------------------------------------- */

    let belowFoldAccelerated = false;

    function accelerateBelowFold(root = document) {
        if (!shouldAccelerateBelowFold || belowFoldAccelerated) return;
        belowFoldAccelerated = true;

        // 1. Reduce lazy-x observer margin by re-initializing with smaller rootMargin
        // The site's observer is created in an IIFE, so we can't directly modify it.
        // Instead, we force-initialize sections near the viewport.
        try {
            const lazySections = root.querySelectorAll('[data-lazy-x][x-ignore]');
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;

            for (const section of lazySections) {
                const rect = section.getBoundingClientRect();
                // If section is within preloadDistance viewports, force Alpine init
                if (rect.top < viewportHeight * CONFIG.preloadDistance) {
                    section.removeAttribute("x-ignore");
                    // Trigger Alpine initialization if available
                    if (window.Alpine) {
                        window.Alpine.initTree(section);
                    }
                }
            }
        } catch (_) {}

        // 2. Preload card images within preloadDistance viewports
        try {
            const cardImages = root.querySelectorAll('.card .cv img[data-src][data-late]');
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;

            for (const img of cardImages) {
                const rect = img.getBoundingClientRect();
                if (rect.top < viewportHeight * CONFIG.preloadDistance) {
                    // Trigger the site's lazy load function
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    img.removeAttribute("data-late");
                    img.removeAttribute("data-src");
                    img.removeAttribute("data-srcset");
                    img.loading = "eager";
                    img.fetchPriority = "high";
                }
            }
        } catch (_) {}

        // 3. Increase contain-intrinsic-size for sections (CSS handles this, but ensure inline)
        if (CONFIG.increaseIntrinsicSize) {
            try {
                const sections = root.querySelectorAll('.sec, .shelf-s, #sched, #explore');
                for (const section of sections) {
                    section.style.setProperty('contain-intrinsic-size', `auto ${CONFIG.intrinsicSize}px`, 'important');
                }
            } catch (_) {}
        }

        // 4. Add skeleton placeholders to empty cards
        if (CONFIG.addSkeletons) {
            try {
                const emptyCards = root.querySelectorAll('.card .cv:not(:has(img[src]))');
                for (const cv of emptyCards) {
                    if (!cv.classList.contains('sarrast-skeleton')) {
                        cv.classList.add('sarrast-skeleton');
                    }
                }
            } catch (_) {}
        }
    }

    /* ---------------------------------------------------------------
     * Batch DOM processing
     * --------------------------------------------------------------- */

    const imageQueue = [];
    const frameQueue = [];
    const boxQueue = [];
    let processing = false;

    function queueCurrentContent(root = document) {
        // Images
        const images = root.querySelectorAll("img");
        for (const img of images) {
            if (!processedImages.has(img)) {
                imageQueue.push(img);
            }
        }

        // Iframes
        const frames = root.querySelectorAll("iframe");
        for (const frame of frames) {
            if (!processedFrames.has(frame)) {
                frameQueue.push(frame);
            }
        }

        // Reader boxes
        if (CONFIG.optimizeReaderBoxes) {
            const boxes = root.querySelectorAll("body.rdr .boxes .bx");
            for (const box of boxes) {
                if (!processedBoxes.has(box)) {
                    boxQueue.push(box);
                }
            }
        }

        processQueues();
    }

    function processQueues() {
        if (processing) {
            return;
        }

        processing = true;

        runWhenIdle(() => {
            let processed = 0;

            while (imageQueue.length && processed < CONFIG.batchSize) {
                optimizeImage(imageQueue.shift());
                processed++;
            }

            while (frameQueue.length && processed < CONFIG.batchSize) {
                optimizeIframe(frameQueue.shift());
                processed++;
            }

            while (boxQueue.length && processed < CONFIG.batchSize) {
                const box = boxQueue.shift();
                if (!processedBoxes.has(box)) {
                    processedBoxes.add(box);
                    box.classList.add("sarrast-reader-box");
                    try {
                        const style = box.style;
                        const width = parseFloat(style.getPropertyValue("--ex")) - parseFloat(style.getPropertyValue("--x"));
                        const height = parseFloat(style.getPropertyValue("--ey")) - parseFloat(style.getPropertyValue("--y"));
                        if (width > 0 && height > 0) {
                            box.style.setProperty("contain-intrinsic-size", `${Math.ceil(width)}px ${Math.ceil(height)}px`, "important");
                        } else {
                            box.style.setProperty("contain-intrinsic-size", "200px 100px", "important");
                        }
                    } catch (_) {
                        box.style.setProperty("contain-intrinsic-size", "200px 100px", "important");
                    }
                }
                processed++;
            }

            processing = false;

            /*
             * Continue later rather than processing hundreds of
             * elements in one blocking task.
             */
            if (imageQueue.length || frameQueue.length || boxQueue.length) {
                processQueues();
            }
        });
    }

    /* ---------------------------------------------------------------
     * MutationObserver for dynamic content (htmx, Alpine.js)
     * --------------------------------------------------------------- */

    let mutationScheduled = false;

    const observer = new MutationObserver((mutations) => {
        let foundRelevantNode = false;

        for (const mutation of mutations) {
            if (!mutation.addedNodes.length) {
                continue;
            }

            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    continue;
                }

                const element = node;

                // New images
                if (element.matches?.("img")) {
                    imageQueue.push(element);
                    foundRelevantNode = true;
                }

                // New iframes
                if (element.matches?.("iframe")) {
                    frameQueue.push(element);
                    foundRelevantNode = true;
                }

                // New reader boxes
                if (CONFIG.optimizeReaderBoxes && element.matches?.(".bx")) {
                    boxQueue.push(element);
                    foundRelevantNode = true;
                }

                // Descendant elements
                if (element.querySelectorAll) {
                    const imgs = element.querySelectorAll("img");
                    const frames = element.querySelectorAll("iframe");
                    const boxes = CONFIG.optimizeReaderBoxes ? element.querySelectorAll(".bx") : [];

                    for (const img of imgs) {
                        if (!processedImages.has(img)) {
                            imageQueue.push(img);
                            foundRelevantNode = true;
                        }
                    }

                    for (const frame of frames) {
                        if (!processedFrames.has(frame)) {
                            frameQueue.push(frame);
                            foundRelevantNode = true;
                        }
                    }

                    for (const box of boxes) {
                        if (!processedBoxes.has(box)) {
                            boxQueue.push(box);
                            foundRelevantNode = true;
                        }
                    }
                }
            }
        }

        if (foundRelevantNode && !mutationScheduled) {
            mutationScheduled = true;

            runWhenIdle(() => {
                mutationScheduled = false;
                processQueues();
            });
        }
    });

    /* ---------------------------------------------------------------
     * Start observing after the document becomes available
     * --------------------------------------------------------------- */

    function startObserver() {
        if (!document.body) {
            return;
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        queueCurrentContent();

        // Initial reader boxes optimization
        if (CONFIG.optimizeReaderBoxes) {
            optimizeReaderBoxes();
        }

        // Accelerate below-fold loading
        if (shouldAccelerateBelowFold) {
            accelerateBelowFold();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startObserver, { once: true });
    } else {
        startObserver();
    }

    /* ---------------------------------------------------------------
     * Handle htmx SPA navigation
     * --------------------------------------------------------------- */

    function handleHtmxSwap(event) {
        const target = event.detail?.elt || event.target;
        if (target) {
            // Re-queue content in the swapped region
            queueCurrentContent(target);
            if (CONFIG.optimizeReaderBoxes) {
                optimizeReaderBoxes(target);
            }
            // Re-accelerate below-fold for new content
            if (shouldAccelerateBelowFold) {
                belowFoldAccelerated = false;
                accelerateBelowFold(target);
            }
        }
    }

    function handleHtmxLoad(event) {
        const target = event.detail?.elt;
        if (target) {
            // Ad slots may be re-initialized
            if (CONFIG.blockAds) {
                target.querySelectorAll?.(".ad-slot[data-ad]:not([data-ran])").forEach((slot) => {
                    slot.style.display = "none";
                });
            }
        }
    }

    document.addEventListener("htmx:afterSwap", handleHtmxSwap);
    document.addEventListener("htmx:load", handleHtmxLoad);

    /* ---------------------------------------------------------------
     * Re-process after full page load
     * --------------------------------------------------------------- */

    window.addEventListener(
        "load",
        () => {
            runWhenIdle(() => {
                queueCurrentContent();
                if (CONFIG.optimizeReaderBoxes) {
                    optimizeReaderBoxes();
                }
                if (shouldAccelerateBelowFold) {
                    belowFoldAccelerated = false;
                    accelerateBelowFold();
                }
            }, 500);
        },
        {
            once: true,
            passive: true,
        }
    );

    /* ---------------------------------------------------------------
     * Handle orientation / viewport changes
     * --------------------------------------------------------------- */

    let resizeTimer = 0;

    window.addEventListener(
        "resize",
        () => {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {
                queueCurrentContent();
                if (CONFIG.optimizeReaderBoxes) {
                    optimizeReaderBoxes();
                }
                if (shouldAccelerateBelowFold) {
                    belowFoldAccelerated = false;
                    accelerateBelowFold();
                }
            }, 250);
        },
        {
            passive: true,
        }
    );

    /* ---------------------------------------------------------------
     * Ad slot cleanup (periodic check for dynamically inserted ads)
     * --------------------------------------------------------------- */

    if (CONFIG.blockAds) {
        let adCleanupTimer = 0;

        function cleanupAdSlots() {
            document.querySelectorAll(".ad-slot, .ad-in, .ad-w, [data-ad-slot], ins.adsbygoogle").forEach((el) => {
                if (el.style.display !== "none") {
                    el.style.display = "none";
                    el.style.visibility = "hidden";
                    el.style.opacity = "0";
                    el.style.pointerEvents = "none";
                }
            });

            // Hide ad iframes
            document.querySelectorAll('iframe[src*="juicyads"], iframe[src*="doubleclick"], iframe[src*="googlesyndication"]').forEach((iframe) => {
                if (iframe.style.display !== "none") {
                    iframe.style.display = "none";
                    iframe.style.visibility = "hidden";
                    iframe.style.width = "0";
                    iframe.style.height = "0";
                }
            });
        }

        // Initial cleanup
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", cleanupAdSlots, { once: true });
        } else {
            cleanupAdSlots();
        }

        // Periodic cleanup for dynamically inserted ads
        adCleanupTimer = setInterval(cleanupAdSlots, 5000);

        // Cleanup on pagehide
        window.addEventListener(
            "pagehide",
            () => {
                clearInterval(adCleanupTimer);
            },
            { once: true, passive: true }
        );
    }

    /* ---------------------------------------------------------------
     * Cleanup when page is being unloaded
     * --------------------------------------------------------------- */

    window.addEventListener(
        "pagehide",
        () => {
            clearTimeout(scrollTimer);

            if (scrollFrame) {
                cancelAnimationFrame(scrollFrame);
            }

            observer.disconnect();

            // Remove event listeners
            document.removeEventListener("htmx:afterSwap", handleHtmxSwap);
            document.removeEventListener("htmx:load", handleHtmxLoad);

            clearTimeout(resizeTimer);
        },
        {
            once: true,
            passive: true,
        }
    );

    /* ---------------------------------------------------------------
     * Console log for debugging
     * --------------------------------------------------------------- */

    console.log("[Sarrast Optimizer] Initialized v1.1.0", {
        isReader,
        isHome,
        isSeriesList,
        config: CONFIG,
    });
})();