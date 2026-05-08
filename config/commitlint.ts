import { RuleConfigSeverity } from '@commitlint/types';
import type { UserConfig } from 'cz-git';
import { scanChangedScopes, listPackages, permuteScope } from './utility.ts';

export const { packages, rootName } = await listPackages();
export const scopeEnumSeparator = ', ';
export const {
	enableMultipleScopes,
	scopeEnum,
} = permuteScope(packages, scopeEnumSeparator);
export const defaultScope = await scanChangedScopes(packages, rootName, enableMultipleScopes);

const prompt = {
	types: [
		{ value: 'init', name: 'init		初始化' },
		{ value: 'fix', name: 'fix		修复' },
		{ value: 'refactor', name: 'refactor	重构' },
		{ value: 'add', name: 'add		添加' },
		{ value: 'test', name: 'test		测试相关' },
		{ value: 'doc', name: 'doc		添加文档' },
		{ value: 'style', name: 'style		风格修改' },
		{ value: 'revert', name: 'revert	撤销提交' },
		{ value: 'env', name: 'env		非代码部分' },
	],
	allowBreakingChanges: ['add', 'refactor', 'fix', 'revert'],

	scopes: packages.map(({ manifest: { name = '' } }) => name),
	enableMultipleScopes,
	scopeEnumSeparator,
	allowEmptyScopes: true,
	customScopesAlias: '<自己写>',
	allowCustomScopes: false,
	customScopesAlign: 'bottom',
	emptyScopesAlias: '<空>',
	defaultScope,

	messages: {
		type: '本次提交的类型',
		scope: '[可选] 本次提交影响的范围',
		customScope: '本次提交影响的范围\n',
		subject: '简述提交',
		body: '[可选] 详细描述提交，用 "|" 来换行\n',
		breaking: '[可选] 列出破坏性更新\n',
		footer: '[可选] 列出解决的议题号，比如: #31, #34\n',
		confirmCommit: '确认以上提交信息？',
		footerPrefixesSelect: '[可选] 选择议题类型',
		customFooterPrefix: '输入议题前缀',
	},
	skipQuestions: ['footer'],

	breaklineNumber: 80,
	maxHeaderLength: Infinity,
	maxSubjectLength: Infinity,
	minSubjectLength: 0,

	issuePrefixes: [
		{ value: 'closed', name: 'closed	议题已被关闭' },
	],
	allowCustomIssuePrefix: true,
	customIssuePrefixAlias: '<自己写>',
	customIssuePrefixAlign: 'top',
	allowEmptyIssuePrefix: true,
	emptyIssuePrefixAlias: '<跳过>',
	defaultIssues: '',
} satisfies UserConfig['prompt'];

const config: UserConfig = {
	/*
	 * Resolve and load conventional-changelog-atom from node_modules.
	 * Referenced packages must be installed
	 */
	// parserPreset: 'conventional-changelog-atom',
	/*
	 * Resolve and load @commitlint/format from node_modules.
	 * Referenced package must be installed
	 */
	// formatter: '@commitlint/format',
	/*
	 * Any rules defined here will override rules from @commitlint/config-conventional
	 */
	rules: {
		'body-leading-blank': [RuleConfigSeverity.Error, 'always'],
		'scope-enum': [RuleConfigSeverity.Error, 'always', scopeEnum],
		'subject-empty': [RuleConfigSeverity.Error, 'never'],
		'type-enum': [RuleConfigSeverity.Error, 'always', prompt.types.map(({ value }) => value)],
		'type-case': [RuleConfigSeverity.Error, 'always', 'kebab-case'],
		'type-empty': [RuleConfigSeverity.Error, 'never'],
	},
	/*
	 * Functions that return true if commitlint should ignore the given message.
	 */
	ignores: [commit => commit === ''],
	/*
	 * Whether commitlint uses the default ignore rules.
	 */
	defaultIgnores: false,
	/*
	 * Custom URL to show upon failure
	 */
	helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
	/*
	 * Custom prompt configs
	 */
	prompt,
};
export default config;
