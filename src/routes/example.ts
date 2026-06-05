import { Router } from 'express';
import { z } from 'zod';
import { requireApiKey } from '../middleware/auth';
import { strictLimiter } from '../middleware/rateLimit';

const router = Router();

router.get('/public-ping', (_req, res) => {
  res.json({
    success: true,
    message: 'pong'
  });
});

router.post('/protected-echo', requireApiKey, strictLimiter, (req, res, next) => {
  try {
    const payload = z.object({
      message: z.string().min(1).max(500)
    }).parse(req.body);

    res.json({
      success: true,
      auth: req.auth,
      echo: payload.message
    });
  } catch (error) {
    next(error);
  }
});

export default router;
