import 'dotenv/config';
import express from 'express';
import { renderRoutes, renderDocs } from '@/routes.ts';
import { writeDocumentation } from '@/utils/zodToOpenAPI.ts';
import cors from 'cors';
import logger from '@/utils/logger.ts';

const app = express();
const port = process.env.PORT;

//middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  renderRoutes(app);
  writeDocumentation();
  renderDocs(app);

  logger.info(`Server is listening on port ${port}`);
});
