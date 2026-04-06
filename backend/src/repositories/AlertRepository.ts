import { runQuery, runExec } from '../models/database';
import { Alert } from '../types';

export class AlertRepository {
  static findAll(leida?: boolean): Alert[] {
    let query = 'SELECT * FROM alerts ORDER BY created_at DESC';
    const params: any[] = [];

    if (leida !== undefined) {
      query = 'SELECT * FROM alerts WHERE leida = ? ORDER BY created_at DESC';
      params.push(leida ? 1 : 0);
    }

    return runQuery(query, params) as Alert[];
  }

  static findUnread(): Alert[] {
    return runQuery('SELECT * FROM alerts WHERE leida = 0 ORDER BY created_at DESC') as Alert[];
  }

  static findByProduct(product_id: number): Alert[] {
    return runQuery('SELECT * FROM alerts WHERE product_id = ? ORDER BY created_at DESC', [product_id]) as Alert[];
  }

  static create(data: {
    product_id?: number;
    warehouse_id?: number;
    tipo: 'bajo_stock' | 'stock_critico' | 'stock_agotado';
    mensaje: string;
  }): Alert {
    const result = runExec(
      'INSERT INTO alerts (product_id, warehouse_id, tipo, mensaje) VALUES (?, ?, ?, ?)',
      [data.product_id || null, data.warehouse_id || 1, data.tipo, data.mensaje]
    );
    const rows = runQuery('SELECT * FROM alerts WHERE id = ?', [result.lastId]);
    return rows[0] as Alert;
  }

  static markAsRead(id: number): boolean {
    const result = runExec('UPDATE alerts SET leida = 1 WHERE id = ?', [id]);
    return result.changes > 0;
  }

  static markAllAsRead(): number {
    const result = runExec('UPDATE alerts SET leida = 1 WHERE leida = 0');
    return result.changes;
  }

  static delete(id: number): boolean {
    const result = runExec('DELETE FROM alerts WHERE id = ?', [id]);
    return result.changes > 0;
  }

  static getCount(): { total: number; sin_leer: number } {
    const totalRows = runQuery('SELECT COUNT(*) as count FROM alerts');
    const sinLeerRows = runQuery('SELECT COUNT(*) as count FROM alerts WHERE leida = 0');
    return {
      total: totalRows[0]?.count || 0,
      sin_leer: sinLeerRows[0]?.count || 0
    };
  }
}
