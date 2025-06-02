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

export async function parseFormData(formData: FormData): Promise<Record<string, any>> {
  const data: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    // Vérifier si la valeur est un fichier (objet avec un type MIME)
    if (typeof value === 'object' && value && 'type' in value && value.type.startsWith('image/')) {
      const fileData: MediaInput = {
        file: value,
        type: value.type,
      };

      // Gérer les fichiers multiples
      if (key in data) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(fileData);
      } else {
        data[key] = fileData;
      }
    } else {
      // Traiter les champs texte (pas besoin de JSON.parse pour des chaînes simples)
      data[key] = value;
    }
  }

  console.log('Parsed data:', data);
  return data;
}
