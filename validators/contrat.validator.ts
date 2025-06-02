import { date, z } from "zod";

export const ContratValidator = z.object({
    dateDebut: z.string().datetime({ offset: true }),
    dateFin: z.string().datetime({ offset: true }),
    loyerMensuel: z.number().min(0, { message: "Le loyer doit être un nombre positif" }),
    typeContrat: z.string().min(1, { message: "Le type de contrat ne peut pas être vide" }),
})

export const ContratUpdateValidator = z.object({
    dateDebut: z.string().datetime({ offset: true }).optional(),
    dateFin: z.string().datetime({ offset: true }).optional(),
    loyerMensuel: z.number().min(0, { message: "Le loyer doit être un nombre positif" }).optional(),
    typeContrat: z.string().min(1, { message: "Le type de contrat ne peut pas être vide" }).optional(),
})