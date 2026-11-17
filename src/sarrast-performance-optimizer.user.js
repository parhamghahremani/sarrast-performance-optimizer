// ==UserScript==
// @name         Sarrast Performance Optimizer
// @namespace    https://github.com/parhamghahremani
// @version      1.2.3
// @description  Performance and scrolling optimization for Sarrast (Manhwa/Comic reader)
// @author       parham
// @match        https://sarrast.com/*
// @match        https://www.sarrast.com/*
// @run-at       document-start
// @grant        none
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJlIiB4MT0iLjEiIHkxPSIwIiB4Mj0iLjciIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmQxZTgiLz48c3RvcCBvZmZzZXQ9Ii40IiBzdG9wLWNvbG9yPSIjZmY3YWI4Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZDgxYjcyIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImsiIHgxPSIuMSIgeTE9IjAiIHgyPSIuNyIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZDZmZiIvPjxzdG9wIG9mZnNldD0iLjQiIHN0b3AtY29sb3I9IiM5YjZjZjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM1YjIxYjYiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZCIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2IwMTI2YSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzZiMGI0NSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJqIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNGMyZmJmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMjYxNjZlIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImgiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iLjgiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggaWQ9ImEiIGQ9Ik0yNiAxMmgzMmEyMCAyMCAwIDAgMSAyMCAyMHYxNmEyMCAyMCAwIDAgMS0yMCAyMEg0NnEtNiA4LTE4IDE0IDQtOCA0LTE0aC02QTIwIDIwIDAgMCAxIDYgNDhWMzJhMjAgMjAgMCAwIDEgMjAtMjBaIi8+PHBhdGggaWQ9ImIiIGQ9Ik0xMDIgMTJINzBhMjAgMjAgMCAwIDAtMjAgMjB2MTZhMjAgMjAgMCAwIDAgMjAgMjBoMTJxNiA4IDE4IDE0LTQtOC00LTE0aDZhMjAgMjAgMCAwIDAgMjAtMjBWMzJhMjAgMjAgMCAwIDAtMjAtMjBaIi8+PHBhdGggaWQ9Im4iIGQ9Im0wLTYgMS42IDQuNEw2IDAgMS42IDEuNiAwIDZsLTEuNi00LjRMLTYgMGw0LjQtMS42WiIvPjxwYXRoIGQ9Ik01NiA0NmMtNC04LTI0LTgtMjQgMnMyNCA2IDI0IDE3LTIwIDExLTI2IDMiIGlkPSJpIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNNjggMzh2MzhtMC0zOGgxMmMxNCAwIDE0IDIwIDAgMjBINjhtMTIgMCAxNCAxOCIgaWQ9Im0iIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxjbGlwUGF0aCBpZD0iZiI+PHVzZSB4bGluazpocmVmPSIjYSIgaHJlZj0iI2EiLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0ibCI+PHVzZSB4bGluazpocmVmPSIjYiIgaHJlZj0iI2IiLz48L2NsaXBQYXRoPjxmaWx0ZXIgaWQ9ImMiIHg9Ii0zMCUiIHk9Ii0zMCUiIHdpZHRoPSIxNjAlIiBoZWlnaHQ9IjE2MCUiPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjMuNSIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9ImciIHg9Ii0zMCUiIHk9Ii0zMCUiIHdpZHRoPSIxNjAlIiBoZWlnaHQ9IjE2MCUiPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjUiLz48L2ZpbHRlcj48L2RlZnM+PGVsbGlwc2UgY3g9IjY0IiBjeT0iMTI0IiByeD0iNDAiIHJ5PSIzLjYiIGZpbGw9IiMyYTA4NDAiIG9wYWNpdHk9Ii40IiBmaWx0ZXI9InVybCgjYykiLz48dXNlIHhsaW5rOmhyZWY9IiNhIiBocmVmPSIjYSIgZmlsbD0idXJsKCNkKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCA1KSIvPjx1c2UgeGxpbms6aHJlZj0iI2EiIGhyZWY9IiNhIiBmaWxsPSJ1cmwoI2UpIi8+PGcgY2xpcC1wYXRoPSJ1cmwoI2YpIj48dXNlIHhsaW5rOmhyZWY9IiNhIiBocmVmPSIjYSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGEwZjZhIiBzdHJva2Utd2lkdGg9IjEwIiBvcGFjaXR5PSIuNSIgZmlsdGVyPSJ1cmwoI2cpIi8+PGVsbGlwc2UgY3g9IjMwIiBjeT0iMTYiIHJ4PSIzMCIgcnk9IjEwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIuMjUiLz48L2c+PHVzZSB4bGluazpocmVmPSIjYSIgaHJlZj0iI2EiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjcuIiBzdHJva2Utd2lkdGg9IjEuOCIvPjxwYXRoIGQ9Ik0xNiAyOGExMCAxMCAwIDAgMSAxMC04aDMyYTEwIDEwIDAgMCAxIDEwIDhxLTI2IDEyLTUyIDBaIiBmaWxsPSJ1cmwoI2gpIiBvcGFjaXR5PSIuNTUiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCguODIgMCAwIC44MiA2Ljc0IC02Ljc0KSI+PHVzZSB4bGluazpocmVmPSIjaSIgaHJlZj0iI2kiIHN0cm9rZT0iIzdhMGI0ZSIgc3Ryb2tlLXdpZHRoPSIxMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCA1KSIvPjx1c2UgeGxpbms6aHJlZj0iI2kiIGhyZWY9IiNpIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMTAuNSIvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDM4KSI+PHVzZSB4bGluazpocmVmPSIjYiIgaHJlZj0iI2IiIGZpbGw9InVybCgjaikiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgNSkiLz48dXNlIHhsaW5rOmhyZWY9IiNiIiBocmVmPSIjYiIgZmlsbD0idXJsKCNrKSIvPjxnIGNsaXAtcGF0aD0idXJsKCNsKSI+PHVzZSB4bGluazpocmVmPSIjYiIgaHJlZj0iI2IiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJlMWE3YSIgc3Ryb2tlLXdpZHRoPSIxMCIgb3BhY2l0eT0iLjUiIGZpbHRlcj0idXJsKCNnKSIvPjxlbGxpcHNlIGN4PSI4MiIgY3k9IjE2IiByeD0iMzAiIHJ5PSIxMCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjI1Ii8+PC9nPjx1c2UgeGxpbms6aHJlZj0iI2IiIGhyZWY9IiNiIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuNyIgc3Ryb2tlLXdpZHRoPSIxLjgiLz48cGF0aCBkPSJNNjAgMjhhMTAgMTAgMCAwIDEgMTAtOGgzMmExMCAxMCAwIDAgMSAxMCA4cS0yNiAxMi01MiAwWiIgZmlsbD0idXJsKCNoKSIgb3BhY2l0eT0iLjU1Ii8+PC9nPjxnIHRyYW5zZm9ybT0ibWF0cml4KC44MiAwIDAgLjgyIDE5LjU4IDI5LjI2KSI+PHVzZSB4bGluazpocmVmPSIjbSIgaHJlZj0iI20iIHN0cm9rZT0iIzM0MjA4YSIgc3Ryb2tlLXdpZHRoPSIxMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCA1KSIvPjx1c2UgeGxpbms6aHJlZj0iI20iIGhyZWY9IiNtIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMTAuNSIvPjwvZz48dXNlIHhsaW5rOmhyZWY9IiNuIiBocmVmPSIjbiIgZmlsbD0iI2ZmZiIgdHJhbnNmb3JtPSJtYXRyaXgoMS4zIDAgMCAxLjMgMTEyIDEyKSIvPjx1c2UgeGxpbms6aHJlZj0iI24iIGhyZWY9IiNuIiBmaWxsPSIjZmZkMWVjIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNCAxMDQpIHNjYWxlKDEpIi8+PGNpcmNsZSBjeD0iMTE4IiBjeT0iMTA0IiByPSIyIiBmaWxsPSIjYzRiNWZkIi8+PGNpcmNsZSBjeD0iODYiIGN5PSI4IiByPSIxLjgiIGZpbGw9IiNmZjlhZDUiLz48L3N2Zz4=
// @downloadURL  https://github.com/parhamghahremani/userscripts/raw/main/sarrast-performance-optimizer/versions/sarrast-performance-optimizer-v1.2.3.user.js
// @updateURL    https://github.com/parhamghahremani/userscripts/raw/main/sarrast-performance-optimizer/versions/sarrast-performance-optimizer-v1.2.3.user.js
// @supportURL   https://github.com/parhamghahremani/userscripts/issues
// @homepageURL  https://github.com/parhamghahremani/userscripts/tree/main/sarrast-performance-optimizer
// @license      MIT
// ==/UserScript==

