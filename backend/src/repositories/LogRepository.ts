import { runQuery, runExec } from '../models/database';
import { Log } from '../types';

export interface LogFilters {
  user_id?: number;
  entidad?: string;
  entidad_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  limit?: number;
}

export class LogRepository {
  static findAll(filters?: LogFilters): Log[] {
    let query = 'SELECT * FROM logs WHERE 1=1';
    const params: any[] = [];

    if (filters?.user_id) {
      query += ' AND user_id = ?';
      params.push(filters.user_id);
    }
    if (filters?.entidad) {
      query += ' AND entidad = ?';
      params.push(filters.entidad);
    }
    if (filters?.entidad_id) {
      query += ' AND entidad_id = ?';
      params.push(filters.entidad_id);
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
    }

    return runQuery(query, params) as Log[];
  }

  static create(data: {
    user_id?: number;
    accion: string;
    entidad: 'product' | 'movement' | 'user' | 'warehouse' | 'alert';
    entidad_id?: number;
    detalle?: string;
  }): Log {
    const result = runExec(
      'INSERT INTO logs (user_id, accion, entidad, entidad_id, detalle) VALUES (?, ?, ?, ?, ?)',
      [data.user_id || null, data.accion, data.entidad, data.entidad_id || null, data.detalle || null]
    );
    const rows = runQuery('SELECT * FROM logs WHERE id = ?', [result.lastId]);
    return rows[0] as Log;
  }

  static findByEntity(entidad: string, entidad_id: number): Log[] {
    return runQuery('SELECT * FROM logs WHERE entidad = ? AND entidad_id = ? ORDER BY created_at DESC', [entidad, entidad_id]) as Log[];
  }
}
