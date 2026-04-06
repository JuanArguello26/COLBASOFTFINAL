import { runQuery, runExec } from '../models/database';

export interface Supplier {
  id: number;
  nit: string;
  nombre: string;
  contacto: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  ciudad: string;
  activo: number;
  created_at: string;
}

export class SupplierRepository {
  static findAll(): Supplier[] {
    const rows = runQuery('SELECT * FROM suppliers WHERE activo = 1 ORDER BY nombre');
    return rows as Supplier[];
  }

  static findById(id: number): Supplier | undefined {
    const rows = runQuery('SELECT * FROM suppliers WHERE id = ?', [id]);
    return rows[0] as Supplier | undefined;
  }

  static findByNit(nit: string): Supplier | undefined {
    const rows = runQuery('SELECT * FROM suppliers WHERE nit = ?', [nit]);
    return rows[0] as Supplier | undefined;
  }

  static create(data: {
    nit: string;
    nombre: string;
    contacto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    ciudad?: string;
  }): Supplier {
    const result = runExec(
      `INSERT INTO suppliers (nit, nombre, contacto, telefono, email, direccion, ciudad)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nit,
        data.nombre,
        data.contacto || null,
        data.telefono || null,
        data.email || null,
        data.direccion || null,
        data.ciudad || 'Eje Cafetero'
      ]
    );
    return this.findById(result.lastId)!;
  }

  static update(id: number, data: Partial<Omit<Supplier, 'id' | 'created_at'>>): Supplier | undefined {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nit) { fields.push('nit = ?'); values.push(data.nit); }
    if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
    if (data.contacto !== undefined) { fields.push('contacto = ?'); values.push(data.contacto); }
    if (data.telefono !== undefined) { fields.push('telefono = ?'); values.push(data.telefono); }
    if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email); }
    if (data.direccion !== undefined) { fields.push('direccion = ?'); values.push(data.direccion); }
    if (data.ciudad) { fields.push('ciudad = ?'); values.push(data.ciudad); }
    if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    runExec(`UPDATE suppliers SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static delete(id: number): boolean {
    const result = runExec('UPDATE suppliers SET activo = 0 WHERE id = ?', [id]);
    return result.changes > 0;
  }
}
