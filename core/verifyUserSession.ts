import prisma from "@/lib/prisma.config";
import jwt from "jsonwebtoken";

export async function VerifyUserSession(req: Request, id: string) {
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        throw new Error("ID invalide ou manquant");
    }
    const user = await prisma.gestionnaire.findUnique({
        where: { id: Number(id) }
    });
    if (!user) {
        throw new Error("Utilisateur non trouvé");
    }
    const session = await prisma.session.findUnique({
        where: { gestionnaireId: user.id }
    });
    if (!session) {
        throw new Error("Utilisateur déjà déconnecté");
    }
    // Retourne directement l'objet user
    return user;
}