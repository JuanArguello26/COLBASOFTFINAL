import { useState, useEffect } from 'react';
import { productsAPI, movementsAPI } from '../../services/api';
import { Product, Movement } from '../../types';
import { Card } from '../../components/common/Card';
import { Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Layout } from '../../components/layout/Layout';

export function TrazabilidadPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await productsAPI.getAll();
      setProducts(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadTrazabilidad = async (productId: number) => {
    setLoading(true);
    try {
      const res = await movementsAPI.getAll({ product_id: productId, limit: 50 });
      setMovements(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (productId: number) => {
    setSelectedProduct(productId);
    if (productId) {
      loadTrazabilidad(productId);
    } else {
      setMovements([]);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Trazabilidad</h1>
          <p className="text-slate-500 dark:text-slate-400">Historial completo de movimientos por producto</p>
        </div>

        <Card className="mb-6">
          <div className="max-w-md">
            <Select
              label="Seleccionar Producto"
              value={selectedProduct || ''}
              onChange={(e) => handleProductChange(Number(e.target.value))}
              options={[
                { value: '', label: 'Seleccione un producto...' },
                ...products.map(p => ({ value: String(p.id), label: `${p.codigo} - ${p.nombre}` }))
              ]}
            />
          </div>
        </Card>

        {selectedProduct && (
          <>
            <Card className="mb-6">
              <div className="flex items-center gap-4">
                {products.filter(p => p.id === selectedProduct).map(p => (
                  <div key={p.id} className="flex-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Producto</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{p.nombre}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Código: {p.codigo}</p>
                  </div>
                ))}
                {products.filter(p => p.id === selectedProduct).map(p => (
                  <div key={p.id} className="text-right">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Stock Actual</p>
                    <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{p.stock_actual} {p.unidad}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title={`Historial de Movimientos (${movements.length})`}>
              {loading ? (
                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div></div>
              ) : movements.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">No hay movimientos registrados</p>
              ) : (
                <div className="space-y-3">
                  {movements.map(m => (
                    <div key={m.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        m.tipo === 'entrada' ? 'bg-success-100 dark:bg-success-900/30 text-success-500 dark:text-success-400' :
                        m.tipo === 'salida' ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-500 dark:text-danger-400' :
                        'bg-warning-100 dark:bg-warning-900/30 text-warning-500 dark:text-warning-400'
                      }`}>
                        {m.tipo === 'entrada' ? '↓' : m.tipo === 'salida' ? '↑' : '↔'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800 dark:text-slate-100 capitalize">{m.tipo}</span>
                          {m.tipo === 'entrada' ? (
                            <Badge variant="success">+{m.cantidad}</Badge>
                          ) : m.tipo === 'salida' ? (
                            <Badge variant="danger">-{m.cantidad}</Badge>
                          ) : (
                            <Badge variant="warning">{m.cantidad > 0 ? '+' : ''}{m.cantidad}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{m.motivo || 'Sin motivo'}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Stock: {m.stock_anterior} → {m.stock_nuevo}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(m.created_at)}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">ID: {m.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
