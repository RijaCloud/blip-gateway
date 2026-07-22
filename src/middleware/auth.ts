import type { NextFunction, Response } from 'express';
import { getRequiredEnv } from '../config/env';
import type { AppRequest } from '../types/request';
import { HttpError } from '../utils/httpError';

const getExpectedApiKey = () => getRequiredEnv('API_KEY');

export const requireApiKey = (req: AppRequest, _res: Response, next: NextFunction) => {
  const providedApiKey = req.get('X-API-Key') || req.get('X-Admin-API-Key');

  if (!providedApiKey) {
    next(new HttpError(401, 'Cle API requise.', 'API_KEY_REQUIRED'));
    return;
  }

  const expectedApiKey = getExpectedApiKey();
  if (providedApiKey !== expectedApiKey) {
    next(new HttpError(403, 'Cle API invalide.', 'API_KEY_INVALID'));
    return;
  }

  req.auth = {
    type: 'api-key',
    identifier: 'service'
  };

  next();
};
