import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';
import { AuthRequest } from '../middleware/auth';

export class DashboardController {
  static getStats(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id } = req.query;
      const stats = DashboardService.getStats(warehouse_id ? parseInt(warehouse_id as string) : undefined);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }

  static getChartData(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id } = req.query;
      const data = DashboardService.getChartData(warehouse_id ? parseInt(warehouse_id as string) : undefined);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener datos de gráficos' });
    }
  }

  static getKPIs(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id } = req.query;
      const kpis = DashboardService.getKPIs(warehouse_id ? parseInt(warehouse_id as string) : undefined);
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener KPIs' });
    }
  }
}
