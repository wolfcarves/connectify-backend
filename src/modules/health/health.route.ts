import express from 'express';
import { healthcheck } from './health.controller';

const HealthRouter = express.Router();

HealthRouter.get('/check', healthcheck);

export default HealthRouter;
