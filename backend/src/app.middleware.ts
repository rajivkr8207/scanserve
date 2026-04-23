import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
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
  app.use(helmet());
  app.use(limiter);
  app.use(blockUnwantedRequests);
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true, limit: '16kb' }));
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(compression());
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    }),
  );
};
