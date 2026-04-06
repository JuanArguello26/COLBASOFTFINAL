export interface User {
  id: number;
  email: string;
  password_hash: string;
  nombre: string;
  rol: 'admin' | 'operario';
  activo: boolean;
  created_at: string;
}

export interface Warehouse {
  id: number;
  nombre: string;
  ubicacion: string;
  ciudad: string;
  activo: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria: 'tela' | 'insumo' | 'prenda';
  unidad: 'metros' | 'unidades' | 'kilogramos';
  stock_actual: number;
  stock_minimo: number;
  precio_unitario: number;
  proveedor: string | null;
  warehouse_id: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Movement {
  id: number;
  product_id: number;
  warehouse_id: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  motivo: string | null;
  user_id: number;
  created_at: string;
}

export interface Alert {
  id: number;
  product_id: number | null;
  warehouse_id: number;
  tipo: 'bajo_stock' | 'stock_critico' | 'stock_agotado';
  mensaje: string;
  leida: boolean;
  created_at: string;
}

export interface Log {
  id: number;
  user_id: number | null;
  accion: string;
  entidad: 'product' | 'movement' | 'user' | 'warehouse' | 'alert';
  entidad_id: number | null;
  detalle: string | null;
  created_at: string;
}

export interface AuthRequest extends Express.Request {
  user?: User;
}
