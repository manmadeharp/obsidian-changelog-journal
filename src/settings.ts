import { App, Notice, PluginSettingTab, Setting, TFile } from "obsidian";
import MyPlugin from "main";

export interface MyPluginSettings {
	dailyTemplatePath: string;
	dailyTemplateFolder: string;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	dailyTemplatePath: "",
	dailyTemplateFolder: "",
};
export class MySettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// new Setting(containerEl)
		// 	.setName('Setting #1')
		// 	.setDesc('Example setting')
		// 	.addText(text =>
		// 		text
		// 			.setPlaceholder('Enter a value')
		// 			.setValue(this.plugin.settings.mySetting)
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.mySetting = value;
		// 				await this.plugin.saveSettings();
		// 			})
		// 	);
		//
		new Setting(containerEl).setName("Daily Notes Settings").setHeading();

		new Setting(containerEl)
			.setName("Daily note Template")
			.setDesc("Select the daily note template from vault.")
			.addDropdown((drop) => {
				for (const file of this.app.vault.getMarkdownFiles()) {
					drop.addOption(file.path, file.name);
				}

				drop.setValue(this.plugin.settings.dailyTemplatePath || "");

				drop.onChange(async (value) => {
					this.plugin.settings.dailyTemplatePath = value;
					await this.plugin.saveSettings();
					new Notice(`template set to: ${value}`);
				});
			});
		new Setting(containerEl)
			.setName("Daily note Folder")
			.setDesc("Select the daily note Folder from vault.")
			.addDropdown((drop) => {
				for (const folder of this.app.vault.getAllFolders()) {
					drop.addOption(folder.path, folder.name);
				}

				drop.setValue(this.plugin.settings.dailyTemplateFolder || "");

				drop.onChange(async (value) => {
					this.plugin.settings.dailyTemplateFolder = value;
					console.log(value);
					await this.plugin.saveSettings();
					new Notice(`folder set to: ${value}`);
				});
			});
	}
}
