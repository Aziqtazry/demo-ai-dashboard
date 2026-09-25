import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    outputDir: './test-results',
    reporter: [['list']],
    use: {
        baseURL: 'http://127.0.0.1:5173',
        channel: 'chrome',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'npm.cmd run dev -- --host 127.0.0.1',
        url: 'http://127.0.0.1:5173',
        reuseExistingServer: false,
        timeout: 30_000,
    },
    projects: [
        {
            name: 'desktop-chrome',
            use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        },
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 7'], channel: 'chrome' },
        },
    ],
});
