import prisma from "@/lib/prisma.config";
 
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = parseInt(id);
 
  // Validation simplifiée de l'ID
  if (!id || isNaN(userId) || userId <= 0) {
    return Response.json({ error: "ID invalide ou manquant" }, { status: 400 });
  }
 
  try {
    const user = await prisma.dossierGestionnaire.findUnique({
      where: {
        gestionnaireId: userId,
      },
    });
 
    return Response.json(
      { complete: !!user },
      { status: user ? 200 : 404 }
    );
  } catch (error) {
    console.error(`[API] Erreur lors de la vérification du profil pour l'ID ${userId}:`, error);
    return Response.json(
      { error: "Erreur serveur lors de la vérification du profil" },
      { status: 500 }
    );
  }
}