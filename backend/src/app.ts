import express from 'express';
import { errorMiddleware } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import healthRouter from './modules/HealthCheck/health.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/health', healthRouter);

app.use(errorMiddleware);
export default app;
