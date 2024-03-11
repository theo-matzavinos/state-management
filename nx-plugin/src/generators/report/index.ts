import { dirname, join } from 'node:path';

import { type Tree, generateFiles, formatFiles } from '@nx/devkit';
import { query } from '@phenomnomnominal/tsquery';

import {
  addMenuItem,
  findTypeDefinitionSourceFile,
  getEndpoint,
  normalizeOptions,
  parseType,
} from '../utils/codegen';

import type { NormalizedOptions } from '../utils/codegen';
import type { Identifier } from 'typescript';

type Options = {
  endpoints: string;
  path: string;
  label: string;
  project: string;
};

export default async function (tree: Tree, options: Options) {
  const normalizedOptions = normalizeOptions(tree, options);

  await generateReportComponent(tree, normalizedOptions);
  await addMenuItem(tree, normalizedOptions);
  await formatFiles(tree);
}

async function generateReportComponent(
  tree: Tree,
  {
    directory,
    endpointsFile,
    featureNames,
    label,
    sourceFiles,
    project,
  }: NormalizedOptions,
) {
  const [reportEndpoint, reportEndpointName] = getEndpoint(
    endpointsFile,
    'Post',
  );
  const paramsType = query<Identifier>(
    reportEndpoint,
    'Parameter TypeReference > Identifier',
  )[1];

  const { dto, props } = parseType(
    findTypeDefinitionSourceFile(sourceFiles, paramsType),
    paramsType,
  );

  await generateFiles(tree, join(__dirname, 'files'), dirname(directory), {
    tpl: '',
    label,
    props,
    reportEndpointName,
    project,
    dto,
    ...featureNames,
  });
}
