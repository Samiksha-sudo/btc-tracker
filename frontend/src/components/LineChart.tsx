import React from 'react';
import { MetricData } from '../types/analytics';

interface LineChartProps {
  data: MetricData[];
  metric: keyof MetricData;
  title: string;
  color?: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  metric,
  title,
  color = '#3B82F6',
  height = 200
}) => {
  if (data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          Waiting for data...
        </div>
      </div>
    );
  }

  const values = data.map(d => Number(d[metric]));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((Number(d[metric]) - minValue) / range) * 80 + 10;
    return `${x},${100 - y}`;
  }).join(' ');

  const currentValue = values[values.length - 1];
  const previousValue = values[values.length - 2];
  const change = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {typeof currentValue === 'number' ? currentValue.toLocaleString() : currentValue}
          </div>
          {change !== 0 && (
            <div className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </div>
          )}
        </div>
      </div>
      
      <div className="relative" style={{ height }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          <polyline
            fill={`url(#gradient-${metric})`}
            stroke="none"
            points={`0,100 ${points} 100,100`}
          />
          
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            points={points}
            className="drop-shadow-sm"
          />
          
          {/* Last point indicator */}
          {data.length > 0 && (
            <circle
              cx={((data.length - 1) / (data.length - 1)) * 100}
              cy={100 - (((currentValue - minValue) / range) * 80 + 10)}
              r="1"
              fill={color}
              className="animate-pulse"
            />
          )}
        </svg>
      </div>
    </div>
  );
};