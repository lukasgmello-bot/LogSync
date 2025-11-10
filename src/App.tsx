import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n.ts';
import { useAuth } from './contexts/AuthContext';
import { AuthWrapper } from './components/Auth/AuthWrapper';
import { Sidebar } from './components/Layout/Sidebar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { RoutesPlanningView } from './components/Routes/RoutesPlanningView';
import { DeliveriesView } from './components/Deliveries/DeliveriesView';
import { FleetView } from './components/Fleet/FleetView';
import { ClientsView } from './components/Clients/ClientsView';
import { ReportsView } from './components/Reports/ReportsView';
import { NotificationsView } from './components/Notifications/NotificationsView';
import { SettingsView } from './components/Settings/SettingsView';
import LanguageSelector from './components/LanguageSelector';

function App() {
  const { user, loading } = useAuth();
  // const [currentView, setCurrentView] = useState('dashboard'); // Removido para usar react-router-dom
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthWrapper />;
  }

  // Removendo a lógica de renderização manual, agora usaremos o router.
  // O estado currentView e a função renderView serão removidos.
  // A navegação será feita pelo Sidebar, que precisará ser adaptado.

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/routes" element={<RoutesPlanningView />} />
          <Route path="/routes/create" element={<div>{t('create_route')} View Placeholder</div>} />
          <Route path="/routes/:id" element={<div>{t('view_details')} Route View Placeholder</div>} />
          <Route path="/deliveries" element={<DeliveriesView />} />
          <Route path="/fleet" element={<FleetView />} />
          <Route path="/fleet/vehicles/add" element={<div>{t('add')} {t('vehicle')} View Placeholder</div>} />
          <Route path="/fleet/vehicles/:id" element={<div>{t('view_details')} {t('vehicle')} View Placeholder</div>} />
          <Route path="/fleet/drivers/add" element={<div>{t('add')} {t('driver')} View Placeholder</div>} />
          <Route path="/fleet/drivers/:id" element={<div>{t('view_profile')} {t('driver')} View Placeholder</div>} />
          <Route path="/clients" element={<ClientsView />} />
          <Route path="/clients/add" element={<div>{t('add_client')} View Placeholder</div>} />
          <Route path="/clients/:id" element={<div>{t('view_details')} {t('client')} View Placeholder</div>} />
          <Route path="/reports" element={<ReportsView />} />
          <Route path="/notifications" element={<NotificationsView />} />
          <Route path="/settings" element={<SettingsView><LanguageSelector /></SettingsView>} />
          <Route path="*" element={<div>404 | {t('details')}</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
