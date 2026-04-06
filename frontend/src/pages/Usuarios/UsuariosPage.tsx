import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { User } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';

export function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', nombre: '', rol: 'operario' as 'admin' | 'operario' });
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await usersAPI.getAll();
      setUsers(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const { password, ...data } = formData;
        await usersAPI.update(editingUser.id, password ? formData : data);
      } else {
        await usersAPI.create(formData);
      }
      setShowModal(false);
      loadUsers();
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;
    try {
      await usersAPI.delete(id);
      loadUsers();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', nombre: '', rol: 'operario' });
    setEditingUser(null);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ email: user.email, password: '', nombre: user.nombre, rol: user.rol });
    setShowModal(true);
  };

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    { key: 'rol', header: 'Rol', render: (u: User) => (
      <Badge variant={u.rol === 'admin' ? 'info' : 'default'}>{u.rol}</Badge>
    )},
    { key: 'activo', header: 'Estado', render: (u: User) => (
      <Badge variant={u.activo ? 'success' : 'danger'}>{u.activo ? 'Activo' : 'Inactivo'}</Badge>
    )},
    { key: 'created_at', header: 'Creado', render: (u: User) => new Date(u.created_at || '').toLocaleDateString('es-CO') },
    { key: 'acciones', header: 'Acciones', render: (u: User) => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => openEdit(u)}>Editar</Button>
        {u.id !== currentUser?.id && (
          <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>Eliminar</Button>
        )}
      </div>
    )}
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Usuarios</h1>
            <p className="text-slate-500 dark:text-slate-400">Gestión de usuarios del sistema</p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true); }}>+ Nuevo Usuario</Button>
        </div>

        <Card>
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div></div>
          ) : (
            <Table columns={columns} data={users} keyExtractor={(u) => u.id} emptyMessage="No hay usuarios" />
          )}
        </Card>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={!!editingUser} />
            <Input label={editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'} type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingUser} />
            <Select label="Rol" value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value as 'admin' | 'operario' })} options={[
              { value: 'operario', label: 'Operario' },
              { value: 'admin', label: 'Administrador' }
            ]} />
            <div className="flex gap-2 pt-4">
              <Button type="submit">{editingUser ? 'Actualizar' : 'Crear'}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
