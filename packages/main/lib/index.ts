/**
 * 测试用的 TS 包
 * @license MIT
 * @author accurtype
 */
declare module './index.ts';

/**
 * 得到一个问候
 * @param n 要问候斐波那契数列的第几项
 * @returns 问候
 */
export default function hello(n: number): string {
	const helloString = `hello, ${n}!`;
	console.log(helloString);
	return helloString;
}
