import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT;

const bootstrap = async () => {
  app.listen(port, () => console.log(`Server is listening on port ${port}`));
};

await bootstrap();
