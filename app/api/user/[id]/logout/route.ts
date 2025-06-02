import prisma from "@/lib/prisma.config";
import jwt from "jsonwebtoken";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
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
  } catch (error: any) {
    return Response.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}
