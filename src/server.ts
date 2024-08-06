import 'dotenv/config';
import express from 'express';
import { renderRoutes, renderDocs } from '@/routes.ts';
import { writeDocumentation } from '@/utils/zodToOpenAPI.ts';
import cors from 'cors';
import logger from '@/utils/logger.ts';
import {
  zodErrorHandler,
  errorHandler,
  notFoundHandler,
} from './middleware/error.middleware.ts';

const app = express();
const port = process.env.PORT;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

renderRoutes(app);
writeDocumentation();
renderDocs(app);

app.use(zodErrorHandler);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is listening on port ${port}`);
});
