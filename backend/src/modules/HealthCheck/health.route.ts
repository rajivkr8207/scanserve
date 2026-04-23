import express from 'express';
import { healthCheck } from './health.controller.js';

const healthRouter = express.Router();

healthRouter.get('/', healthCheck);

export default healthRouter;
