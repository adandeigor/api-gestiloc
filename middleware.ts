import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from './lib/prisma.config';

// Liste des routes publiques (aucune authentification JWT requise)


export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const response = NextResponse.next();

  // Vérifier le token API pour toutes les routes
  const apiAccessToken = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!apiAccessToken || apiAccessToken !== process.env.NEXT_API_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Accès non autorisé : token API invalide' },
      { status: 401, headers: response.headers }
    );
  }

  // Vérifier le JWT uniquement pour les routes protégées (exemple)
  if (path.startsWith('/api/user')) {
    const authToken = req.headers.get('authorization-jwt')?.replace('Bearer ', '');
    if (!authToken) {
      return NextResponse.json(
        { error: 'Token JWT manquant' },
        { status: 401, headers: response.headers }
      );
    }

    try {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET!) as {
        userId: number;
        email: string;
      };

      // Vérifier si l'utilisateur existe dans la base de données
      const user = await prisma.gestionnaire.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 401, headers: response.headers }
        );
      }

      // Ajouter les informations de l'utilisateur à la requête
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('user', JSON.stringify({ userId: decoded.userId, email: decoded.email }));

      // Enregistrer un log d'audit
      await prisma.auditLog.create({
        data: {
          gestionnaireId: decoded.userId,
          action: 'ACCES_ROUTE',
          details: `Accès à la route ${path} par ${decoded.email}`,
        },
      });

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
        headers: response.headers,
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Token JWT invalide' },
        { status: 401, headers: response.headers }
      );
    }
  }

  return response;
}

// Configurer les routes à intercepter
export const config = {
  matcher: ['/api/:path*'],
};