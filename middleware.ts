import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from './lib/prisma.config';

export const runtime = 'nodejs';

// Liste des routes publiques (aucune authentification JWT requise)

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Créer une réponse de base
  const response = NextResponse.next();

  // Ajouter les en-têtes CORS
  response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Authorization-JWT');

  // Gérer les requêtes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Authorization-JWT',
      },
    });
  }

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

      // Restriction d'accès pour les comptes EN_ATTENTE sur certaines routes
      const restrictedPaths = [
        /^\/api\/user\/\d+\/stats$/,
        /^\/api\/user\/\d+\/propriete(\/.*)?$/,
        /^\/api\/user\/\d+\/profile$/,
        /^\/api\/user\/\d+\/company$/,
        /^\/api\/user\/\d+\/auditlog$/,
      ];
      if (
        user.statut === 'EN_ATTENTE' &&
        restrictedPaths.some((regex) => regex.test(path))
      ) {
        return NextResponse.json(
          { error: 'Votre compte doit être validé pour accéder à cette ressource.' },
          { status: 403, headers: response.headers }
        );
      }

      // Ajouter les informations de l'utilisateur à la requête
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('user', JSON.stringify({ userId: decoded.userId, email: decoded.email }));

 

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
        headers: response.headers,
      });
    } catch  {
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