import { VerifyUserSession } from "@/core/verifyUserSession";
import prisma from "@/lib/prisma.config";
import { LocataireValidator } from "@/validators/locataire.validator";
import { z } from "zod";

export async function POST(request: Request, { params }: { params: Promise<{ id: string, propId: string, unitLocId: string }> }) {
    const { id, propId, unitLocId } = await params;
    const user = await VerifyUserSession(request, id);
    try {
        const data = await request.json()
        const validatedData = LocataireValidator.parse(data);
        //verifier si le local est occupé
        const existingTenant = await prisma.locataire.findUnique({
            where: { uniteLocativeId: Number(unitLocId) }
        })
        if (existingTenant) {
            return new Response(JSON.stringify({ error: "Cette unité locative est déjà occupée" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        // Vérification si l'unité locative existe
        const unitLoc = await prisma.uniteLocative.findUnique({
            where: { id: Number(unitLocId), proprieteId: Number(propId) }
        });
        if (!unitLoc) {
            return new Response(JSON.stringify({ error: "Unité locative non trouvée" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }
        const newTenant = await prisma.locataire.create({
            data: { ...validatedData, uniteLocativeId: Number(unitLocId) }
        });
        await prisma.auditLog.create({
            data: {
                gestionnaireId: user.id,
                action: 'CREATION_LOCATAIRE',
                details: `Locataire ${newTenant.prenom} ${newTenant.nom} (ID: ${newTenant.id}) ajouté à l'unité ID ${unitLocId}`,
                adminId: user.isAdmin ? user.id : undefined,
                createdAt: new Date(),
            },
        });
        return new Response(JSON.stringify({ message: "Le locataire a bien été créé", data: newTenant }),
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
