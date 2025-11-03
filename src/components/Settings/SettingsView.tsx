import React, { useState } from 'react';
import { Settings, User, Lock, Bell, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const SettingsView: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'parameters'>('profile');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'security'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span className="font-medium">Security</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'notifications'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="font-medium">Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab('parameters')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'parameters'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Parameters</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={profile?.full_name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={profile?.role}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 capitalize"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue={profile?.phone || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Route Delays</p>
                      <p className="text-sm text-gray-600">Get notified when routes are delayed</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Route Deviations</p>
                      <p className="text-sm text-gray-600">Get notified about route deviations</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Maintenance Alerts</p>
                      <p className="text-sm text-gray-600">Vehicle maintenance reminders</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'parameters' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Route Parameters</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Kilometer ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue="0.50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Speed (km/h)</label>
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Stop Time (minutes)</label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    Save Parameters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
