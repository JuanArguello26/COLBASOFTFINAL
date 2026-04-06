import { ProductRepository } from '../repositories/ProductRepository';
import { MovementRepository } from '../repositories/MovementRepository';
import { AlertRepository } from '../repositories/AlertRepository';
import { LogRepository } from '../repositories/LogRepository';
import { Product } from '../types';

export class InventoryService {
  static getAllProducts(filters?: { categoria?: string; warehouse_id?: number; search?: string }) {
    return ProductRepository.findAll(filters);
  }

  static getProductById(id: number) {
    return ProductRepository.findById(id);
  }

  static createProduct(data: {
    codigo: string;
    nombre: string;
    descripcion?: string;
    categoria: 'tela' | 'insumo' | 'prenda';
    unidad: 'metros' | 'unidades' | 'kilogramos';
    stock_minimo?: number;
    precio_unitario?: number;
    proveedor?: string;
    warehouse_id?: number;
  }, userId: number) {
    const existing = ProductRepository.findByCode(data.codigo);
    if (existing) {
      throw new Error('Ya existe un producto con este código');
    }

    const product = ProductRepository.create(data);
    
    LogRepository.create({
      user_id: userId,
      accion: 'CREAR_PRODUCTO',
      entidad: 'product',
      entidad_id: product.id,
      detalle: `Creado producto: ${product.nombre} (${product.codigo})`
    });

    return product;
  }

  static updateProduct(id: number, data: Partial<Product>, userId: number) {
    const product = ProductRepository.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const updated = ProductRepository.update(id, data);
    
    LogRepository.create({
      user_id: userId,
      accion: 'ACTUALIZAR_PRODUCTO',
      entidad: 'product',
      entidad_id: id,
      detalle: `Actualizado producto: ${product.nombre}`
    });

    this.checkStockAlerts(id);
    return updated;
  }

  static deleteProduct(id: number, userId: number) {
    const product = ProductRepository.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const deleted = ProductRepository.delete(id);
    
    LogRepository.create({
      user_id: userId,
      accion: 'ELIMINAR_PRODUCTO',
      entidad: 'product',
      entidad_id: id,
      detalle: `Eliminado producto: ${product.nombre}`
    });

    return deleted;
  }

  static getLowStock(warehouse_id?: number) {
    return ProductRepository.findLowStock(warehouse_id);
  }

  static getCritical(warehouse_id?: number) {
    return ProductRepository.findCritical(warehouse_id);
  }

  static checkStockAlerts(productId: number, warehouseId: number = 1) {
    const product = ProductRepository.findById(productId);
    if (!product) return;

    const existingAlerts = AlertRepository.findByProduct(productId);
    const activeAlerts = existingAlerts.filter(a => !a.leida);

    if (product.stock_actual <= 0) {
      if (!activeAlerts.some(a => a.tipo === 'stock_agotado')) {
        AlertRepository.create({
          product_id: productId,
          warehouse_id: warehouseId,
          tipo: 'stock_agotado',
          mensaje: `⚠️ STOCK AGOTADO: ${product.nombre} (${product.codigo})`
        });
      }
    } else if (product.stock_actual <= product.stock_minimo * 0.5) {
      if (!activeAlerts.some(a => a.tipo === 'stock_critico')) {
        AlertRepository.create({
          product_id: productId,
          warehouse_id: warehouseId,
          tipo: 'stock_critico',
          mensaje: `🔴 STOCK CRÍTICO: ${product.nombre} - Stock: ${product.stock_actual} ${product.unidad}`
        });
      }
    } else if (product.stock_actual <= product.stock_minimo) {
      if (!activeAlerts.some(a => a.tipo === 'bajo_stock')) {
        AlertRepository.create({
          product_id: productId,
          warehouse_id: warehouseId,
          tipo: 'bajo_stock',
          mensaje: `🟡 BAJO STOCK: ${product.nombre} - Stock: ${product.stock_actual} ${product.unidad}`
        });
      }
    }
  }

  static checkAllStockAlerts(warehouseId: number = 1) {
    const products = ProductRepository.findAll({ warehouse_id: warehouseId });
    
    for (const product of products) {
      this.checkStockAlerts(product.id, warehouseId);
    }
  }

  static getStats(warehouse_id?: number) {
    return ProductRepository.getStats(warehouse_id);
  }
}
