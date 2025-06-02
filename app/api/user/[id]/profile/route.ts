import { parseFormData } from "@/core/bodyParser";
import { VerifyUserSession } from "@/core/verifyUserSession";
import prisma from "@/lib/prisma.config";
import { ProfileValidator } from "@/validators/profile.validator";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadToSupabase(file: File | null, folder: string, userId: string) {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const filePath = `${folder}/${userId}_${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from("gestionnaire")
    .upload(filePath, file.stream(), {
      contentType: file.type,
      upsert: true,
    });
  if (error) throw new Error(error.message);
  // Génère l'URL publique
  const { data: publicUrlData } = supabase.storage.from("gestionnaire").getPublicUrl(filePath);
  return publicUrlData.publicUrl;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return Response.json({ error: "ID invalide ou manquant" }, { status: 400 });
  }
  const user = await VerifyUserSession(req, id);

  try {
    console.log("Début du handler profile");

    const data = await req.json()
    const validateData = ProfileValidator.safeParse(data);

   
    if (!validateData.success) {
      return Response.json(
        { error: validateData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.log("Validation OK :", validateData.data);

    // Insertion en base de données
    const result = await prisma.dossierGestionnaire.create({
      data: { ...validateData.data, gestionnaireId: Number(id) },
    });
    console.log("Insertion OK :", result);

    return Response.json({ message: "Profil mis à jour avec succès" }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur dans /profile :", error);
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}

