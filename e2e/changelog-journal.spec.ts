import test, { expect, type ElectronApplication } from "@playwright/test";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { _electron as electron } from "playwright";

const appPath = path.resolve("./.obsidian-unpacked/main.js");
const vaultPath = path.resolve("./e2e-vault");

let app: ElectronApplication;

test.beforeEach(async () => {

	app = await electron.launch({
		args: [
			appPath,
			"open",
			`obsidian://open?path=${encodeURIComponent(vaultPath)}`
		]
	});
});

test.afterEach(async () => {
	console.log("Closing Electron...");
	try {
		await app.close();
		console.log("Closed Electron successfully.");
	} catch (err) {
		console.error("Error during Electron close:", err);
	}
});

test("sanity: can open vault and load window", async () => {
	const window = await app.firstWindow();
	const title = await window.title();
	expect(title.toLowerCase()).toContain("obsidian");
});

test("Testing the plugin by modifying a file", async () => {
})
