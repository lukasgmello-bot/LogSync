import React, { useEffect, useState } from 'react';
import { Plus, MapPin, Clock, DollarSign, Truck } from 'lucide-react';
import { supabase, Route, Vehicle, Driver } from '../../lib/supabase';

export const RoutesPlanningView: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [routesRes, vehiclesRes, driversRes] = await Promise.all([
      supabase.from('routes').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('vehicles').select('*'),
      supabase.from('drivers').select('*'),
    ]);

    if (routesRes.data) setRoutes(routesRes.data);
    if (vehiclesRes.data) setVehicles(vehiclesRes.data);
    if (driversRes.data) setDrivers(driversRes.data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Planning</h1>
          <p className="text-gray-600 mt-1">Create and optimize delivery routes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Create Route</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="aspect-video bg-gray-100 rounded-t-xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Interactive Map View</p>
            <p className="text-sm text-gray-500 mt-1">Route visualization and waypoint management</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Routes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No routes found. Create your first route to get started.
                  </td>
                </tr>
              ) : (
                routes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Truck className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900">{route.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                        {route.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.total_distance_km.toFixed(1)} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      {route.estimated_duration_minutes} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        {route.estimated_fuel_cost.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">View Details</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
