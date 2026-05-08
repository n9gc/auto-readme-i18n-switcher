import { findWorkspacePackages, type Project } from '@pnpm/find-workspace-packages';
import { openRepository } from 'es-git';
import { constants } from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Tsconfig } from 'tsconfig-type';
import packageRoot from '../package.json' with { type: 'json' };

export function pathTo(n: string) {
	return fileURLToPath(new URL(n, import.meta.url));
}

export const rootPath = pathTo('..');

export async function listPackages() {
	const packagesWithRoot = await findWorkspacePackages(rootPath);
	for (const { manifest: { name }, dir } of packagesWithRoot) {
		if (!name) throw new Error(`package ${dir} has no name`);
	}
	const packages = packagesWithRoot.filter(({ manifest: { name } }) => name !== packageRoot.name);
	return {
		packages,
		packagesWithRoot,
		rootName: packageRoot.name,
	};
}

export function allList<T>(s: Iterable<T>) {
	const r = new Set<T[]>([[]]);
	for (const k of s) {
		const b = new Set(s);
		b.delete(k);
		for (const n of allList(b)) r.add([k, ...n]);
	}
	return r;
}
export function permuteScope(
	packages: readonly Project[],
	scopeEnumSeparator: string,
) {
	const enableMultipleScopes = packages.length < 8;
	let scopeEnum = packages.map(({ manifest: { name = '' } }) => name);
	if (enableMultipleScopes) {
		scopeEnum = [...allList(new Set(scopeEnum))].map(n => n.join(scopeEnumSeparator));
	}
	return {
		scopeEnum,
		enableMultipleScopes,
	};
}

const repo = await openRepository(rootPath);

export async function scanChangedScopes(
	packages: readonly Project[],
	rootName: string,
	enableMultipleScopes: boolean,
): Promise<string[] | string> {
	const statusNow = repo.statuses();
	const scopes = new Set(new Set(statusNow
		.iter()
		.filter(entry => {
			const status = entry.status();
			return status.indexNew
				|| status.indexDeleted
				|| status.indexRenamed
				|| status.indexModified
				|| status.indexTypechange;
		})
		.flatMap(entry => [
			entry.path(),
			entry
				.headToIndex()
				?.newFile()
				.path(),
			entry
				.headToIndex()
				?.oldFile()
				.path(),
		])
		.filter(n => typeof n === 'string'))
		.values()
		.map(relative => rootPath + relative)
		.map(filePath => packages
			.filter(({ dir }) => filePath.startsWith(dir))
			.map(({ manifest: { name = '' } }) => name))
		.flatMap(n => (n.length > 0 ? n : [rootName])));
	if (scopes.has(rootName)) return enableMultipleScopes ? [] : '';
	if (enableMultipleScopes) return [...scopes];
	return scopes.size === 1 ? scopes.values().next().value! : '';
}


export async function isExist(filePath: string) {
	try {
		await fsp.access(filePath, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

export async function referTsProjects(packages: readonly Project[]) {
	const references = await Promise.all(packages
		.map(({ dir }) => dir)
		.map(async directory => (await isExist(`${directory}/tsconfig.json`) ? [directory] : [])))
		.then(n => n
			.flat()
			.map(directory => path.relative(rootPath, directory))
			.map(directory => `./${directory}`)
			.map(path => ({ path })));
	const tsconfig: Tsconfig = {
		$schema: 'https://json.schemastore.org/tsconfig.json',
		files: [],
		references,
	};
	console.log(JSON.stringify(tsconfig, void 0, '\t'));
}

