import prisma from "@/lib/prisma.config";
import { RegisterValidator } from "@/validators/auth.validator";
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validateData = RegisterValidator.safeParse(data);
    if (!validateData.success) {
      return Response.json(
        { error: validateData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const user = await prisma.gestionnaire.findUnique({
      where: { email: validateData.data?.email },
    });
    if (user) {
      return Response.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Hash password (asynchrone)
    const hashedPassword = await bcrypt.hash(validateData.data?.motDePasse, 10);

    // Create the user
    const newUser = await prisma.gestionnaire.create({
      data: {
        nom: validateData.data?.nom,
        prenom: validateData.data?.prenom,
        email: validateData.data?.email,
        motDePasse: hashedPassword,
        telephone: validateData.data?.telephone,
      },
    });

    return Response.json(
      {
        message: "Utilisateur créé avec succès",
        user: {
          id: newUser.id,
          nom: newUser.nom,
          prenom: newUser.prenom,
          email: newUser.email,
          telephone: newUser.telephone,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Une erreur est survenue" },
      { status: 500 }
    );
  }
}