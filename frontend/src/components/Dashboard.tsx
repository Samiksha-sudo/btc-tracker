import React, { useState } from 'react';
import { Activity, Wifi, WifiOff, Settings, Bell } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { MetricCard } from './MetricCard';
import { LineChart } from './LineChart';
import { RegionMap } from './RegionMap';
import { AlertPanel } from './AlertPanel';
import { TimeWindowSelector } from './TimeWindowSelector';
import { CampaignTable } from './CampaignTable';
import { TimeWindow } from '../types/analytics';

export const Dashboard: React.FC = () => {
  const { metrics, isConnected, alerts, acknowledgeAlert } = useWebSocket();
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('1h');
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'admin'>('overview');

  const latestMetrics = metrics[metrics.length - 1];
  const previousMetrics = metrics[metrics.length - 2];

  const getChange = (current: number, previous: number): number => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Activity className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400" />
              {unacknowledgedAlerts.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unacknowledgedAlerts.length}
                </span>
              )}
            </div>
            
            <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex space-x-8 mt-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'admin'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Admin
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <>
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <TimeWindowSelector selected={timeWindow} onChange={setTimeWindow} />
              <div className="text-sm text-gray-400">
                Last updated: {latestMetrics ? new Date(latestMetrics.timestamp).toLocaleTimeString() : 'Never'}
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Impressions"
                value={latestMetrics?.impressions || 0}
                change={latestMetrics && previousMetrics ? getChange(latestMetrics.impressions, previousMetrics.impressions) : undefined}
                trend={latestMetrics && previousMetrics && latestMetrics.impressions > previousMetrics.impressions ? 'up' : 'down'}
              />
              <MetricCard
                title="Click-Through Rate"
                value={latestMetrics?.ctr || 0}
                suffix="%"
                change={latestMetrics && previousMetrics ? getChange(latestMetrics.ctr, previousMetrics.ctr) : undefined}
                trend={latestMetrics && previousMetrics && latestMetrics.ctr > previousMetrics.ctr ? 'up' : 'down'}
              />
              <MetricCard
                title="Conversions"
                value={latestMetrics?.conversions || 0}
                change={latestMetrics && previousMetrics ? getChange(latestMetrics.conversions, previousMetrics.conversions) : undefined}
                trend={latestMetrics && previousMetrics && latestMetrics.conversions > previousMetrics.conversions ? 'up' : 'down'}
              />
              <MetricCard
                title="Revenue"
                value={latestMetrics?.revenue || 0}
                prefix="$"
                change={latestMetrics && previousMetrics ? getChange(latestMetrics.revenue, previousMetrics.revenue) : undefined}
                trend={latestMetrics && previousMetrics && latestMetrics.revenue > previousMetrics.revenue ? 'up' : 'down'}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <LineChart
                data={metrics}
                metric="impressions"
                title="Impressions Over Time"
                color="#3B82F6"
              />
              <LineChart
                data={metrics}
                metric="ctr"
                title="Click-Through Rate"
                color="#10B981"
              />
              <LineChart
                data={metrics}
                metric="conversions"
                title="Conversions"
                color="#F59E0B"
              />
              <LineChart
                data={metrics}
                metric="revenue"
                title="Revenue"
                color="#8B5CF6"
              />
            </div>

            {/* Region Map and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegionMap />
              <AlertPanel alerts={alerts} onAcknowledge={acknowledgeAlert} />
            </div>
          </>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Campaign Management</h2>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Create Campaign
              </button>
            </div>
            <CampaignTable />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Threshold Configuration */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Alert Thresholds</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span>CTR Below</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        defaultValue="2"
                        className="w-16 px-2 py-1 bg-gray-600 rounded text-sm"
                      />
                      <span className="text-sm text-gray-400">%</span>
                      <input type="checkbox" defaultChecked className="text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span>Bounce Rate Above</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        defaultValue="70"
                        className="w-16 px-2 py-1 bg-gray-600 rounded text-sm"
                      />
                      <span className="text-sm text-gray-400">%</span>
                      <input type="checkbox" defaultChecked className="text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span>Budget Spent Above</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        defaultValue="80"
                        className="w-16 px-2 py-1 bg-gray-600 rounded text-sm"
                      />
                      <span className="text-sm text-gray-400">%</span>
                      <input type="checkbox" defaultChecked className="text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>WebSocket Connection</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${isConnected ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Message Processing</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                      2,147 msg/sec
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Latency</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                      ~45ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database Status</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                      Healthy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};