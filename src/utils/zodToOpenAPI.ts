import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import * as fs from 'fs';

const registry = new OpenAPIRegistry();

const getOpenAPIDocumentation = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Todo List Api',
      description: 'Todo List Api Description',
    },
    servers: [{ url: 'v1' }],
  });
};

export const writeDocumentation = () => {
  const docs = getOpenAPIDocumentation();
  const fileContent = JSON.stringify(docs);

  fs.writeFileSync(`${process.cwd()}/src/docs/openapi-docs.json`, fileContent, {
    encoding: 'utf-8',
  });
};
