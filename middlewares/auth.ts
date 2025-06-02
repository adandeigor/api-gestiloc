import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma.config';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: { userId: number; email: string };
}

export const authenticate = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant ou invalide' });
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; email: string };

      // Vérifier si l'utilisateur existe
      const user = await prisma.gestionnaire.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }

      req.user = { userId: decoded.userId, email: decoded.email };
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Token invalide' });
    }
  };
};