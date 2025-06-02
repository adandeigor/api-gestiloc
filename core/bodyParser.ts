import { z } from "zod";

const mediaSchema = z
  .object({
    file: z.any().optional(),
    url: z.string().url('URL invalide').optional(),
    type: z.string().optional(),
  })
  .refine((data) => data.file || data.url, {
    message: 'Un fichier ou une URL doit être fourni',
  });

export type MediaInput = z.infer<typeof mediaSchema>;

