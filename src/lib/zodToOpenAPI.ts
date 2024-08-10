import {
	OpenAPIRegistry,
	OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import type { OpenAPIObjectConfig } from '@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator.js';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import * as fs from 'fs';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

const getOpenAPIDocumentation = () => {
	const generator = new OpenApiGeneratorV3(registry.definitions);

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

export const writeDocumentation = () => {
	const docs = getOpenAPIDocumentation();
	const fileContent = JSON.stringify(docs);

	fs.writeFileSync(
		`${process.cwd()}/src/docs/openapi-docs.json`,
		fileContent,
		{
			encoding: 'utf-8',
		},
	);
};
