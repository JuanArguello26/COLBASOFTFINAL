import { Request, Response } from 'express';
import { InventoryService } from '../services/InventoryService';
import { AuthRequest } from '../middleware/auth';

export class ProductController {
  static getAll(req: AuthRequest, res: Response) {
    try {
      const { categoria, warehouse_id, search } = req.query;
      const products = InventoryService.getAllProducts({
        categoria: categoria as string,
        warehouse_id: warehouse_id ? parseInt(warehouse_id as string) : undefined,
        search: search as string
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  static getById(req: AuthRequest, res: Response) {
    try {
      const product = InventoryService.getProductById(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener producto' });
    }
  }

  static create(req: AuthRequest, res: Response) {
    try {
      const product = InventoryService.createProduct(req.body, req.user!.id);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static update(req: AuthRequest, res: Response) {
    try {
      const product = InventoryService.updateProduct(parseInt(req.params.id), req.body, req.user!.id);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static delete(req: AuthRequest, res: Response) {
    try {
      const deleted = InventoryService.deleteProduct(parseInt(req.params.id), req.user!.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json({ message: 'Producto eliminado' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static getLowStock(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id } = req.query;
      const products = InventoryService.getLowStock(warehouse_id ? parseInt(warehouse_id as string) : undefined);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  static getCritical(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id } = req.query;
      const products = InventoryService.getCritical(warehouse_id ? parseInt(warehouse_id as string) : undefined);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  static checkAlerts(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id } = req.query;
      InventoryService.checkAllStockAlerts(warehouse_id ? parseInt(warehouse_id as string) : undefined);
      res.json({ message: 'Alertas verificadas' });
    } catch (error) {
      res.status(500).json({ error: 'Error al verificar alertas' });
    }
  }
}
