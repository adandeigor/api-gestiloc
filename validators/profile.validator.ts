import { z } from "zod";

export const ProfileValidator = z.object({
  ifu_number: z.string().min(1, "Le numéro de l'ifu  est requis"),
  carte_identite_number: z.string().min(1, "le numéro de la carte d'identité est requis"),
  ifu_file: z.string().min(1, "Le fichier de l'ifu est requis"),
  carte_identite_file: z.string().min(1, "Le fichier de la carte d'identité est requis"),
  nationalite: z.string().min(1, "La nationalité est requise"),
  adresse: z.string().min(1, "L'adresse est requise"),
  ville: z.string().min(1, "La ville est requise"),
  code_postal: z.string().min(1, "Le code postal est requis"),
  pays: z.string().min(1, "Le pays est requis"),
  date_naissance: z.coerce.date({ invalid_type_error: "Date de naissance invalide" }),
  role : z.enum(["GESTIONNAIRE", "PARTICULIER"]),
});

export const ProfileValidatorUpdate = z.object({
  ifu: z.string().optional().nullable(),
  carte_identite: z.string().optional().nullable(),
  nationalite: z.string().optional().nullable(),
  adresse: z.string().optional().nullable(),
  ville: z.string().optional().nullable(),
  code_postal: z.string().optional().nullable(),
  pays: z.string().optional().nullable(),
  date_naissance: z.coerce.date({ invalid_type_error: "Date de naissance invalide" }).optional().nullable(),
});
export type ProfileValidatorUpdateType = z.infer<typeof ProfileValidatorUpdate>;
export type ProfileValidatorType = z.infer<typeof ProfileValidator>;

