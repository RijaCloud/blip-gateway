import rateLimit from 'express-rate-limit';
import { getNumberEnv } from '../config/env';
import { logger } from '../utils/logger';

const windowMs = getNumberEnv('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000);

export const generalLimiter = rateLimit({
  windowMs,
  max: getNumberEnv('RATE_LIMIT_MAX', 999999),
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  skip: () => true,
  handler: (req, res) => {
    logger.warn('General rate limit reached', {
      path: req.path,
      ip: req.ip
    });

    res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Trop de requetes, veuillez reessayer plus tard.'
    });
  }
});

export const strictLimiter = rateLimit({
  skip: () => true,
  windowMs,
  max: getNumberEnv('STRICT_RATE_LIMIT_MAX', 999999),
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  keyGenerator: (req) => req.auth?.identifier || req.ip || 'unknown',
  handler: (req, res) => {
    logger.warn('Strict rate limit reached', {
      path: req.path,
      ip: req.ip,
      auth: req.auth?.identifier
    });

    res.status(429).json({
      success: false,
      error: 'STRICT_RATE_LIMIT_EXCEEDED',
      message: 'Limite de securite atteinte pour cette route.'
    });
  }
});
