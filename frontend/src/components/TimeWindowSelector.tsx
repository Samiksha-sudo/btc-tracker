import React from 'react';
import { TimeWindow } from '../types/analytics';

interface TimeWindowSelectorProps {
  selected: TimeWindow;
  onChange: (window: TimeWindow) => void;
}

export const TimeWindowSelector: React.FC<TimeWindowSelectorProps> = ({
  selected,
  onChange
}) => {
  const windows: { value: TimeWindow; label: string }[] = [
    { value: '5m', label: '5 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: 'custom', label: 'Custom' }
  ];

  return (
    <div className="flex space-x-2 bg-gray-800 rounded-lg p-1 border border-gray-700">
      {windows.map((window) => (
        <button
          key={window.value}
          onClick={() => onChange(window.value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selected === window.value
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          {window.label}
        </button>
      ))}
    </div>
  );
};