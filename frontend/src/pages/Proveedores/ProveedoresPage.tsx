import { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Layout } from '../../components/layout/Layout';
import { suppliersAPI } from '../../services/api';

interface Supplier {
  id: number;
  nit: string;
  nombre: string;
  contacto: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  ciudad: string;
  activo: number;
}

export function ProveedoresPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    nit: '', nombre: '', contacto: '', telefono: '', email: '', direccion: '', ciudad: 'Pereira'
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const res = await suppliersAPI.getAll();
      setSuppliers(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await suppliersAPI.update(editingSupplier.id, formData);
      } else {
        await suppliersAPI.create(formData);
      }
      setShowModal(false);
      loadSuppliers();
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este proveedor?')) return;
    try {
      await suppliersAPI.delete(id);
      loadSuppliers();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const resetForm = () => {
    setFormData({ nit: '', nombre: '', contacto: '', telefono: '', email: '', direccion: '', ciudad: 'Pereira' });
    setEditingSupplier(null);
  };

  const openEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      nit: supplier.nit,
      nombre: supplier.nombre,
      contacto: supplier.contacto || '',
      telefono: supplier.telefono || '',
      email: supplier.email || '',
      direccion: supplier.direccion || '',
      ciudad: supplier.ciudad
    });
    setShowModal(true);
  };

  const columns = [
    { key: 'nit', header: 'NIT' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'contacto', header: 'Contacto' },
    { key: 'telefono', header: 'Teléfono' },
    { key: 'email', header: 'Email' },
    { key: 'ciudad', header: 'Ciudad' },
    { key: 'acciones', header: 'Acciones', render: (s: Supplier) => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => openEdit(s)}>Editar</Button>
        <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>Eliminar</Button>
      </div>
    )}
  ];

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Proveedores</h1>
            <p className="text-slate-500 dark:text-slate-400">Gestión de proveedores del sector textil</p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true); }}>+ Nuevo Proveedor</Button>
        </div>

        <Card>
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div></div>
          ) : (
            <Table columns={columns} data={suppliers} keyExtractor={(s) => s.id} emptyMessage="No hay proveedores" />
          )}
        </Card>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'} size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="NIT" value={formData.nit} onChange={(e) => setFormData({ ...formData, nit: e.target.value })} required />
              <Input label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
            </div>
            <Input label="Persona de Contacto" value={formData.contacto} onChange={(e) => setFormData({ ...formData, contacto: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Teléfono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
              <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <Input label="Dirección" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
            <Select label="Ciudad" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} options={[
              { value: 'Pereira', label: 'Pereira' },
              { value: 'Armenia', label: 'Armenia' },
              { value: 'Manizales', label: 'Manizales' },
              { value: 'Cartago', label: 'Cartago' },
              { value: 'Calarcá', label: 'Calarcá' },
              { value: 'La Tebaida', label: 'La Tebaida' }
            ]} />
            <div className="flex gap-2 pt-4">
              <Button type="submit">{editingSupplier ? 'Actualizar' : 'Crear'}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
