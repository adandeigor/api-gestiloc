import { z } from "zod";

export const auditLogCreateSchema = z.object({
  gestionnaireId: z.number(),
  action: z.string().min(1, "L'action est requise"),
  details: z.string().optional(),
  adminId: z.number().optional(),
  createdAt: z.date().optional(),
});
