import { VerifyUserSession } from "@/core/verifyUserSession"
import prisma from "@/lib/prisma.config"
import proprieteValidator from "@/validators/propriete.validator"
import { z } from "zod"

export async function GET (request:Request, { params }: { params: Promise<{ id: string, propId: string }> }) {
    const { id, propId } = await params
    const user = await VerifyUserSession(request, id)
    try {
        const property = await prisma.propriete.findUnique({
            where: { id: Number(propId), gestionnaireId: user.id },
            include: { gestionnaire: true }
        })

        if (!property) {
            return new Response(JSON.stringify({ error: "Propriété non trouvée" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            })
        }

        return new Response(JSON.stringify({ message: "Propriété récupérée avec succès", data: property }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            })
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}

export async function DELETE (request:Request, { params }: { params: Promise<{ id: string, propId: string }> }) {
    const { id, propId } = await params
    const user = await VerifyUserSession(request, id)

    try {
        // Vérification si la propriété existe
        const existingProperty = await prisma.propriete.findUnique({
            where: { id: Number(propId), gestionnaireId: user.id }
        })
        if (!existingProperty) {
            return new Response(JSON.stringify({ error: "Propriété non trouvée" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            })
        }
        // Suppression de la propriété
        const property = await prisma.propriete.delete({
            where: { id: Number(propId), gestionnaireId: user.id }
        })

        return new Response(JSON.stringify({ message: "Propriété supprimée avec succès", data: property }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            })
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}

export async function PUT (request:Request, { params }: { params: Promise<{ id: string, propId: string }> }) {
    const { id, propId } = await params
    const user = await VerifyUserSession(request, id)

    try {
        const data = await request.json()
        
        // Vérification si la propriété existe
        const existingProperty = await prisma.propriete.findUnique({
            where: { id: Number(propId), gestionnaireId: user.id }
        })
        if (!existingProperty) {
            return new Response(JSON.stringify({ error: "Propriété non trouvée" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            })
        }

        const validatedData = proprieteValidator.ProprieteUpdateSchemaValidator.parse(data)
        // Mise à jour de la propriété
        const updatedProperty = await prisma.propriete.update({
            where: { id: Number(propId), gestionnaireId: user.id },
            data: validatedData
        })

        return new Response(JSON.stringify({ message: "Propriété mise à jour avec succès", data: updatedProperty }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: error.issues }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            })
        }
        return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}