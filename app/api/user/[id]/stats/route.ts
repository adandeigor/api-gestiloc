import { VerifyUserSession } from "@/core/verifyUserSession"
import prisma from "@/lib/prisma.config"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) {
        return Response.json({ error: "ID is required" }, { status: 400 })
    }
    // Vérification session
    await VerifyUserSession(request, id)

    // Récupération du gestionnaire et toutes ses relations
    const gestionnaire = await prisma.gestionnaire.findUnique({
        where: { id: Number(id) },
        include: {
            proprietes: {
                include: {
                    unitesLocatives: {
                        include: {
                            contrats: {
                                include: {
                                    etatsDesLieux: true,
                                    paiements: true,
                                    locataire: true,
                                }
                            },
                            locataires: true,
                        }
                    }
                }
            },
            notifications: true,
            sessions: true,
            company: true,
            auditLogs: true,
            dossiergestionnaire: true,
        }
    })

    if (!gestionnaire) {
        return Response.json({ error: "Gestionnaire non trouvé" }, { status: 404 })
    }

    // Agrégation des données
    const allProperties = gestionnaire.proprietes
    const allUnits = allProperties.flatMap(p => p.unitesLocatives)
    const allContrats = allUnits.flatMap(u => u.contrats)
    const allEtatsDesLieux = allContrats.flatMap(c => c.etatsDesLieux)
    const allPaiements = allContrats.flatMap(c => c.paiements)
    const allLocataires = allUnits.flatMap(u => u.locataires)
    const allNotifications = gestionnaire.notifications
    const allSessions = gestionnaire.sessions
    const allAuditLogs = gestionnaire.auditLogs

    // Chiffre d'affaires (somme des paiements)
    const chiffreAffaire = allPaiements.reduce((sum, p) => sum + p.montant, 0)

    // Unités occupées/disponibles
    const unitsOccupied = allUnits.filter(u => u.locataires.length > 0)
    const unitsAvailable = allUnits.filter(u => u.locataires.length === 0)

    // Retirer le mot de passe du gestionnaire
    const { motDePasse, ...gestionnaireSansMdp } = gestionnaire

    return Response.json({
        gestionnaire: {
            ...gestionnaireSansMdp,
            proprietes: undefined, // on détaille plus bas
            notifications: undefined,
            sessions: undefined,
            auditLogs: undefined,
            dossiergestionnaire: undefined,
        },
        dossiergestionnaire: gestionnaire.dossiergestionnaire,
        company: gestionnaire.company,
        proprietes: allProperties,
        totalProperties: allProperties.length,
        unitesLocatives: allUnits,
        totalUnits: allUnits.length,
        unitsOccupied: unitsOccupied.length,
        unitsAvailable: unitsAvailable.length,
        contrats: allContrats,
        totalContrats: allContrats.length,
        etatsDesLieux: allEtatsDesLieux,
        totalEtatsDesLieux: allEtatsDesLieux.length,
        paiements: allPaiements,
        totalPaiements: allPaiements.length,
        chiffreAffaire,
        locataires: allLocataires,
        totalLocataires: allLocataires.length,
        notifications: allNotifications,
        totalNotifications: allNotifications.length,
        sessions: allSessions,
        totalSessions: allSessions.length,
        auditLogs: allAuditLogs,
        totalAuditLogs: allAuditLogs.length,
    })
}