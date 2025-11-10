import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Map, Package, Truck, Users, BarChart3, Settings, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type SidebarProps = {};

export const Sidebar: React.FC<SidebarProps> = () => {
  const { t } = useTranslation();
  const { profile, signOut } = useAuth();
  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { id: 'routes', label: t('routes'), icon: Map, path: '/routes' },
    { id: 'deliveries', label: t('deliveries'), icon: Package, path: '/deliveries' },
    { id: 'fleet', label: t('fleet'), icon: Truck, path: '/fleet' },
    { id: 'clients', label: t('clients'), icon: Users, path: '/clients' },
    { id: 'reports', label: t('reports'), icon: BarChart3, path: '/reports' },
    { id: 'notifications', label: t('notifications'), icon: Bell, path: '/notifications' },
    { id: 'settings', label: t('settings'), icon: Settings, path: '/settings' },
  ];

  // Os itens de menu foram movidos para dentro do componente para usar useTranslation.
  // O menuItems original será removido.

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">{t('app_name')}</h1>
        <p className="text-sm text-slate-400 mt-1">{t('app_tagline')}</p>
      </div>

      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
	              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
	                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">
              {profile?.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{profile?.full_name}</p>
            <p className="text-xs text-slate-400 capitalize">{profile?.role}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('sign_out')}</span>
        </button>
      </div>
    </div>
  );
};
