import prisma from "@/lib/prisma.config";

export async function VerifyIsAdmin(req: Request, id:string){
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        throw new Error("ID invalide ou manquant");
    }
    const user = await prisma.gestionnaire.findUnique({
        where: { id: Number(id) }
    });
    if (!user) {
        throw new Error("Utilisateur non identifié");
    }
    if(user.isAdmin !== true){
        throw new Error("Utilisateur non admin");
    }
    // Retourne directement l'objet user
    return user;
}