'use strict';

(function () {
    /*
     * ================================================================
     * SARRAST PERFORMANCE OPTIMIZER v1.2.2
     * ================================================================
     *
     * Designed primarily for Firefox Android.
     *
     * Main goals:
     *   1. Reduce paint/compositing cost during scroll (surgical: only expensive GPU effects).
     *   2. Reduce scroll-time visual effects (backdrop-filter, filter, box-shadow ONLY).
     *   3. Optimize very long comic images (5000px+) with content-visibility.
     *   4. Optimize translation overlay boxes (.bx) - 100+ per chapter.
     *   5. Block third-party ad scripts and hide ad slots.
     *   6. Reduce animations/transitions for calmer experience.
     *
     * The script intentionally avoids aggressive DOM manipulation.
     *
     * v1.2.2 - Complete fix for scroll-end flash: permanently disable scroll-only effects.
     * v1.2.1 - Hero carousel rapid cycling fix, below-fold re-render fix, scroll-end delay increase.
     * v1.2.0 - Surgical scroll optimization, below-fold intrinsic size increase, reveal preservation.
     * v1.1.0 - Below-fold loading acceleration, hero carousel pause (animation-play-state).
     * v1.0.0 - Initial release.
     */

    /* ---------------------------------------------------------------
     * Configuration
     * --------------------------------------------------------------- */

    const CONFIG = {
        // Enable image optimizations on normal pages.
        optimizeImages: true,

        // Enable content-visibility for large images.
        optimizeLargeImages: true,

        // Minimum rendered height for an image to receive
        // content-visibility optimization.
        largeImageHeight: 800,

        // Images farther than this amount below the viewport
        // may be converted to lazy-loading.
        lazyDistance: 1.5,

        // How long the temporary "scrolling" state remains active.
        scrollEndDelay: 300,

        // Delay for non-critical DOM optimization work.
        idleDelay: 300,

        // Maximum number of nodes processed during one idle pass.
        batchSize: 100,

        // Block third-party ad scripts and hide ad slots.
        blockAds: true,

        // Reduce all animations/transitions (pauses hero autoplay).
        calmMotion: true,

        // Optimize translation overlay boxes on reader pages.
        optimizeReaderBoxes: true,

        // Minimum rendered height for reader image content-visibility.
        readerImageThreshold: 2000,

        // Disable hero carousel autoplay completely (animation: none).
        disableHeroAutoplay: true,

        // Force content-visibility: visible instead of auto.
        forceContentVisibilityVisible: true,

        // Disable expensive transitions during scroll (box-shadow, filter, backdrop-filter, text-shadow).
        disableExpensiveTransitionsDuringScroll: true,

        // Below-fold loading acceleration.
        accelerateBelowFold: true,

        // Target rootMargin for lazy-x observer (script forces init instead).
        lazyXMargin: 300,

        // Viewport multiplier for early image preload.
        preloadDistance: 2,

        // Boost contain-intrinsic-size for sections.
        increaseIntrinsicSize: true,

        // New intrinsic size for sections (px).
        intrinsicSize: 5000,

        // Add shimmer skeleton to empty cards.
        addSkeletons: true,

        // NEW v1.2.2: Completely disable all scroll-only effects permanently.
        // This REPLACES scroll-time toggle entirely - no more sarrast-scrolling class.
        disableAllScrollEffects: true,
    };

    /* ---------------------------------------------------------------
     * Safety / page detection
     * --------------------------------------------------------------- */

    // Manual emergency disable:
    // Add ?sarrastperf=off to the URL.
    if (new URLSearchParams(location.search).get("sarrastperf") === "off") {
        return;
    }

    // Page type detection
    const isReaderPage =
        /\/series\/[^/]+\/[^/]+/.test(location.pathname) ||
        /\/reader/.test(location.pathname);

    const isHomepage = location.pathname === "/" || location.pathname === "";

    const isSeriesListing =
        /\/series$/.test(location.pathname) ||
        /\/search/.test(location.pathname);

    /* ---------------------------------------------------------------
     * Early performance CSS
     * --------------------------------------------------------------- */

    const style = document.createElement("style");
    style.id = "sarrast-performance-optimizer";

    // Build CSS dynamically based on config
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

        html,
        body {
            scroll-snap-type: none !important;
        }

        /* Prevent unnecessary layer promotion */
        * {
            will-change: auto !important;
        }

        /*
         * ------------------------------------------------------------
         * Image rendering
         * ------------------------------------------------------------
         */

        img {
            image-rendering: auto !important;
        }
    `;

    // v1.2.2: Permanent disable of all scroll-only effects
    if (CONFIG.disableAllScrollEffects) {
        css += `
        /*
         * ------------------------------------------------------------
         * PERMANENT: Disable all scroll-only effects (v1.2.2)
         * ------------------------------------------------------------
         * These effects only exist to provide visual feedback during/after scroll.
         * By permanently disabling them, flash CANNOT occur because the effects
         * never exist to flash back in. No toggle, no timing, zero flash possible.
         */

        html.sarrast-disable-scroll-effects * {
            /* Restrict transitions to cheap properties only */
            transition-property:
                opacity,
                transform,
                color,
                background-color,
                background,
                border-color,
                border !important;
            transition-duration: 0.001s !important;

            /* Permanently disable expensive GPU effects */
            box-shadow: none !important;
            filter: none !important;
            -webkit-filter: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            text-shadow: none !important;
        }

        /* Force reveal elements to final state with no animation */
        html.sarrast-disable-scroll-effects .rv {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
        }

        /* Kill transitions/animations on scroll/animate related classes */
        html.sarrast-disable-scroll-effects [class*="scroll"],
        html.sarrast-disable-scroll-effects [class*="animate"],
        html.sarrast-disable-scroll-effects [class*="reveal"],
        html.sarrast-disable-scroll-effects [class*="fade"],
        html.sarrast-disable-scroll-effects [class*="slide"] {
            animation: none !important;
            transition: none !important;
        }
        `;
    } else {
        // Legacy scroll-time surgical optimization (v1.2.0)
        if (CONFIG.disableExpensiveTransitionsDuringScroll) {
            css += `
        /*
         * ------------------------------------------------------------
         * Scroll-time surgical optimization (LEGACY - v1.2.0)
         * ------------------------------------------------------------
         * Only disable EXPENSIVE GPU effects during scroll.
         * Preserve transitions, transforms, opacity to eliminate flash.
         */

        html.sarrast-scrolling *,
        html.sarrast-scrolling *::before,
        html.sarrast-scrolling *::after {
            /* Only expensive GPU effects */
            box-shadow: none !important;
            filter: none !important;
            -webkit-filter: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            text-shadow: none !important;

            /* Restrict transition-property to cheap properties only */
            transition-property:
                opacity,
                transform,
                color,
                background-color,
                background,
                border-color,
                border !important;

            background-attachment: scroll !important;
        }
        `;
        } else {
            // Even more legacy aggressive mode
            css += `
        /*
         * ------------------------------------------------------------
         * Scroll-time aggressive optimization (LEGACY)
         * ------------------------------------------------------------
         */

        html.sarrast-scrolling *,
        html.sarrast-scrolling *::before,
        html.sarrast-scrolling *::after {
            transition: none !important;
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
        }
        `;
        }
    }

    // Calm motion (animations/transitions reduction)
    if (CONFIG.calmMotion) {
        css += `
        /*
         * ------------------------------------------------------------
         * Calm motion - reduce animations/transitions
         * ------------------------------------------------------------
         */
        html.sarrast-calm *,
        html.sarrast-calm *::before,
        html.sarrast-calm *::after {
            animation-duration: 0.001ms !important;
            animation-delay: 0s !important;
            animation-iteration-count: 1 !important;

            transition-duration: 0.001ms !important;
            transition-delay: 0s !important;
        }

        /* Hero carousel: pause autoplay on slides and dots */
        html.sarrast-calm .hs-col,
        html.sarrast-calm .hd-dot.on i:after {
            animation-play-state: paused !important;
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
            html.sarrast-calm *,
            html.sarrast-calm *::before,
            html.sarrast-calm *::after {
                animation-duration: 0.001ms !important;
                transition-duration: 0.001ms !important;
            }
        }
        `;
    }

    // Hero carousel autoplay disable
    if (CONFIG.disableHeroAutoplay) {
        css += `
        /*
         * ------------------------------------------------------------
         * Hero carousel - completely stop autoplay
         * ------------------------------------------------------------
         */
        html .hs-col,
        html .hd-dot.on i:after {
            animation: none !important;
        }
        `;
    }

    // Force content-visibility: visible
    if (CONFIG.forceContentVisibilityVisible) {
        css += `
        /*
         * ------------------------------------------------------------
         * Force content-visibility: visible (prevent re-render)
         * ------------------------------------------------------------
         */
        .sec,
        .shelf-s,
        #sched,
        #explore,
        .rv {
            content-visibility: visible !important;
        }
        `;
    }

    // Large image optimization
    if (CONFIG.optimizeLargeImages) {
        css += `
        /*
         * ------------------------------------------------------------
         * Large image optimization
         * ------------------------------------------------------------
         */
        img.sarrast-large-image {
            content-visibility: auto !important;
            contain-intrinsic-size: auto 800px !important;
        }

        /* Reader page images - taller threshold */
        .col .pg.sarrast-reader-image {
            content-visibility: auto !important;
            contain-intrinsic-size: auto 5000px !important;
        }
        `;
    }

    // Translation overlay boxes
    if (CONFIG.optimizeReaderBoxes) {
        css += `
        /*
         * ------------------------------------------------------------
         * Translation overlay boxes (.bx)
         * ------------------------------------------------------------
         */
        .bx.sarrast-box {
            content-visibility: auto !important;
            contain-intrinsic-size: auto 500px !important;
        }
        `;
    }

    // Hero carousel off-screen optimization
    css += `
        /*
         * ------------------------------------------------------------
         * Hero carousel off-screen slides
         * ------------------------------------------------------------
         */
        .hs-col.sarrast-offscreen {
            content-visibility: auto !important;
            contain-intrinsic-size: auto 300px !important;
        }
    `;

    // Card grid optimization
    css += `
        /*
         * ------------------------------------------------------------
         * Card grid optimization
         * ------------------------------------------------------------
         */
        .card.sarrast-card {
            content-visibility: auto !important;
            contain-intrinsic-size: auto 400px !important;
        }
    `;

    // Iframe optimization
    css += `
        /*
         * ------------------------------------------------------------
         * Iframe optimization
         * ------------------------------------------------------------
         */
        iframe.sarrast-lazy-frame {
            content-visibility: auto !important;
            contain-intrinsic-size: auto 300px !important;
        }
    `;

    // Below-fold acceleration - increased intrinsic size
    if (CONFIG.accelerateBelowFold && CONFIG.increaseIntrinsicSize) {
        css += `
        /*
         * ------------------------------------------------------------
         * Below-fold acceleration - section intrinsic size
         * ------------------------------------------------------------
         */
        .sec,
        .shelf-s,
        #sched,
        #explore {
            contain-intrinsic-size: auto ${CONFIG.intrinsicSize}px !important;
        }
        `;
    }

    // Reveal elements intrinsic size
    if (CONFIG.accelerateBelowFold) {
        css += `
        /*
         * ------------------------------------------------------------
         * Reveal elements intrinsic size
         * ------------------------------------------------------------
         */
        .rv {
            contain-intrinsic-size: auto 800px !important;
        }
        `;
    }

    // Skeleton shimmer for empty cards
    if (CONFIG.addSkeletons) {
        css += `
        /*
         * ------------------------------------------------------------
         * Skeleton placeholder for cards without images
         * ------------------------------------------------------------
         */
        .card.sarrast-skeleton::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: sarrast-shimmer 1.5s infinite;
            z-index: 1;
        }
        @keyframes sarrast-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        `;
    }

    // Ad blocking
    if (CONFIG.blockAds) {
        css += `
        /*
         * ------------------------------------------------------------
         * Ad blocking
         * ------------------------------------------------------------
         */
        [id*="ad"], [class*="ad-slot"], [class*="advertisement"],
        .juicyads, [src*="juicyads"], iframe[src*="ads"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
        }
        `;
    }

    style.textContent = css;

    if (document.documentElement) {
        document.documentElement.appendChild(style);
    } else {
        document.addEventListener(
            "DOMContentLoaded",
            () => document.documentElement.appendChild(style),
            { once: true }
        );
    }

    /* ---------------------------------------------------------------
     * Apply initial CSS classes based on config
     * --------------------------------------------------------------- */

    function applyInitialClasses() {
        if (CONFIG.disableAllScrollEffects) {
            document.documentElement.classList.add("sarrast-disable-scroll-effects");
        }

        if (CONFIG.calmMotion) {
            document.documentElement.classList.add("sarrast-calm");
        }

        if (CONFIG.forceContentVisibilityVisible) {
            document.body.classList.add("sarrast-force-visible");
        }
    }

    if (document.documentElement) {
        applyInitialClasses();
    } else {
        document.addEventListener("DOMContentLoaded", applyInitialClasses, { once: true });
    }

    /* ---------------------------------------------------------------
     * Scrolling state (legacy - only used when disableAllScrollEffects is false)
     * --------------------------------------------------------------- */

    let scrollTimer = 0;
    let scrollFrame = 0;

    function markScrolling() {
        if (CONFIG.disableAllScrollEffects) {
            return; // No-op: effects permanently disabled
        }

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

    window.addEventListener("scroll", markScrolling, { passive: true });

    /* ---------------------------------------------------------------
     * Utility: schedule non-critical work
     * --------------------------------------------------------------- */

    function runWhenIdle(callback, timeout = CONFIG.idleDelay) {
        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(callback, { timeout });
        } else {
            setTimeout(callback, timeout);
        }
    }

    /* ---------------------------------------------------------------
     * Image optimization
     * --------------------------------------------------------------- */

    const processedImages = new WeakSet();

    function optimizeImage(img) {
        if (!(img instanceof HTMLImageElement)) {return;}
        if (processedImages.has(img)) {return;}
        processedImages.add(img);

        try {
            img.decoding = "async";
        } catch {}

        if (CONFIG.optimizeImages) {
            try {
                const rect = img.getBoundingClientRect();
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;

                if (rect.top > viewportHeight * CONFIG.lazyDistance) {
                    img.loading = "lazy";
                    if ("fetchPriority" in img) {img.fetchPriority = "low";}
                } else {
                    img.loading = "eager";
                    if ("fetchPriority" in img) {img.fetchPriority = "auto";}
                }
            } catch {}
        }

        if (CONFIG.optimizeLargeImages) {
            if (img.complete) {
                optimizeLoadedImage(img);
            } else {
                img.addEventListener("load", () => optimizeLoadedImage(img), { once: true, passive: true });
            }
        }
    }

    function optimizeLoadedImage(img) {
        if (!(img instanceof HTMLImageElement)) {return;}
        if (!img.naturalWidth || !img.naturalHeight) {return;}

        try {
            const rect = img.getBoundingClientRect();
            const renderedHeight = rect.height;

            // Reader page images
            if (isReaderPage && renderedHeight >= CONFIG.readerImageThreshold) {
                img.classList.add("sarrast-reader-image");
                if (renderedHeight > 0) {
                    img.style.setProperty("contain-intrinsic-size", `auto ${Math.ceil(renderedHeight)}px`, "important");
                }
            }
            // General large images
            else if (renderedHeight >= CONFIG.largeImageHeight) {
                img.classList.add("sarrast-large-image");
                if (renderedHeight > 0) {
                    img.style.setProperty("contain-intrinsic-size", `auto ${Math.ceil(renderedHeight)}px`, "important");
                }
            }
        } catch {}
    }

    /* ---------------------------------------------------------------
     * Iframe optimization
     * --------------------------------------------------------------- */

    const processedFrames = new WeakSet();

    function optimizeIframe(frame) {
        if (!(frame instanceof HTMLIFrameElement)) {return;}
        if (processedFrames.has(frame)) {return;}
        processedFrames.add(frame);

        try {
            const rect = frame.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;

            if (rect.top > viewportHeight * CONFIG.lazyDistance) {
                frame.loading = "lazy";
                frame.classList.add("sarrast-lazy-frame");
            }
        } catch {}
    }

    /* ---------------------------------------------------------------
     * Translation overlay boxes (.bx)
     * --------------------------------------------------------------- */

    const processedBoxes = new WeakSet();

    function optimizeBox(box) {
        if (!(box instanceof HTMLElement)) {return;}
        if (processedBoxes.has(box)) {return;}
        processedBoxes.add(box);

        if (!CONFIG.optimizeReaderBoxes) {return;}
        if (!isReaderPage) {return;}

        try {
            const rect = box.getBoundingClientRect();
            const renderedHeight = rect.height;

            if (renderedHeight > 0) {
                box.classList.add("sarrast-box");
                box.style.setProperty("contain-intrinsic-size", `auto ${Math.ceil(renderedHeight)}px`, "important");
            }
        } catch {}
    }

    /* ---------------------------------------------------------------
     * Hero carousel off-screen optimization
     * --------------------------------------------------------------- */

    const processedHeroSlides = new WeakSet();

    function optimizeHeroSlide(slide) {
        if (!(slide instanceof HTMLElement)) {return;}
        if (processedHeroSlides.has(slide)) {return;}
        processedHeroSlides.add(slide);

        if (!isHomepage) {return;}

        try {
            const rect = slide.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;

            if (rect.bottom < 0 || rect.top > viewportHeight) {
                slide.classList.add("sarrast-offscreen");
            }
        } catch {}
    }

    /* ---------------------------------------------------------------
     * Card grid optimization
     * --------------------------------------------------------------- */

    const processedCards = new WeakSet();

    function optimizeCard(card) {
        if (!(card instanceof HTMLElement)) {return;}
        if (processedCards.has(card)) {return;}
        processedCards.add(card);

        if (!isSeriesListing) {return;}

        try {
            card.classList.add("sarrast-card");

            // Skeleton for cards without loaded images
            if (CONFIG.addSkeletons) {
                const img = card.querySelector("img");
                if (img && (!img.src || img.src === location.href)) {
                    card.classList.add("sarrast-skeleton");
                }
            }
        } catch {}
    }

    /* ---------------------------------------------------------------
     * Batch DOM processing
     * --------------------------------------------------------------- */

    const imageQueue = [];
    const frameQueue = [];
    const boxQueue = [];
    const heroQueue = [];
    const cardQueue = [];
    let processing = false;

    function queueCurrentContent() {
        const images = document.querySelectorAll("img");
        const frames = document.querySelectorAll("iframe");
        const boxes = document.querySelectorAll(".bx");
        const heroSlides = document.querySelectorAll(".hs-col");
        const cards = document.querySelectorAll(".card");

        for (const img of images) {if (!processedImages.has(img)) {imageQueue.push(img);}}
        for (const frame of frames) {if (!processedFrames.has(frame)) {frameQueue.push(frame);}}
        for (const box of boxes) {if (!processedBoxes.has(box)) {boxQueue.push(box);}}
        for (const slide of heroSlides) {if (!processedHeroSlides.has(slide)) {heroQueue.push(slide);}}
        for (const card of cards) {if (!processedCards.has(card)) {cardQueue.push(card);}}

        processQueues();
    }

    function processQueues() {
        if (processing) {return;}
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
                optimizeBox(boxQueue.shift());
                processed++;
            }

            while (heroQueue.length && processed < CONFIG.batchSize) {
                optimizeHeroSlide(heroQueue.shift());
                processed++;
            }

            while (cardQueue.length && processed < CONFIG.batchSize) {
                optimizeCard(cardQueue.shift());
                processed++;
            }

            processing = false;

            if (imageQueue.length || frameQueue.length || boxQueue.length || heroQueue.length || cardQueue.length) {
                processQueues();
            }
        });
    }

    /* ---------------------------------------------------------------
     * MutationObserver
     * --------------------------------------------------------------- */

    let mutationScheduled = false;

    const observer = new MutationObserver((mutations) => {
        let foundRelevantNode = false;

        for (const mutation of mutations) {
            if (!mutation.addedNodes.length) {continue;}

            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) {continue;}

                const element = node;

                if (element.matches && element.matches("img")) {
                    if (!processedImages.has(element)) {
                        imageQueue.push(element);
                        foundRelevantNode = true;
                    }
                }

                if (element.matches && element.matches("iframe")) {
                    if (!processedFrames.has(element)) {
                        frameQueue.push(element);
                        foundRelevantNode = true;
                    }
                }

                if (element.matches && element.matches(".bx")) {
                    if (!processedBoxes.has(element)) {
                        boxQueue.push(element);
                        foundRelevantNode = true;
                    }
                }

                if (element.matches && element.matches(".hs-col")) {
                    if (!processedHeroSlides.has(element)) {
                        heroQueue.push(element);
                        foundRelevantNode = true;
                    }
                }

                if (element.matches && element.matches(".card")) {
                    if (!processedCards.has(element)) {
                        cardQueue.push(element);
                        foundRelevantNode = true;
                    }
                }

                if (element.querySelectorAll) {
                    const imgs = element.querySelectorAll("img");
                    const frames = element.querySelectorAll("iframe");
                    const boxes = element.querySelectorAll(".bx");
                    const heroSlides = element.querySelectorAll(".hs-col");
                    const cards = element.querySelectorAll(".card");

                    for (const img of imgs) {if (!processedImages.has(img)) { imageQueue.push(img); foundRelevantNode = true; }}
                    for (const frame of frames) {if (!processedFrames.has(frame)) { frameQueue.push(frame); foundRelevantNode = true; }}
                    for (const box of boxes) {if (!processedBoxes.has(box)) { boxQueue.push(box); foundRelevantNode = true; }}
                    for (const slide of heroSlides) {if (!processedHeroSlides.has(slide)) { heroQueue.push(slide); foundRelevantNode = true; }}
                    for (const card of cards) {if (!processedCards.has(card)) { cardQueue.push(card); foundRelevantNode = true; }}
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
     * Start observing
     * --------------------------------------------------------------- */

    function startObserver() {
        if (!document.body) {return;}

        observer.observe(document.body, { childList: true, subtree: true });
        queueCurrentContent();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startObserver, { once: true });
    } else {
        startObserver();
    }

    /* ---------------------------------------------------------------
     * htmx SPA navigation handling
     * --------------------------------------------------------------- */

    document.body.addEventListener("htmx:afterSwap", () => {
        runWhenIdle(queueCurrentContent, 100);
    }, { passive: true });

    document.body.addEventListener("htmx:load", () => {
        runWhenIdle(queueCurrentContent, 100);
    }, { passive: true });

    /* ---------------------------------------------------------------
     * Re-process after full page load
     * --------------------------------------------------------------- */

    window.addEventListener("load", () => {
        runWhenIdle(queueCurrentContent, 500);
    }, { once: true, passive: true });

    /* ---------------------------------------------------------------
     * Handle orientation / viewport changes
     * --------------------------------------------------------------- */

    let resizeTimer = 0;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            queueCurrentContent();
        }, 250);
    }, { passive: true });

    /* ---------------------------------------------------------------
     * Periodic ad cleanup
     * --------------------------------------------------------------- */

    if (CONFIG.blockAds) {
        setInterval(() => {
            const adElements = document.querySelectorAll('[id*="ad"], [class*="ad-slot"], [class*="advertisement"], .juicyads, [src*="juicyads"], iframe[src*="ads"]');
            adElements.forEach(el => {
                el.style.display = "none";
                el.style.visibility = "hidden";
                el.style.opacity = "0";
                el.style.height = "0";
                el.style.width = "0";
            });
        }, 5000);
    }

    /* ---------------------------------------------------------------
     * Alpine hero component patch (disable autoplay at component level)
     * --------------------------------------------------------------- */

    if (CONFIG.disableHeroAutoplay) {
        function patchHeroComponent() {
            if (typeof Alpine !== "undefined") {
                try {
                    // Force hero component to have reduced: true
                    document.querySelectorAll("[x-data]").forEach(el => {
                        if (el.__x && el.__x.getUnobservedData) {
                            const data = el.__x.getUnobservedData();
                            if (data && typeof data.reduced !== "undefined") {
                                Object.defineProperty(data, "reduced", { get: () => true, configurable: true });
                            }
                        }
                    });
                } catch {}
            }
        }

        if (typeof Alpine !== "undefined") {
            patchHeroComponent();
        } else {
            document.addEventListener("alpine:init", patchHeroComponent, { once: true });
        }
    }

    /* ---------------------------------------------------------------
     * Cleanup on pagehide
     * --------------------------------------------------------------- */

    window.addEventListener("pagehide", () => {
        clearTimeout(scrollTimer);
        if (scrollFrame) {cancelAnimationFrame(scrollFrame);}
        observer.disconnect();
    }, { once: true, passive: true });

})();