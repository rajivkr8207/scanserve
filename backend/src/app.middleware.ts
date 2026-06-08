import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { loggingMiddleware } from './middlewares/logger.middleware.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5000, // Increased limit for local development hot-reloading
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

const blockUnwantedRequests = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const unwantedPaths = ['.env', '.git', 'wp-admin', 'phpmyadmin'];
  if (unwantedPaths.some((path) => req.url.includes(path))) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

export const appMiddleware = (app: express.Application) => {
  // CORS MUST be first so that all responses (even errors like 429) get CORS headers
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],
      methods: ["POST", "PUT", "GET", "DELETE", "PATCH"],
      credentials: true,
    }),
  );

  app.use(loggingMiddleware);
  app.use(helmet());
  app.use(limiter);
  app.use(blockUnwantedRequests);
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true, limit: '16kb' }));
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(compression());
};
