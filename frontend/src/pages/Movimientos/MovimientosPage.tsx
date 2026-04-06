import { useState, useEffect } from 'react';
import { movementsAPI, productsAPI, warehousesAPI } from '../../services/api';
import { Movement, Product, Warehouse } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select, TextArea } from '../../components/common/Input';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Layout } from '../../components/layout/Layout';
import { exportToPDF, exportToExcel } from '../../utils/export';

export function MovimientosPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [movimientoTipo, setMovimientoTipo] = useState<'entrada' | 'salida' | 'ajuste'>('entrada');
  const [formData, setFormData] = useState({ product_id: 0, cantidad: 0, motivo: '', warehouse_id: 1 });

  useEffect(() => {
    loadData();
  }, [tipoFiltro]);

  const loadData = async () => {
    try {
      const [movRes, prodRes, warRes] = await Promise.all([
        movementsAPI.getAll({ tipo: tipoFiltro || undefined, limit: 100 }),
        productsAPI.getAll(),
        warehousesAPI.getAll()
      ]);
      setMovements(movRes.data);
      setProducts(prodRes.data);
      setWarehouses(warRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (movimientoTipo === 'entrada') {
        await movementsAPI.entrada(formData);
      } else if (movimientoTipo === 'salida') {
        await movementsAPI.salida(formData);
      } else {
        await movementsAPI.ajuste(formData);
      }
      setShowModal(false);
      loadData();
      setFormData({ product_id: 0, cantidad: 0, motivo: '', warehouse_id: 1 });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al registrar');
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return <Badge variant="success">Entrada</Badge>;
      case 'salida': return <Badge variant="danger">Salida</Badge>;
      case 'ajuste': return <Badge variant="warning">Ajuste</Badge>;
      default: return <Badge>{tipo}</Badge>;
    }
  };

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product?.nombre || 'Desconocido';
  };

  const movementColumns = [
    { key: 'id', header: 'ID' },
    { key: 'tipo', header: 'Tipo' },
    { key: 'product_id', header: 'Producto' },
    { key: 'cantidad', header: 'Cantidad' },
    { key: 'stock_anterior', header: 'Stock Anterior' },
    { key: 'stock_nuevo', header: 'Stock Nuevo' },
    { key: 'motivo', header: 'Motivo' },
    { key: 'created_at', header: 'Fecha' }
  ];

  const handleExportPDF = () => {
    const data = movements.map(m => ({
      id: m.id,
      tipo: m.tipo,
      producto: getProductName(m.product_id),
      cantidad: m.cantidad,
      stock_anterior: m.stock_anterior,
      stock_nuevo: m.stock_nuevo,
      motivo: m.motivo || '',
      fecha: new Date(m.created_at).toLocaleString('es-CO')
    }));
    exportToPDF(data, movementColumns, 'movimientos', 'Historial de Movimientos');
  };

  const handleExportExcel = () => {
    const data = movements.map(m => ({
      id: m.id,
      tipo: m.tipo,
      producto: getProductName(m.product_id),
      cantidad: m.cantidad,
      stock_anterior: m.stock_anterior,
      stock_nuevo: m.stock_nuevo,
      motivo: m.motivo || '',
      fecha: m.created_at
    }));
    exportToExcel(data, movementColumns, 'movimientos', 'Movimientos');
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'tipo', header: 'Tipo', render: (m: Movement) => getTipoBadge(m.tipo) },
    { key: 'product_id', header: 'Producto', render: (m: Movement) => getProductName(m.product_id) },
    { key: 'cantidad', header: 'Cantidad', render: (m: Movement) => (
      <span className={m.tipo === 'entrada' ? 'text-success-500 dark:text-success-400' : m.tipo === 'salida' ? 'text-danger-500 dark:text-danger-400' : 'text-warning-500 dark:text-warning-400'}>
        {m.tipo === 'entrada' ? '+' : m.tipo === 'salida' ? '-' : ''}{m.cantidad}
      </span>
    )},
    { key: 'stock_anterior', header: 'Stock Anterior' },
    { key: 'stock_nuevo', header: 'Stock Nuevo' },
    { key: 'motivo', header: 'Motivo' },
    { key: 'created_at', header: 'Fecha', render: (m: Movement) => new Date(m.created_at).toLocaleString('es-CO') }
  ];

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Movimientos</h1>
            <p className="text-slate-500 dark:text-slate-400">Registro de entradas, salidas y ajustes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>📄 PDF</Button>
            <Button variant="outline" onClick={handleExportExcel}>📊 Excel</Button>
            <Button variant="success" onClick={() => { setMovimientoTipo('entrada'); setShowModal(true); }}>+ Entrada</Button>
            <Button variant="danger" onClick={() => { setMovimientoTipo('salida'); setShowModal(true); }}>+ Salida</Button>
            <Button variant="warning" onClick={() => { setMovimientoTipo('ajuste'); setShowModal(true); }}>+ Ajuste</Button>
          </div>
        </div>

        <Card className="mb-6">
          <div className="flex gap-4">
            <Select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} options={[
              { value: '', label: 'Todos los tipos' },
              { value: 'entrada', label: 'Entradas' },
              { value: 'salida', label: 'Salidas' },
              { value: 'ajuste', label: 'Ajustes' }
            ]} />
          </div>
        </Card>

        <Card>
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div></div>
          ) : (
            <Table columns={columns} data={movements} keyExtractor={(m) => m.id} emptyMessage="No hay movimientos" />
          )}
        </Card>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} 
          title={`Registrar ${movimientoTipo.charAt(0).toUpperCase() + movimientoTipo.slice(1)}`} size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select label="Producto" value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: Number(e.target.value) })} 
              options={products.map(p => ({ value: String(p.id), label: `${p.codigo} - ${p.nombre} (Stock: ${p.stock_actual} ${p.unidad})` }))} />
            <Input label="Cantidad" type="number" value={formData.cantidad} onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) })} required />
            <TextArea label="Motivo" value={formData.motivo} onChange={(e) => setFormData({ ...formData, motivo: e.target.value })} 
              placeholder={movimientoTipo === 'entrada' ? 'Compra a proveedor' : movimientoTipo === 'salida' ? 'Venta/Producción' : 'Motivo del ajuste'} required />
            <Select label="Almacén" value={formData.warehouse_id} onChange={(e) => setFormData({ ...formData, warehouse_id: Number(e.target.value) })} 
              options={warehouses.map(w => ({ value: String(w.id), label: w.nombre }))} />
            <div className="flex gap-2 pt-4">
              <Button type="submit">{movimientoTipo === 'entrada' ? 'Registrar Entrada' : movimientoTipo === 'salida' ? 'Registrar Salida' : 'Registrar Ajuste'}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
