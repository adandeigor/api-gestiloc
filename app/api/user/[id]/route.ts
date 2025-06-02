import { VerifyUserSession } from "@/core/verifyUserSession"
import prisma from "@/lib/prisma.config"

export async function GET (request:Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await VerifyUserSession(request, id)
    if (!user) {
        return new Response(JSON.stringify({ error: "Utilisateur non trouvée" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        })
    }
    //user response without password
    const userResponse = await prisma.gestionnaire.findUnique({
        where: { id: user.id },
        select: { id: true, email: true, nom: true, prenom: true,telephone: true, createdAt: true, updatedAt: true , proprietes: true, notifications:true, dossiergestionnaire:true, auditLogs:true, statut: true },
    })
    return new Response(JSON.stringify(userResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    })
}
