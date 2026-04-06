import { runQuery, runExec } from '../models/database';
import { Movement } from '../types';

export interface MovementFilters {
  product_id?: number;
  warehouse_id?: number;
  tipo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  limit?: number;
  offset?: number;
}

export class MovementRepository {
  static findAll(filters?: MovementFilters): Movement[] {
    let query = 'SELECT * FROM movements WHERE 1=1';
    const params: any[] = [];

    if (filters?.product_id) {
      query += ' AND product_id = ?';
      params.push(filters.product_id);
    }
    if (filters?.warehouse_id) {
      query += ' AND warehouse_id = ?';
      params.push(filters.warehouse_id);
    }
    if (filters?.tipo) {
      query += ' AND tipo = ?';
      params.push(filters.tipo);
    }
    if (filters?.fecha_inicio) {
      query += ' AND created_at >= ?';
      params.push(filters.fecha_inicio);
    }
    if (filters?.fecha_fin) {
      query += ' AND created_at <= ?';
      params.push(filters.fecha_fin);
    }

    query += ' ORDER BY created_at DESC';

    if (filters?.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      if (filters?.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    return runQuery(query, params) as Movement[];
  }

  static findById(id: number): Movement | undefined {
    const rows = runQuery('SELECT * FROM movements WHERE id = ?', [id]);
    return rows[0] as Movement | undefined;
  }

  static create(data: {
    product_id: number;
    warehouse_id?: number;
    tipo: 'entrada' | 'salida' | 'ajuste';
    cantidad: number;
    stock_anterior: number;
    stock_nuevo: number;
    motivo?: string;
    user_id: number;
  }): Movement {
    const result = runExec(
      `INSERT INTO movements (product_id, warehouse_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.product_id,
        data.warehouse_id || 1,
        data.tipo,
        data.cantidad,
        data.stock_anterior,
        data.stock_nuevo,
        data.motivo || null,
        data.user_id
      ]
    );
    return this.findById(result.lastId)!;
  }

  static getStats(warehouse_id?: number): {
    total_entradas: number;
    total_salidas: number;
    movimientos_hoy: number;
    movimientos_semana: number;
  } {
    const whereWarehouse = warehouse_id ? `AND warehouse_id = ${warehouse_id}` : '';
    
    const entradasRows = runQuery(`SELECT COALESCE(SUM(cantidad), 0) as total FROM movements WHERE tipo = 'entrada' ${whereWarehouse}`);
    const salidasRows = runQuery(`SELECT COALESCE(SUM(cantidad), 0) as total FROM movements WHERE tipo = 'salida' ${whereWarehouse}`);
    const hoyRows = runQuery(`SELECT COUNT(*) as count FROM movements WHERE date(created_at) = date('now') ${whereWarehouse}`);
    const semanaRows = runQuery(`SELECT COUNT(*) as count FROM movements WHERE created_at >= datetime('now', '-7 days') ${whereWarehouse}`);

    return {
      total_entradas: entradasRows[0]?.total || 0,
      total_salidas: salidasRows[0]?.total || 0,
      movimientos_hoy: hoyRows[0]?.count || 0,
      movimientos_semana: semanaRows[0]?.count || 0
    };
  }

  static getRotationData(warehouse_id?: number, days: number = 30): { fecha: string; entradas: number; salidas: number }[] {
    const rows = runQuery(
      `SELECT 
        date(created_at) as fecha,
        SUM(CASE WHEN tipo = 'entrada' THEN cantidad ELSE 0 END) as entradas,
        SUM(CASE WHEN tipo = 'salida' THEN cantidad ELSE 0 END) as salidas
      FROM movements
      WHERE created_at >= datetime('now', '-${days} days')
      ${warehouse_id ? `AND warehouse_id = ${warehouse_id}` : ''}
      GROUP BY date(created_at)
      ORDER BY fecha`
    );
    return rows as any[];
  }
}
