import React from 'react';
import { LayoutDashboard, Map, Package, Truck, Users, BarChart3, Settings, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from "react-i18next";

type SidebarProps = {
  currentView: string;
  onViewChange: (view: string) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { profile, signOut } = useAuth();
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'routes', label: t('route_planning'), icon: Map },
    { id: 'deliveries', label: t('deliveries'), icon: Package },
    { id: 'fleet', label: t('fleet_drivers'), icon: Truck },
    { id: 'clients', label: t('clients'), icon: Users },
    { id: 'reports', label: t('reports'), icon: BarChart3 },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">LogiSync</h1>
        <p className="text-sm text-slate-400 mt-1">Logistics Platform</p>
      </div>
      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {menuItems.map(({id, label, icon: Icon}) => {
            const isActive = currentView === id;
            return (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      {/* ... */}
    </div>
  );
};