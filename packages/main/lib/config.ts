/**
 * 配置相关
 * @license MIT
 * @author n9gc
 */
declare module './config.ts';

import { getInput, getMultilineInput } from '@actions/core';
import { compile } from 'micromustache';
import UriTemplate from 'uri-template-lite';
import * as z from 'zod';

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
const Input = getInputDecorator(getInput, Boolean);
/**装饰器，获得一个字符串数组 Actions 参数 */
const MultilineInput = getInputDecorator(getMultilineInput, input => input.length > 0);

export const ParsedReadme = z.object({
	folder: z.string(),
	lang: z.string(),
}).readonly();
export type ParsedReadme = z.infer<typeof ParsedReadme>;

/**配置 */
export class Config {
	/**自述文件文件夹 */
	@Input readonly folder: string = '.';

	/**文件名的模式字符串  */
	@Input protected readonly fileName: string = 'README.{lang}.md';
	/**文件名的模式  */
	protected readonly fileTemplate = new UriTemplate(`{folder}/${this.fileName}`);
	/**解析文件名 */
	parseFile(filePath: string): ParsedReadme | undefined {
		const result = ParsedReadme.safeParse(this.fileTemplate.match(filePath));
		return result.data;
	}

	/**要被忽略的文件夹名称 */
	@MultilineInput protected readonly ignoredFolderNames: string[] = ['node_modules'];
	/**要被忽略的文件夹名称 */
	readonly ignoredFolderNamesSet = new Set(this.ignoredFolderNames);

	/**标签 */
	@Input readonly tag: string = '<!-- auto-readme-i18n-switcher-->';


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
	@Input protected readonly switcherLine: string = '[{{display}}]({{path}})';
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

