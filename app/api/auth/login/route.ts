import prisma from "@/lib/prisma.config";
import { LoginValidator } from "@/validators/auth.validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validateData = LoginValidator.safeParse(data);

    if (!validateData.success) {
      return Response.json(
        { error: validateData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = await prisma.gestionnaire.findUnique({
      where: { email: validateData.data?.email },
    });

    if (!user) {
      return Response.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      validateData.data?.motDePasse,
      user.motDePasse
    );

    if (!isPasswordValid) {
      return Response.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const session = await prisma.session.findUnique({
      where: { gestionnaireId: user.id },
    });

    if (session) {
      await prisma.session.update({
        where: { id: session.id },
        data: { token },
      });
    } else {
      await prisma.session.create({
        data: {
          gestionnaireId: user.id,
          token,
        },
      });
    }
    return Response.json(
      {
        message: "Utilisateur connecté avec succès",
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          telephone: user.telephone,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}