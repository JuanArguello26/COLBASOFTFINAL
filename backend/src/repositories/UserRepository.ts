import { runQuery, runExec, saveDatabase } from '../models/database';
import { User } from '../types';
import bcrypt from 'bcryptjs';

export class UserRepository {
  static findAll(): User[] {
    const rows = runQuery('SELECT * FROM users WHERE activo = 1 ORDER BY nombre');
    return rows as User[];
  }

  static findById(id: number): User | undefined {
    const rows = runQuery('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] as User | undefined;
  }

  static findByEmail(email: string): User | undefined {
    const rows = runQuery('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] as User | undefined;
  }

  static create(data: { email: string; password: string; nombre: string; rol: 'admin' | 'operario' }): User {
    const password_hash = bcrypt.hashSync(data.password, 10);
    const result = runExec(
      'INSERT INTO users (email, password_hash, nombre, rol) VALUES (?, ?, ?, ?)',
      [data.email, password_hash, data.nombre, data.rol]
    );
    return this.findById(result.lastId)!;
  }

  static update(id: number, data: Partial<Omit<User, 'id' | 'created_at' | 'password_hash'>>): User | undefined {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
    if (data.rol) { fields.push('rol = ?'); values.push(data.rol); }
    if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo ? 1 : 0); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    runExec(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static delete(id: number): boolean {
    const result = runExec('UPDATE users SET activo = 0 WHERE id = ?', [id]);
    return result.changes > 0;
  }

  static verifyPassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password_hash);
  }
}
