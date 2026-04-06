import { runQuery, runExec } from '../models/database';
import { Product } from '../types';

export class ProductRepository {
  static findAll(filters?: { categoria?: string; warehouse_id?: number; search?: string }): Product[] {
    let query = 'SELECT * FROM products WHERE activo = 1';
    const params: any[] = [];

    if (filters?.categoria) {
      query += ' AND categoria = ?';
      params.push(filters.categoria);
    }
    if (filters?.warehouse_id) {
      query += ' AND warehouse_id = ?';
      params.push(filters.warehouse_id);
    }
    if (filters?.search) {
      query += ' AND (nombre LIKE ? OR codigo LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY nombre';
    const rows = runQuery(query, params);
    return rows as Product[];
  }

  static findById(id: number): Product | undefined {
    const rows = runQuery('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] as Product | undefined;
  }

  static findByCode(codigo: string): Product | undefined {
    const rows = runQuery('SELECT * FROM products WHERE codigo = ?', [codigo]);
    return rows[0] as Product | undefined;
  }

  static findLowStock(warehouse_id?: number): Product[] {
    let query = 'SELECT * FROM products WHERE activo = 1 AND stock_actual <= stock_minimo';
    const params: any[] = [];

    if (warehouse_id) {
      query += ' AND warehouse_id = ?';
      params.push(warehouse_id);
    }
    return runQuery(query, params) as Product[];
  }

  static findCritical(warehouse_id?: number): Product[] {
    let query = 'SELECT * FROM products WHERE activo = 1 AND stock_actual <= (stock_minimo * 0.5)';
    const params: any[] = [];

    if (warehouse_id) {
      query += ' AND warehouse_id = ?';
      params.push(warehouse_id);
    }
    return runQuery(query, params) as Product[];
  }

  static create(data: {
    codigo: string;
    nombre: string;
    descripcion?: string;
    categoria: 'tela' | 'insumo' | 'prenda';
    unidad: 'metros' | 'unidades' | 'kilogramos';
    stock_minimo?: number;
    precio_unitario?: number;
    proveedor?: string;
    warehouse_id?: number;
  }): Product {
    const result = runExec(
      `INSERT INTO products (codigo, nombre, descripcion, categoria, unidad, stock_minimo, precio_unitario, proveedor, warehouse_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.codigo,
        data.nombre,
        data.descripcion || null,
        data.categoria,
        data.unidad,
        data.stock_minimo || 10,
        data.precio_unitario || 0,
        data.proveedor || null,
        data.warehouse_id || 1
      ]
    );
    return this.findById(result.lastId)!;
  }

  static updateStock(id: number, nuevoStock: number): Product | undefined {
    runExec(
      'UPDATE products SET stock_actual = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [nuevoStock, id]
    );
    return this.findById(id);
  }

  static update(id: number, data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Product | undefined {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.codigo) { fields.push('codigo = ?'); values.push(data.codigo); }
    if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
    if (data.descripcion !== undefined) { fields.push('descripcion = ?'); values.push(data.descripcion); }
    if (data.categoria) { fields.push('categoria = ?'); values.push(data.categoria); }
    if (data.unidad) { fields.push('unidad = ?'); values.push(data.unidad); }
    if (data.stock_minimo !== undefined) { fields.push('stock_minimo = ?'); values.push(data.stock_minimo); }
    if (data.precio_unitario !== undefined) { fields.push('precio_unitario = ?'); values.push(data.precio_unitario); }
    if (data.proveedor !== undefined) { fields.push('proveedor = ?'); values.push(data.proveedor); }
    if (data.warehouse_id) { fields.push('warehouse_id = ?'); values.push(data.warehouse_id); }
    if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo ? 1 : 0); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    runExec(`UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
    return this.findById(id);
  }

  static delete(id: number): boolean {
    const result = runExec('UPDATE products SET activo = 0 WHERE id = ?', [id]);
    return result.changes > 0;
  }

  static getStats(warehouse_id?: number): { total: number; valor_total: number; bajo_stock: number; criticos: number } {
    const totalRows = runQuery(`SELECT COUNT(*) as count FROM products WHERE activo = 1 ${warehouse_id ? 'AND warehouse_id = ?' : ''}`, warehouse_id ? [warehouse_id] : []);
    const valorRows = runQuery(`SELECT SUM(stock_actual * precio_unitario) as total FROM products WHERE activo = 1 ${warehouse_id ? 'AND warehouse_id = ?' : ''}`, warehouse_id ? [warehouse_id] : []);
    const bajoStockRows = runQuery(`SELECT COUNT(*) as count FROM products WHERE activo = 1 AND stock_actual <= stock_minimo ${warehouse_id ? 'AND warehouse_id = ?' : ''}`, warehouse_id ? [warehouse_id] : []);
    const criticosRows = runQuery(`SELECT COUNT(*) as count FROM products WHERE activo = 1 AND stock_actual <= (stock_minimo * 0.5) ${warehouse_id ? 'AND warehouse_id = ?' : ''}`, warehouse_id ? [warehouse_id] : []);

    return {
      total: totalRows[0]?.count || 0,
      valor_total: valorRows[0]?.total || 0,
      bajo_stock: bajoStockRows[0]?.count || 0,
      criticos: criticosRows[0]?.count || 0
    };
  }
}
