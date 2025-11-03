import React, { useEffect, useState } from 'react';
import { Users, Plus, Mail, Phone, MapPin } from 'lucide-react';
import { supabase, Client } from '../../lib/supabase';

export const ClientsView: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('name');

    if (data) setClients(data);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-1">Manage your delivery clients and recipients</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          <span>Add Client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.length === 0 ? (
          <div className="col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No clients found</p>
            <p className="text-sm text-gray-500 mt-1">Add your first client to get started</p>
          </div>
        ) : (
          clients.map((client) => (
            <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {client.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{client.phone}</span>
                  </div>
                )}
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-700">{client.address}</span>
                </div>
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
