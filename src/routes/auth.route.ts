import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { strictLimiter } from '../middleware/rateLimit';

const router = Router();
const controller = new AuthController();

// Applique le rate limiter strict pour prévenir les attaques par force brute
router.post('/register', strictLimiter, controller.register);
router.post('/login', strictLimiter, controller.login);

export default router;
