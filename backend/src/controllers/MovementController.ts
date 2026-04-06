import { Request, Response } from 'express';
import { MovementService } from '../services/MovementService';
import { AuthRequest } from '../middleware/auth';

export class MovementController {
  static getAll(req: AuthRequest, res: Response) {
    try {
      const filters = {
        product_id: req.query.product_id ? parseInt(req.query.product_id as string) : undefined,
        warehouse_id: req.query.warehouse_id ? parseInt(req.query.warehouse_id as string) : undefined,
        tipo: req.query.tipo as string,
        fecha_inicio: req.query.fecha_inicio as string,
        fecha_fin: req.query.fecha_fin as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };
      const movements = MovementService.getAllMovements(filters);
      res.json(movements);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener movimientos' });
    }
  }

  static getById(req: AuthRequest, res: Response) {
    try {
      const movement = MovementService.getMovementById(parseInt(req.params.id));
      if (!movement) {
        return res.status(404).json({ error: 'Movimiento no encontrado' });
      }
      res.json(movement);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener movimiento' });
    }
  }

  static entrada(req: AuthRequest, res: Response) {
    try {
      const movement = MovementService.registerEntrada(req.body, req.user!.id);
      res.status(201).json(movement);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static salida(req: AuthRequest, res: Response) {
    try {
      const movement = MovementService.registerSalida(req.body, req.user!.id);
      res.status(201).json(movement);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static ajuste(req: AuthRequest, res: Response) {
    try {
      const movement = MovementService.registerAjuste(req.body, req.user!.id);
      res.status(201).json(movement);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static getStats(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id } = req.query;
      const stats = MovementService.getStats(warehouse_id ? parseInt(warehouse_id as string) : undefined);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }

  static getRotation(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id, days } = req.query;
      const data = MovementService.getRotationData(
        warehouse_id ? parseInt(warehouse_id as string) : undefined,
        days ? parseInt(days as string) : 30
      );
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener datos de rotación' });
    }
  }
}
