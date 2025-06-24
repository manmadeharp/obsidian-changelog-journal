import { defineConfig, devices } from "@playwright/test";

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	use: {
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
		// console: "verbose",
	},
	projects: [
		{
			name: "obsidian",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
