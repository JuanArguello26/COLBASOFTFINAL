import { Request, Response } from 'express';
import { SupplierRepository } from '../repositories/SupplierRepository';
import { AuthRequest } from '../middleware/auth';
import { adminOnly } from '../middleware/auth';

export class SupplierController {
  static getAll(req: AuthRequest, res: Response) {
    try {
      const suppliers = SupplierRepository.findAll();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener proveedores' });
    }
  }

  static getById(req: AuthRequest, res: Response) {
    try {
      const supplier = SupplierRepository.findById(parseInt(req.params.id));
      if (!supplier) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener proveedor' });
    }
  }

  static create(req: AuthRequest, res: Response) {
    try {
      const { nit, nombre, contacto, telefono, email, direccion, ciudad } = req.body;
      
      const existing = SupplierRepository.findByNit(nit);
      if (existing) {
        return res.status(400).json({ error: 'Ya existe un proveedor con este NIT' });
      }

      const supplier = SupplierRepository.create({ nit, nombre, contacto, telefono, email, direccion, ciudad });
      res.status(201).json(supplier);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static update(req: AuthRequest, res: Response) {
    try {
      const supplier = SupplierRepository.update(parseInt(req.params.id), req.body);
      if (!supplier) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }
      res.json(supplier);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static delete(req: AuthRequest, res: Response) {
    try {
      const deleted = SupplierRepository.delete(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }
      res.json({ message: 'Proveedor eliminado' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
