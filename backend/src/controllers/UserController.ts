import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { LogRepository } from '../repositories/LogRepository';
import { AuthRequest } from '../middleware/auth';
import { adminOnly } from '../middleware/auth';

export class UserController {
  static getAll(req: AuthRequest, res: Response) {
    try {
      const users = UserRepository.findAll();
      res.json(users.map(u => ({
        id: u.id,
        email: u.email,
        nombre: u.nombre,
        rol: u.rol,
        activo: u.activo,
        created_at: u.created_at
      })));
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  static getById(req: AuthRequest, res: Response) {
    try {
      const user = UserRepository.findById(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
        activo: user.activo,
        created_at: user.created_at
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  }

  static create(req: AuthRequest, res: Response) {
    try {
      const { email, password, nombre, rol } = req.body;
      
      const existing = UserRepository.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'Email ya registrado' });
      }

      const user = UserRepository.create({ email, password, nombre, rol: rol || 'operario' });
      
      LogRepository.create({
        user_id: req.user!.id,
        accion: 'CREAR_USUARIO',
        entidad: 'user',
        entidad_id: user.id,
        detalle: `Creado usuario: ${nombre} (${rol || 'operario'})`
      });

      res.status(201).json({
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static update(req: AuthRequest, res: Response) {
    try {
      const user = UserRepository.update(parseInt(req.params.id), req.body);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      LogRepository.create({
        user_id: req.user!.id,
        accion: 'ACTUALIZAR_USUARIO',
        entidad: 'user',
        entidad_id: user.id,
        detalle: `Actualizado usuario ID: ${user.id}`
      });

      res.json({
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
        activo: user.activo
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static delete(req: AuthRequest, res: Response) {
    try {
      const deleted = UserRepository.delete(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      LogRepository.create({
        user_id: req.user!.id,
        accion: 'ELIMINAR_USUARIO',
        entidad: 'user',
        entidad_id: parseInt(req.params.id),
        detalle: `Eliminado usuario ID: ${req.params.id}`
      });

      res.json({ message: 'Usuario eliminado' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
