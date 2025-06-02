import { VerifyUserSession } from "@/core/verifyUserSession";
import prisma from "@/lib/prisma.config";
import { UniteLocativeValidator } from "@/validators/uniteLocative.validator";
import { z } from "zod";

export async function GET(request: Request, { params }: { params: Promise<{ id: string, propId: string }> }) {
    const { id, propId } = await params;
    const user = await VerifyUserSession(request, id);
    try {
        const uniteLocative = await prisma.uniteLocative.findMany({
            where: { proprieteId: Number(propId) },
            include: { propriete: true, locataires: true }
        });
        if (!uniteLocative) {
            return new Response(JSON.stringify({ error: "Aucune unité locative trouvée pour cette propriété" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }
        return new Response(JSON.stringify({ message: "Unité locative récupérée avec succès", data: uniteLocative }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string, propId: string }> }) {
    const { id, propId } = await params;
    const user = await VerifyUserSession(request, id);
    try {
        const data = await request.json();
        const validatedData = UniteLocativeValidator.parse(data);

        const newUnit = await prisma.uniteLocative.create({ data: { ...validatedData, proprieteId: Number(propId) } });
        await prisma.auditLog.create({
            data: {
                gestionnaireId: user.id,
                action: 'CREATION_UNITE_LOCATIVE',
                details: `Unité locative ${newUnit.nom} (ID: ${newUnit.id}) ajoutée à la propriété ID ${propId}`,
                adminId: user.isAdmin ? user.id : undefined,
                createdAt: new Date(),
            },
        });

        return new Response(JSON.stringify({ message: "L'unité locative a bien été créée", data: newUnit }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" }
            });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: error.issues }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}