import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Package, Truck, DollarSign, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type KPICardProps = {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
};

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

export const DashboardView: React.FC = () => {
  const [stats, setStats] = useState({
    totalRoutes: 0,
    activeDeliveries: 0,
    activeVehicles: 0,
    avgDeliveryTime: 0,
    totalFuelCost: 0,
    onTimeRate: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [routesRes, deliveriesRes, vehiclesRes, analyticsRes] = await Promise.all([
        supabase.from('routes').select('*', { count: 'exact' }).eq('status', 'in_progress'),
        supabase.from('deliveries').select('*', { count: 'exact' }).in('status', ['pending', 'in_transit']),
        supabase.from('vehicles').select('*', { count: 'exact' }).eq('status', 'in_use'),
        supabase.from('analytics_snapshots').select('*').eq('snapshot_date', today).maybeSingle(),
      ]);

      const analytics = analyticsRes.data;

      setStats({
        totalRoutes: routesRes.count || 0,
        activeDeliveries: deliveriesRes.count || 0,
        activeVehicles: vehiclesRes.count || 0,
        avgDeliveryTime: analytics?.average_delivery_time_minutes || 0,
        totalFuelCost: analytics?.total_fuel_cost || 0,
        onTimeRate: analytics
          ? ((analytics.on_time_deliveries / (analytics.on_time_deliveries + analytics.delayed_deliveries)) * 100) || 0
          : 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your operations overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Active Routes"
          value={stats.totalRoutes}
          change={8}
          trend="up"
          icon={<Package className="w-6 h-6" />}
        />
        <KPICard
          title="Active Deliveries"
          value={stats.activeDeliveries}
          icon={<Package className="w-6 h-6" />}
        />
        <KPICard
          title="Active Vehicles"
          value={stats.activeVehicles}
          icon={<Truck className="w-6 h-6" />}
        />
        <KPICard
          title="Avg Delivery Time"
          value={`${Math.round(stats.avgDeliveryTime)} min`}
          change={5}
          trend="down"
          icon={<Clock className="w-6 h-6" />}
        />
        <KPICard
          title="Total Fuel Cost"
          value={`$${stats.totalFuelCost.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6" />}
        />
        <KPICard
          title="On-Time Rate"
          value={`${stats.onTimeRate.toFixed(1)}%`}
          change={12}
          trend="up"
          icon={<TrendingUp className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-700">Route #1234 completed successfully</p>
              <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-700">New delivery assigned to Driver #5</p>
              <span className="text-xs text-gray-500 ml-auto">15 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm text-gray-700">Vehicle #AB-123 scheduled for maintenance</p>
              <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Routes Efficiency</span>
                <span className="font-medium text-gray-900">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Fleet Utilization</span>
                <span className="font-medium text-gray-900">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Driver Availability</span>
                <span className="font-medium text-gray-900">64%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
