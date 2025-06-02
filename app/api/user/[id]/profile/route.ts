import { VerifyUserSession } from "@/core/verifyUserSession";
import prisma from "@/lib/prisma.config";
import { ProfileValidator } from "@/validators/profile.validator";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";



export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return Response.json({ error: "ID invalide ou manquant" }, { status: 400 });
  }
  await VerifyUserSession(req, id);

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
  } catch (error) {
    console.error("Erreur dans /profile :", error);
    return Response.json(
      { error: "Erreur serveur", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

