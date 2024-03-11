import { join } from 'path';

import {
  formatFiles,
  generateFiles,
  names,
  readProjectConfiguration,
  stripIndents,
  type Tree,
} from '@nx/devkit';

import type { AngularProjectConfiguration } from '@nx/angular/src/utils/types';

export default async function componentGenerator(
  tree: Tree,
  {
    project,
    name,
    export: shouldExport,
  }: {
    project: string;
    name: string;
    export: boolean;
  }
) {
  const { fileName, className } = names(name);
  const { prefix, sourceRoot } = readProjectConfiguration(
    tree,
    project
  ) as AngularProjectConfiguration;

  generateFiles(tree, join(__dirname, 'files'), sourceRoot, {
    tpl: '',
    fileName,
    className,
    prefix,
    name,
  });

  if (shouldExport) {
    const entryPointPath = `${sourceRoot}/index.ts`;
    const updateEntryPointContent = stripIndents`${tree.read(
      entryPointPath,
      'utf-8'
    )}
      export * from './${fileName}.component';`;

    tree.write(entryPointPath, updateEntryPointContent);
  }

  await formatFiles(tree);
}
