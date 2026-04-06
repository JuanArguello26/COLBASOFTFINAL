import { useState, useEffect } from 'react';
import { productsAPI, warehousesAPI } from '../../services/api';
import { Product, Warehouse } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select, TextArea } from '../../components/common/Input';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Layout } from '../../components/layout/Layout';

export function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [warehouseId, setWarehouseId] = useState<number | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    codigo: '', nombre: '', descripcion: '', categoria: 'tela', unidad: 'metros',
    stock_minimo: 10, precio_unitario: 0, proveedor: '', warehouse_id: 1
  });

  useEffect(() => {
    loadProducts();
    loadWarehouses();
  }, [search, categoria, warehouseId]);

  const loadProducts = async () => {
    try {
      const res = await productsAPI.getAll({
        search: search || undefined,
        categoria: categoria || undefined,
        warehouse_id: warehouseId || undefined
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWarehouses = async () => {
    try {
      const res = await warehousesAPI.getAll();
      setWarehouses(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
      } else {
        await productsAPI.create(formData);
      }
      setShowModal(false);
      loadProducts();
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este producto?')) return;
    try {
      await productsAPI.delete(id);
      loadProducts();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: '', nombre: '', descripcion: '', categoria: 'tela', unidad: 'metros',
      stock_minimo: 10, precio_unitario: 0, proveedor: '', warehouse_id: 1
    });
    setEditingProduct(null);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      codigo: product.codigo, nombre: product.nombre, descripcion: product.descripcion || '',
      categoria: product.categoria, unidad: product.unidad, stock_minimo: product.stock_minimo,
      precio_unitario: product.precio_unitario, proveedor: product.proveedor || '', warehouse_id: product.warehouse_id
    });
    setShowModal(true);
  };

  const getStockBadge = (product: Product) => {
    if (product.stock_actual <= 0) return <Badge variant="danger">Agotado</Badge>;
    if (product.stock_actual <= product.stock_minimo * 0.5) return <Badge variant="danger">Crítico</Badge>;
    if (product.stock_actual <= product.stock_minimo) return <Badge variant="warning">Bajo</Badge>;
    return <Badge variant="success">Normal</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  };

  const columns = [
    { key: 'codigo', header: 'Código' },
    { key: 'nombre', header: 'Producto' },
    { key: 'categoria', header: 'Categoría', render: (p: Product) => <span className="capitalize">{p.categoria}</span> },
    { key: 'stock_actual', header: 'Stock', render: (p: Product) => (
      <div className="flex items-center gap-2">
        <span>{p.stock_actual} {p.unidad}</span>
        {getStockBadge(p)}
      </div>
    )},
    { key: 'precio_unitario', header: 'Precio', render: (p: Product) => formatCurrency(p.precio_unitario) },
    { key: 'acciones', header: 'Acciones', render: (p: Product) => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => openEdit(p)}>Editar</Button>
        <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>Eliminar</Button>
      </div>
    )}
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Inventario</h1>
            <p className="text-slate-500 dark:text-slate-400">Gestión de productos</p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true); }}>+ Nuevo Producto</Button>
        </div>

        <Card className="mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              options={[
                { value: '', label: 'Todas las categorías' },
                { value: 'tela', label: 'Telas' },
                { value: 'insumo', label: 'Insumos' },
                { value: 'prenda', label: 'Prendas' }
              ]}
            />
            <Select
              value={warehouseId}
              onChange={(e) => setWarehouseId(Number(e.target.value))}
              options={[
                { value: '', label: 'Todos los almacenes' },
                ...warehouses.map(w => ({ value: String(w.id), label: w.nombre }))
              ]}
            />
          </div>
        </Card>

        <Card>
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div></div>
          ) : (
            <Table columns={columns} data={products} keyExtractor={(p) => p.id} emptyMessage="No hay productos" />
          )}
        </Card>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'} size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Código" value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} required />
              <Input label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
            </div>
            <TextArea label="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Categoría" value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} options={[
                { value: 'tela', label: 'Tela' }, { value: 'insumo', label: 'Insumo' }, { value: 'prenda', label: 'Prenda' }
              ]} />
              <Select label="Unidad" value={formData.unidad} onChange={(e) => setFormData({ ...formData, unidad: e.target.value })} options={[
                { value: 'metros', label: 'Metros' }, { value: 'unidades', label: 'Unidades' }, { value: 'kilogramos', label: 'Kilogramos' }
              ]} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Stock Mínimo" type="number" value={formData.stock_minimo} onChange={(e) => setFormData({ ...formData, stock_minimo: Number(e.target.value) })} />
              <Input label="Precio Unitario" type="number" value={formData.precio_unitario} onChange={(e) => setFormData({ ...formData, precio_unitario: Number(e.target.value) })} />
            </div>
            <Input label="Proveedor" value={formData.proveedor} onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })} />
            <Select label="Almacén" value={formData.warehouse_id} onChange={(e) => setFormData({ ...formData, warehouse_id: Number(e.target.value) })} options={warehouses.map(w => ({ value: String(w.id), label: w.nombre }))} />
            <div className="flex gap-2 pt-4">
              <Button type="submit">{editingProduct ? 'Actualizar' : 'Crear'}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
