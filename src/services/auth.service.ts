import bcrypt from 'bcrypt';
import { UserModel, UserDocument } from '../models/user.model';
import { HttpError } from '../utils/httpError';
import type { RegisterInput, LoginInput } from '../validators/auth.schema';

export class AuthService {
  /**
   * Enregistre un nouvel utilisateur.
   * Centralise la logique d'unicité et de création.
   */
  async register(payload: RegisterInput): Promise<Omit<UserDocument, 'password'>> {
    // Vérification d'unicité de l'email en lecture optimisée avec lean
    const existingUser = await UserModel.findOne({ email: payload.email }).lean();
    if (existingUser) {
      throw new HttpError(409, 'Cette adresse email est déjà utilisée.', 'EMAIL_ALREADY_EXISTS');
    }

    // Création de l'utilisateur (le hook pre-save se charge de hacher le mot de passe)
    const user = await UserModel.create(payload);
    
    // Conversion en objet simple et retrait du mot de passe pour la réponse
    const userObj = user.toObject();
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  }

  /**
   * Connecte un utilisateur et valide ses identifiants.
   * Utilise .lean() pour économiser la RAM et accélérer le traitement.
   */
  async login(payload: LoginInput): Promise<Omit<UserDocument, 'password'>> {
    // Lecture optimisée en lecture seule
    const user = await UserModel.findOne({ email: payload.email }).lean();
    if (!user) {
      throw new HttpError(401, 'Identifiants invalides.', 'INVALID_CREDENTIALS');
    }

    // Comparaison asynchrone du mot de passe pour ne pas bloquer le thread principal Node.js
    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(401, 'Identifiants invalides.', 'INVALID_CREDENTIALS');
    }

    // Retrait du mot de passe
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
