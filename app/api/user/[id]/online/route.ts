import { VerifyUserSession } from "@/core/verifyUserSession";
import prisma from "@/lib/prisma.config";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return Response.json({ error: "ID invalide ou manquant" }, { status: 400 });
    }
    await VerifyUserSession(req, id)
    try {
        const user = await prisma.session.findUnique({
            where: {
                gestionnaireId: Number(id),
            },
        });
        if (!user) {
            return Response.json({ error: "Utilisateur non connecté", online: false }, { status: 404 });
        }
        return Response.json({ online: true }, { status: 200 });
    } catch (error) {
        return Response.json({ error: error }, { status: 500 });
    }
}