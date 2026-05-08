import { listPackages, referTsProjects } from './utility.ts';

const { packages } = await listPackages();
await referTsProjects(packages);

