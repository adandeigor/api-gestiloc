import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

  /**
   * @description Upload a file to the `gestionnaire` bucket.
   * @param {NextRequest} req The request object.
   * @returns {NextResponse} The response object.
   * @throws {Error} If there is an error while uploading the file.
   */
export async function POST(req: NextRequest) {
  try {
    // Récupère le form-data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;

    if (!file || !folder) {
      return NextResponse.json({ error: 'Fichier ou dossier manquant.' }, { status: 400 });
    }

    // Chemin complet dans le bucket
    const filePath = `${folder}/${file.name}`;

    // Upload dans le bucket 'gestionnaire'
    const { data, error } = await supabase.storage
      .from('gestionnaire')
      .upload(filePath, file.stream(), {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ path: data.path }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}