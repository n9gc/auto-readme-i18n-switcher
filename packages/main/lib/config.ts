/**
 * 配置相关
 * @license MIT
 * @author n9gc
 */
declare module './config.ts';

import { getBooleanInput, getInput, getMultilineInput } from '@actions/core';
import { compile } from 'micromustache';
import * as fs from 'node:fs';
import path from 'node:path';
import UriTemplate from 'uri-template-lite';

function getInputDecorator<T>(getter: (key: string) => T, judger: (n: T) => boolean) {
	return (_: unknown, context: ClassFieldDecoratorContext<unknown, T>) => {
		const key = context.name;
		if (typeof key !== 'string') throw new Error('not string');
		return (defaultValue: T) => {
			const input = getter(key);
			return judger(input) ? input : defaultValue;
		};
	};
}

/**装饰器，获得一个字符串 Actions 参数 */
export const Input = getInputDecorator(getInput, Boolean);
/**装饰器，获得一个字符串数组 Actions 参数 */
export const MultilineInput = getInputDecorator(getMultilineInput, input => input.length > 0);
/**装饰器，获得一个布尔值 Actions 参数 */
export const BooleanInput = getInputDecorator(getBooleanInput, input => input !== void 0);

/**配置 */
export class Config {
	/**项目文件夹 */
	static readonly root = process.cwd();
	/**变成绝对路径 */
	static toReal(filePath: string) {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		return fs.realpathSync(filePath);
	}
	/**变成绝对路径 */
	static toReals(filePaths: readonly string[]) {
		return filePaths.map(n => this.toReal(n));
	}
	/**变成相对路径 */
	static toRelative(this: typeof Config, filePath: string) {
		return path.relative(this.root, filePath);
	}

	/**自述文件文件夹 */
	@MultilineInput protected readonly folders: string[] = ['.'];
	/**自述文件文件夹的绝对路径 */
	readonly realFolders = Config.toReals(this.folders);

	/**用作仓库说明文件的文件  */
	@Input protected readonly repoReadme: string = '';
	readonly realRepoReadme = this.repoReadme === '' ? void 0 : Config.toReal(this.repoReadme);

	/**文件名的模式字符串  */
	@Input protected readonly fileName: string = 'README.{lang}.md';
	/**文件名的模式  */
	readonly fileTemplate = new UriTemplate(`{folder}${this.fileName}`);

	/**标签 */
	@Input readonly tag: string = 'auto-readme-i18n-switcher';

	/**预先编译模板 */
	private compile(template: string) {
		return compile(template, {
			validateVarNames: true,
			propsExist: true,
		});
	}

	/**切换器框架模板字符串 */
	@Input protected readonly switcherBody: string = '| {{lines}} |';
	/**每个语言文件的模板字符串 */
	@Input protected readonly switcherLine: string = '[{{display}}]({{filePath}})';
	/**当前语言文件的模板字符串 */
	@Input protected readonly switcherLineActive: string = '{{display}}';
	/**每个语言文件之间的分隔符 */
	@Input readonly switcherSpliter: string = ' | ';

	/**切换器框架模板渲染器 */
	switcherBodyRenderer = this.compile(this.switcherBody);
	/**每个语言文件的模板渲染器 */
	switcherLineRenderer = this.compile(this.switcherLine);
	/**当前语言文件的模板渲染器 */
	switcherLineActiveRenderer = this.compile(this.switcherLineActive);
}

