import { runQuery, runExec } from '../models/database';
import { Warehouse } from '../types';

export class WarehouseRepository {
  static findAll(): Warehouse[] {
    const rows = runQuery('SELECT * FROM warehouses WHERE activo = 1 ORDER BY nombre');
    return rows as Warehouse[];
  }

  static findById(id: number): Warehouse | undefined {
    const rows = runQuery('SELECT * FROM warehouses WHERE id = ?', [id]);
    return rows[0] as Warehouse | undefined;
  }

  static create(data: { nombre: string; ubicacion: string; ciudad: string }): Warehouse {
    const result = runExec(
      'INSERT INTO warehouses (nombre, ubicacion, ciudad) VALUES (?, ?, ?)',
      [data.nombre, data.ubicacion, data.ciudad]
    );
    return this.findById(result.lastId)!;
  }

  static update(id: number, data: Partial<Omit<Warehouse, 'id' | 'created_at'>>): Warehouse | undefined {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
    if (data.ubicacion) { fields.push('ubicacion = ?'); values.push(data.ubicacion); }
    if (data.ciudad) { fields.push('ciudad = ?'); values.push(data.ciudad); }
    if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo ? 1 : 0); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    runExec(`UPDATE warehouses SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }
}
