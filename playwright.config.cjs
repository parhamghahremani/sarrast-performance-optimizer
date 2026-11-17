/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
    testDir: "./tests",
    timeout: 60000,
    expect: { timeout: 10000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:8081",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...require("@playwright/test").devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...require("@playwright/test").devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...require("@playwright/test").devices["Desktop Safari"] },
        },
    ],
    webServer: {
        command: "npx serve tests/fixtures -p 8081",
        url: "http://localhost:8081",
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
};