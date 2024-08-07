import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { OpenAPIObjectConfig } from '@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator.js';
import * as fs from 'fs';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

const generator = new OpenApiGeneratorV3(registry.definitions);

const getOpenAPIDocumentation = () => {
	const apiConfig: OpenAPIObjectConfig = {
		openapi: '3.0.0',
		info: {
			version: '1.0.0',
			title: 'Todo List Api',
			description: 'Todo List Api Description',
		},
		servers: [{ url: 'v1' }],
	};

	return generator.generateDocument(apiConfig);
};

export const generateComponents = () => {
	return generator.generateComponents();
};

export const writeDocumentation = () => {
	const docs = getOpenAPIDocumentation();
	const fileContent = JSON.stringify(docs);

	fs.writeFileSync(`${process.cwd()}/src/docs/openapi-docs.json`, fileContent, {
		encoding: 'utf-8',
	});
};
