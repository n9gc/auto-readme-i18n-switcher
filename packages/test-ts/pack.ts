import { build } from 'esbuild';
import { glob } from 'tinyglobby';
import { getDirname } from 'esm-entry';

await build({
	entryPoints: await glob(
		[
			'lib/**/*.ts',
		],
		{
			onlyFiles: true,
			cwd: getDirname(import.meta.url),
		},
	),
	bundle: false,
	outdir: '.',
	format: 'esm',
	platform: 'node',
	target: 'esnext',
});
