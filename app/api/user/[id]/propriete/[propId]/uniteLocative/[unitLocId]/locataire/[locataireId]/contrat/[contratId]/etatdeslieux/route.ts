import { VerifyUserSession } from "@/core/verifyUserSession";
import prisma from "@/lib/prisma.config";
import { z } from "zod";

const Details = z.record(z.string(), z.string());

const EtatDesLieuxValidator = z.object({
    type: z.enum(["ENTREE", "SORTIE"], { message: "Le type d'état des lieux doit être 'ENTREE' ou 'SORTIE'" }),
    date: z.string().datetime({ message: "La date doit avoir le format ISO 8601" }),
    details: Details,
})
export async function GET(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string, locataireId: string, contratId: string }> }) {
    const { id, propId, unitLocId, locataireId, contratId } = await params;
    const user = await VerifyUserSession(request, id);
    try {
        const etatDesLieux = await prisma.etatDesLieux.findMany({
            where: {
                contratId: Number(contratId),
            },
            include: {
                contrat: true,
            },
        });

        if (!etatDesLieux || etatDesLieux.length === 0) {
            return new Response(JSON.stringify({ error: "Aucun état des lieux trouvé pour ce contrat" }), { status: 404 });
        }
        return new Response(JSON.stringify(etatDesLieux), { status: 200 });
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
    const validatedData = EtatDesLieuxValidator.parse(body);
    try {
        //verification de la présence du contrat
        const existingContrat = await prisma.contrat.findUnique({
            where: {
                id: Number(contratId),
                uniteLocativeId: Number(unitLocId),
                locataireId: Number(locataireId),
            },
        });

        if (!existingContrat) {
            return new Response(JSON.stringify({ error: "Contrat non trouvé" }), { status: 404 });
        }

        //IL doit avoir un seul état des lieux pour un contrat
        const existingEtatDesLieux = await prisma.etatDesLieux.findFirst({
            where: {
                contratId: Number(contratId),
                type: validatedData.type, // On vérifie le type pour éviter les doublons
            },
        });
        if (existingEtatDesLieux) {
            return new Response(JSON.stringify({ error: "Un état des lieux existe déjà pour ce contrat" }), { status: 400 });
        }
        // Création de l'état des lieux
        // Si le contrat existe, on peut créer l'état des lieux
        const etatDesLieux = await prisma.etatDesLieux.create({
            data: {
                ...validatedData,
                contratId: Number(contratId),
            },
        });
        await prisma.auditLog.create({
            data: {
                gestionnaireId: user.id,
                action: 'CREATION_ETAT_DES_LIEUX',
                details: `Etat des lieux (ID: ${etatDesLieux.id}) créé pour le contrat ID ${etatDesLieux.contratId}`,
                adminId: user.isAdmin ? user.id : undefined,
                createdAt: new Date(),
            },
        });
        return new Response(JSON.stringify(etatDesLieux), { status: 201 });
    } catch (error: any) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: error.issues }), { status: 400 });
        }
        if (error.code === 'P2002') {
            return new Response(JSON.stringify({ error: "Un état des lieux de ce type existe déjà pour ce contrat" }), { status: 400 });
        }
        return new Response(JSON.stringify({ error: "Une erreur inconnue est survenue" }), { status: 500 });
    }
}

