import { normalizePath, Notice, Plugin, TAbstractFile, TFile } from "obsidian";
import MyPlugin from "main";
import dayjs, { Dayjs } from "dayjs";
import yaml from "js-yaml";

function extractFrontmatter(source: string): string {
	const match = source.match(/^---\n([\s\S]*?)\n---/);
	if (!match) throw new Error("Frontmatter block not found or malformed");
	return match[1]; // this is the raw YAML block, no delimiters
}

function file_name_with_extension(filename: string): string {
	return filename.endsWith(".md") ? filename : filename + ".md";
}

export function insert_yaml(
	source: string,
	path: Record<string, string>,
): string {
	// console.log(source, path);
	const lines = source.split("\n");

	let front_yaml: string = "";

	if (lines[0].trim() == "---") {
		front_yaml = extractFrontmatter(source);
		const parsed = yaml.load(front_yaml) as Record<string, any>;

		if (parsed["files-modified"] instanceof Array) {
			// console.log("correct yaml", parsed);
			if (parsed["files-modified"] == null) {
				parsed["files-modified"] = [];
			}
			parsed["files-modified"].push(`[[${path["file-modified"]}]]`);
			// console.log("modified yaml", parsed);
		}

		const new_yaml = yaml.dump(parsed);

		const updated_frontmatter = source.replace(
			/^---\n([\s\S]*?)\n---/,
			`---\n${new_yaml}---`,
		);
		return updated_frontmatter;
	} else {
		new Notice("Please add yaml to the notes given in your settings.");
		return "";
	}
}

async function create_day_note(
	plugin: MyPlugin,
	notename: string,
): Promise<TFile | null> {
	const template_path = normalizePath(plugin.settings.dailyTemplatePath);
	const new_note_folder = plugin.settings.dailyTemplateFolder;

	const template: TFile | null = plugin.app.vault.getFileByPath(
		template_path,
	);

	console.log(template);

	if (!(template instanceof TFile)) {
		new Notice("Template file not found please set in settings.");
		return null;
	}

	const existing = plugin.app.vault.getFileByPath(
		`${new_note_folder}/${notename}.md`,
	);
	if (existing instanceof TFile) {
		new Notice(`Note already exists: ${notename}`);
		return existing;
	}

	const template_contents = await plugin.app.vault.read(template);

	const file = await plugin.app.vault.create(
		`${new_note_folder}/${notename}.md`,
		template_contents,
	);
	new Notice(
		"New note has been create at ${new_note_folder + notename + '.md'}",
	);

	return file;
}

export default async function add_data_to_day_journal(
	plugin: MyPlugin,
	file: TFile,
	date: Dayjs,
) {
	const day_journal_name = date.format("DD-MMM-YYYY");

	const modified_file_name = file.name;

	console.log(day_journal_name + ".md", modified_file_name);

	if (file_name_with_extension(day_journal_name) == modified_file_name) {
		console.log("naming conflict, avoid recurse");
		return;
	}

	let found = false;
	let note_file: TFile | null = null;

	for (const file of plugin.app.vault.getMarkdownFiles()) {
		// console.log(file, day_journal_name);
		if (file.name == day_journal_name + ".md") {
			// console.log("file.name is found: ", file.name);
			found = true;
			note_file = file;
		} else {
			// console.log(
			// 	"file name does not match the target file: ",
			// 	file.name,
			// );
		}
	}
	if (!found) {
		const new_note = create_day_note(plugin, day_journal_name);
		if (new_note instanceof TFile) {
			note_file = new_note;
		}
	}

	if (note_file != null) {
		const day_note_content = await plugin.app.vault.read(note_file);
		const modified_file_yaml = {
			"file-modified": `[[${modified_file_name}]]`,
		};

		const new_yaml = insert_yaml(day_note_content, modified_file_yaml);

		await plugin.app.vault.modify(note_file, new_yaml);
	}
}
