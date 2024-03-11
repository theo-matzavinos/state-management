import { libraryGenerator, UnitTestRunner } from '@nx/angular/generators';
import { formatFiles, type Tree } from '@nx/devkit';

import componentGenerator from '../component';
import updateEslintConfig from '../eslint';

export default async function (
  tree: Tree,
  {
    name,
    skipComponent,
  }: {
    name: string;
    skipComponent: boolean;
  },
) {
  const libraryPath = `libs/shared/${name}`;
  const projectName = `shared-${name}`;

  await libraryGenerator(tree, {
    directory: libraryPath,
    name: projectName,
    buildable: true,
    routing: false,
    flat: true,
    inlineStyle: true,
    inlineTemplate: true,
    skipTests: true,
    standalone: true,
    unitTestRunner: UnitTestRunner.None,
    tags: 'type:shared',
    projectNameAndRootFormat: 'as-provided',
    strict: true,
    prefix: 'slg',
    importPath: `@slg/${name}`,
  });

  tree.delete(`${libraryPath}/src/lib`);
  tree.write(`${libraryPath}/src/index.ts`, '');

  if (!skipComponent) {
    await componentGenerator(tree, {
      project: projectName,
      name,
      export: true,
    });
  }

  await updateEslintConfig(tree, { project: projectName });

  await formatFiles(tree);
}
