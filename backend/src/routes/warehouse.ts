import { Router } from 'express';
import { WarehouseRepository } from '../repositories/WarehouseRepository';
import { LogRepository } from '../repositories/LogRepository';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', (req: AuthRequest, res) => {
  try {
    const warehouses = WarehouseRepository.findAll();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener almacenes' });
  }
});

router.get('/:id', (req: AuthRequest, res) => {
  try {
    const warehouse = WarehouseRepository.findById(parseInt(req.params.id));
    if (!warehouse) {
      return res.status(404).json({ error: 'Almacén no encontrado' });
    }
    res.json(warehouse);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener almacén' });
  }
});

router.post('/', (req: AuthRequest, res) => {
  try {
    const { nombre, ubicacion, ciudad } = req.body;
    const warehouse = WarehouseRepository.create({ nombre, ubicacion, ciudad });
    
    LogRepository.create({
      user_id: req.user!.id,
      accion: 'CREAR_ALMACEN',
      entidad: 'warehouse',
      entidad_id: warehouse.id,
      detalle: `Creado almacén: ${nombre}`
    });

    res.status(201).json(warehouse);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', (req: AuthRequest, res) => {
  try {
    const warehouse = WarehouseRepository.update(parseInt(req.params.id), req.body);
    if (!warehouse) {
      return res.status(404).json({ error: 'Almacén no encontrado' });
    }
    res.json(warehouse);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
