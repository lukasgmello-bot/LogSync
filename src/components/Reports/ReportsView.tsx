import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, TrendingUp, BarChart3 } from 'lucide-react';
import { supabase, AnalyticsSnapshot } from '../../lib/supabase';

export const ReportsView: React.FC = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const { data } = await supabase
      .from('analytics_snapshots')
      .select('*')
      .order('snapshot_date', { ascending: false })
      .limit(7);

    if (data) setAnalytics(data);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Routes', 'Deliveries', 'Distance (km)', 'Fuel Cost', 'Avg Time (min)', 'On Time', 'Delayed'],
      ...analytics.map(a => [
        a.snapshot_date,
        a.total_routes,
        a.total_deliveries,
        a.total_distance_km,
        a.total_fuel_cost,
        a.average_delivery_time_minutes,
        a.on_time_deliveries,
        a.delayed_deliveries,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logisync-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('reports_analytics')}</h1>
          <p className="text-gray-600 mt-1">{t('view_performance_metrics')}</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Download className="w-5 h-5" />
          <span>{t('export_csv')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('performance_trends')}</h2>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{t('performance_chart_visualization')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('delivery_success_rate')}</h2>
            <BarChart3 className="w-5 h-5 text-green-600" />
          </div>
          <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {analytics.length > 0 && analytics[0].total_deliveries > 0
                  ? ((analytics[0].on_time_deliveries / analytics[0].total_deliveries) * 100).toFixed(1)
                  : 0}%
              </div>
              <p className="text-sm text-gray-600">{t('on_time_delivery_rate')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{t('daily_analytics')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('routes')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('deliveries')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('distance')} ({t('km')})
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('fuel_cost')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('avg_time')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('success_rate')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {t('no_analytics_data')}
                  </td>
                </tr>
              ) : (
                analytics.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(item.snapshot_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.total_routes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.total_deliveries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.total_distance_km.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.total_fuel_cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
	                      {item.average_delivery_time_minutes.toFixed(0)} {t('min')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.total_deliveries > 0
                        ? ((item.on_time_deliveries / item.total_deliveries) * 100).toFixed(1)
                        : 0}%
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
