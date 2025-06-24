import { App, Editor, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import add_data_to_day_journal from 'src/add-to-journal-yaml';
import { FileChanges } from 'src/file-modification-listener';
import { MyPluginSettings, DEFAULT_SETTINGS, MySettingTab } from 'src/settings';

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		console.log("test")

		FileChanges(this, (file, date) => {
			add_data_to_day_journal(this, file, date)
		})

		this.addSettingTab(new MySettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}
//
// 	onOpen() {
// 		const { contentEl } = this;
// 		contentEl.setText('Woah!');
// 	}
//
// 	onClose() {
// 		const { contentEl } = this;
// 		contentEl.empty();
// 	}
// }

