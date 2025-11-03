import React, { useEffect, useState } from 'react';
import { Truck, User, Plus } from 'lucide-react';
import { supabase, Vehicle, Driver } from '../../lib/supabase';

export const FleetView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'drivers'>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [vehiclesRes, driversRes] = await Promise.all([
      supabase.from('vehicles').select('*').order('license_plate'),
      supabase.from('drivers').select('*').order('created_at', { ascending: false }),
    ]);

    if (vehiclesRes.data) setVehicles(vehiclesRes.data);
    if (driversRes.data) setDrivers(driversRes.data);
  };

  const getVehicleStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in_use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDriverStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'on_route': return 'bg-blue-100 text-blue-800';
      case 'off_duty': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet & Driver Management</h1>
          <p className="text-gray-600 mt-1">Manage vehicles and driver assignments</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          <span>Add {activeTab === 'vehicles' ? 'Vehicle' : 'Driver'}</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'vehicles'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vehicles ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'drivers'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Drivers ({drivers.length})
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'vehicles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.length === 0 ? (
            <div className="col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No vehicles found</p>
              <p className="text-sm text-gray-500 mt-1">Add your first vehicle to get started</p>
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{vehicle.license_plate}</h3>
                      <p className="text-sm text-gray-500">{vehicle.model}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getVehicleStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium text-gray-900">{vehicle.capacity_kg} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fuel Consumption</span>
                    <span className="font-medium text-gray-900">{vehicle.fuel_consumption_per_km} L/km</span>
                  </div>
                  {vehicle.last_maintenance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Maintenance</span>
                      <span className="font-medium text-gray-900">
                        {new Date(vehicle.last_maintenance).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Deliveries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drivers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No drivers found. Add your first driver to get started.
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">Driver #{driver.id.slice(0, 8)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {driver.license_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDriverStatusColor(driver.availability_status)}`}>
                          {driver.availability_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ⭐ {driver.rating.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {driver.total_deliveries}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">View Profile</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
