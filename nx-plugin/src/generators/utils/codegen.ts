import { basename, dirname } from 'node:path';

import { glob, names, readProjectConfiguration } from '@nx/devkit';
import * as tsQuery from '@phenomnomnominal/tsquery';
import * as ts from 'typescript';

import type { Tree } from '@nx/devkit';

export type NormalizedOptions = {
  sourceFiles: ts.SourceFile[];
  endpointsFile: ts.SourceFile;
  directory: string;
  featureNames: ReturnType<typeof names>;
  label: string;
  project: string;
  path: string;
};

export function normalizeOptions(
  tree: Tree,
  {
    endpoints,
    label,
    path,
    project,
  }: {
    endpoints: string;
    path: string;
    label: string;
    project: string;
  },
): NormalizedOptions {
  const featureNames = names(basename(path));
  const directory = `${
    readProjectConfiguration(tree, project).root
  }/src/app/${path}`;
  const sourceFiles = tsQuery.project(
    `libs/${project}/endpoints/tsconfig.lib.json`,
  );
  const endpointsFile = sourceFiles.find(
    (f) => basename(f.fileName).replace(/\.ts$/, '') === endpoints,
  )!;

  return {
    directory,
    endpointsFile,
    featureNames,
    label,
    project,
    sourceFiles,
    path,
  };
}

export function getEndpoint(endpointsFile: ts.SourceFile, suffix: string) {
  const [endpoint] = tsQuery.query<ts.VariableDeclaration>(
    endpointsFile,
    `VariableDeclaration:has(Identifier[text=/${suffix}$/]):first-child`,
  );

  return [endpoint, `${endpoint.name.getText()}Promise`] as const;
}

export function getEndpointResponseType(
  endpoint: ts.VariableDeclaration,
  sourceFiles: ts.SourceFile[],
) {
  const [returnType] = tsQuery.query<ts.Identifier>(
    endpoint,
    'ArrowFunction > TypeReference TypeReference > Identifier',
  );
  const returnTypeFile = findTypeDefinitionSourceFile(sourceFiles, returnType)!;
  const [dtoType] = tsQuery.query<ts.Identifier>(
    returnTypeFile,
    'Identifier[text=data] ~ * Identifier',
  );
  const dtoFile = findTypeDefinitionSourceFile(sourceFiles, dtoType)!;

  return parseType(dtoFile, dtoType);
}

export function parseType(file: ts.SourceFile, type: ts.Identifier) {
  const references: string[] = [];
  const dtoFileText = file.getFullText();
  const props = tsQuery
    .query<ts.PropertySignature>(file, 'PropertySignature')
    .map((p) => {
      const comments = ts.getTrailingCommentRanges(dtoFileText, p.pos);
      const type = p.type!.getText();

      if (
        p.type!.kind === tsQuery.SyntaxKind.TypeReference &&
        !references.includes(type)
      ) {
        references.push(type);
      }

      return {
        key: p.name.getText(),
        type: comments?.length ? 'Date' : type,
      };
    });

  return {
    dto: type.getText(),
    props,
    references,
  };
}

export function findTypeDefinitionSourceFile(
  sourceFiles: ts.SourceFile[],
  type: ts.Identifier,
) {
  return sourceFiles.find((f) =>
    tsQuery.includes(
      f,
      `TypeAliasDeclaration:has(ExportKeyword) > Identifier[text=${type.getText()}]`,
    ),
  );
}

export async function addMenuItem(tree: Tree, options: NormalizedOptions) {
  try {
    const [menuComponentPath] = glob(tree, [
      `**/${dirname(options.directory).replace(
        /[()[\]]/g,
        '*',
      )}/**/*-menu.component.ts`,
    ]);
    const menuComponent = tree.read(menuComponentPath)!.toString();
    const menuClosingIndex = Math.max(
      menuComponent.indexOf('</slg-menu>'),
      menuComponent.indexOf('</slg-sub-menu>'),
    );
    const route = options.path
      .split('/')
      .map((s) => s.replace(/\(.*\)/g, ''))
      .filter((s) => !!s)
      .map((s) => `'${s}'`);
    const updatedMenuComponent = `${menuComponent.substring(
      0,
      menuClosingIndex,
    )}
  <a slgMenuItem [routerLink]="['/', ${route.join()}]">
  ${options.label}
</a>
${menuComponent.substring(menuClosingIndex)}`;

    tree.write(menuComponentPath, updatedMenuComponent);
  } catch (error) {
    console.warn('Failed to add menu entry');
  }
}
