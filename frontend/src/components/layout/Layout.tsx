import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';

const menuItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/inventario', icon: '📦', label: 'Inventario' },
  { to: '/movimientos', icon: '🔄', label: 'Movimientos' },
  { to: '/trazabilidad', icon: '🔍', label: 'Trazabilidad' },
  { to: '/usuarios', icon: '👥', label: 'Usuarios', adminOnly: true }
];

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 fixed h-full">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-xl font-bold text-primary-600">COLBASOFT</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sistema Logístico Textil</p>
        </div>
        
        <nav className="p-4">
          {menuItems.map(item => {
            if (item.adminOnly && user?.rol !== 'admin') return null;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
              {user?.nombre.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{user?.nombre}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.rol}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-danger-500 dark:hover:text-danger-400 transition-colors text-left"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <div className="p-4 flex justify-end">
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
