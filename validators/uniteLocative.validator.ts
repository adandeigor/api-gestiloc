import { z } from "zod";

export const UniteLocativeValidator = z.object({
    nom: z.string().min(1, "Le nom de l'unité locative est requis"),
    description: z.string().min(1, "La description de l'unité locative est requise"),
    prix: z.number().min(0, "Le prix de l'unité locative doit être supérieur ou égal à 0"),
})

export const UniteLocativeUpdateValidator = z.object({
    nom: z.string().optional(),
    description: z.string().optional(),
    prix: z.number().optional(),
});