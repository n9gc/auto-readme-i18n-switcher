/**
 * 测试用的 TS 包
 * @license MIT
 * @author n9gc
 */
declare module './index.ts';

import * as core from '@actions/core';
import { walk } from '@nodelib/fs.walk/promises';
import * as fsp from 'node:fs/promises';
import path from 'node:path';
import { Config } from './config.ts';

async function run() {
	try {
		const config = new Config();

		process.chdir(config.folder);
		const cwd = process.cwd();

		const files = await walk('.', {
			deepFilter({ name }) {
				return !config.ignoredFolderNamesSet.has(name);
			},
			followSymbolicLinks: true,
		});
		if (files.length === 0) {
			core.info('No files.');
			return;
		}

		const readmes = files.flatMap(({ path: filePath }) => {
			filePath = path.relative(cwd, filePath);
			const data = config.parseFile(filePath);
			if (!data) return [];
			const display = new Intl.DisplayNames(data.lang, { type: 'language' }).of(data.lang);
			return [{ ...data, filePath, display }];
		});
		if (readmes.length === 0) {
			core.info('No readme files.');
			return;
		}


		for (const readme of readmes) {
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const file = await fsp.readFile(readme.filePath);
			const content = file.toString();
			if (!content.includes(config.tag)) continue;
			const switcher = config.switcherBodyRenderer.render({
				lines: readmes
					.map(scope => (scope === readme
						? config.switcherLineActiveRenderer
						: config.switcherLineRenderer).render(scope))
					.join(config.switcherSpliter),
			});
			const contentNew = content.replaceAll(config.tag, switcher);
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			await fsp.writeFile(readme.filePath, contentNew);
			core.info(`${readme.filePath} updated successfully.`);
		}
	} catch (error) {
		if (error instanceof Error) {
			core.setFailed(error);
		}
	}
}

await run();
