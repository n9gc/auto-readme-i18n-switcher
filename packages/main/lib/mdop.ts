/**
 * 操作 markdown 文章
 * @license MIT
 * @author n9gc
 */
declare module './mdop.ts';

import { zone } from 'mdast-zone';
import { remark } from 'remark';
import type { Nodes } from 'mdast';

/**替换 md 文章里的 tag */
export function replaceZone(markdown: string, tag: string, content: string) {
	return new Promise<string>(resolve => {
		const joiner = (tree: Nodes) => zone(tree, tag, (start, _, end) => {
			const startOffset = start.position?.end.offset;
			const endOffset = end.position?.start.offset;
			if (startOffset === void 0 || endOffset === void 0) return [];
			const starter = markdown.slice(0, startOffset);
			const ender = markdown.slice(endOffset);

			resolve(`${starter}\n${content}\n${ender}`);
			return [];
		});
		remark()
			.use(() => joiner)
			.process(markdown)
			.then(() => resolve(markdown));
	});
}

