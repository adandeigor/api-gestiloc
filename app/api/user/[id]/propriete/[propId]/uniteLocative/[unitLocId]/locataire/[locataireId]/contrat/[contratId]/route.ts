import prisma from "@/lib/prisma.config";
import { ContratUpdateValidator } from "@/validators/contrat.validator";

export async function GET(request: Request, { params }: { params: Promise<{ id: string, propId: string , unitLocId: string, locataireId: string}> }) {
    const { id, propId, unitLocId, locataireId } = await params;
    try {
        const contrats = await prisma.contrat.findMany({
            where: {
                uniteLocativeId: Number(unitLocId),
                locataireId: Number(locataireId),
            },
            include: {
                uniteLocative: true,
                locataire: true,
            },
        });
        return new Response(JSON.stringify(contrats), { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        return new Response(JSON.stringify({ error: "Une erreur inconnue est survenue" }), { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string, locataireId: string, contratId: string }> }) {
    const { id, propId, unitLocId, locataireId, contratId } = await params;
    try {
        // Vérification de la présence du contrat
        const existingContrat = await prisma.contrat.findUnique({
            where: {
                id: Number(contratId),
                uniteLocativeId: Number(unitLocId),
                locataireId: Number(locataireId),
            },
        })
        if (!existingContrat) {
            return new Response(JSON.stringify({ error: "Contrat non trouvé" }), { status: 404 });
        }
        // Suppression du contrat
        const contrat = await prisma.contrat.delete({
            where: {
                id: Number(contratId),
                uniteLocativeId: Number(unitLocId),
                locataireId: Number(locataireId),
            },
        });
        return new Response(JSON.stringify(contrat), { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        return new Response(JSON.stringify({ error: "Une erreur inconnue est survenue" }), { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string, locataireId: string, contratId: string }> }) {
    const { id, propId, unitLocId, locataireId, contratId } = await params;
    const body = await request.json();

    try {
        const validatedData = ContratUpdateValidator.parse(body);
        // Vérification de la présence du contrat
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
        //vérifier si le contrat est vérouillé
        if (existingContrat.isLocked) {
            return new Response(JSON.stringify({ error: "Le contrat est vérouillé et ne peut pas être modifié" }), { status: 403 });
        }
        // Mise à jour du contrat
        const updatedContrat = await prisma.contrat.update({
            where: {
                id: Number(contratId),
                uniteLocativeId: Number(unitLocId),
                locataireId: Number(locataireId),
            },
            data: validatedData,
        });
        return new Response(JSON.stringify(updatedContrat), { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        return new Response(JSON.stringify({ error: "Une erreur inconnue est survenue" }), { status: 500 });
    }
}