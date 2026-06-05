import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères.')
    .max(50, 'Le nom ne doit pas dépasser 50 caractères.'),
  email: z
    .string()
    .trim()
    .min(1, 'L\'adresse email est requise.')
    .email('Format de l\'adresse email invalide.')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères.')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères.')
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'L\'adresse email est requise.')
    .email('Format de l\'adresse email invalide.')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis.')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
