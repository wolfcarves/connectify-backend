import 'dotenv/config';

import type { Request, Response, Express } from 'express';
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
			title: 'Connectify Api',
			description: 'Connectify Api Description',
		},
		servers: [
			{
				url:
					process.env.NODE_ENV === 'production'
						? 'http://localhost:5000'
						: 'http://localhost:5000',
			},
		],
	};

	return generator.generateDocument(apiConfig);
};

export const writeDocumentation = (app: Express) => {
	const docs = getOpenAPIDocumentation();
	const fileContent = docs;

	app.get('/spec.json', (_req: Request, res: Response) => {
		res.status(200).json(fileContent);
	});

	fs.writeFileSync(
		`${process.cwd()}/src/docs/openapi-docs.json`,
		JSON.stringify(fileContent),
		{ encoding: 'utf-8' },
	);
};
