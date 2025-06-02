import { VerifyUserSession } from "@/core/verifyUserSession";
import prisma from "@/lib/prisma.config";
import { z } from "zod";

const AvenantValidator = z.object({
    titre: z.string().min(1, { message: "Le titre de l'avenant ne peut pas être vide" }),
    contenu: z.string().min(1, { message: "Le contenu de l'avenant ne peut pas être vide" }),
    documentUrl: z.array(z.string().url(), { message: "Chaque document doit être une URL valide" }).optional(),
});
export async function GET(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string, locataireId: string, contratId: string }> }) {
    const { id, propId, unitLocId, locataireId, contratId } = await params;
    const user = await VerifyUserSession(request, id);
    try {
        const avenant = await prisma.avenant.findMany({
            where: {
                contratId: Number(contratId),
            },
            include: {
                contrat: true,
            },
        });

        if (!avenant || avenant.length === 0) {
            return new Response(JSON.stringify({ error: "Aucun avenant trouvé pour ce contrat" }), { status: 404 });
        }
        return new Response(JSON.stringify(avenant), { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        return new Response(JSON.stringify({ error: "Une erreur inconnue est survenue" }), { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string, locataireId: string, contratId: string }> }) {
    const { id, propId, unitLocId, locataireId, contratId } = await params;
    const user = await VerifyUserSession(request, id);
    const body = await request.json();
    const validatedData = AvenantValidator.parse(body);
    try {
        const avenant = await prisma.avenant.create({
            data: {
                ...validatedData,
                contratId: Number(contratId),
            },
        });
        await prisma.auditLog.create({
            data: {
                gestionnaireId: user.id,
                action: 'CREATION_AVENANT',
                details: `Avenant (ID: ${avenant.id}) créé pour le contrat ID ${contratId}`,
                adminId: user.isAdmin ? user.id : undefined,
                createdAt: new Date(),
            },
        });
        return new Response(JSON.stringify(avenant), { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: error.issues }), { status: 400 });
        }
        return new Response(JSON.stringify({ error: "Une erreur inconnue est survenue" }), { status: 500 });
    }
}

