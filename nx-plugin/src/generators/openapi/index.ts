import { join } from 'path';

import { formatFiles, generateFiles, names } from '@nx/devkit';
import * as $RefParser from 'json-schema-ref-parser';
import { NgOpenApiGen } from 'ng-openapi-gen';

import { generateBarrel } from '../utils/generate-barrel';

import type { OpenAPIObject } from '@loopback/openapi-v3-types';
import type { Tree } from '@nx/devkit';

type Options = {
  schema: string;
  deleteExisting: boolean;
  endpointsPath: string;
  dtoPath: string;
};

export default async function (
  tree: Tree,
  { schema, deleteExisting, dtoPath, endpointsPath }: Options,
) {
  const openApi = (await $RefParser.bundle(schema, {
    dereference: { circular: false },
  })) as OpenAPIObject;
  const ngOpenApiGen = new NgOpenApiGen(openApi, {
    input: schema,
    ignoreUnusedModels: false,
    silent: true,
  });

  await generateFilesForModels(
    tree,
    deleteExisting,
    ngOpenApiGen.models,
    dtoPath,
  );
  await generateFilesForServices(
    tree,
    deleteExisting,
    ngOpenApiGen.services,
    endpointsPath,
  );
  await formatFiles(tree);
}

async function generateFilesForModels(
  tree: Tree,
  deleteExisting: boolean,
  models: NgOpenApiGen['models'],
  path: string,
) {
  if (deleteExisting) {
    rmrf(tree, path);
  }

  for (const [name, model] of models) {
    const modelNames = names(name);
    const templateFile = `files/${model.isEnum ? 'enum' : 'type'}`;

    if (model.properties) {
      for (const property of model.properties) {
        if (property.type === 'DateOnly') {
          property.type = 'string; // DateOnly';
        }
      }
    }

    model.imports = model.imports.filter(
      (value) => value.typeName !== 'DateOnly',
    );

    await generateFiles(tree, join(__dirname, templateFile), path, {
      tpl: '',
      ...model,
      ...modelNames,
    });
  }

  generateBarrel(tree, path);
}

async function generateFilesForServices(
  tree: Tree,
  deleteExisting: boolean,
  services: NgOpenApiGen['services'],
  path: string,
) {
  if (deleteExisting) {
    rmrf(tree, path);
  }

  for (const [name, service] of services) {
    const serviceNames = names(`${name}Endpoints`);

    generateFiles(tree, join(__dirname, 'files/endpoints'), path, {
      tpl: '',
      ...service,
      ...serviceNames,
    });
  }

  generateBarrel(tree, path);
}

async function rmrf(tree: Tree, path: string) {
  for (const file of tree.children(path)) {
    tree.delete(`${path}/${file}`);
  }
}
