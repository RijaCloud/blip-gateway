import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  req.requestStartTime = Date.now();

  res.on('finish', () => {
    logger.info('HTTP request completed', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - (req.requestStartTime || Date.now()),
      ip: req.ip
    });
  });

  next();
};
