import { join } from 'node:path';

import { type Tree, generateFiles, formatFiles } from '@nx/devkit';

import {
  addMenuItem,
  getEndpoint,
  getEndpointResponseType,
  normalizeOptions,
} from '../utils/codegen';

import type { NormalizedOptions } from '../utils/codegen';

type Options = {
  endpoints: string;
  path: string;
  label: string;
  project: string;
};

export default async function (tree: Tree, options: Options) {
  const normalizedOptions = normalizeOptions(tree, options);
  const [, deleteEndpointName] = getEndpoint(
    normalizedOptions.endpointsFile,
    'Delete',
  );

  await generateListComponents(tree, normalizedOptions, deleteEndpointName);
  await generateItemComponents(tree, normalizedOptions, deleteEndpointName);

  await generateFiles(
    tree,
    join(__dirname, 'files/routes'),
    normalizedOptions.directory,
    {
      tpl: '',
      ...normalizedOptions.featureNames,
    },
  );
  // TODO
  // await addMenuItem(tree, normalizedOptions);
  await formatFiles(tree);
}

async function generateListComponents(
  tree: Tree,
  {
    directory,
    endpointsFile,
    featureNames,
    label,
    sourceFiles,
    project,
  }: NormalizedOptions,
  deleteEndpointName: string,
) {
  const [searchEndpoint, searchEndpointName] = getEndpoint(
    endpointsFile,
    'SearchGet',
  );
  const { dto, props } = getEndpointResponseType(searchEndpoint, sourceFiles);

  await generateFiles(tree, join(__dirname, 'files/list'), directory, {
    tpl: '',
    label,
    props,
    searchEndpointName,
    deleteEndpointName,
    project,
    dto,
    ...featureNames,
  });
}

async function generateItemComponents(
  tree: Tree,
  {
    directory,
    endpointsFile,
    featureNames,
    label,
    sourceFiles,
    project,
  }: NormalizedOptions,
  deleteEndpointName: string,
) {
  const [findEndpoint, findEndpointName] = getEndpoint(endpointsFile, 'IdGet');
  const { dto, props } = getEndpointResponseType(findEndpoint, sourceFiles);
  const [, createEndpointName] = getEndpoint(endpointsFile, 'Post');
  const [, updateEndpointName] = getEndpoint(endpointsFile, 'IdPut');

  await generateFiles(tree, join(__dirname, 'files/item'), directory, {
    tpl: '',
    label,
    props,
    findEndpointName,
    createEndpointName,
    updateEndpointName,
    deleteEndpointName,
    project,
    dto,
    ...featureNames,
  });
}
