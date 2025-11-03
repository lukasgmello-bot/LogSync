import React, { useEffect, useState } from 'react';
import { Package, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase, Delivery } from '../../lib/supabase';

export const DeliveriesView: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadDeliveries();
  }, [filter]);

  const loadDeliveries = async () => {
    let query = supabase.from('deliveries').select('*').order('scheduled_time', { ascending: true });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data } = await query;
    if (data) setDeliveries(data);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_transit': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'delayed': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-red-600 font-semibold';
    if (priority === 3) return 'text-yellow-600 font-medium';
    return 'text-gray-600';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
        <p className="text-gray-600 mt-1">Track and manage all deliveries and pickups</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          {['all', 'pending', 'in_transit', 'delivered', 'delayed', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deliveries.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No deliveries found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or create a new route with deliveries</p>
          </div>
        ) : (
          deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(delivery.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {delivery.type === 'delivery' ? 'Delivery' : 'Pickup'} #{delivery.id.slice(0, 8)}
                    </h3>
                    <span className={`text-xs ${getPriorityColor(delivery.priority)}`}>
                      Priority: {delivery.priority}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                  {delivery.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="text-sm text-gray-900">{delivery.address}</p>
                </div>

                {delivery.scheduled_time && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Scheduled Time</p>
                    <p className="text-sm text-gray-900">
                      {new Date(delivery.scheduled_time).toLocaleString()}
                    </p>
                  </div>
                )}

                {delivery.weight_kg && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Weight</p>
                    <p className="text-sm text-gray-900">{delivery.weight_kg} kg</p>
                  </div>
                )}

                {delivery.notes && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-700 italic">{delivery.notes}</p>
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
    </div>
  );
};
