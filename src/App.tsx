import { useState } from 'react';
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

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

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

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'routes': return <RoutesPlanningView />;
      case 'deliveries': return <DeliveriesView />;
      case 'fleet': return <FleetView />;
      case 'clients': return <ClientsView />;
      case 'reports': return <ReportsView />;
      case 'notifications': return <NotificationsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 overflow-auto">
        {renderView()}
      </div>
    </div>
  );
}

export default App;
