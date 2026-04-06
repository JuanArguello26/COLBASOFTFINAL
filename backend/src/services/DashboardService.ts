import { ProductRepository } from '../repositories/ProductRepository';
import { MovementRepository } from '../repositories/MovementRepository';
import { AlertRepository } from '../repositories/AlertRepository';
import { WarehouseRepository } from '../repositories/WarehouseRepository';

export interface DashboardStats {
  inventory: {
    total_productos: number;
    valor_total_inventario: number;
    productos_bajo_stock: number;
    productos_stock_critico: number;
  };
  movements: {
    entradas_hoy: number;
    salidas_hoy: number;
    movimientos_semana: number;
  };
  alerts: {
    alertas_sin_leer: number;
  };
  warehouses: {
    total: number;
  };
}

export interface ChartData {
  rotation: { fecha: string; entradas: number; salidas: number }[];
  byCategory: { categoria: string; cantidad: number; valor: number }[];
  topProducts: { nombre: string; stock: number }[];
}

export class DashboardService {
  static getStats(warehouse_id?: number): DashboardStats {
    const inventory = ProductRepository.getStats(warehouse_id);
    const movementStats = MovementRepository.getStats(warehouse_id);
    const alertCount = AlertRepository.getCount();
    const warehouses = WarehouseRepository.findAll();

    const entradasHoy = MovementRepository.findAll({
      warehouse_id,
      tipo: 'entrada',
      fecha_inicio: new Date().toISOString().split('T')[0]
    });
    const salidasHoy = MovementRepository.findAll({
      warehouse_id,
      tipo: 'salida',
      fecha_inicio: new Date().toISOString().split('T')[0]
    });

    return {
      inventory: {
        total_productos: inventory.total,
        valor_total_inventario: inventory.valor_total,
        productos_bajo_stock: inventory.bajo_stock,
        productos_stock_critico: inventory.criticos
      },
      movements: {
        entradas_hoy: entradasHoy.reduce((sum, m) => sum + m.cantidad, 0),
        salidas_hoy: salidasHoy.reduce((sum, m) => sum + m.cantidad, 0),
        movimientos_semana: movementStats.movimientos_semana
      },
      alerts: {
        alertas_sin_leer: alertCount.sin_leer
      },
      warehouses: {
        total: warehouses.length
      }
    };
  }

  static getChartData(warehouse_id?: number): ChartData {
    const rotation = MovementRepository.getRotationData(warehouse_id, 30);
    
    const products = ProductRepository.findAll({ warehouse_id });
    const byCategory = [
      { categoria: 'tela', cantidad: 0, valor: 0 },
      { categoria: 'insumo', cantidad: 0, valor: 0 },
      { categoria: 'prenda', cantidad: 0, valor: 0 }
    ];

    for (const p of products) {
      const cat = byCategory.find(c => c.categoria === p.categoria);
      if (cat) {
        cat.cantidad += p.stock_actual;
        cat.valor += p.stock_actual * p.precio_unitario;
      }
    }

    const topProducts = [...products]
      .sort((a, b) => b.stock_actual - a.stock_actual)
      .slice(0, 5)
      .map(p => ({ nombre: p.nombre, stock: p.stock_actual }));

    return {
      rotation,
      byCategory: byCategory.filter(c => c.cantidad > 0),
      topProducts
    };
  }

  static getKPIs(warehouse_id?: number) {
    const products = ProductRepository.findAll({ warehouse_id });
    const movements = MovementRepository.findAll({ warehouse_id, limit: 100 });
    
    const totalStock = products.reduce((sum, p) => sum + p.stock_actual, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.stock_actual * p.precio_unitario), 0);
    const avgPrice = products.length > 0 ? totalValue / products.length : 0;
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString();
    
    const recentMovements = movements.filter(m => m.created_at >= lastMonthStr);
    const entradas = recentMovements.filter(m => m.tipo === 'entrada').reduce((sum, m) => sum + m.cantidad, 0);
    const salidas = recentMovements.filter(m => m.tipo === 'salida').reduce((sum, m) => sum + m.cantidad, 0);
    
    const rotationRate = totalStock > 0 ? (salidas / totalStock) * 100 : 0;
    
    return {
      valor_total_inventario: totalValue,
      promedio_unitario: avgPrice,
      tasa_rotacion: Math.round(rotationRate * 100) / 100,
      entradas_mes: entradas,
      salidas_mes: salidas,
      productos_activos: products.length
    };
  }
}
