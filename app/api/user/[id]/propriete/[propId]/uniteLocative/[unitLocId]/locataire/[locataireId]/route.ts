import { VerifyUserSession } from "@/core/verifyUserSession";
import prisma from "@/lib/prisma.config";
import { LocataireUpdateValidator } from "@/validators/locataire.validator";
import { z } from "zod";

export async function GET(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string, locataireId: string }>  }) {
    const { id, propId, unitLocId, locataireId } = await params;
    const user = await VerifyUserSession(request, id);
    try {
        const locataire = await prisma.locataire.findUnique({
            where: { id: Number(locataireId), uniteLocativeId: Number(unitLocId) },
            include: { uniteLocative: true }
        });
        if (!locataire) {
            return new Response(JSON.stringify({ error: "Locataire non trouvé pour cette unité locative" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }
        return new Response(JSON.stringify({ message: "Locataire récupéré avec succès", data: locataire }),
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string, locataireId: string }>  }) {
    const { id, propId, unitLocId, locataireId } = await params;
    const user = await VerifyUserSession(request, id);
    try {
        // Vérification si l'unité locative existe
        const existingUnit = await prisma.locataire.findUnique({
            where: { id: Number(locataireId), uniteLocativeId: Number(unitLocId) }
        });
        if (!existingUnit) {
            return new Response(JSON.stringify({ error: "Locataire non trouvée" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }
        // Suppression de l'unité locative
        const unit = await prisma.locataire.delete({
            where: { id: Number(locataireId), uniteLocativeId: Number(unitLocId) }
        });

        return new Response(JSON.stringify({ message: "Locataire supprimé avec succès", data: unit }),
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string, locataireId: string }>  }) {
    const { id, propId, unitLocId, locataireId } = await params;
    const user = await VerifyUserSession(request, id);
    try {
        const data = await request.json();
        const validatedData = LocataireUpdateValidator.parse(data);
        // Vérification si le locataire existe
        const existingTenant = await prisma.locataire.findUnique({
            where: { id: Number(locataireId), uniteLocativeId: Number(unitLocId) }
        });
        if (!existingTenant) {
            return new Response(JSON.stringify({ error: "Locataire non trouvé" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }
        const updatedTenant = await prisma.locataire.update({
            where: { id: Number(locataireId), uniteLocativeId: Number(unitLocId) },
            data: validatedData
        });
        return new Response(JSON.stringify({ message: "Locataire mis à jour avec succès", data: updatedTenant }),
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