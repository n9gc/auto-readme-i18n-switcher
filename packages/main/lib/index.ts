/**
 * 测试用的 TS 包
 * @license MIT
 * @author n9gc
 */
declare module './index.ts';

import * as core from '@actions/core';
import * as fsp from 'node:fs/promises';
import path from 'node:path';
import * as z from 'zod';
import { Config } from './config.ts';

export const ParsedReadme = z.object({
	folder: z.string(),
	lang: z.string(),
}).readonly();
export type ParsedReadme = z.infer<typeof ParsedReadme>;

export interface ReadmeInfo extends ParsedReadme {
	readonly filePath: string;
	readonly display: string;
}
export interface ReadmeInfoWithSwitcher extends ReadmeInfo {
	readonly switcher: string;
}

export class Runner {
	/**配置 */
	readonly config = new Config();

	/**解析文件名 */
	parseFile(filePath: string): ParsedReadme | undefined {
		const result = ParsedReadme.safeParse(
			this.config.fileTemplate.match(filePath),
		);
		return result.data;
	}

	/**解析文件夹 */
	async scanReadmes(folderPath: string) {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const files = await fsp.readdir(folderPath, { recursive: false });
		if (files.length === 0) {
			core.info(`No files in "${Config.toRelative(folderPath)}"`);
		}

		const readmes = files.flatMap(fileName => {
			const filePath = Config.toRelative(path.join(folderPath, fileName));
			const data = this.parseFile(filePath);
			if (!data) return [];
			const display = new Intl.DisplayNames(data.lang, { type: 'language' }).of(data.lang) ?? data.lang;
			const readmeInfo: ReadmeInfo = { ...data, filePath, display };
			return [readmeInfo];
		});
		if (readmes.length === 0) {
			core.info(`No readme files in "${Config.toRelative(folderPath)}"`);
		}
		return readmes;
	}

	/**获得各个 readme 的切换器 */
	renderSwitchers(readmes: readonly ReadmeInfo[]): ReadmeInfoWithSwitcher[] {
		return readmes.map(readme => ({
			switcher: this.config.switcherBodyRenderer.render({
				lines: readmes
					.map(scope => (scope === readme
						? this.config.switcherLineActiveRenderer
						: this.config.switcherLineRenderer).render(scope))
					.join(this.config.switcherSpliter),
			}),
			...readme,
		}));
	}

	/**写入切换器 */
	async writeToFiles(readmes: readonly ReadmeInfoWithSwitcher[]) {
		for (const { filePath, switcher } of readmes) {
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const file = await fsp.readFile(filePath);
			const content = file.toString();
			if (!content.includes(this.config.tag)) {
				core.info(`${Config.toRelative(filePath)} has no tag`);
				continue;
			}
			const contentNew = content.replaceAll(this.config.tag, switcher);
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			await fsp.writeFile(filePath, contentNew);
			core.info(`${Config.toRelative(filePath)} updated successfully.`);
		}
	}

	/**设置仓库说明文件 */
	async copyRepoReadme() {
		const { realRepoReadme } = this.config;
		if (!realRepoReadme) return;
		await fsp.copyFile(
			realRepoReadme,
			path.join(Config.root, `README${path.extname(realRepoReadme)}`),
		);
	}

	async run() {
		try {
			for (const folder of this.config.realFolders) {
				const readmes = await this.scanReadmes(folder);
				await this.writeToFiles(this.renderSwitchers(readmes));
			}
			await this.copyRepoReadme();
		} catch (error) {
			if (error instanceof Error) {
				core.setFailed(error);
			}
		}
	}
}

await new Runner().run();
