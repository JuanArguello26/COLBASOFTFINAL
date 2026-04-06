import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { LogRepository } from '../repositories/LogRepository';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'colbasoft-secret-key-2024';

export class AuthController {
  static login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
      }

      const user = UserRepository.findByEmail(email);
      if (!user || !user.activo) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      if (!UserRepository.verifyPassword(user, password)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      LogRepository.create({
        user_id: user.id,
        accion: 'LOGIN',
        entidad: 'user',
        entidad_id: user.id,
        detalle: 'Usuario inició sesión'
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          rol: user.rol
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  static me(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'No autorizado' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      const user = UserRepository.findById(decoded.id);
      if (!user || !user.activo) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      res.json({
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol
      });
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  }

  static logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        
        LogRepository.create({
          user_id: decoded.id,
          accion: 'LOGOUT',
          entidad: 'user',
          detalle: 'Usuario cerró sesión'
        });
      }

      res.json({ message: 'Logout exitoso' });
    } catch (error) {
      res.json({ message: 'Logout exitoso' });
    }
  }
}
