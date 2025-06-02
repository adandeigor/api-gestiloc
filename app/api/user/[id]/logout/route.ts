import prisma from "@/lib/prisma.config";
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return Response.json({ error: "ID manquant" }, { status: 400 });
  }
  if (isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return Response.json({ error: "ID invalide" }, { status: 400 });
  }
  try {
    const user = await prisma.gestionnaire.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      return Response.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }
    // Vérifie si l'utilisateur est déjà déconnecté
    const session = await prisma.session.findUnique({
      where: {
        gestionnaireId: user.id,
      },
    });
    if (!session) {
      return Response.json({ error: "Utilisateur déjà déconnecté" }, { status: 400 });
    }

  
    await prisma.session.deleteMany({
      where: {
        gestionnaireId: user.id,
      },
    });

    return Response.json({ message: "Déconnexion réussie, token invalidé" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Erreur serveur", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
