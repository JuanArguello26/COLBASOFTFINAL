import { Request, Response } from 'express';
import { AlertService } from '../services/AlertService';
import { AuthRequest } from '../middleware/auth';

export class AlertController {
  static getAll(req: AuthRequest, res: Response) {
    try {
      const { leida } = req.query;
      const alerts = AlertService.getAll(leida !== undefined ? leida === 'true' : undefined);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener alertas' });
    }
  }

  static getUnread(req: AuthRequest, res: Response) {
    try {
      const alerts = AlertService.getUnread();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener alertas' });
    }
  }

  static markAsRead(req: AuthRequest, res: Response) {
    try {
      const result = AlertService.markAsRead(parseInt(req.params.id), req.user!.id);
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ error: 'Error al marcar alerta' });
    }
  }

  static markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const count = AlertService.markAllAsRead(req.user!.id);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Error al marcar alertas' });
    }
  }

  static delete(req: AuthRequest, res: Response) {
    try {
      const result = AlertService.delete(parseInt(req.params.id), req.user!.id);
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar alerta' });
    }
  }

  static getCount(req: AuthRequest, res: Response) {
    try {
      const count = AlertService.getCount();
      res.json(count);
    } catch (error) {
      res.status(500).json({ error: 'Error al contar alertas' });
    }
  }
}
