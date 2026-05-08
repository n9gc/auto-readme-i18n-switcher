import { includeIgnoreFile } from '@eslint/compat';
import eslint from '@eslint/js';
import accurtypeStyle from 'eslint-config-accurtype-style';
import { importX } from 'eslint-plugin-import-x';
import importZod from 'eslint-plugin-import-zod';
import { configs as securityConfigs } from 'eslint-plugin-security';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { ConfigArray, configs as tseslintConfigs } from 'typescript-eslint';
import { pathTo } from './utility.ts';

const config: ConfigArray = defineConfig(
	...accurtypeStyle,
	eslint.configs.recommended,
	...tseslintConfigs.stylisticTypeChecked,
	unicorn.configs.recommended,
	securityConfigs.recommended as any,
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	...importZod.configs.recommended,
	{
		name: 'TS Base Config',
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: pathTo('..'),
				projectService: true,
			},
		},
	},
	{
		name: 'Opt Rules',
		rules: { 'no-unused-vars': 'off' },
	},
	includeIgnoreFile(pathTo('../.gitignore')),
	{
		name: 'Global Ignore',
		ignores: [
			'**/*.md',
		],
	},
	{
		name: 'Node Env',
		files: [
			'config/cz-config.cjs',
		],
		languageOptions: { globals: globals.node },
	},
);
export default config;
