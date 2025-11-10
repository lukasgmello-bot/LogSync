import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, AlertCircle, CheckCircle, Info, Wrench } from 'lucide-react';
import { supabase, Notification } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const NotificationsView: React.FC = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setNotifications(data);
  };

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, is_read: true } : n
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'deviation': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'maintenance': return <Wrench className="w-5 h-5 text-blue-600" />;
      case 'general': return <Info className="w-5 h-5 text-gray-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'delay': return 'bg-yellow-50';
      case 'deviation': return 'bg-red-50';
      case 'maintenance': return 'bg-blue-50';
      case 'general': return 'bg-gray-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('notifications')}</h1>
          <p className="text-gray-600 mt-1">{t('stay_updated_with_alerts')}</p>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">{t('no_notifications')}</p>
            <p className="text-sm text-gray-500 mt-1">{t('youre_all_caught_up')}</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition ${
                !notification.is_read ? 'border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeBg(notification.type)}`}>
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
	                        <span>{t('mark_as_read')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
