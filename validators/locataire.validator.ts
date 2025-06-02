import { z } from "zod";

export const LocataireValidator = z.object({
    nom: z.string().min(1, "Le nom du locataire est requis"),
    prenom: z.string().min(1, "Le prénom du locataire est requis"),
    email: z.string().email("L'email doit être valide").min(1, "L'email du locataire est requis"),
    telephone: z.string().min(1, "Le numéro de téléphone du locataire est requis"),
    carte_identite: z.string().min(1, "La carte d'identité du locataire est requise"),
    photo_identite: z.string({ required_error: "La photo d'identité du locataire est requise"}).optional().nullable()
});

export const LocataireUpdateValidator = z.object({
    nom: z.string().optional(),
    prenom: z.string().optional(),
    email: z.string().email("L'email doit être valide").optional(),
    telephone: z.string().optional(),
    carte_identite: z.string().optional(),
    photo_identite: z.string().optional().nullable()
});
export type LocataireValidatorType = z.infer<typeof LocataireValidator>;
export type LocataireUpdateValidatorType = z.infer<typeof LocataireUpdateValidator>;