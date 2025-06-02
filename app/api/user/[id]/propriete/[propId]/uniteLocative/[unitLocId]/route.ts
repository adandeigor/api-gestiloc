import { VerifyUserSession } from "@/core/verifyUserSession";
import prisma from "@/lib/prisma.config";
import { UniteLocativeUpdateValidator } from "@/validators/uniteLocative.validator";
import { z } from "zod";

export async function GET(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string }> }) {
    const { id, propId, unitLocId } = await params;
     await VerifyUserSession(request, id);
    try {
        const uniteLocative = await prisma.uniteLocative.findUnique({
            where: { id: Number(unitLocId), proprieteId: Number(propId) },
            include: { propriete: true }
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
        return new Response(JSON.stringify({ error: "Erreur interne du serveur" , details: error}), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string }> }) {
    const { id, propId, unitLocId } = await params;
     await VerifyUserSession(request, id);
    try {
        // Vérification si l'unité locative existe
        const existingUnit = await prisma.uniteLocative.findUnique({
            where: { id: Number(unitLocId), proprieteId: Number(propId) }
        });
        if (!existingUnit) {
            return new Response(JSON.stringify({ error: "Unité locative non trouvée" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }
        // Suppression de l'unité locative
        const unit = await prisma.uniteLocative.delete({
            where: { id: Number(unitLocId), proprieteId: Number(propId) }
        });

        return new Response(JSON.stringify({ message: "Unité locative supprimée avec succès", data: unit }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur interne du serveur" , details: error}), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string }> }) {
    const { id, propId, unitLocId } = await params;
     await VerifyUserSession(request, id);
    try {
        const data = await request.json();
        const validatedData = UniteLocativeUpdateValidator.parse(data);

        const updatedUnit = await prisma.uniteLocative.update({
            where: { id: Number(unitLocId), proprieteId: Number(propId) },
            data: validatedData
        });

        return new Response(JSON.stringify({ message: "L'unité locative a bien été mise à jour", data: updatedUnit }),
            {
                status: 200,
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