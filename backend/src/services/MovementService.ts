import { ProductRepository } from '../repositories/ProductRepository';
import { MovementRepository, MovementFilters } from '../repositories/MovementRepository';
import { LogRepository } from '../repositories/LogRepository';
import { InventoryService } from './InventoryService';

export class MovementService {
  static getAllMovements(filters?: MovementFilters) {
    return MovementRepository.findAll(filters);
  }

  static getMovementById(id: number) {
    return MovementRepository.findById(id);
  }

  static registerEntrada(data: {
    product_id: number;
    cantidad: number;
    motivo?: string;
    warehouse_id?: number;
  }, userId: number) {
    const product = ProductRepository.findById(data.product_id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const stock_anterior = product.stock_actual;
    const stock_nuevo = stock_anterior + data.cantidad;

    const movement = MovementRepository.create({
      product_id: data.product_id,
      warehouse_id: data.warehouse_id,
      tipo: 'entrada',
      cantidad: data.cantidad,
      stock_anterior,
      stock_nuevo,
      motivo: data.motivo,
      user_id: userId
    });

    ProductRepository.updateStock(data.product_id, stock_nuevo);

    LogRepository.create({
      user_id: userId,
      accion: 'REGISTRAR_ENTRADA',
      entidad: 'movement',
      entidad_id: movement.id,
      detalle: `Entrada de ${data.cantidad} ${product.unidad} de ${product.nombre}. Stock: ${stock_anterior} → ${stock_nuevo}`
    });

    InventoryService.checkStockAlerts(data.product_id, data.warehouse_id);

    return movement;
  }

  static registerSalida(data: {
    product_id: number;
    cantidad: number;
    motivo?: string;
    warehouse_id?: number;
  }, userId: number) {
    const product = ProductRepository.findById(data.product_id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (product.stock_actual < data.cantidad) {
      throw new Error(`Stock insuficiente. Stock actual: ${product.stock_actual} ${product.unidad}`);
    }

    const stock_anterior = product.stock_actual;
    const stock_nuevo = stock_anterior - data.cantidad;

    const movement = MovementRepository.create({
      product_id: data.product_id,
      warehouse_id: data.warehouse_id,
      tipo: 'salida',
      cantidad: data.cantidad,
      stock_anterior,
      stock_nuevo,
      motivo: data.motivo,
      user_id: userId
    });

    ProductRepository.updateStock(data.product_id, stock_nuevo);

    LogRepository.create({
      user_id: userId,
      accion: 'REGISTRAR_SALIDA',
      entidad: 'movement',
      entidad_id: movement.id,
      detalle: `Salida de ${data.cantidad} ${product.unidad} de ${product.nombre}. Stock: ${stock_anterior} → ${stock_nuevo}`
    });

    InventoryService.checkStockAlerts(data.product_id, data.warehouse_id);

    return movement;
  }

  static registerAjuste(data: {
    product_id: number;
    cantidad: number;
    motivo: string;
    warehouse_id?: number;
  }, userId: number) {
    const product = ProductRepository.findById(data.product_id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (data.cantidad < 0 && product.stock_actual < Math.abs(data.cantidad)) {
      throw new Error('No se puede reducir más del stock disponible');
    }

    const stock_anterior = product.stock_actual;
    const stock_nuevo = stock_anterior + data.cantidad;

    const movement = MovementRepository.create({
      product_id: data.product_id,
      warehouse_id: data.warehouse_id,
      tipo: 'ajuste',
      cantidad: data.cantidad,
      stock_anterior,
      stock_nuevo,
      motivo: data.motivo,
      user_id: userId
    });

    ProductRepository.updateStock(data.product_id, stock_nuevo);

    LogRepository.create({
      user_id: userId,
      accion: 'REGISTRAR_AJUSTE',
      entidad: 'movement',
      entidad_id: movement.id,
      detalle: `Ajuste de ${data.cantidad} ${product.unidad} en ${product.nombre}. Stock: ${stock_anterior} → ${stock_nuevo}. Motivo: ${data.motivo}`
    });

    InventoryService.checkStockAlerts(data.product_id, data.warehouse_id);

    return movement;
  }

  static getStats(warehouse_id?: number) {
    return MovementRepository.getStats(warehouse_id);
  }

  static getRotationData(warehouse_id?: number, days: number = 30) {
    return MovementRepository.getRotationData(warehouse_id, days);
  }
}
