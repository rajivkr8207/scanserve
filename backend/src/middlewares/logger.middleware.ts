import type { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            requestId: req.headers['x-request-id'],
            ip: req.ip,
            userAgent: req.get('user-agent'),
        });
    });

    next();
};