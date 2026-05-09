import { build } from 'esbuild';

await build({
	entryPoints: ['lib/index.ts'],
	bundle: true,
	outfile: '../../dist.cjs',
	format: 'cjs',
	platform: 'node',
	target: 'es2024',
});
