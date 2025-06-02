import { z as zod } from 'zod';

export const RegisterValidator = zod.object({
  nom: zod.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }).max(50, { message: 'Le nom ne peut pas dépasser 50 caractères' }),
  prenom: zod.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }).max(50, { message: 'Le prénom ne peut pas dépasser 50 caractères' }).optional(),
  email: zod.string().email({ message: "L'email n'est pas valide" }).max(100, { message: "L'email ne peut pas dépasser 100 caractères" }),
  motDePasse: zod
    .string()
    .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une lettre minuscule' })
    .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une lettre majuscule' })
    .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
    .max(100, { message: 'Le mot de passe ne peut pas dépasser 100 caractères' }),
  telephone: zod
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Le numéro de téléphone n’est pas valide' })
    .optional(),
});

export const LoginValidator = zod.object({
  email: zod.string().email({ message: "L'email n'est pas valide" }).max(100, { message: "L'email ne peut pas dépasser 100 caractères" }),
  motDePasse: zod.string().min(1, { message: 'Le mot de passe est requis' }),
});

export type RegisterValidatorType = zod.infer<typeof RegisterValidator>;
export type LoginValidatorType = zod.infer<typeof LoginValidator>;