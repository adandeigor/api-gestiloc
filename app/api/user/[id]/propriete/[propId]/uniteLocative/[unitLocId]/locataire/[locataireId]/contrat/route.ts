import { VerifyUserSession } from "@/core/verifyUserSession";
import prisma from "@/lib/prisma.config";
import { ContratValidator } from "@/validators/contrat.validator";
import { z } from "zod";

export async function POST(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string, locataireId: string }> }) {
    const { id, unitLocId, locataireId } = await params;
    const body = await request.json();
    const user = await VerifyUserSession(request, id);
    const validatedData = ContratValidator.parse(body);
    try {
        const contrat = await prisma.contrat.create({
            data: {
                ...validatedData,
                uniteLocativeId: Number(unitLocId),
                locataireId: Number(locataireId),
            }
        });
        await prisma.auditLog.create({
            data: {
                gestionnaireId: user.id,
                action: 'CREATION_CONTRAT',
                details: `Contrat (ID: ${contrat.id}) créé pour le locataire ID ${contrat.locataireId}`,
                adminId: user.isAdmin ? user.id : undefined,
                createdAt: new Date(),
            },
        });
        return new Response(JSON.stringify(contrat), { status: 201 });
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

export async function GET(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string, locataireId: string }> }) {
    const { id, unitLocId, locataireId } = await params;
    await VerifyUserSession(request, id);
    try {
        const contrats = await prisma.contrat.findMany({
            where: {
                uniteLocativeId: Number(unitLocId),
                locataireId: Number(locataireId),
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
