import { initializeDatabase, runQuery, runExec, saveDatabase } from './models/database';
import { UserRepository } from './repositories/UserRepository';
import { WarehouseRepository } from './repositories/WarehouseRepository';
import { ProductRepository } from './repositories/ProductRepository';
import { MovementRepository } from './repositories/MovementRepository';
import { AlertRepository } from './repositories/AlertRepository';

async function seed() {
  console.log('🌱 Iniciando seed de datos...');
  
  await initializeDatabase();
  
  runExec('DELETE FROM logs');
  runExec('DELETE FROM alerts');
  runExec('DELETE FROM movements');
  runExec('DELETE FROM products');
  runExec('DELETE FROM users');
  runExec('DELETE FROM warehouses');
  
  console.log('👤 Creando usuarios...');
  const admin = UserRepository.create({
    email: 'admin@colbasoft.com',
    password: 'admin123',
    nombre: 'Carlos Martínez',
    rol: 'admin'
  });
  
  const operario1 = UserRepository.create({
    email: 'operario1@colbasoft.com',
    password: 'operario123',
    nombre: 'María López',
    rol: 'operario'
  });
  
  const operario2 = UserRepository.create({
    email: 'operario2@colbasoft.com',
    password: 'operario123',
    nombre: 'Pedro Gómez',
    rol: 'operario'
  });
  
  console.log('🏭 Creando almacenes del Eje Cafetero...');
  const warehouse1 = WarehouseRepository.create({
    nombre: 'Almacén Central Pereira',
    ubicacion: 'Zona Industrial de Pereira',
    ciudad: 'Pereira'
  });
  
  const warehouse2 = WarehouseRepository.create({
    nombre: 'Almacén Armenia',
    ubicacion: 'Zona Franca Armenia',
    ciudad: 'Armenia'
  });
  
  const warehouse3 = WarehouseRepository.create({
    nombre: 'Almacén Manizales',
    ubicacion: 'Sector del Estadio',
    ciudad: 'Manizales'
  });
  
  console.log('📦 Creando productos (telas, insumos, prendas)...');
  
  const products = [
    { codigo: 'TELA001', nombre: 'Algodón Orgánico Blanco', descripcion: 'Tela de algodón orgánico de alta calidad', categoria: 'tela' as const, unidad: 'metros' as const, stock_actual: 1500, stock_minimo: 200, precio_unitario: 15000, proveedor: 'Textiles del Eje' },
    { codigo: 'TELA002', nombre: 'Denim Azul Oscuro', descripcion: 'Tela jeans resistente para pantalones', categoria: 'tela' as const, unidad: 'metros' as const, stock_actual: 800, stock_minimo: 150, precio_unitario: 22000, proveedor: 'Denim Colombia' },
    { codigo: 'TELA003', nombre: 'Lino Beige Natural', descripcion: 'Tela de lino 100% natural', categoria: 'tela' as const, unidad: 'metros' as const, stock_actual: 50, stock_minimo: 100, precio_unitario: 28000, proveedor: 'Fibras del Café' },
    { codigo: 'TELA004', nombre: 'Poliamida Negra', descripcion: 'Tela sintética para uniformes', categoria: 'tela' as const, unidad: 'metros' as const, stock_actual: 1200, stock_minimo: 200, precio_unitario: 18000, proveedor: 'Textiles del Eje' },
    { codigo: 'TELA005', nombre: 'Franela Gris', descripcion: 'Tela suave para camisas interiores', categoria: 'tela' as const, unidad: 'metros' as const, stock_actual: 5, stock_minimo: 100, precio_unitario: 12000, proveedor: 'TexCafé' },
    { codigo: 'INS001', nombre: 'Hilo de Coser Negro', descripcion: 'Hilo industrial de alta resistencia', categoria: 'insumo' as const, unidad: 'unidades' as const, stock_actual: 500, stock_minimo: 50, precio_unitario: 2500, proveedor: 'Ferretería Textil' },
    { codigo: 'INS002', nombre: 'Botones Metálicos', descripcion: 'Botones automáticos de metal', categoria: 'insumo' as const, unidad: 'unidades' as const, stock_actual: 2000, stock_minimo: 200, precio_unitario: 800, proveedor: 'Botones del Eje' },
    { codigo: 'INS003', nombre: 'Cierres de Cremallera 50cm', descripcion: 'Cierres de nylon reforzados', categoria: 'insumo' as const, unidad: 'unidades' as const, stock_actual: 300, stock_minimo: 100, precio_unitario: 3500, proveedor: 'Cierres Colombia' },
    { codigo: 'INS004', nombre: 'Elástico 2cm', descripcion: 'Elástico para cintura', categoria: 'insumo' as const, unidad: 'metros' as const, stock_actual: 15, stock_minimo: 50, precio_unitario: 1500, proveedor: 'TexCafé' },
    { codigo: 'INS005', nombre: 'Etiqueta de Marca', descripcion: 'Etiquetas bordadas personalizadas', categoria: 'insumo' as const, unidad: 'unidades' as const, stock_actual: 8000, stock_minimo: 500, precio_unitario: 200, proveedor: 'Etikett' },
    { codigo: 'PRENDA001', nombre: 'Camisa Casual Manga Larga', descripcion: 'Camisa de mezclilla para hombre', categoria: 'prenda' as const, unidad: 'unidades' as const, stock_actual: 120, stock_minimo: 30, precio_unitario: 85000, proveedor: 'Confección Café' },
    { codigo: 'PRENDA002', nombre: 'Pantalón Jeans Slim', descripcion: 'Pantalón denim ajuste moderno', categoria: 'prenda' as const, unidad: 'unidades' as const, stock_actual: 80, stock_minimo: 25, precio_unitario: 95000, proveedor: 'Denim Colombia' },
    { codigo: 'PRENDA003', nombre: 'Camiseta Básica Blanca', descripcion: 'Camiseta de algodón básica', categoria: 'prenda' as const, unidad: 'unidades' as const, stock_actual: 200, stock_minimo: 50, precio_unitario: 25000, proveedor: 'Confección Café' },
    { codigo: 'PRENDA004', nombre: 'Overol Industrial', descripcion: 'Overol de mezclilla para trabajo', categoria: 'prenda' as const, unidad: 'unidades' as const, stock_actual: 8, stock_minimo: 15, precio_unitario: 120000, proveedor: 'Industrial Wear' },
    { codigo: 'PRENDA005', nombre: 'Chaqueta de Franela', descripcion: 'Chaqueta de franela para hombre', categoria: 'prenda' as const, unidad: 'unidades' as const, stock_actual: 45, stock_minimo: 20, precio_unitario: 135000, proveedor: 'Confección Café' }
  ];
  
  const createdProducts = products.map((p, index) => {
    return ProductRepository.create({
      ...p,
      warehouse_id: (index % 3) + 1
    });
  });
  
  console.log('🔄 Creando movimientos de ejemplo...');
  
  const movementTypes = ['entrada', 'salida'] as const;
  const userIds = [1, 2, 3];
  
  for (let i = 0; i < 25; i++) {
    const productIndex = Math.floor(Math.random() * createdProducts.length);
    const product = createdProducts[productIndex];
    const tipo = movementTypes[Math.floor(Math.random() * 2)];
    const cantidad = Math.floor(Math.random() * 50) + 1;
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    
    const stockAnterior = product.stock_actual;
    const stockNuevo = tipo === 'entrada' ? stockAnterior + cantidad : Math.max(0, stockAnterior - cantidad);
    
    MovementRepository.create({
      product_id: product.id,
      warehouse_id: product.warehouse_id,
      tipo,
      cantidad,
      stock_anterior: stockAnterior,
      stock_nuevo: stockNuevo,
      motivo: tipo === 'entrada' ? 'Compra a proveedor' : 'Venta/Producción',
      user_id: userId
    });
    
    ProductRepository.updateStock(product.id, stockNuevo);
  }
  
  console.log('⚠️ Creando alertas de ejemplo...');
  
  AlertRepository.create({
    product_id: 3,
    warehouse_id: 1,
    tipo: 'bajo_stock',
    mensaje: '🟡 BAJO STOCK: Lino Beige Natural - Stock: 50 metros'
  });
  
  AlertRepository.create({
    product_id: 5,
    warehouse_id: 1,
    tipo: 'stock_critico',
    mensaje: '🔴 STOCK CRÍTICO: Franela Gris - Stock: 5 metros'
  });
  
  AlertRepository.create({
    product_id: 9,
    warehouse_id: 3,
    tipo: 'bajo_stock',
    mensaje: '🟡 BAJO STOCK: Elástico 2cm - Stock: 15 metros'
  });
  
  AlertRepository.create({
    product_id: 14,
    warehouse_id: 2,
    tipo: 'stock_agotado',
    mensaje: '⚠️ STOCK AGOTADO: Overol Industrial'
  });
  
  console.log('✅ Seed completado exitosamente!');
  console.log('');
  console.log('📋 Credenciales de acceso:');
  console.log('   Admin: admin@colbasoft.com / admin123');
  console.log('   Operario: operario1@colbasoft.com / operario123');
  console.log('');
  console.log('🏭 Almacenes: Pereira, Armenia, Manizales');
  console.log('📦 Productos: 15 (telas, insumos, prendas)');
}

seed();
