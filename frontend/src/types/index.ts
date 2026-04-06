export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: 'admin' | 'operario';
  activo?: boolean;
  created_at?: string;
}

export interface Warehouse {
  id: number;
  nombre: string;
  ubicacion: string;
  ciudad: string;
  activo?: boolean;
  created_at?: string;
}

export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: 'tela' | 'insumo' | 'prenda';
  unidad: 'metros' | 'unidades' | 'kilogramos';
  stock_actual: number;
  stock_minimo: number;
  precio_unitario: number;
  proveedor?: string;
  warehouse_id: number;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Movement {
  id: number;
  product_id: number;
  warehouse_id: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  motivo?: string;
  user_id: number;
  created_at: string;
}

export interface Alert {
  id: number;
  product_id?: number;
  warehouse_id?: number;
  tipo: 'bajo_stock' | 'stock_critico' | 'stock_agotado';
  mensaje: string;
  leida: boolean;
  created_at: string;
}

export interface Log {
  id: number;
  user_id?: number;
  accion: string;
  entidad: 'product' | 'movement' | 'user' | 'warehouse' | 'alert';
  entidad_id?: number;
  detalle?: string;
  created_at: string;
}

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

export interface KPIs {
  valor_total_inventario: number;
  promedio_unitario: number;
  tasa_rotacion: number;
  entradas_mes: number;
  salidas_mes: number;
  productos_activos: number;
}
