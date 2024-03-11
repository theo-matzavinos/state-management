import {
  updateJson,
  formatFiles,
  glob,
  readProjectConfiguration,
} from '@nx/devkit';

import type { Tree } from '@nx/devkit';
import type { ESLint } from 'eslint';

export default async function (tree: Tree, { project }: { project?: string }) {
  if (!project) {
    for (const path of glob(tree, ['**/.eslintrc.json'])) {
      updateEslintConfig(tree, path);
    }
  } else {
    updateEslintConfig(
      tree,
      `${readProjectConfiguration(tree, project).root}/.eslintrc.json`,
    );
  }

  await formatFiles(tree);
}

function updateEslintConfig(tree: Tree, path: string) {
  updateJson(tree, path, (value: ESLint.ConfigData) => {
    const angularRules = value.overrides?.find((override) => {
      if (Array.isArray(override.extends)) {
        return override.extends?.some((extend) =>
          extend.includes('@nx/angular'),
        );
      }

      return override.extends?.includes('@nx/angular');
    });

    if (!angularRules) {
      return value;
    }

    angularRules.rules = angularRules.rules ?? {};
    angularRules.rules['@angular-eslint/no-host-metadata-property'] = 'off';
    angularRules.rules['@angular-eslint/no-input-rename'] = 'off';
    angularRules.rules['@angular-eslint/component-class-suffix'] = 'off';
    angularRules.rules['@angular-eslint/directive-class-suffix'] = 'off';

    return value;
  });
}
