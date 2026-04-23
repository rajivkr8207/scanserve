import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ENV } from '../config/env.js';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    error = new ApiError(
      error.statusCode || 500,
      error.message || 'Internal Server Error',
      error.errors || [],
    );
  }

  res.status(error.statusCode).json({
    success: error.success,
    message: error.message,
    errors: error.errors,
    stack: ENV.NODE_ENV === 'development' ? error.stack : undefined,
  });
};
