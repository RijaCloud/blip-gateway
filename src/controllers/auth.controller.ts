import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.schema';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Endpoint d'inscription (POST /register)
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validation du corps de la requête
      const payload = registerSchema.parse(req.body);

      // Appel du service d'inscription
      const user = await this.authService.register(payload);

      // Envoi de la réponse avec statut 201
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Endpoint de connexion (POST /login)
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validation du corps de la requête
      const payload = loginSchema.parse(req.body);

      // Appel du service de connexion
      const user = await this.authService.login(payload);

      // Envoi de la réponse avec statut 200
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };
}
