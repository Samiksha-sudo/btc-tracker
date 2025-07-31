import React from 'react';
import { AlertTriangle, Info, XCircle, Check } from 'lucide-react';
import { Alert } from '../types/analytics';

interface AlertPanelProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onAcknowledge }) => {
  const getAlertIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertBorderColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'error':
        return 'border-red-500';
      case 'warning':
        return 'border-orange-500';
      default:
        return 'border-blue-500';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Live Alerts</h3>
      
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No active alerts
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${getAlertBorderColor(alert.severity)} ${
                alert.acknowledged ? 'bg-gray-700 opacity-60' : 'bg-gray-700'
              } transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.severity)}
                  <div className="flex-1">
                    <p className="text-white font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="ml-4 p-1 rounded-full hover:bg-gray-600 transition-colors"
                    title="Acknowledge alert"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};