import {
  updateJson,
  updateNxJson,
  addDependenciesToPackageJson,
  formatFiles,
} from '@nx/devkit';

import type { Tree } from '@nx/devkit';

export default async function (tree: Tree, { name }: { name: string }) {
  updateNxJson(tree, {
    workspaceLayout: {
      appsDir: 'apps',
      libsDir: 'libs',
    },
    tasksRunnerOptions: {
      default: {
        runner: 'nx/tasks-runners/default',
        options: {
          cacheableOperations: ['build', 'lint', 'test', 'e2e'],
          cacheDirectory: '.cache/nx',
        },
      },
    },
  });

  await addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nx/vite': 'latest',
      '@nx/angular': 'latest',
      '@analogjs/vite-plugin-angular': 'latest',
    }
  )();

  updateJson(tree, '.eslintrc.json', (rules) => {
    const enforceModuleBoundariesRule = rules.overrides.find(
      (override: { rules: Record<string, string[]> }) =>
        '@nx/enforce-module-boundaries' in override.rules
    );
    const depConstraintsConfig: unknown[] = (enforceModuleBoundariesRule.rules[
      '@nx/enforce-module-boundaries'
    ][1].depConstraints = []);

    depConstraintsConfig.push({
      sourceTag: 'type:app',
      onlyDependOnLibsWithTags: ['type:api', 'type:shared'],
    });

    depConstraintsConfig.push({
      sourceTag: 'type:api',
      onlyDependOnLibsWithTags: [
        'type:api',
        'type:core',
        'type:feature',
        'type:shared',
      ],
    });

    depConstraintsConfig.push({
      sourceTag: 'type:core',
      onlyDependOnLibsWithTags: ['type:api', 'type:shared'],
    });

    depConstraintsConfig.push({
      sourceTag: 'type:feature',
      onlyDependOnLibsWithTags: [
        'type:api',
        'type:core',
        'type:feature',
        'type:shared',
      ],
    });

    depConstraintsConfig.push({
      sourceTag: 'type:shared',
      onlyDependOnLibsWithTags: ['type:shared'],
    });

    return rules;
  }) as unknown;

  tree.write(
    `${name}.code-workspace`,
    JSON.stringify({
      folders: [
        {
          name: 'Root',
          path: '.',
        },
        {
          name: 'app',
          path: 'apps/slg',
        },
        {
          path: 'libs/shared',
          name: 'shared',
        },
        {
          path: 'libs/nx-plugin',
          name: 'nx-plugin',
        },
      ],
      settings: {
        'typescript.preferences.importModuleSpecifier': 'project-relative',
        'terminal.integrated.cwd': '${workspaceFolder:Root}',
        'typescript.tsdk': 'Root/node_modules/typescript/lib',
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
        'editor.formatOnSave': true,
        'editor.codeActionsOnSave': {
          'source.fixAll.eslint': true,
        },
        'tailwindCSS.experimental.configFile': 'tailwind.config.js',
        'tailwindCSS.experimental.classRegex': ['class:\\s*["\'`]([^"\'`]*)'],
        'files.exclude': {
          '**/.eslint*': false,
          '**/.git*': false,
          '**/*package*.json': false,
          '**/project.json': false,
          '**/README*': false,
          '**/tsconfig*': false,
          '**/.prettier*': false,
          '**/.editorconfig*': false,
          '**/nx.json': false,
          tmp: false,
          dist: false,
          '.vscode': false,
          '.angular': false,
          '.npmrc': false,
          '**/jest*.js': false,
          node_modules: false,
          '.browserslistrc': false,
        },
      },
      extensions: {
        recommendations: [
          'angular.ng-template',
          'nrwl.angular-console',
          'esbenp.prettier-vscode',
          'dbaeumer.vscode-eslint',
          'editorconfig.editorconfig',
          'yoavbls.pretty-ts-errors',
          'bradlc.vscode-tailwindcss',
          'amodio.toggle-excluded-files',
        ],
      },
    })
  );

  await formatFiles(tree);
}
