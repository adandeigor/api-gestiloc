import { VerifyUserSession } from "@/core/verifyUserSession"
import prisma from "@/lib/prisma.config"
import proprieteValidator from "@/validators/propriete.validator"
import { z } from "zod"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await VerifyUserSession(request, id)
    try {
        const data = await request.json()
        const validatedData = proprieteValidator.ProprieteSchemaValidator.parse(data)
        const newProperty = await prisma.propriete.create({ data: { ...validatedData, gestionnaireId: user.id } })
        await prisma.auditLog.create({
            data: {
                gestionnaireId: user.id,
                action: 'CREATION_PROPRIETE',
                details: `Propriété ${newProperty.nom} (ID: ${newProperty.id}) ajoutée`,
                adminId: user.isAdmin ? user.id : undefined,
                createdAt: new Date(),
            },
        });

        return new Response(JSON.stringify({ message: "La propriété a bien été créee", data: newProperty }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" }
            })
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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await VerifyUserSession(request, id)
    try {
        const properties = await prisma.propriete.findMany({
            where: { gestionnaireId: user.id },
            include: { gestionnaire: true }
        })

        return new Response(JSON.stringify({ message: "Propriétés récupérées avec succès", data: properties }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            })
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur interne du serveur" , details: error}), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}