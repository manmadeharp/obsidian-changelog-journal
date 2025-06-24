import { Vault, App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import dayjs, { Dayjs } from 'dayjs'

export function FileChanges(plugin: Plugin, handler: (file: TFile, timestamp: Dayjs) => void) {

	const on_file_modification = plugin.app.vault.on('modify', (file) => {
		if (file instanceof TFile) {
			handler(file, dayjs())
		}
		else {
			console.log("modified is not a file")
		}
	})

	plugin.registerEvent(on_file_modification);
}
