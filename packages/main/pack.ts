import { build } from 'esbuild';

await build({
	entryPoints: ['lib/index.ts'],
	bundle: true,
	outfile: '../../dist.js',
	format: 'esm',
	platform: 'node',
	target: 'esnext',
});
