import type { Tree } from '@nx/devkit';

export function generateBarrel(tree: Tree, path: string) {
  const files = tree.children(path);

  tree.write(
    `${path}/index.ts`,
    files
      .filter((path) => path !== 'index.ts')
      .map((path) => `export * from './${path.replace(/\.ts$/, '')}';`)
      .join('\n'),
  );
}
