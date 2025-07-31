import React from 'react';
import { mockRegions } from '../utils/mockData';

export const RegionMap: React.FC = () => {
  const maxUsers = Math.max(...mockRegions.map(r => r.users));

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Global User Activity</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockRegions.map((region, index) => {
          const intensity = (region.users / maxUsers) * 100;
          const intensityClass = intensity > 80 ? 'bg-red-500' : 
                               intensity > 60 ? 'bg-orange-500' :
                               intensity > 40 ? 'bg-yellow-500' :
                               intensity > 20 ? 'bg-blue-500' : 'bg-gray-500';
          
          return (
            <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${intensityClass} animate-pulse`}></div>
                  <span className="font-medium text-white">{region.country}</span>
                </div>
                <span className="text-sm text-gray-400">{region.region}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-gray-400">Users</div>
                  <div className="font-semibold text-white">{region.users.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400">Conv.</div>
                  <div className="font-semibold text-green-400">{region.conversions}</div>
                </div>
                <div>
                  <div className="text-gray-400">Revenue</div>
                  <div className="font-semibold text-blue-400">${region.revenue.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="mt-3 bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${intensityClass} transition-all duration-1000`}
                  style={{ width: `${intensity}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};