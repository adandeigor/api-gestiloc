import prisma from "@/lib/prisma.config";

export async function GET(req: Request, {params}: {params: Promise<{id: string}>}) {
    const { id } = await params;
    if (!id) {
        return Response.json({ error: "ID manquant" }, { status: 400 });
    }
    if (isNaN(parseInt(id))) {
        return Response.json({ error: "ID invalide" }, { status: 400 });
    }
    if (parseInt(id) <= 0) {
        return Response.json({ error: "ID invalide" }, { status: 400 });
    }
    try {
        const user = await prisma.dossierGestionnaire.findUnique({
            where: {
                gestionnaireId: Number(id),
            }
        });
        if (!user) {
            return Response.json({ complete: false }, { status: 404 });
        } else {
            return Response.json({ complete: true }, { status: 200 });  
        }
    } catch (error) {
        return Response.json({ error: error }, { status: 500 });
    }
}