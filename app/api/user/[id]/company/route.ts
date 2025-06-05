import { VerifyUserSession } from "@/core/verifyUserSession";
import prisma from "@/lib/prisma.config";
import { CompanyValidator, CompanyUpdateValidator } from "@/validators/company.validator";
import { z } from "zod";

export async function GET(req: Request, { params }: { params: Promise<{ id: string } > }) {
    const { id } = await params;
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return Response.json({ error: "ID invalide ou manquant" }, { status: 400 });
    }
    await VerifyUserSession(req, id)
    try {
        const user = await prisma.gestionnaire.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!user) {
            return Response.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }
        
        const dossier = await prisma.dossierGestionnaire.findUnique({
            where: {
                gestionnaireId: user.id,
            },
        });
        if (!dossier) {
            return Response.json({ error: "Dossier non trouvé" }, { status: 404 });
        }
        const company = await prisma.company.findUnique({
            where : {
                gestionnaireId : dossier.id,
            }
        })
        if(!company){
            return Response.json({ error: "Entreprise non trouvée" }, { status: 404 });
        }
        return Response.json({ company: company }, { status: 200 });
    } catch (error) {
        return Response.json({ error: error }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Valider l'ID
    const { id } = await params;
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return Response.json({ error: "ID invalide ou manquant" }, { status: 400 });
    }

    // Vérifier la session utilisateur
    try {
      await VerifyUserSession(req, id);
    } catch (error) {
      return Response.json({ error: "Session utilisateur invalide ou expirée" , details: error}, { status: 401 });
    }

    // Lire et valider le corps de la requête
    let data;
    try {
      data = await req.json();
    } catch (jsonError) {
      console.error("Erreur lors du parsing JSON:", jsonError);
      return Response.json({ error: "Corps de la requête invalide ou mal formé" }, { status: 400 });
    }

    // Vérifier que les champs requis sont présents
    const { name, type, registre_commerce_file, registre_commerce_number, address, latitude, longitude, description } = data;
    if (!name || !type || !address || !description) {
      return Response.json({ error: "Champs obligatoires manquants (name, type, address, description)" }, { status: 400 });
    }

    // Valider les données avec Zod
    const validationResult = CompanyValidator.safeParse({
      name,
      type,
      registre_commerce_file,
      registre_commerce_number,
      address,
      latitude,
      longitude,
      description,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.format();
      return Response.json(
        {
          error: "Validation des données échouée",
          details: errors,
        },
        { status: 400 }
      );
    }

    // Vérifier l'existence du dossier
    const dossier = await prisma.dossierGestionnaire.findUnique({
      where: {
        gestionnaireId: Number(id),
      },
    });

    if (!dossier) {
      return Response.json({ error: "Dossier non trouvé pour ce gestionnaire" }, { status: 404 });
    }

    // Créer l'entreprise
    const company = await prisma.company.create({
      data: {
        registre_commerce_file: validationResult.data.registre_commerce_file,
        registre_commerce_number: validationResult.data.registre_commerce_number,
        name: validationResult.data.name,
        type: validationResult.data.type,
        address: validationResult.data.address,
        latitude: validationResult.data.latitude,
        longitude: validationResult.data.longitude,
        description: validationResult.data.description,
        gestionnaireId: Number(id),
      },
    });

    return Response.json({ company }, { status: 201 });
  } catch (error) {
    console.error("Erreur dans POST /api/user/:id/company:", error);

    // Gérer les erreurs spécifiques
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "Erreur de validation des données",
          details: error.format(),
        },
        { status: 400 }
      );
    }

    // Gérer les erreurs Prisma (par exemple, contraintes de base de données)
    if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
      return Response.json(
        {
          error: "Erreur lors de la création de l'entreprise dans la base de données",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Erreur générique
    return Response.json(
      {
        error: "Erreur interne du serveur",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string } > }) {
    const { id } = await params;
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return Response.json({ error: "ID invalide ou manquant" }, { status: 400 });
    }
    await VerifyUserSession(req, id)
    const dossier = await prisma.dossierGestionnaire.findUnique({
        where : {
            gestionnaireId : Number(id),
        }
    })

    if (!dossier) {
        return Response.json({ error: "Dossier non rencontré" }, { status: 404 });
    }
    try {
        const company = await prisma.company.delete({
            where : {
                gestionnaireId : dossier.id,
            }
        })
        return Response.json({ company: company }, { status: 200 });
    } catch (error) {
        return Response.json({ error: error }, { status: 500 });
    }
}



export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return Response.json({ error: "ID invalide ou manquant" }, { status: 400 });
    }
    await VerifyUserSession(req, id)
    const data = await req.json()
    const { name, type, registre_commerce, address, latitude, longitude, description } = data

    const dossier = await prisma.dossierGestionnaire.findUnique({
        where:{
            gestionnaireId : Number(id),
        }
    })

    if (!dossier) {
        return Response.json({ error: "Dossier non rencontré" }, { status: 404 });
    }

   

    if (registre_commerce) {
        
        const validatedData = CompanyUpdateValidator.parse({
        name : name,
        type : type,
        registre_commerce,
        address : address,
        latitude : latitude,
        longitude : longitude,
        description : description,
        })

        try {
            const company = await prisma.company.update({
                where : {
                    gestionnaireId : dossier.id,
                },
                data : {
                    registre_commerce_file : validatedData.registre_commerce_file as string,
                    registre_commerce_number : validatedData.registre_commerce_number as string,
                    name : validatedData.name as string,
                    type : validatedData.type as string,
                    address : validatedData.address as string,
                    latitude : Number(validatedData.latitude),
                    longitude : Number(validatedData.longitude),
                    description : validatedData.description as string,
                }
            })
            return Response.json({ company: company }, { status: 200 });
        } catch (error) {
            return Response.json({ error: error }, { status: 500 });
        }
    } else {
        try {
            const company = await prisma.company.update({
                where : {
                    gestionnaireId : dossier.id,
                },
                data : {
                    name : name,
                    type : type,
                    address : address,
                    latitude : Number(latitude),
                    longitude : Number(longitude),
                    description : description,
                }
            })
            return Response.json({ company: company }, { status: 200 });
        } catch (error) {
            return Response.json({ error: error }, { status: 500 });
        }
    }
}