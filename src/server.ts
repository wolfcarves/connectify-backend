import 'dotenv/config';
import express from 'express';
import { renderRoutes, renderDocs } from './routes.ts';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';
import { writeDocumentation } from './utils/zodToOpenAPI.ts';

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
  extendZodWithOpenApi(z);
  renderRoutes(app);
  writeDocumentation();
  renderDocs(app);

  console.log(`Server is listening on port ${port}`);
});
