import express from 'express';
import { errorMiddleware } from './middlewares/error.middleware.js';
import healthRouter from './modules/HealthCheck/health.route.js';
import { appMiddleware } from './app.middleware.js';
import userRouter from './modules/user/user.route.js';
import adminRouter from './modules/admin/admin.route.js';

const app = express();

// apply app middleware
appMiddleware(app);

// app routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
// error middleware
app.use(errorMiddleware);

export default app;
