import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';

const JWT_SECRET = 'colbasoft-secret-key-2024';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    rol: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = UserRepository.findById(decoded.id);
    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      rol: user.rol
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  next();
}
